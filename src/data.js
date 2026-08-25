// "Merdivenim Geldi" FPL League Data Store & Persistence Layer
// Full 38-Week Premier League Season Simulation

export const INITIAL_TEAMS = [
  {
    "id": "fe",
    "name": "Fe",
    "manager": "Muhammed Fe",
    "color": "#00ff87",
    "accent": "text-emerald-400",
    "gradient": "linear-gradient(135deg, #059669, #00ff87)",
    "avatar": "👑"
  },
  {
    "id": "reis",
    "name": "Reis United",
    "manager": "Oğuz Ünal",
    "color": "#a855f7",
    "accent": "text-purple-400",
    "gradient": "linear-gradient(135deg, #7c3aed, #a855f7)",
    "avatar": "⚽"
  },
  {
    "id": "zirve",
    "name": "Yeniden Zirveye",
    "manager": "ŞAHİN KILINÇ",
    "color": "#f43f5e",
    "accent": "text-rose-400",
    "gradient": "linear-gradient(135deg, #be123c, #f43f5e)",
    "avatar": "🚀"
  },
  {
    "id": "hedef27",
    "name": "Hedef 27 🍆 🍑",
    "manager": "Ali Can Çakmak",
    "color": "#38bdf8",
    "accent": "text-sky-400",
    "gradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
    "avatar": "🎯"
  },
  {
    "id": "kirmizisiyah",
    "name": "KırmızıSiyah",
    "manager": "Turgay Çavuş",
    "color": "#ef4444",
    "accent": "text-red-500",
    "gradient": "linear-gradient(135deg, #991b1b, #ef4444)",
    "avatar": "🔴"
  },
  {
    "id": "explorer",
    "name": "Explorer",
    "manager": "ali zenginler",
    "color": "#2dd4bf",
    "accent": "text-teal-400",
    "gradient": "linear-gradient(135deg, #0f766e, #2dd4bf)",
    "avatar": "🧭"
  },
  {
    "id": "aliyntem",
    "name": "Aliyntem42",
    "manager": "Ali Yöntem",
    "color": "#facc15",
    "accent": "text-yellow-400",
    "gradient": "linear-gradient(135deg, #ca8a04, #facc15)",
    "avatar": "⭐"
  },
  {
    "id": "d3mon",
    "name": "D3mon FC",
    "manager": "Oğuz Çalışkanoğlu",
    "color": "#818cf8",
    "accent": "text-indigo-400",
    "gradient": "linear-gradient(135deg, #4338ca, #818cf8)",
    "avatar": "😈"
  },
  {
    "id": "recobaba",
    "name": "Reco BaBa",
    "manager": "Recep Alper",
    "color": "#fb923c",
    "accent": "text-orange-400",
    "gradient": "linear-gradient(135deg, #ea580c, #fb923c)",
    "avatar": "🔥"
  }
];

export const INITIAL_GAMEWEEKS = [
  {
    "gw": 1,
    "scores": {
      "fe": 39,
      "reis": 39,
      "zirve": 39,
      "hedef27": 38,
      "kirmizisiyah": 35,
      "explorer": 25,
      "aliyntem": 25,
      "d3mon": 25,
      "recobaba": 25
    }
  },
  {
    "gw": 2,
    "scores": {
      "fe": 62,
      "reis": 48,
      "zirve": 65,
      "hedef27": 58,
      "kirmizisiyah": 44,
      "explorer": 49,
      "aliyntem": 64,
      "d3mon": 42,
      "recobaba": 38
    }
  },
  {
    "gw": 3,
    "scores": {
      "fe": 58,
      "reis": 68,
      "zirve": 51,
      "hedef27": 74,
      "kirmizisiyah": 52,
      "explorer": 48,
      "aliyntem": 57,
      "d3mon": 49,
      "recobaba": 45
    }
  },
  {
    "gw": 4,
    "scores": {
      "fe": 79,
      "reis": 56,
      "zirve": 54,
      "hedef27": 63,
      "kirmizisiyah": 55,
      "explorer": 42,
      "aliyntem": 72,
      "d3mon": 51,
      "recobaba": 48
    }
  },
  {
    "gw": 5,
    "scores": {
      "fe": 52,
      "reis": 81,
      "zirve": 58,
      "hedef27": 76,
      "kirmizisiyah": 50,
      "explorer": 59,
      "aliyntem": 65,
      "d3mon": 54,
      "recobaba": 46
    }
  },
  {
    "gw": 6,
    "scores": {
      "fe": 74,
      "reis": 49,
      "zirve": 82,
      "hedef27": 68,
      "kirmizisiyah": 58,
      "explorer": 43,
      "aliyntem": 61,
      "d3mon": 50,
      "recobaba": 52
    }
  },
  {
    "gw": 7,
    "scores": {
      "fe": 48,
      "reis": 67,
      "zirve": 69,
      "hedef27": 85,
      "kirmizisiyah": 49,
      "explorer": 51,
      "aliyntem": 58,
      "d3mon": 53,
      "recobaba": 44
    }
  },
  {
    "gw": 8,
    "scores": {
      "fe": 83,
      "reis": 54,
      "zirve": 60,
      "hedef27": 77,
      "kirmizisiyah": 62,
      "explorer": 47,
      "aliyntem": 64,
      "d3mon": 48,
      "recobaba": 41
    }
  },
  {
    "gw": 9,
    "scores": {
      "fe": 61,
      "reis": 88,
      "zirve": 59,
      "hedef27": 79,
      "kirmizisiyah": 53,
      "explorer": 56,
      "aliyntem": 54,
      "d3mon": 57,
      "recobaba": 49
    }
  },
  {
    "gw": 10,
    "scores": {
      "fe": 66,
      "reis": 55,
      "zirve": 84,
      "hedef27": 71,
      "kirmizisiyah": 64,
      "explorer": 50,
      "aliyntem": 68,
      "d3mon": 52,
      "recobaba": 45
    }
  },
  {
    "gw": 11,
    "scores": {
      "fe": 77,
      "reis": 63,
      "zirve": 72,
      "hedef27": 80,
      "kirmizisiyah": 56,
      "explorer": 48,
      "aliyntem": 59,
      "d3mon": 55,
      "recobaba": 43
    }
  },
  {
    "gw": 12,
    "scores": {
      "fe": 54,
      "reis": 76,
      "zirve": 68,
      "hedef27": 73,
      "kirmizisiyah": 65,
      "explorer": 52,
      "aliyntem": 60,
      "d3mon": 49,
      "recobaba": 47
    }
  },
  {
    "gw": 13,
    "scores": {
      "fe": 69,
      "reis": 84,
      "zirve": 63,
      "hedef27": 82,
      "kirmizisiyah": 59,
      "explorer": 46,
      "aliyntem": 62,
      "d3mon": 53,
      "recobaba": 50
    }
  },
  {
    "gw": 14,
    "scores": {
      "fe": 58,
      "reis": 62,
      "zirve": 79,
      "hedef27": 75,
      "kirmizisiyah": 51,
      "explorer": 54,
      "aliyntem": 67,
      "d3mon": 61,
      "recobaba": 44
    }
  },
  {
    "gw": 15,
    "scores": {
      "fe": 73,
      "reis": 70,
      "zirve": 75,
      "hedef27": 84,
      "kirmizisiyah": 60,
      "explorer": 49,
      "aliyntem": 63,
      "d3mon": 58,
      "recobaba": 48
    }
  },
  {
    "gw": 16,
    "scores": {
      "fe": 67,
      "reis": 61,
      "zirve": 63,
      "hedef27": 75,
      "kirmizisiyah": 75,
      "explorer": 67,
      "aliyntem": 64,
      "d3mon": 79,
      "recobaba": 63
    }
  },
  {
    "gw": 17,
    "scores": {
      "fe": 87,
      "reis": 62,
      "zirve": 79,
      "hedef27": 62,
      "kirmizisiyah": 62,
      "explorer": 61,
      "aliyntem": 53,
      "d3mon": 53,
      "recobaba": 75
    }
  },
  {
    "gw": 18,
    "scores": {
      "fe": 57,
      "reis": 109,
      "zirve": 57,
      "hedef27": 79,
      "kirmizisiyah": 62,
      "explorer": 80,
      "aliyntem": 83,
      "d3mon": 75,
      "recobaba": 71
    }
  },
  {
    "gw": 19,
    "scores": {
      "fe": 80,
      "reis": 65,
      "zirve": 69,
      "hedef27": 75,
      "kirmizisiyah": 89,
      "explorer": 63,
      "aliyntem": 72,
      "d3mon": 51,
      "recobaba": 63
    }
  },
  {
    "gw": 20,
    "scores": {
      "fe": 68,
      "reis": 70,
      "zirve": 82,
      "hedef27": 57,
      "kirmizisiyah": 67,
      "explorer": 79,
      "aliyntem": 61,
      "d3mon": 70,
      "recobaba": 75
    }
  },
  {
    "gw": 21,
    "scores": {
      "fe": 57,
      "reis": 84,
      "zirve": 63,
      "hedef27": 82,
      "kirmizisiyah": 68,
      "explorer": 65,
      "aliyntem": 108,
      "d3mon": 78,
      "recobaba": 59
    }
  },
  {
    "gw": 22,
    "scores": {
      "fe": 70,
      "reis": 43,
      "zirve": 76,
      "hedef27": 72,
      "kirmizisiyah": 71,
      "explorer": 41,
      "aliyntem": 63,
      "d3mon": 67,
      "recobaba": 71
    }
  },
  {
    "gw": 23,
    "scores": {
      "fe": 84,
      "reis": 62,
      "zirve": 74,
      "hedef27": 76,
      "kirmizisiyah": 106,
      "explorer": 63,
      "aliyntem": 74,
      "d3mon": 63,
      "recobaba": 90
    }
  },
  {
    "gw": 24,
    "scores": {
      "fe": 56,
      "reis": 34,
      "zirve": 77,
      "hedef27": 69,
      "kirmizisiyah": 79,
      "explorer": 58,
      "aliyntem": 98,
      "d3mon": 67,
      "recobaba": 62
    }
  },
  {
    "gw": 25,
    "scores": {
      "fe": 102,
      "reis": 85,
      "zirve": 86,
      "hedef27": 85,
      "kirmizisiyah": 74,
      "explorer": 101,
      "aliyntem": 132,
      "d3mon": 122,
      "recobaba": 105
    }
  },
  {
    "gw": 26,
    "scores": {
      "fe": 56,
      "reis": 73,
      "zirve": 81,
      "hedef27": 63,
      "kirmizisiyah": 62,
      "explorer": 60,
      "aliyntem": 70,
      "d3mon": 73,
      "recobaba": 84
    }
  },
  {
    "gw": 27,
    "scores": {
      "fe": 83,
      "reis": 84,
      "zirve": 49,
      "hedef27": 56,
      "kirmizisiyah": 84,
      "explorer": 77,
      "aliyntem": 79,
      "d3mon": 71,
      "recobaba": 67
    }
  },
  {
    "gw": 28,
    "scores": {
      "fe": 79,
      "reis": 58,
      "zirve": 66,
      "hedef27": 64,
      "kirmizisiyah": 74,
      "explorer": 61,
      "aliyntem": 60,
      "d3mon": 67,
      "recobaba": 64
    }
  },
  {
    "gw": 29,
    "scores": {
      "fe": 63,
      "reis": 109,
      "zirve": 38,
      "hedef27": 81,
      "kirmizisiyah": 70,
      "explorer": 95,
      "aliyntem": 57,
      "d3mon": 80,
      "recobaba": 70
    }
  },
  {
    "gw": 30,
    "scores": {
      "fe": 69,
      "reis": 60,
      "zirve": 55,
      "hedef27": 66,
      "kirmizisiyah": 106,
      "explorer": 102,
      "aliyntem": 87,
      "d3mon": 78,
      "recobaba": 60
    }
  },
  {
    "gw": 31,
    "scores": {
      "fe": 73,
      "reis": 71,
      "zirve": 65,
      "hedef27": 68,
      "kirmizisiyah": 85,
      "explorer": 62,
      "aliyntem": 78,
      "d3mon": 51,
      "recobaba": 72
    }
  },
  {
    "gw": 32,
    "scores": {
      "fe": 64,
      "reis": 67,
      "zirve": 95,
      "hedef27": 98,
      "kirmizisiyah": 56,
      "explorer": 93,
      "aliyntem": 62,
      "d3mon": 81,
      "recobaba": 81
    }
  },
  {
    "gw": 33,
    "scores": {
      "fe": 60,
      "reis": 84,
      "zirve": 58,
      "hedef27": 84,
      "kirmizisiyah": 89,
      "explorer": 74,
      "aliyntem": 84,
      "d3mon": 96,
      "recobaba": 60
    }
  },
  {
    "gw": 34,
    "scores": {
      "fe": 86,
      "reis": 76,
      "zirve": 112,
      "hedef27": 86,
      "kirmizisiyah": 97,
      "explorer": 81,
      "aliyntem": 95,
      "d3mon": 75,
      "recobaba": 62
    }
  },
  {
    "gw": 35,
    "scores": {
      "fe": 73,
      "reis": 65,
      "zirve": 66,
      "hedef27": 118,
      "kirmizisiyah": 81,
      "explorer": 68,
      "aliyntem": 76,
      "d3mon": 85,
      "recobaba": 70
    }
  },
  {
    "gw": 36,
    "scores": {
      "fe": 56,
      "reis": 65,
      "zirve": 113,
      "hedef27": 103,
      "kirmizisiyah": 56,
      "explorer": 73,
      "aliyntem": 55,
      "d3mon": 76,
      "recobaba": 41
    }
  },
  {
    "gw": 37,
    "scores": {
      "fe": 106,
      "reis": 87,
      "zirve": 99,
      "hedef27": 63,
      "kirmizisiyah": 87,
      "explorer": 113,
      "aliyntem": 93,
      "d3mon": 85,
      "recobaba": 106
    }
  },
  {
    "gw": 38,
    "scores": {
      "fe": 68,
      "reis": 75,
      "zirve": 80,
      "hedef27": 67,
      "kirmizisiyah": 79,
      "explorer": 66,
      "aliyntem": 73,
      "d3mon": 82,
      "recobaba": 61
    }
  }
];

export const STORAGE_KEY = "fpl_merdivenim_geldi_v38_distinct_colors_store";

export function loadLeagueData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.teams && parsed.gameweeks && parsed.gameweeks.length >= 38) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("LocalStorage parse error, falling back to initial data", err);
  }

  const defaultData = {
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
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("LocalStorage save error", err);
  }
}

export function resetLeagueData() {
  const defaultData = {
    leagueName: "Merdivenim Geldi",
    leagueId: "",
    lastUpdated: new Date().toISOString(),
    teams: INITIAL_TEAMS,
    gameweeks: INITIAL_GAMEWEEKS
  };
  saveLeagueData(defaultData);
  return defaultData;
}
