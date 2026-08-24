// FPL Public API Integration with CORS fallback support

export async function fetchFplLeagueStandings(leagueId) {
  if (!leagueId) {
    throw new Error("Lütfen geçerli bir FPL Lig ID numarası girin.");
  }

  const cleanLeagueId = leagueId.toString().trim();
  const fplUrl = `https://fantasy.premierleague.com/api/leagues-classic/${cleanLeagueId}/standings/`;

  // List of proxies to bypass browser CORS restrictions
  const proxyEndpoints = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(fplUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(fplUrl)}`
  ];

  let lastError = null;

  for (const endpoint of proxyEndpoints) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP Hata: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.standings && data.standings.results) {
        return parseFplApiResponse(data);
      }
    } catch (err) {
      console.warn(`Proxy ${endpoint} failed:`, err);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "FPL verisi çekilemedi. Lig ID'sinin doğruluğunu kontrol edin.");
}

function parseFplApiResponse(data) {
  const leagueName = data.league?.name || "Merdivenim Geldi";
  const results = data.standings.results || [];

  const teams = results.map((r, idx) => ({
    id: `fpl_${r.entry}`,
    fplEntryId: r.entry,
    name: r.entry_name,
    manager: r.player_name,
    color: getColorByIndex(idx),
    avatar: getAvatarByIndex(idx)
  }));

  // We can return the standings snapshot
  return {
    leagueName,
    teams,
    results: results.map(r => ({
      fplEntryId: r.entry,
      rank: r.rank,
      lastRank: r.last_rank,
      eventTotal: r.event_total,
      total: r.total
    }))
  };
}

function getColorByIndex(i) {
  const colors = ["#00ff85", "#a855f7", "#e90052", "#f43f5e", "#ef4444", "#04f5ff", "#eab308", "#6366f1", "#f97316"];
  return colors[i % colors.length];
}

function getAvatarByIndex(i) {
  const avatars = ["👑", "⚽", "🚀", "🎯", "🔴", "🧭", "⭐", "😈", "🔥"];
  return avatars[i % avatars.length];
}
