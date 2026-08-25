// "Merdivenim Geldi" FPL League Data Store & Persistence Layer
// Realistic 38-Week Premier League Season Simulation

export const INITIAL_TEAMS = [
  {
    "id": "fe",
    "name": "Fe",
    "manager": "Muhammed Fe",
    "color": "#00FF66",
    "accent": "text-[#00FF66]",
    "gradient": "linear-gradient(135deg, #059669, #00FF66)",
    "avatar": "👑"
  },
  {
    "id": "reis",
    "name": "Reis United",
    "manager": "Oğuz Ünal",
    "color": "#D500F9",
    "accent": "text-[#D500F9]",
    "gradient": "linear-gradient(135deg, #7c3aed, #D500F9)",
    "avatar": "⚽"
  },
  {
    "id": "zirve",
    "name": "Yeniden Zirveye",
    "manager": "ŞAHİN KILINÇ",
    "color": "#FF0055",
    "accent": "text-[#FF0055]",
    "gradient": "linear-gradient(135deg, #be123c, #FF0055)",
    "avatar": "🚀"
  },
  {
    "id": "hedef27",
    "name": "Hedef 27 🍆 🍑",
    "manager": "Ali Can Çakmak",
    "color": "#FFFFFF",
    "accent": "text-white",
    "gradient": "linear-gradient(135deg, #64748b, #FFFFFF)",
    "avatar": "🎯"
  },
  {
    "id": "kirmizisiyah",
    "name": "KırmızıSiyah",
    "manager": "Turgay Çavuş",
    "color": "#FF2A2A",
    "accent": "text-[#FF2A2A]",
    "gradient": "linear-gradient(135deg, #991b1b, #FF2A2A)",
    "avatar": "🔴"
  },
  {
    "id": "explorer",
    "name": "Explorer",
    "manager": "ali zenginler",
    "color": "#00F0FF",
    "accent": "text-[#00F0FF]",
    "gradient": "linear-gradient(135deg, #0284c7, #00F0FF)",
    "avatar": "🧭"
  },
  {
    "id": "aliyntem",
    "name": "Aliyntem42",
    "manager": "Ali Yöntem",
    "color": "#FFE500",
    "accent": "text-[#FFE500]",
    "gradient": "linear-gradient(135deg, #ca8a04, #FFE500)",
    "avatar": "⭐"
  },
  {
    "id": "d3mon",
    "name": "D3mon FC",
    "manager": "Oğuz Çalışkanoğlu",
    "color": "#2979FF",
    "accent": "text-[#2979FF]",
    "gradient": "linear-gradient(135deg, #1d4ed8, #2979FF)",
    "avatar": "😈"
  },
  {
    "id": "recobaba",
    "name": "Reco BaBa",
    "manager": "Recep Alper",
    "color": "#FF7700",
    "accent": "text-[#FF7700]",
    "gradient": "linear-gradient(135deg, #ea580c, #FF7700)",
    "avatar": "🔥"
  }
];

export const INITIAL_GAMEWEEKS = [
  {
    "gw": 1,
    "scores": {
      "fe": 67,
      "reis": 61,
      "zirve": 83,
      "hedef27": 79,
      "kirmizisiyah": 79,
      "explorer": 57,
      "aliyntem": 75,
      "d3mon": 47,
      "recobaba": 74
    }
  },
  {
    "gw": 2,
    "scores": {
      "fe": 83,
      "reis": 72,
      "zirve": 40,
      "hedef27": 77,
      "kirmizisiyah": 43,
      "explorer": 75,
      "aliyntem": 56,
      "d3mon": 71,
      "recobaba": 74
    }
  },
  {
    "gw": 3,
    "scores": {
      "fe": 65,
      "reis": 44,
      "zirve": 62,
      "hedef27": 86,
      "kirmizisiyah": 65,
      "explorer": 48,
      "aliyntem": 64,
      "d3mon": 61,
      "recobaba": 73
    }
  },
  {
    "gw": 4,
    "scores": {
      "fe": 65,
      "reis": 73,
      "zirve": 80,
      "hedef27": 67,
      "kirmizisiyah": 63,
      "explorer": 57,
      "aliyntem": 65,
      "d3mon": 43,
      "recobaba": 64
    }
  },
  {
    "gw": 5,
    "scores": {
      "fe": 64,
      "reis": 67,
      "zirve": 76,
      "hedef27": 63,
      "kirmizisiyah": 58,
      "explorer": 45,
      "aliyntem": 45,
      "d3mon": 49,
      "recobaba": 36
    }
  },
  {
    "gw": 6,
    "scores": {
      "fe": 78,
      "reis": 72,
      "zirve": 57,
      "hedef27": 60,
      "kirmizisiyah": 57,
      "explorer": 75,
      "aliyntem": 49,
      "d3mon": 33,
      "recobaba": 55
    }
  },
  {
    "gw": 7,
    "scores": {
      "fe": 57,
      "reis": 57,
      "zirve": 44,
      "hedef27": 50,
      "kirmizisiyah": 40,
      "explorer": 32,
      "aliyntem": 42,
      "d3mon": 32,
      "recobaba": 54
    }
  },
  {
    "gw": 8,
    "scores": {
      "fe": 59,
      "reis": 70,
      "zirve": 62,
      "hedef27": 53,
      "kirmizisiyah": 57,
      "explorer": 43,
      "aliyntem": 42,
      "d3mon": 42,
      "recobaba": 32
    }
  },
  {
    "gw": 9,
    "scores": {
      "fe": 62,
      "reis": 104,
      "zirve": 78,
      "hedef27": 66,
      "kirmizisiyah": 70,
      "explorer": 68,
      "aliyntem": 36,
      "d3mon": 57,
      "recobaba": 69
    }
  },
  {
    "gw": 10,
    "scores": {
      "fe": 102,
      "reis": 62,
      "zirve": 74,
      "hedef27": 68,
      "kirmizisiyah": 74,
      "explorer": 61,
      "aliyntem": 33,
      "d3mon": 74,
      "recobaba": 40
    }
  },
  {
    "gw": 11,
    "scores": {
      "fe": 61,
      "reis": 58,
      "zirve": 49,
      "hedef27": 66,
      "kirmizisiyah": 49,
      "explorer": 67,
      "aliyntem": 61,
      "d3mon": 45,
      "recobaba": 44
    }
  },
  {
    "gw": 12,
    "scores": {
      "fe": 64,
      "reis": 90,
      "zirve": 71,
      "hedef27": 65,
      "kirmizisiyah": 74,
      "explorer": 62,
      "aliyntem": 67,
      "d3mon": 68,
      "recobaba": 64
    }
  },
  {
    "gw": 13,
    "scores": {
      "fe": 75,
      "reis": 43,
      "zirve": 55,
      "hedef27": 71,
      "kirmizisiyah": 50,
      "explorer": 47,
      "aliyntem": 46,
      "d3mon": 55,
      "recobaba": 65
    }
  },
  {
    "gw": 14,
    "scores": {
      "fe": 56,
      "reis": 85,
      "zirve": 80,
      "hedef27": 90,
      "kirmizisiyah": 94,
      "explorer": 39,
      "aliyntem": 85,
      "d3mon": 72,
      "recobaba": 62
    }
  },
  {
    "gw": 15,
    "scores": {
      "fe": 60,
      "reis": 46,
      "zirve": 83,
      "hedef27": 67,
      "kirmizisiyah": 45,
      "explorer": 72,
      "aliyntem": 53,
      "d3mon": 42,
      "recobaba": 62
    }
  },
  {
    "gw": 16,
    "scores": {
      "fe": 48,
      "reis": 46,
      "zirve": 61,
      "hedef27": 39,
      "kirmizisiyah": 47,
      "explorer": 47,
      "aliyntem": 60,
      "d3mon": 46,
      "recobaba": 63
    }
  },
  {
    "gw": 17,
    "scores": {
      "fe": 60,
      "reis": 68,
      "zirve": 88,
      "hedef27": 70,
      "kirmizisiyah": 62,
      "explorer": 59,
      "aliyntem": 74,
      "d3mon": 57,
      "recobaba": 50
    }
  },
  {
    "gw": 18,
    "scores": {
      "fe": 33,
      "reis": 59,
      "zirve": 58,
      "hedef27": 32,
      "kirmizisiyah": 51,
      "explorer": 32,
      "aliyntem": 46,
      "d3mon": 45,
      "recobaba": 32
    }
  },
  {
    "gw": 19,
    "scores": {
      "fe": 66,
      "reis": 88,
      "zirve": 65,
      "hedef27": 76,
      "kirmizisiyah": 69,
      "explorer": 67,
      "aliyntem": 58,
      "d3mon": 57,
      "recobaba": 90
    }
  },
  {
    "gw": 20,
    "scores": {
      "fe": 71,
      "reis": 73,
      "zirve": 85,
      "hedef27": 45,
      "kirmizisiyah": 63,
      "explorer": 90,
      "aliyntem": 81,
      "d3mon": 50,
      "recobaba": 44
    }
  },
  {
    "gw": 21,
    "scores": {
      "fe": 61,
      "reis": 71,
      "zirve": 71,
      "hedef27": 66,
      "kirmizisiyah": 36,
      "explorer": 58,
      "aliyntem": 66,
      "d3mon": 48,
      "recobaba": 85
    }
  },
  {
    "gw": 22,
    "scores": {
      "fe": 85,
      "reis": 50,
      "zirve": 52,
      "hedef27": 77,
      "kirmizisiyah": 52,
      "explorer": 53,
      "aliyntem": 78,
      "d3mon": 64,
      "recobaba": 43
    }
  },
  {
    "gw": 23,
    "scores": {
      "fe": 61,
      "reis": 62,
      "zirve": 60,
      "hedef27": 74,
      "kirmizisiyah": 77,
      "explorer": 53,
      "aliyntem": 69,
      "d3mon": 62,
      "recobaba": 54
    }
  },
  {
    "gw": 24,
    "scores": {
      "fe": 71,
      "reis": 64,
      "zirve": 72,
      "hedef27": 73,
      "kirmizisiyah": 53,
      "explorer": 58,
      "aliyntem": 34,
      "d3mon": 47,
      "recobaba": 82
    }
  },
  {
    "gw": 25,
    "scores": {
      "fe": 114,
      "reis": 62,
      "zirve": 73,
      "hedef27": 114,
      "kirmizisiyah": 101,
      "explorer": 100,
      "aliyntem": 94,
      "d3mon": 97,
      "recobaba": 107
    }
  },
  {
    "gw": 26,
    "scores": {
      "fe": 47,
      "reis": 79,
      "zirve": 74,
      "hedef27": 71,
      "kirmizisiyah": 46,
      "explorer": 56,
      "aliyntem": 48,
      "d3mon": 60,
      "recobaba": 74
    }
  },
  {
    "gw": 27,
    "scores": {
      "fe": 63,
      "reis": 69,
      "zirve": 73,
      "hedef27": 65,
      "kirmizisiyah": 64,
      "explorer": 37,
      "aliyntem": 90,
      "d3mon": 39,
      "recobaba": 76
    }
  },
  {
    "gw": 28,
    "scores": {
      "fe": 69,
      "reis": 59,
      "zirve": 51,
      "hedef27": 56,
      "kirmizisiyah": 88,
      "explorer": 71,
      "aliyntem": 52,
      "d3mon": 80,
      "recobaba": 78
    }
  },
  {
    "gw": 29,
    "scores": {
      "fe": 48,
      "reis": 44,
      "zirve": 35,
      "hedef27": 60,
      "kirmizisiyah": 37,
      "explorer": 32,
      "aliyntem": 32,
      "d3mon": 58,
      "recobaba": 39
    }
  },
  {
    "gw": 30,
    "scores": {
      "fe": 56,
      "reis": 69,
      "zirve": 63,
      "hedef27": 54,
      "kirmizisiyah": 39,
      "explorer": 62,
      "aliyntem": 67,
      "d3mon": 72,
      "recobaba": 49
    }
  },
  {
    "gw": 31,
    "scores": {
      "fe": 51,
      "reis": 78,
      "zirve": 67,
      "hedef27": 66,
      "kirmizisiyah": 33,
      "explorer": 58,
      "aliyntem": 72,
      "d3mon": 66,
      "recobaba": 99
    }
  },
  {
    "gw": 32,
    "scores": {
      "fe": 64,
      "reis": 65,
      "zirve": 58,
      "hedef27": 35,
      "kirmizisiyah": 57,
      "explorer": 48,
      "aliyntem": 70,
      "d3mon": 60,
      "recobaba": 34
    }
  },
  {
    "gw": 33,
    "scores": {
      "fe": 66,
      "reis": 41,
      "zirve": 50,
      "hedef27": 62,
      "kirmizisiyah": 67,
      "explorer": 46,
      "aliyntem": 65,
      "d3mon": 55,
      "recobaba": 69
    }
  },
  {
    "gw": 34,
    "scores": {
      "fe": 45,
      "reis": 98,
      "zirve": 83,
      "hedef27": 114,
      "kirmizisiyah": 100,
      "explorer": 71,
      "aliyntem": 81,
      "d3mon": 80,
      "recobaba": 32
    }
  },
  {
    "gw": 35,
    "scores": {
      "fe": 66,
      "reis": 72,
      "zirve": 72,
      "hedef27": 85,
      "kirmizisiyah": 52,
      "explorer": 43,
      "aliyntem": 50,
      "d3mon": 66,
      "recobaba": 58
    }
  },
  {
    "gw": 36,
    "scores": {
      "fe": 60,
      "reis": 62,
      "zirve": 55,
      "hedef27": 94,
      "kirmizisiyah": 70,
      "explorer": 47,
      "aliyntem": 74,
      "d3mon": 46,
      "recobaba": 72
    }
  },
  {
    "gw": 37,
    "scores": {
      "fe": 109,
      "reis": 90,
      "zirve": 99,
      "hedef27": 99,
      "kirmizisiyah": 76,
      "explorer": 57,
      "aliyntem": 77,
      "d3mon": 104,
      "recobaba": 91
    }
  },
  {
    "gw": 38,
    "scores": {
      "fe": 77,
      "reis": 52,
      "zirve": 47,
      "hedef27": 78,
      "kirmizisiyah": 82,
      "explorer": 63,
      "aliyntem": 63,
      "d3mon": 32,
      "recobaba": 62
    }
  }
];

export const DATASET_VERSION = "2026_realistic_v3";
export const STORAGE_KEY = "fpl_ladder_v2026_realistic_v3";

export function loadLeagueData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === DATASET_VERSION && parsed.teams && parsed.gameweeks && parsed.gameweeks.length >= 38) {
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
