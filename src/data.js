// "Merdivenim Geldi" FPL League Data Store & Persistence Layer

export const INITIAL_TEAMS = [
  { 
    id: "fe", 
    name: "Fe", 
    manager: "Muhammed Fe", 
    color: "#00ff87", 
    accent: "text-emerald-400",
    gradient: "linear-gradient(135deg, #059669, #00ff87)",
    avatar: "👑"
  },
  { 
    id: "reis", 
    name: "Reis United", 
    manager: "Oğuz Ünal", 
    color: "#a855f7", 
    accent: "text-purple-400",
    gradient: "linear-gradient(135deg, #6b21a8, #a855f7)",
    avatar: "⚽"
  },
  { 
    id: "zirve", 
    name: "Yeniden Zirveye", 
    manager: "ŞAHİN KILINÇ", 
    color: "#e90052", 
    accent: "text-rose-400",
    gradient: "linear-gradient(135deg, #be123c, #f43f5e)",
    avatar: "🚀"
  },
  { 
    id: "hedef27", 
    name: "Hedef 27 🍆 🍑", 
    manager: "Ali Can Çakmak", 
    color: "#f43f5e", 
    accent: "text-pink-400",
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
    avatar: "🎯"
  },
  { 
    id: "kirmizisiyah", 
    name: "KırmızıSiyah", 
    manager: "Turgay Çavuş", 
    color: "#ef4444", 
    accent: "text-red-400",
    gradient: "linear-gradient(135deg, #dc2626, #1f2937)",
    avatar: "🔴"
  },
  { 
    id: "explorer", 
    name: "Explorer", 
    manager: "ali zenginler", 
    color: "#04f5ff", 
    accent: "text-cyan-400",
    gradient: "linear-gradient(135deg, #0284c7, #04f5ff)",
    avatar: "🧭"
  },
  { 
    id: "aliyntem", 
    name: "Aliyntem42", 
    manager: "Ali Yöntem", 
    color: "#fbbf24", 
    accent: "text-amber-400",
    gradient: "linear-gradient(135deg, #d97706, #fbbf24)",
    avatar: "⭐"
  },
  { 
    id: "d3mon", 
    name: "D3mon FC", 
    manager: "Oğuz Çalışkanoğlu", 
    color: "#6366f1", 
    accent: "text-indigo-400",
    gradient: "linear-gradient(135deg, #4338ca, #818cf8)",
    avatar: "😈"
  },
  { 
    id: "recobaba", 
    name: "Reco BaBa", 
    manager: "Recep Alper", 
    color: "#f97316", 
    accent: "text-orange-400",
    gradient: "linear-gradient(135deg, #c2410c, #fb923c)",
    avatar: "🔥"
  }
];

// 15 Gameweeks of rich FPL simulation data
export const INITIAL_GAMEWEEKS = [
  {
    gw: 1,
    scores: {
      fe: 39,
      reis: 39,
      zirve: 39,
      hedef27: 38,
      kirmizisiyah: 35,
      explorer: 25,
      aliyntem: 25,
      d3mon: 25,
      recobaba: 25
    }
  },
  {
    gw: 2,
    scores: {
      fe: 67,
      reis: 54,
      zirve: 72,
      hedef27: 61,
      kirmizisiyah: 48,
      explorer: 59,
      aliyntem: 77,
      d3mon: 52,
      recobaba: 45
    }
  },
  {
    gw: 3,
    scores: {
      fe: 58,
      reis: 65,
      zirve: 44,
      hedef27: 82,
      kirmizisiyah: 70,
      explorer: 64,
      aliyntem: 53,
      d3mon: 69,
      recobaba: 62
    }
  },
  {
    gw: 4,
    scores: {
      fe: 81,
      reis: 74,
      zirve: 68,
      hedef27: 55,
      kirmizisiyah: 62,
      explorer: 49,
      aliyntem: 88,
      d3mon: 60,
      recobaba: 71
    }
  },
  {
    gw: 5,
    scores: {
      fe: 62,
      reis: 80,
      zirve: 79,
      hedef27: 74,
      kirmizisiyah: 53,
      explorer: 68,
      aliyntem: 65,
      d3mon: 73,
      recobaba: 56
    }
  },
  {
    gw: 6,
    scores: {
      fe: 75,
      reis: 63,
      zirve: 85,
      hedef27: 69,
      kirmizisiyah: 77,
      explorer: 55,
      aliyntem: 70,
      d3mon: 58,
      recobaba: 64
    }
  },
  {
    gw: 7,
    scores: {
      fe: 53,
      reis: 71,
      zirve: 60,
      hedef27: 88,
      kirmizisiyah: 65,
      explorer: 74,
      aliyntem: 59,
      d3mon: 81,
      recobaba: 50
    }
  },
  {
    gw: 8,
    scores: {
      fe: 89,
      reis: 58,
      zirve: 66,
      hedef27: 72,
      kirmizisiyah: 80,
      explorer: 63,
      aliyntem: 75,
      d3mon: 67,
      recobaba: 69
    }
  },
  {
    gw: 9,
    scores: {
      fe: 64,
      reis: 86,
      zirve: 73,
      hedef27: 65,
      kirmizisiyah: 59,
      explorer: 82,
      aliyntem: 61,
      d3mon: 70,
      recobaba: 78
    }
  },
  {
    gw: 10,
    scores: {
      fe: 70,
      reis: 67,
      zirve: 91,
      hedef27: 76,
      kirmizisiyah: 68,
      explorer: 70,
      aliyntem: 84,
      d3mon: 62,
      recobaba: 59
    }
  },
  {
    gw: 11,
    scores: {
      fe: 83,
      reis: 79,
      zirve: 64,
      hedef27: 80,
      kirmizisiyah: 72,
      explorer: 66,
      aliyntem: 69,
      d3mon: 75,
      recobaba: 85
    }
  },
  {
    gw: 12,
    scores: {
      fe: 66,
      reis: 72,
      zirve: 82,
      hedef27: 68,
      kirmizisiyah: 85,
      explorer: 58,
      aliyntem: 73,
      d3mon: 64,
      recobaba: 67
    }
  },
  {
    gw: 13,
    scores: {
      fe: 78,
      reis: 88,
      zirve: 71,
      hedef27: 75,
      kirmizisiyah: 61,
      explorer: 79,
      aliyntem: 80,
      d3mon: 77,
      recobaba: 60
    }
  },
  {
    gw: 14,
    scores: {
      fe: 72,
      reis: 65,
      zirve: 77,
      hedef27: 93,
      kirmizisiyah: 69,
      explorer: 71,
      aliyntem: 64,
      d3mon: 82,
      recobaba: 74
    }
  },
  {
    gw: 15,
    scores: {
      fe: 85,
      reis: 81,
      zirve: 89,
      hedef27: 78,
      kirmizisiyah: 74,
      explorer: 86,
      aliyntem: 77,
      d3mon: 69,
      recobaba: 73
    }
  }
];

export const STORAGE_KEY = "fpl_merdivenim_geldi_v15_store";

export function loadLeagueData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.teams && parsed.gameweeks && parsed.gameweeks.length > 0) {
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
