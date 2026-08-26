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

/**
 * 🎖️ 1. RPG Level & Title Calculator
 */
export function getManagerLevel(totalPoints) {
  if (totalPoints >= 950) {
    return {
      level: 5,
      title: "FPL Efsanesi / Zirve Şampiyonu",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10",
      icon: "👑",
      min: 950,
      max: 1200,
      progressPct: Math.min(100, Math.round(((totalPoints - 950) / 250) * 100))
    };
  } else if (totalPoints >= 800) {
    return {
      level: 4,
      title: "Merdiven Üstadı",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/10",
      icon: "🧙‍♂️",
      min: 800,
      max: 950,
      progressPct: Math.round(((totalPoints - 800) / 150) * 100)
    };
  } else if (totalPoints >= 600) {
    return {
      level: 3,
      title: "Pep'in Çırağı",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10",
      icon: "⚡",
      min: 600,
      max: 800,
      progressPct: Math.round(((totalPoints - 600) / 200) * 100)
    };
  } else if (totalPoints >= 300) {
    return {
      level: 2,
      title: "Halı Saha Taktisyeni",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      icon: "📋",
      min: 300,
      max: 600,
      progressPct: Math.round(((totalPoints - 300) / 300) * 100)
    };
  } else {
    return {
      level: 1,
      title: "Çaylak Menajer",
      badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/40",
      icon: "🌱",
      min: 0,
      max: 300,
      progressPct: Math.round((totalPoints / 300) * 100)
    };
  }
}

/**
 * 🏅 2. Dynamic Badges & Trophies Calculator
 */
export function getTeamBadges(leagueData, teamId, targetGw = null) {
  const progData = getProgressionData(leagueData);
  const teamProg = progData.teams.find(tp => tp.team.id === teamId);
  if (!teamProg) return [];

  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  const currentGwIdx = targetGw ? gws.findIndex(g => g.gw === targetGw) : gws.length - 1;
  const validLength = currentGwIdx >= 0 ? currentGwIdx + 1 : teamProg.ranks.length;

  const ranks = teamProg.ranks.slice(0, validLength);
  const scores = teamProg.gwScores.slice(0, validLength);

  // 1. 👑 Merdivenler Kralı: Üst üste 3 hafta 1. sırada kalan
  let maxConsecutiveRank1 = 0;
  let currentStreak = 0;
  ranks.forEach(r => {
    if (r === 1) {
      currentStreak++;
      if (currentStreak > maxConsecutiveRank1) maxConsecutiveRank1 = currentStreak;
    } else {
      currentStreak = 0;
    }
  });
  const hasMerdivenlerKrali = maxConsecutiveRank1 >= 3;

  // 2. 🏹 Hat-Trick: Sezonda 3+ kez haftanın en yüksek puanını alan
  let gwWinCount = 0;
  for (let i = 0; i < validLength; i++) {
    const gwScoresObj = gws[i]?.scores || {};
    const maxVal = Math.max(...Object.values(gwScoresObj));
    if (gwScoresObj[teamId] === maxVal) {
      gwWinCount++;
    }
  }
  const hasHatTrick = gwWinCount >= 3;

  // 3. 💯 Yüzler Kulübü: Tek haftada 100+ puan barajını aşan
  const hasCenturyClub = scores.some(s => s >= 100);

  // 4. 🎯 Gurme: 5 hafta boyunca hiç 40 puanın altına düşmeyen
  let hasConsistency = false;
  let consistencyStreak = 0;
  scores.forEach(s => {
    if (s >= 40) {
      consistencyStreak++;
      if (consistencyStreak >= 5) hasConsistency = true;
    } else {
      consistencyStreak = 0;
    }
  });

  // 5. 🥄 Futbol Cahili: Seçili haftada en düşük puanı alan VEYA son sırada (9.) olan
  const latestGwScores = gws[validLength - 1]?.scores || {};
  const currentMinScore = Math.min(...Object.values(latestGwScores));
  const isLowestInGw = latestGwScores[teamId] === currentMinScore;
  const isLastRank = ranks[ranks.length - 1] === 9;
  const hasFutbolCahili = isLowestInGw || isLastRank;

  return [
    {
      id: "merdivenler_krali",
      name: "Merdivenler Kralı",
      icon: "👑",
      image: "./assets/badges/merdivenler_krali.svg",
      desc: "Üst üste 3 hafta 1. sırada kaldı",
      unlocked: hasMerdivenlerKrali,
      badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-300"
    },
    {
      id: "hat_trick",
      name: "Hat-Trick",
      icon: "🏹",
      image: "./assets/badges/hat_trick.svg",
      desc: "Sezonda 3+ kez haftanın en yüksek puanını aldı",
      unlocked: hasHatTrick,
      badgeClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
    },
    {
      id: "yuzler_kulubu",
      name: "Yüzler Kulübü",
      icon: "💯",
      image: "./assets/badges/yuzler_kulubu.svg",
      desc: "Tek haftada 100+ puan barajını aştı",
      unlocked: hasCenturyClub,
      badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
    },
    {
      id: "istikrar_abidesi",
      name: "Gurme",
      icon: "🎯",
      image: "./assets/badges/istikrar_abidesi.svg",
      desc: "5 hafta boyunca hiç 40 puan altına düşmedi",
      unlocked: hasConsistency,
      badgeClass: "bg-purple-500/15 border-purple-500/30 text-purple-300"
    },
    {
      id: "futbol_cahili",
      name: "Futbol Cahili (<0.4)",
      icon: "🥄",
      image: "./assets/badges/futbol_cahili.svg",
      desc: "Haftanın en düşük puanını aldı / Son sırada",
      unlocked: hasFutbolCahili,
      badgeClass: "bg-rose-500/15 border-rose-500/30 text-rose-300"
    }
  ];
}

/**
 * 🏆 3. League-Wide Badges & Trophy Cabinet Overview
 */
export function getLeagueBadgesOverview(leagueData, targetGw = null) {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  if (gws.length === 0) return [];

  const currentGwIdx = targetGw ? gws.findIndex(g => g.gw === targetGw) : gws.length - 1;
  const validGws = gws.slice(0, currentGwIdx >= 0 ? currentGwIdx + 1 : gws.length);

  const progData = getProgressionData(leagueData);

  // 1. 👑 Merdivenler Kralı (Üst üste 3 hafta 1. sırada kalanlar)
  const merdivenKraliHolders = [];
  leagueData.teams.forEach(team => {
    const tp = progData.teams.find(t => t.team.id === team.id);
    if (!tp) return;
    const ranks = tp.ranks.slice(0, validGws.length);
    let count = 0;
    let streak = 0;
    ranks.forEach(r => {
      if (r === 1) {
        streak++;
        if (streak >= 3) count++;
      } else {
        streak = 0;
      }
    });
    if (count > 0) {
      merdivenKraliHolders.push({ team, count, detail: `${count} kez 3+ hafta liderlik` });
    }
  });

  // 2. 🏹 Hat-Trick (Sezonda 3+ kez haftanın en yüksek puanını alanlar)
  const hatTrickHolders = [];
  leagueData.teams.forEach(team => {
    let winCount = 0;
    validGws.forEach(gwItem => {
      const scoresObj = gwItem.scores;
      const maxVal = Math.max(...Object.values(scoresObj));
      if (scoresObj[team.id] === maxVal) {
        winCount++;
      }
    });
    if (winCount >= 3) {
      hatTrickHolders.push({ team, count: winCount, detail: `${winCount} hafta galibiyeti` });
    }
  });

  // 3. 💯 Yüzler Kulübü (Tek haftada 100+ puan barajını aşanlar)
  const centuryHolders = [];
  leagueData.teams.forEach(team => {
    const tp = progData.teams.find(t => t.team.id === team.id);
    if (!tp) return;
    const scores = tp.gwScores.slice(0, validGws.length);
    const hauls = scores.filter(s => s >= 100);
    if (hauls.length > 0) {
      centuryHolders.push({ team, count: hauls.length, detail: `${hauls.length} kez (En çok: ${Math.max(...hauls)} P)` });
    }
  });

  // 4. 🎯 Gurme (5 hafta boyunca hiç 40 puan altına düşmeyenler)
  const istikrarHolders = [];
  leagueData.teams.forEach(team => {
    const tp = progData.teams.find(t => t.team.id === team.id);
    if (!tp) return;
    const scores = tp.gwScores.slice(0, validGws.length);
    let currentStreak = 0;
    let maxStreak = 0;
    scores.forEach(s => {
      if (s >= 40) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });
    if (maxStreak >= 5) {
      istikrarHolders.push({ team, count: Math.floor(maxStreak / 5), detail: `${maxStreak} hafta kesintisiz 40+ P` });
    }
  });

  // 5. 🥄 Futbol Cahili (<0.4) (Haftanın en düşük puanını alanlar)
  const cahilHolders = [];
  const lowestCounts = {};
  leagueData.teams.forEach(t => lowestCounts[t.id] = 0);

  validGws.forEach(gwItem => {
    const scoresObj = gwItem.scores;
    const minVal = Math.min(...Object.values(scoresObj));
    leagueData.teams.forEach(t => {
      if (scoresObj[t.id] === minVal) {
        lowestCounts[t.id]++;
      }
    });
  });

  leagueData.teams.forEach(team => {
    const c = lowestCounts[team.id];
    if (c > 0) {
      cahilHolders.push({ team, count: c, detail: `${c} hafta en düşük skor` });
    }
  });

  return [
    {
      id: "merdivenler_krali",
      title: "Merdivenler Kralı",
      icon: "👑",
      image: "./assets/badges/merdivenler_krali.svg",
      desc: "Üst üste 3 hafta 1. sırada kalanlar",
      badgeColor: "from-amber-500/20 to-yellow-500/5 border-amber-500/30 text-amber-300",
      pillClass: "bg-amber-400/20 text-amber-300 border-amber-400/30",
      glowClass: "card-glow-gold",
      holders: merdivenKraliHolders.sort((a, b) => b.count - a.count)
    },
    {
      id: "hat_trick",
      title: "Hat-Trick",
      icon: "🏹",
      image: "./assets/badges/hat_trick.svg",
      desc: "Sezonda 3+ kez haftanın en yüksek puanını alanlar",
      badgeColor: "from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-300",
      pillClass: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
      glowClass: "card-glow-cyan",
      holders: hatTrickHolders.sort((a, b) => b.count - a.count)
    },
    {
      id: "yuzler_kulubu",
      title: "Yüzler Kulübü",
      icon: "💯",
      image: "./assets/badges/yuzler_kulubu.svg",
      desc: "Tek haftada 100+ puan barajını aşanlar",
      badgeColor: "from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-300",
      pillClass: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30",
      glowClass: "card-glow-emerald",
      holders: centuryHolders.sort((a, b) => b.count - a.count)
    },
    {
      id: "istikrar_abidesi",
      title: "Gurme",
      icon: "🎯",
      image: "./assets/badges/istikrar_abidesi.svg",
      desc: "5 hafta üst üste 40+ puan alanlar",
      badgeColor: "from-purple-500/20 to-indigo-500/5 border-purple-500/30 text-purple-300",
      pillClass: "bg-purple-400/20 text-purple-300 border-purple-400/30",
      glowClass: "card-glow-purple",
      holders: istikrarHolders.sort((a, b) => b.count - a.count)
    },
    {
      id: "futbol_cahili",
      title: "Futbol Cahili (<0.4)",
      icon: "🥄",
      image: "./assets/badges/futbol_cahili.svg",
      desc: "Haftanın en düşük skorunu alanlar",
      badgeColor: "from-rose-500/20 to-red-500/5 border-rose-500/30 text-rose-300",
      pillClass: "bg-rose-400/20 text-rose-300 border-rose-400/30",
      glowClass: "",
      holders: cahilHolders.sort((a, b) => b.count - a.count)
    }
  ];
}


