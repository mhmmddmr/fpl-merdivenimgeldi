// "Merdivenim Geldi" FPL League Data Store & Persistence Layer
// Authentic Realistic 38-Week Premier League Season Simulation (Real-World FPL Distribution: 1870 - 2342 P)

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
      "fe": 61,
      "reis": 71,
      "zirve": 60,
      "hedef27": 58,
      "aliyntem": 65,
      "kirmizisiyah": 60,
      "d3mon": 52,
      "recobaba": 55,
      "explorer": 48
    }
  },
  {
    "gw": 2,
    "scores": {
      "fe": 61,
      "reis": 57,
      "zirve": 55,
      "hedef27": 48,
      "aliyntem": 47,
      "kirmizisiyah": 58,
      "d3mon": 52,
      "recobaba": 53,
      "explorer": 52
    }
  },
  {
    "gw": 3,
    "scores": {
      "fe": 52,
      "reis": 53,
      "zirve": 64,
      "hedef27": 56,
      "aliyntem": 51,
      "kirmizisiyah": 50,
      "d3mon": 49,
      "recobaba": 52,
      "explorer": 47
    }
  },
  {
    "gw": 4,
    "scores": {
      "fe": 59,
      "reis": 69,
      "zirve": 64,
      "hedef27": 59,
      "aliyntem": 54,
      "kirmizisiyah": 61,
      "d3mon": 53,
      "recobaba": 48,
      "explorer": 56
    }
  },
  {
    "gw": 5,
    "scores": {
      "fe": 57,
      "reis": 49,
      "zirve": 50,
      "hedef27": 52,
      "aliyntem": 51,
      "kirmizisiyah": 53,
      "d3mon": 44,
      "recobaba": 48,
      "explorer": 43
    }
  },
  {
    "gw": 6,
    "scores": {
      "fe": 72,
      "reis": 65,
      "zirve": 74,
      "hedef27": 91,
      "aliyntem": 62,
      "kirmizisiyah": 62,
      "d3mon": 55,
      "recobaba": 58,
      "explorer": 59
    }
  },
  {
    "gw": 7,
    "scores": {
      "fe": 42,
      "reis": 39,
      "zirve": 46,
      "hedef27": 43,
      "aliyntem": 46,
      "kirmizisiyah": 36,
      "d3mon": 33,
      "recobaba": 41,
      "explorer": 36
    }
  },
  {
    "gw": 8,
    "scores": {
      "fe": 52,
      "reis": 59,
      "zirve": 50,
      "hedef27": 50,
      "aliyntem": 53,
      "kirmizisiyah": 49,
      "d3mon": 57,
      "recobaba": 53,
      "explorer": 46
    }
  },
  {
    "gw": 9,
    "scores": {
      "fe": 78,
      "reis": 67,
      "zirve": 63,
      "hedef27": 69,
      "aliyntem": 60,
      "kirmizisiyah": 67,
      "d3mon": 56,
      "recobaba": 63,
      "explorer": 58
    }
  },
  {
    "gw": 10,
    "scores": {
      "fe": 52,
      "reis": 58,
      "zirve": 47,
      "hedef27": 48,
      "aliyntem": 47,
      "kirmizisiyah": 55,
      "d3mon": 46,
      "recobaba": 53,
      "explorer": 38
    }
  },
  {
    "gw": 11,
    "scores": {
      "fe": 60,
      "reis": 56,
      "zirve": 57,
      "hedef27": 58,
      "aliyntem": 53,
      "kirmizisiyah": 63,
      "d3mon": 60,
      "recobaba": 52,
      "explorer": 48
    }
  },
  {
    "gw": 12,
    "scores": {
      "fe": 58,
      "reis": 63,
      "zirve": 65,
      "hedef27": 53,
      "aliyntem": 48,
      "kirmizisiyah": 50,
      "d3mon": 57,
      "recobaba": 56,
      "explorer": 50
    }
  },
  {
    "gw": 13,
    "scores": {
      "fe": 57,
      "reis": 58,
      "zirve": 49,
      "hedef27": 45,
      "aliyntem": 43,
      "kirmizisiyah": 42,
      "d3mon": 46,
      "recobaba": 40,
      "explorer": 37
    }
  },
  {
    "gw": 14,
    "scores": {
      "fe": 65,
      "reis": 69,
      "zirve": 69,
      "hedef27": 59,
      "aliyntem": 65,
      "kirmizisiyah": 62,
      "d3mon": 52,
      "recobaba": 84,
      "explorer": 46
    }
  },
  {
    "gw": 15,
    "scores": {
      "fe": 67,
      "reis": 60,
      "zirve": 57,
      "hedef27": 62,
      "aliyntem": 49,
      "kirmizisiyah": 49,
      "d3mon": 45,
      "recobaba": 40,
      "explorer": 54
    }
  },
  {
    "gw": 16,
    "scores": {
      "fe": 50,
      "reis": 51,
      "zirve": 49,
      "hedef27": 42,
      "aliyntem": 44,
      "kirmizisiyah": 54,
      "d3mon": 43,
      "recobaba": 45,
      "explorer": 40
    }
  },
  {
    "gw": 17,
    "scores": {
      "fe": 64,
      "reis": 63,
      "zirve": 66,
      "hedef27": 65,
      "aliyntem": 71,
      "kirmizisiyah": 58,
      "d3mon": 62,
      "recobaba": 58,
      "explorer": 54
    }
  },
  {
    "gw": 18,
    "scores": {
      "fe": 39,
      "reis": 40,
      "zirve": 36,
      "hedef27": 47,
      "aliyntem": 46,
      "kirmizisiyah": 33,
      "d3mon": 39,
      "recobaba": 34,
      "explorer": 39
    }
  },
  {
    "gw": 19,
    "scores": {
      "fe": 72,
      "reis": 77,
      "zirve": 69,
      "hedef27": 78,
      "aliyntem": 90,
      "kirmizisiyah": 63,
      "d3mon": 58,
      "recobaba": 55,
      "explorer": 67
    }
  },
  {
    "gw": 20,
    "scores": {
      "fe": 55,
      "reis": 54,
      "zirve": 63,
      "hedef27": 60,
      "aliyntem": 54,
      "kirmizisiyah": 52,
      "d3mon": 57,
      "recobaba": 45,
      "explorer": 41
    }
  },
  {
    "gw": 21,
    "scores": {
      "fe": 57,
      "reis": 54,
      "zirve": 52,
      "hedef27": 55,
      "aliyntem": 54,
      "kirmizisiyah": 47,
      "d3mon": 50,
      "recobaba": 48,
      "explorer": 47
    }
  },
  {
    "gw": 22,
    "scores": {
      "fe": 70,
      "reis": 67,
      "zirve": 59,
      "hedef27": 56,
      "aliyntem": 62,
      "kirmizisiyah": 56,
      "d3mon": 61,
      "recobaba": 58,
      "explorer": 45
    }
  },
  {
    "gw": 23,
    "scores": {
      "fe": 53,
      "reis": 56,
      "zirve": 60,
      "hedef27": 58,
      "aliyntem": 44,
      "kirmizisiyah": 57,
      "d3mon": 51,
      "recobaba": 51,
      "explorer": 50
    }
  },
  {
    "gw": 24,
    "scores": {
      "fe": 67,
      "reis": 64,
      "zirve": 68,
      "hedef27": 69,
      "aliyntem": 55,
      "kirmizisiyah": 59,
      "d3mon": 63,
      "recobaba": 53,
      "explorer": 50
    }
  },
  {
    "gw": 25,
    "scores": {
      "fe": 110,
      "reis": 94,
      "zirve": 87,
      "hedef27": 93,
      "aliyntem": 83,
      "kirmizisiyah": 83,
      "d3mon": 83,
      "recobaba": 68,
      "explorer": 80
    }
  },
  {
    "gw": 26,
    "scores": {
      "fe": 48,
      "reis": 59,
      "zirve": 46,
      "hedef27": 49,
      "aliyntem": 47,
      "kirmizisiyah": 47,
      "d3mon": 50,
      "recobaba": 50,
      "explorer": 40
    }
  },
  {
    "gw": 27,
    "scores": {
      "fe": 70,
      "reis": 70,
      "zirve": 69,
      "hedef27": 55,
      "aliyntem": 65,
      "kirmizisiyah": 52,
      "d3mon": 61,
      "recobaba": 48,
      "explorer": 46
    }
  },
  {
    "gw": 28,
    "scores": {
      "fe": 53,
      "reis": 47,
      "zirve": 47,
      "hedef27": 51,
      "aliyntem": 47,
      "kirmizisiyah": 41,
      "d3mon": 44,
      "recobaba": 37,
      "explorer": 34
    }
  },
  {
    "gw": 29,
    "scores": {
      "fe": 43,
      "reis": 34,
      "zirve": 40,
      "hedef27": 36,
      "aliyntem": 35,
      "kirmizisiyah": 41,
      "d3mon": 42,
      "recobaba": 30,
      "explorer": 31
    }
  },
  {
    "gw": 30,
    "scores": {
      "fe": 59,
      "reis": 67,
      "zirve": 65,
      "hedef27": 56,
      "aliyntem": 62,
      "kirmizisiyah": 67,
      "d3mon": 53,
      "recobaba": 56,
      "explorer": 61
    }
  },
  {
    "gw": 31,
    "scores": {
      "fe": 56,
      "reis": 53,
      "zirve": 64,
      "hedef27": 54,
      "aliyntem": 56,
      "kirmizisiyah": 49,
      "d3mon": 57,
      "recobaba": 46,
      "explorer": 45
    }
  },
  {
    "gw": 32,
    "scores": {
      "fe": 55,
      "reis": 62,
      "zirve": 57,
      "hedef27": 51,
      "aliyntem": 53,
      "kirmizisiyah": 53,
      "d3mon": 55,
      "recobaba": 51,
      "explorer": 49
    }
  },
  {
    "gw": 33,
    "scores": {
      "fe": 67,
      "reis": 55,
      "zirve": 56,
      "hedef27": 56,
      "aliyntem": 62,
      "kirmizisiyah": 58,
      "d3mon": 57,
      "recobaba": 48,
      "explorer": 47
    }
  },
  {
    "gw": 34,
    "scores": {
      "fe": 90,
      "reis": 101,
      "zirve": 87,
      "hedef27": 82,
      "aliyntem": 79,
      "kirmizisiyah": 74,
      "d3mon": 75,
      "recobaba": 79,
      "explorer": 67
    }
  },
  {
    "gw": 35,
    "scores": {
      "fe": 55,
      "reis": 66,
      "zirve": 56,
      "hedef27": 51,
      "aliyntem": 61,
      "kirmizisiyah": 59,
      "d3mon": 50,
      "recobaba": 42,
      "explorer": 43
    }
  },
  {
    "gw": 36,
    "scores": {
      "fe": 61,
      "reis": 49,
      "zirve": 56,
      "hedef27": 54,
      "aliyntem": 48,
      "kirmizisiyah": 54,
      "d3mon": 55,
      "recobaba": 54,
      "explorer": 53
    }
  },
  {
    "gw": 37,
    "scores": {
      "fe": 86,
      "reis": 87,
      "zirve": 102,
      "hedef27": 86,
      "aliyntem": 83,
      "kirmizisiyah": 69,
      "d3mon": 67,
      "recobaba": 75,
      "explorer": 74
    }
  },
  {
    "gw": 38,
    "scores": {
      "fe": 69,
      "reis": 55,
      "zirve": 60,
      "hedef27": 60,
      "aliyntem": 65,
      "kirmizisiyah": 51,
      "d3mon": 51,
      "recobaba": 58,
      "explorer": 49
    }
  }
];

export const DATASET_VERSION = "2026_authentic_real_v4";
export const STORAGE_KEY = "fpl_ladder_v2026_authentic_real_v4";

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
