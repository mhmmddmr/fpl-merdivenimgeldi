// Statistics & League Analysis Engine for "Merdivenim Geldi"

/**
 * Calculates standings at a specific gameweek (or the latest gameweek)
 */
export function calculateStandings(leagueData, targetGw = null) {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  if (gws.length === 0) return [];

  const maxGw = gws[gws.length - 1].gw;
  const currentGw = targetGw ? Math.min(targetGw, maxGw) : maxGw;

  // Filter gameweeks up to currentGw
  const activeGws = gws.filter(g => g.gw <= currentGw);
  const previousGws = gws.filter(g => g.gw <= currentGw - 1);

  // Map of teamId -> { totalPoints, gwPoints, form: [] }
  const teamStats = {};
  leagueData.teams.forEach(t => {
    teamStats[t.id] = {
      team: t,
      totalPoints: 0,
      gwPoints: 0,
      previousTotal: 0,
      scoresHistory: [],
      winsCount: 0
    };
  });

  // Calculate cumulative points and scores
  activeGws.forEach(gwItem => {
    // Find GW winner(s)
    let highestScore = -Infinity;
    leagueData.teams.forEach(t => {
      const score = gwItem.scores[t.id] || 0;
      if (score > highestScore) highestScore = score;
    });

    leagueData.teams.forEach(t => {
      const score = gwItem.scores[t.id] || 0;
      teamStats[t.id].totalPoints += score;
      teamStats[t.id].scoresHistory.push(score);
      if (gwItem.gw === currentGw) {
        teamStats[t.id].gwPoints = score;
      }
      if (score === highestScore && highestScore > 0) {
        teamStats[t.id].winsCount++;
      }
    });
  });

  // Calculate previous week cumulative points
  previousGws.forEach(gwItem => {
    leagueData.teams.forEach(t => {
      const score = gwItem.scores[t.id] || 0;
      teamStats[t.id].previousTotal += score;
    });
  });

  // Determine current ranking
  const currentRankings = Object.values(teamStats).sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    // Tie-breaker: current GW score, then alphabetically
    if (b.gwPoints !== a.gwPoints) {
      return b.gwPoints - a.gwPoints;
    }
    return a.team.name.localeCompare(b.team.name);
  });

  // Determine previous week ranking (if GW > 1)
  let prevRankingsMap = {};
  if (currentGw > 1) {
    const prevRankings = Object.values(teamStats).map(ts => ({
      id: ts.team.id,
      totalPoints: ts.previousTotal,
      lastScore: ts.scoresHistory[ts.scoresHistory.length - 2] || 0
    })).sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return b.lastScore - a.lastScore;
    });

    let prevRank = 1;
    for (let i = 0; i < prevRankings.length; i++) {
      if (i > 0 && prevRankings[i].totalPoints < prevRankings[i - 1].totalPoints) {
        prevRank = i + 1;
      }
      prevRankingsMap[prevRankings[i].id] = prevRank;
    }
  }

  // Assign ranks with ties handled (e.g., 1, 1, 1, 4, 5, 6, 6, 6, 6)
  let rank = 1;
  const highestTotal = currentRankings[0] ? currentRankings[0].totalPoints : 0;

  const result = currentRankings.map((item, index) => {
    if (index > 0 && item.totalPoints < currentRankings[index - 1].totalPoints) {
      rank = index + 1;
    }

    const prevRank = prevRankingsMap[item.team.id] || rank;
    // rankChange: positive means climbed up, negative dropped
    const rankChange = currentGw > 1 ? prevRank - rank : 0;
    const gapToLeader = highestTotal - item.totalPoints;

    return {
      rank,
      team: item.team,
      gwPoints: item.gwPoints,
      totalPoints: item.totalPoints,
      rankChange,
      prevRank,
      gapToLeader,
      form: item.scoresHistory.slice(-5), // last 5 gameweeks
      scoresHistory: item.scoresHistory,
      winsCount: item.winsCount
    };
  });

  return result;
}

/**
 * Generates top stat cards highlights for a chosen gameweek
 */
export function getStatHighlights(leagueData, targetGw = null) {
  const standings = calculateStandings(leagueData, targetGw);
  if (standings.length === 0) return null;

  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  const currentGw = targetGw || gws[gws.length - 1].gw;

  // 1. Current Leader(s)
  const topScore = standings[0].totalPoints;
  const leaders = standings.filter(s => s.totalPoints === topScore);

  // 2. Gameweek Winner(s) (Highest GW Score)
  const maxGwScore = Math.max(...standings.map(s => s.gwPoints));
  const gwWinners = standings.filter(s => s.gwPoints === maxGwScore);

  // 3. Lowest GW Score (Tahta Kaşık / Wooden Spoon)
  const minGwScore = Math.min(...standings.map(s => s.gwPoints));
  const gwLowest = standings.filter(s => s.gwPoints === minGwScore);

  // 4. Ladder Climbers (Biggest rank rise)
  let maxClimb = -Infinity;
  let topClimber = null;
  standings.forEach(s => {
    if (s.rankChange > maxClimb) {
      maxClimb = s.rankChange;
      topClimber = s;
    }
  });

  // 5. Ladder Droppers (Biggest rank drop)
  let maxDrop = Infinity;
  let topDropper = null;
  standings.forEach(s => {
    if (s.rankChange < maxDrop) {
      maxDrop = s.rankChange;
      topDropper = s;
    }
  });

  // 6. Averages
  const totalGwSum = standings.reduce((acc, curr) => acc + curr.gwPoints, 0);
  const gwAverage = (totalGwSum / standings.length).toFixed(1);

  const totalOverallSum = standings.reduce((acc, curr) => acc + curr.totalPoints, 0);
  const overallAverage = (totalOverallSum / standings.length).toFixed(1);

  return {
    currentGw,
    leaders,
    gwWinners,
    maxGwScore,
    gwLowest,
    minGwScore,
    topClimber: maxClimb > 0 ? { team: topClimber.team, climb: maxClimb } : null,
    topDropper: maxDrop < 0 ? { team: topDropper.team, drop: Math.abs(maxDrop) } : null,
    gwAverage,
    overallAverage
  };
}

/**
 * Gets progression of ranks and cumulative points across all gameweeks
 */
export function getProgressionData(leagueData) {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  const gwList = gws.map(g => g.gw);

  const teamDataMap = {};
  leagueData.teams.forEach(t => {
    teamDataMap[t.id] = {
      team: t,
      ranks: [],
      cumulativePoints: [],
      gwScores: []
    };
  });

  gwList.forEach(gwNumber => {
    const standingsAtGw = calculateStandings(leagueData, gwNumber);
    standingsAtGw.forEach(item => {
      teamDataMap[item.team.id].ranks.push(item.rank);
      teamDataMap[item.team.id].cumulativePoints.push(item.totalPoints);
      teamDataMap[item.team.id].gwScores.push(item.gwPoints);
    });
  });

  return {
    gwList,
    teams: Object.values(teamDataMap)
  };
}

/**
 * Calculates dominance: how many gameweeks each team spent at rank 1
 */
export function getLeaderboardDominance(leagueData) {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  const dominanceMap = {};

  leagueData.teams.forEach(t => {
    dominanceMap[t.id] = {
      team: t,
      weeksAtNumberOne: 0,
      weeksInTop3: 0
    };
  });

  gws.forEach(gwItem => {
    const standings = calculateStandings(leagueData, gwItem.gw);
    standings.forEach(s => {
      if (s.rank === 1) {
        dominanceMap[s.team.id].weeksAtNumberOne++;
      }
      if (s.rank <= 3) {
        dominanceMap[s.team.id].weeksInTop3++;
      }
    });
  });

  return Object.values(dominanceMap).sort((a, b) => {
    if (b.weeksAtNumberOne !== a.weeksAtNumberOne) {
      return b.weeksAtNumberOne - a.weeksAtNumberOne;
    }
    return b.weeksInTop3 - a.weeksInTop3;
  });
}

/**
 * Calculates league records and special awards
 */
export function getLeagueRecords(leagueData) {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  if (gws.length === 0) return null;

  let highestScoreRecord = { score: -Infinity, teams: [], gw: 1 };
  let lowestScoreRecord = { score: Infinity, teams: [], gw: 1 };
  const gwWinsMap = {};

  leagueData.teams.forEach(t => {
    gwWinsMap[t.id] = { team: t, wins: 0, scores: [] };
  });

  gws.forEach(gwItem => {
    let highestInGw = -Infinity;
    leagueData.teams.forEach(t => {
      const score = gwItem.scores[t.id] || 0;
      gwWinsMap[t.id].scores.push(score);

      if (score > highestInGw) highestInGw = score;

      if (score > highestScoreRecord.score) {
        highestScoreRecord = { score, teams: [t], gw: gwItem.gw };
      } else if (score === highestScoreRecord.score) {
        if (!highestScoreRecord.teams.some(team => team.id === t.id)) {
          highestScoreRecord.teams.push(t);
        }
      }

      if (score < lowestScoreRecord.score) {
        lowestScoreRecord = { score, teams: [t], gw: gwItem.gw };
      } else if (score === lowestScoreRecord.score) {
        if (!lowestScoreRecord.teams.some(team => team.id === t.id)) {
          lowestScoreRecord.teams.push(t);
        }
      }
    });

    leagueData.teams.forEach(t => {
      const score = gwItem.scores[t.id] || 0;
      if (score === highestInGw && highestInGw > 0) {
        gwWinsMap[t.id].wins++;
      }
    });
  });

  // Calculate consistency (Standard Deviation)
  const consistencyList = Object.values(gwWinsMap).map(item => {
    const scores = item.scores;
    const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    const variance = scores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (scores.length || 1);
    const stdDev = Math.sqrt(variance);
    return {
      team: item.team,
      avg: avg.toFixed(1),
      stdDev: stdDev.toFixed(2),
      wins: item.wins
    };
  }).sort((a, b) => parseFloat(a.stdDev) - parseFloat(b.stdDev));

  const dominance = getLeaderboardDominance(leagueData);

  return {
    highestScoreRecord,
    lowestScoreRecord,
    mostWins: Object.values(gwWinsMap).sort((a, b) => b.wins - a.wins)[0],
    merdivenKrali: dominance[0],
    mostConsistent: consistencyList[0]
  };
}

/**
 * Head-to-Head comparator between two teams
 */
export function getHeadToHead(leagueData, team1Id, team2Id) {
  const t1 = leagueData.teams.find(t => t.id === team1Id);
  const t2 = leagueData.teams.find(t => t.id === team2Id);
  if (!t1 || !t2) return null;

  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);

  let t1Wins = 0;
  let t2Wins = 0;
  let draws = 0;
  let t1Total = 0;
  let t2Total = 0;

  const matchups = gws.map(gwItem => {
    const s1 = gwItem.scores[t1.id] || 0;
    const s2 = gwItem.scores[t2.id] || 0;
    t1Total += s1;
    t2Total += s2;

    let winner = 'draw';
    if (s1 > s2) {
      winner = 't1';
      t1Wins++;
    } else if (s2 > s1) {
      winner = 't2';
      t2Wins++;
    } else {
      draws++;
    }

    return {
      gw: gwItem.gw,
      s1,
      s2,
      diff: s1 - s2,
      winner
    };
  });

  return {
    t1,
    t2,
    t1Wins,
    t2Wins,
    draws,
    t1Total,
    t2Total,
    diff: t1Total - t2Total,
    matchups
  };
}
