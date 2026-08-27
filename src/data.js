// "Merdivenim Geldi" FPL League Data Store & Persistence Layer
// 15-Week Premier League Active Season Simulation (GW 1 - GW 15)

export const INITIAL_TEAMS = [
  {
    "id": "fe",
    "name": "Fe",
    "manager": "Muhammed Fe",
    "color": "#00FF66",
    "accent": "text-[#00FF66]",
    "gradient": "linear-gradient(135deg, #059669, #00FF66)",
    "avatar": "👑",
    "avatarUrl": "./assets/avatars/fe.jpg"
  },
  {
    "id": "reis",
    "name": "Reis United",
    "manager": "Oğuz Ünal",
    "color": "#D500F9",
    "accent": "text-[#D500F9]",
    "gradient": "linear-gradient(135deg, #7c3aed, #D500F9)",
    "avatar": "⚽",
    "avatarUrl": "./assets/avatars/reis.jpg"
  },
  {
    "id": "zirve",
    "name": "Yeniden Zirveye",
    "manager": "ŞAHİN KILINÇ",
    "color": "#FF0055",
    "accent": "text-[#FF0055]",
    "gradient": "linear-gradient(135deg, #be123c, #FF0055)",
    "avatar": "🚀",
    "avatarUrl": "./assets/avatars/zirve.jpg"
  },
  {
    "id": "hedef27",
    "name": "Hedef 27 🍆 🍑",
    "manager": "Ali Can Çakmak",
    "color": "#FFFFFF",
    "accent": "text-white",
    "gradient": "linear-gradient(135deg, #64748b, #FFFFFF)",
    "avatar": "🎯",
    "avatarUrl": "./assets/avatars/hedef27.jpg"
  },
  {
    "id": "kirmizisiyah",
    "name": "KırmızıSiyah",
    "manager": "Turgay Çavuş",
    "color": "#FF2A2A",
    "accent": "text-[#FF2A2A]",
    "gradient": "linear-gradient(135deg, #991b1b, #FF2A2A)",
    "avatar": "🔴",
    "avatarUrl": "./assets/avatars/kirmizisiyah.jpg"
  },
  {
    "id": "explorer",
    "name": "Explorer",
    "manager": "ali zenginler",
    "color": "#00F0FF",
    "accent": "text-[#00F0FF]",
    "gradient": "linear-gradient(135deg, #0284c7, #00F0FF)",
    "avatar": "🧭",
    "avatarUrl": "./assets/avatars/explorer.jpg"
  },
  {
    "id": "aliyntem",
    "name": "Aliyntem42",
    "manager": "Ali Yöntem",
    "color": "#FFE500",
    "accent": "text-[#FFE500]",
    "gradient": "linear-gradient(135deg, #ca8a04, #FFE500)",
    "avatar": "⭐",
    "avatarUrl": "./assets/avatars/aliyntem.jpg"
  },
  {
    "id": "d3mon",
    "name": "D3mon FC",
    "manager": "Oğuz Çalışkanoğlu",
    "color": "#2979FF",
    "accent": "text-[#2979FF]",
    "gradient": "linear-gradient(135deg, #1d4ed8, #2979FF)",
    "avatar": "😈",
    "avatarUrl": "./assets/avatars/d3mon.jpg"
  },
  {
    "id": "recobaba",
    "name": "Reco BaBa",
    "manager": "Recep Alper",
    "color": "#FF7700",
    "accent": "text-[#FF7700]",
    "gradient": "linear-gradient(135deg, #ea580c, #FF7700)",
    "avatar": "🔥",
    "avatarUrl": "./assets/avatars/recobaba.jpg"
  }
];

export const INITIAL_GAMEWEEKS = [
  {
    "gw": 1,
    "scores": {
      "fe": 66,
      "reis": 67,
      "zirve": 67,
      "hedef27": 79,
      "aliyntem": 61,
      "kirmizisiyah": 59,
      "d3mon": 64,
      "recobaba": 60,
      "explorer": 49
    }
  },
  {
    "gw": 2,
    "scores": {
      "fe": 52,
      "reis": 50,
      "zirve": 55,
      "hedef27": 61,
      "aliyntem": 60,
      "kirmizisiyah": 53,
      "d3mon": 57,
      "recobaba": 48,
      "explorer": 39
    }
  },
  {
    "gw": 3,
    "scores": {
      "fe": 64,
      "reis": 64,
      "zirve": 62,
      "hedef27": 63,
      "aliyntem": 68,
      "kirmizisiyah": 62,
      "d3mon": 52,
      "recobaba": 57,
      "explorer": 53
    }
  },
  {
    "gw": 4,
    "scores": {
      "fe": 61,
      "reis": 67,
      "zirve": 61,
      "hedef27": 61,
      "aliyntem": 64,
      "kirmizisiyah": 60,
      "d3mon": 55,
      "recobaba": 48,
      "explorer": 54
    }
  },
  {
    "gw": 5,
    "scores": {
      "fe": 53,
      "reis": 51,
      "zirve": 48,
      "hedef27": 51,
      "aliyntem": 53,
      "kirmizisiyah": 57,
      "d3mon": 47,
      "recobaba": 46,
      "explorer": 50
    }
  },
  {
    "gw": 6,
    "scores": {
      "fe": 74,
      "reis": 86,
      "zirve": 70,
      "hedef27": 65,
      "aliyntem": 71,
      "kirmizisiyah": 69,
      "d3mon": 56,
      "recobaba": 65,
      "explorer": 56
    }
  },
  {
    "gw": 7,
    "scores": {
      "fe": 41,
      "reis": 38,
      "zirve": 48,
      "hedef27": 39,
      "aliyntem": 37,
      "kirmizisiyah": 36,
      "d3mon": 41,
      "recobaba": 34,
      "explorer": 32
    }
  },
  {
    "gw": 8,
    "scores": {
      "fe": 67,
      "reis": 70,
      "zirve": 60,
      "hedef27": 66,
      "aliyntem": 59,
      "kirmizisiyah": 62,
      "d3mon": 55,
      "recobaba": 50,
      "explorer": 57
    }
  },
  {
    "gw": 9,
    "scores": {
      "fe": 69,
      "reis": 79,
      "zirve": 88,
      "hedef27": 63,
      "aliyntem": 71,
      "kirmizisiyah": 65,
      "d3mon": 69,
      "recobaba": 70,
      "explorer": 59
    }
  },
  {
    "gw": 10,
    "scores": {
      "fe": 63,
      "reis": 57,
      "zirve": 53,
      "hedef27": 53,
      "aliyntem": 50,
      "kirmizisiyah": 56,
      "d3mon": 56,
      "recobaba": 53,
      "explorer": 46
    }
  },
  {
    "gw": 11,
    "scores": {
      "fe": 93,
      "reis": 67,
      "zirve": 72,
      "hedef27": 66,
      "aliyntem": 57,
      "kirmizisiyah": 61,
      "d3mon": 64,
      "recobaba": 59,
      "explorer": 56
    }
  },
  {
    "gw": 12,
    "scores": {
      "fe": 66,
      "reis": 66,
      "zirve": 66,
      "hedef27": 61,
      "aliyntem": 62,
      "kirmizisiyah": 55,
      "d3mon": 49,
      "recobaba": 45,
      "explorer": 54
    }
  },
  {
    "gw": 13,
    "scores": {
      "fe": 56,
      "reis": 49,
      "zirve": 52,
      "hedef27": 49,
      "aliyntem": 51,
      "kirmizisiyah": 50,
      "d3mon": 53,
      "recobaba": 42,
      "explorer": 48
    }
  },
  {
    "gw": 14,
    "scores": {
      "fe": 78,
      "reis": 84,
      "zirve": 76,
      "hedef27": 79,
      "aliyntem": 68,
      "kirmizisiyah": 64,
      "d3mon": 64,
      "recobaba": 87,
      "explorer": 69
    }
  },
  {
    "gw": 15,
    "scores": {
      "fe": 71,
      "reis": 63,
      "zirve": 63,
      "hedef27": 62,
      "aliyntem": 60,
      "kirmizisiyah": 55,
      "d3mon": 57,
      "recobaba": 54,
      "explorer": 53
    }
  }
];

export const DATASET_VERSION = "2026_gw15_season_v7";
export const STORAGE_KEY = "fpl_ladder_v2026_gw15_season_v7";

export function loadLeagueData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === DATASET_VERSION && parsed.teams && parsed.gameweeks && parsed.gameweeks.length >= 15) {
        parsed.teams = parsed.teams.map(t => {
          const init = INITIAL_TEAMS.find(it => it.id === t.id);
          return init ? { ...t, avatarUrl: init.avatarUrl || null } : t;
        });
        return parsed;
      }
    }
  } catch (err) {
    console.error("LocalStorage parse error, falling back to initial data", err);
  }

  const defaultData = {
    version: DATASET_VERSION,
    leagueName: "Merdivenim Geldi",
    leagueId: "",
    lastUpdated: new Date().toISOString(),
    teams: INITIAL_TEAMS,
    gameweeks: INITIAL_GAMEWEEKS
  };
  saveLeagueData(defaultData);
  return defaultData;
}

export function saveLeagueData(data) {
  try {
    data.version = DATASET_VERSION;
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("LocalStorage save error", err);
  }
}

export function resetLeagueData() {
  const defaultData = {
    version: DATASET_VERSION,
    leagueName: "Merdivenim Geldi",
    leagueId: "",
    lastUpdated: new Date().toISOString(),
    teams: INITIAL_TEAMS,
    gameweeks: INITIAL_GAMEWEEKS
  };
  saveLeagueData(defaultData);
  return defaultData;
}
