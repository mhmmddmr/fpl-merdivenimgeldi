// "Merdivenim Geldi" FPL League Data Store & Persistence Layer

export const INITIAL_TEAMS = [
  { 
    id: "fe", 
    name: "Fe", 
    manager: "Muhammed Fe", 
    color: "#00ff85", 
    accent: "text-emerald-400",
    gradient: "linear-gradient(135deg, #059669, #00ff85)",
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
    color: "#eab308", 
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

// Initial scores from GW1 official screenshot
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
  }
];

export const STORAGE_KEY = "fpl_merdivenim_geldi_v1_store";

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
