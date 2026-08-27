// Main Application Logic for "Merdivenim Geldi"

import {
  loadLeagueData,
  saveLeagueData,
  resetLeagueData,
  DATASET_VERSION
} from './data.js?v=5.3.0';

import {
  calculateStandings,
  getStatHighlights,
  getProgressionData,
  getLeaderboardDominance,
  getHeadToHead,
  getManagerLevel,
  getTeamBadges,
  getLeagueBadgesOverview
} from './stats.js?v=5.3.0';

import {
  renderRankChart,
  renderPointsChart,
  renderLadderMatrix,
  updateChartFocus,
  setFocusedTeam,
  getFocusedTeam
} from './charts.js?v=5.3.0';

import { fetchFplLeagueStandings } from './fplApi.js?v=5.3.0';

// Clear previous outdated stores
['fpl_ladder_data_v1', 'fpl_merdivenim_geldi_v38_store', 'fpl_merdivenim_geldi_v38_laser_contrast_store', 'fpl_merdivenim_geldi_v38_realistic_season_store', 'fpl_ladder_v2026_realistic_v3', 'fpl_ladder_v2026_authentic_real_v4'].forEach(k => {
  try { localStorage.removeItem(k); } catch(e) {}
});

// Application State
let leagueData = loadLeagueData();
let selectedGameweek = null;
let currentActiveChartTab = 'rank'; // Default to Sıralama Yarışı (Bump Chart)
let pinnedTeamId = null; // When explicitly clicked/pinned
let tableSortKey = 'rank'; // 'rank' | 'name' | 'gwPoints' | 'totalPoints'
let tableSortOrder = 'asc'; // 'asc' | 'desc'

// Safe Bootstrap Mechanism
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}

function bootstrapApp() {
  try {
    initApp();
    setupEventListeners();
    renderAll();
  } catch (err) {
    console.error("Bootstrap error:", err);
  }
}

function initApp() {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  if (gws.length > 0) {
    selectedGameweek = gws[gws.length - 1].gw;
  }
}

/**
 * Main Render Trigger
 */
export function renderAll() {
  renderHeaderControls();
  renderHighlightCards();
  renderLeagueBadgesSection();
  renderStandingsTable();
  renderTeamFilterPills();
  renderActiveChart();
}

/**
 * 1. Render Header GW Selector & Badges
 */
function renderHeaderControls() {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  const latestGw = gws.length > 0 ? gws[gws.length - 1].gw : 1;
  if (!selectedGameweek) selectedGameweek = latestGw;

  const gwSelect = document.getElementById('gameweek-select');
  if (gwSelect) {
    gwSelect.innerHTML = gws.map(g => `
      <option value="${g.gw}" ${g.gw === selectedGameweek ? 'selected' : ''}>
        Hafta ${g.gw} (GW ${g.gw})
      </option>
    `).join('');
  }

  const heroBadge = document.getElementById('current-gw-badge');
  if (heroBadge) {
    heroBadge.innerText = `Gameweek ${selectedGameweek} • Toplam ${latestGw} Hafta`;
  }
}

/**
 * 2. Render Team Filter Pills for Chart (Hover to Spotlight + Click to Pin)
 */
function updateFilterPillsUI(activeId) {
  const filterContainer = document.getElementById('team-filter-container');
  if (!filterContainer) return;

  filterContainer.querySelectorAll('.team-filter-chip').forEach(btn => {
    const btnId = btn.getAttribute('data-filter');
    const isSelected = btnId === activeId;

    if (btnId === 'all') {
      btn.className = `team-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold font-display transition-all border cursor-pointer ${
        isSelected 
          ? 'bg-white/20 text-white border-white/30 shadow-md scale-105' 
          : 'bg-white/[0.04] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.08]'
      }`;
    } else {
      btn.className = `team-filter-chip px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all border cursor-pointer ${
        isSelected 
          ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-500/25 scale-105' 
          : 'bg-white/[0.04] text-slate-300 border-white/5 hover:text-white hover:bg-white/[0.08] hover:border-white/15'
      }`;
    }
  });
}

function renderTeamFilterPills() {
  const filterContainer = document.getElementById('team-filter-container');
  if (!filterContainer) return;

  const currentFocus = pinnedTeamId || getFocusedTeam() || 'all';

  let pillsHtml = `
    <button data-filter="all" class="team-filter-chip px-3 py-1.5 rounded-xl text-xs font-extrabold font-display transition-all border cursor-pointer ${
      currentFocus === 'all' 
        ? 'bg-white/20 text-white border-white/30 shadow-md scale-105' 
        : 'bg-white/[0.04] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.08]'
    }">
      Tüm Takımlar
    </button>
  `;

  leagueData.teams.forEach(t => {
    const isSelected = currentFocus === t.id;
    pillsHtml += `
      <button data-filter="${t.id}" class="team-filter-chip px-3 py-1.5 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all border cursor-pointer ${
        isSelected 
          ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-500/25 scale-105' 
          : 'bg-white/[0.04] text-slate-300 border-white/5 hover:text-white hover:bg-white/[0.08] hover:border-white/15'
      }">
        <span class="text-sm">${t.avatar}</span>
        <span class="truncate max-w-[95px]">${t.name}</span>
      </button>
    `;
  });

  filterContainer.innerHTML = pillsHtml;

  const progData = getProgressionData(leagueData);

  // Attach Hover (mouseenter) and Click events for each team button
  filterContainer.querySelectorAll('.team-filter-chip').forEach(btn => {
    const teamId = btn.getAttribute('data-filter');

    // 1. Mouse Enter -> Instant hover spotlight without clicking!
    btn.addEventListener('mouseenter', () => {
      updateFilterPillsUI(teamId);
      updateChartFocus(teamId, progData);
    });

    // 2. Click -> Lock/Pin or unpin
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (teamId === 'all') {
        pinnedTeamId = null;
        updateFilterPillsUI('all');
        updateChartFocus('all', progData);
      } else if (pinnedTeamId === teamId) {
        // Toggle off if already pinned
        pinnedTeamId = null;
        updateFilterPillsUI('all');
        updateChartFocus('all', progData);
      } else {
        pinnedTeamId = teamId;
        updateFilterPillsUI(teamId);
        updateChartFocus(teamId, progData);
      }
    });
  });

  // 3. Mouse Leave from container -> Reset to pinned team or all
  filterContainer.addEventListener('mouseleave', () => {
    const target = pinnedTeamId || 'all';
    updateFilterPillsUI(target);
    updateChartFocus(target, progData);
  });
}

/**
 * 3. Render 4 Top Highlight Cards (Executive HUD / World-Class Agency Quality)
 */
function renderHighlightCards() {
  const highlights = getStatHighlights(leagueData, selectedGameweek);
  if (!highlights) return;

  // 1. Current Leader(s)
  const leaderCard = document.getElementById('card-leader');
  if (leaderCard) {
    leaderCard.className = "fpl-hero-card fpl-hero-gold group";
    const isMultiple = highlights.leaders.length > 1;
    const topScore = highlights.leaders[0]?.totalPoints || 0;
    const primaryLeader = highlights.leaders[0];

    let bodyHtml = '';
    if (isMultiple) {
      bodyHtml = `
        <div class="h-14 flex items-center gap-3 my-2.5 relative z-10 min-w-0">
          <div class="flex -space-x-3 overflow-hidden py-1 shrink-0">
            ${highlights.leaders.map(l => `
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md ring-2 ring-[#110a24] shrink-0" style="background: ${l.team.gradient}" title="${l.team.name}">
                ${l.team.avatar}
              </div>
            `).join('')}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-black text-white tracking-tight truncate leading-snug group-hover:text-amber-300 transition-colors font-display">
              ${highlights.leaders.map(l => l.team.name).join(' & ')}
            </h3>
            <p class="text-xs text-slate-400 font-medium truncate mt-0.5">${highlights.leaders.length} Takım Zirveyi Paylaşıyor</p>
          </div>
        </div>
      `;
    } else if (primaryLeader) {
      bodyHtml = `
        <div class="h-14 flex items-center gap-3.5 my-2.5 relative z-10 min-w-0">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 ring-2 ring-amber-400/30 transition-transform group-hover:scale-105 duration-200" style="background: ${primaryLeader.team.gradient}">
            ${primaryLeader.team.avatar}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-black text-white tracking-tight truncate leading-tight group-hover:text-amber-300 transition-colors font-display">${primaryLeader.team.name}</h3>
            <p class="text-xs text-slate-400 font-medium truncate mt-0.5">${primaryLeader.team.manager}</p>
          </div>
        </div>
      `;
    }

    leaderCard.onclick = () => {
      if (primaryLeader?.team?.id) window.openManagerModal(primaryLeader.team.id);
    };

    leaderCard.innerHTML = `
      <div class="fpl-hero-glow bg-amber-500/15"></div>
      
      <!-- Card Header -->
      <div class="h-6 flex items-center justify-between relative z-10 min-w-0">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span class="w-2 h-2 rounded-full shrink-0 bg-amber-400 shadow-[0_0_8px_#fbbf24]"></span>
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 font-display truncate">Güncel Lider</span>
        </div>
        <span class="px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-bold font-display whitespace-nowrap shrink-0" title="Seçili hafta itibarıyla toplam puan tablosunda 1. sırada yer alan takım">
          ${isMultiple ? `${highlights.leaders.length} Takım` : '1. Basamak'}
        </span>
      </div>

      <!-- Hero Subject -->
      ${bodyHtml}

      <!-- Metric Footer -->
      <div class="h-9 pt-2.5 border-t border-white/5 flex items-center justify-between relative z-10 min-w-0">
        <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate mr-1">Toplam Liderlik Puanı</span>
        <div class="flex items-baseline gap-1 font-display shrink-0">
          <span class="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">${topScore}</span>
          <span class="text-xs font-bold text-amber-400/70">P</span>
        </div>
      </div>
    `;
  }

  // 2. Gameweek Winner (Haftanın Fatihi)
  const gwWinnerCard = document.getElementById('card-gw-winner');
  if (gwWinnerCard) {
    gwWinnerCard.className = "fpl-hero-card fpl-hero-purple group";
    const isMultiple = highlights.gwWinners.length > 1;
    const winner = highlights.gwWinners[0];

    let bodyHtml = '';
    if (isMultiple) {
      bodyHtml = `
        <div class="h-14 flex items-center gap-3 my-2.5 relative z-10 min-w-0">
          <div class="flex -space-x-3 overflow-hidden py-1 shrink-0">
            ${highlights.gwWinners.map(w => `
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md ring-2 ring-[#110a24] shrink-0" style="background: ${w.team.gradient}" title="${w.team.name}">
                ${w.team.avatar}
              </div>
            `).join('')}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-black text-white tracking-tight truncate leading-snug group-hover:text-purple-300 transition-colors font-display">
              ${highlights.gwWinners.map(w => w.team.name).join(' & ')}
            </h3>
            <p class="text-xs text-slate-400 font-medium truncate mt-0.5">${highlights.gwWinners.length} Takım Haftayı Paylaştı</p>
          </div>
        </div>
      `;
    } else if (winner) {
      bodyHtml = `
        <div class="h-14 flex items-center gap-3.5 my-2.5 relative z-10 min-w-0">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 ring-2 ring-purple-400/30 transition-transform group-hover:scale-105 duration-200" style="background: ${winner.team.gradient}">
            ${winner.team.avatar}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-black text-white tracking-tight truncate leading-tight group-hover:text-purple-300 transition-colors font-display">${winner.team.name}</h3>
            <p class="text-xs text-slate-400 font-medium truncate mt-0.5">${winner.team.manager}</p>
          </div>
        </div>
      `;
    }

    gwWinnerCard.onclick = () => {
      if (winner?.team?.id) window.openManagerModal(winner.team.id);
    };

    gwWinnerCard.innerHTML = `
      <div class="fpl-hero-glow bg-purple-500/15"></div>
      
      <!-- Card Header -->
      <div class="h-6 flex items-center justify-between relative z-10 min-w-0">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span class="w-2 h-2 rounded-full shrink-0 bg-purple-400 shadow-[0_0_8px_#c084fc]"></span>
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-purple-300 font-display truncate">Haftanın Fatihi</span>
        </div>
        <span class="px-2 py-0.5 rounded-md bg-purple-400/10 border border-purple-400/20 text-purple-300 text-[10px] font-bold font-display whitespace-nowrap shrink-0" title="Seçili haftada en yüksek puanı alan takım">
          GW ${selectedGameweek}
        </span>
      </div>

      <!-- Hero Subject -->
      ${bodyHtml}

      <!-- Metric Footer -->
      <div class="h-9 pt-2.5 border-t border-white/5 flex items-center justify-between relative z-10 min-w-0">
        <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate mr-1">Haftanın En Yüksek Puanı</span>
        <div class="flex items-baseline gap-1 font-display shrink-0">
          <span class="text-2xl sm:text-3xl font-black text-purple-400 tabular-nums">${highlights.maxGwScore}</span>
          <span class="text-xs font-bold text-purple-400/70">P</span>
        </div>
      </div>
    `;
  }

  // 3. Haftanın Cahili (Seçili haftada en düşük puanı alan menajer)
  const lowestCard = document.getElementById('card-climber');
  if (lowestCard) {
    lowestCard.className = "fpl-hero-card fpl-hero-rose group";
    const lowestList = highlights.gwLowest || [];
    const loser = lowestList[0];

    let bodyHtml = '';
    if (lowestList.length > 1) {
      bodyHtml = `
        <div class="h-14 flex items-center gap-3 my-2.5 relative z-10 min-w-0">
          <div class="flex -space-x-3 overflow-hidden py-1 shrink-0">
            ${lowestList.map(l => `
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md ring-2 ring-[#110a24] shrink-0" style="background: ${l.team.gradient}" title="${l.team.name}">
                ${l.team.avatar}
              </div>
            `).join('')}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base font-black text-white tracking-tight truncate leading-snug group-hover:text-rose-300 transition-colors font-display">
              ${lowestList.map(l => l.team.name).join(' & ')}
            </h3>
            <p class="text-xs text-slate-400 font-medium truncate mt-0.5">${lowestList.length} Takım Dipte Eşit</p>
          </div>
        </div>
      `;
    } else if (loser) {
      bodyHtml = `
        <div class="h-14 flex items-center gap-3.5 my-2.5 relative z-10 min-w-0">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 ring-2 ring-rose-400/30 transition-transform group-hover:scale-105 duration-200" style="background: ${loser.team.gradient}">
            ${loser.team.avatar}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-black text-white tracking-tight truncate leading-tight group-hover:text-rose-300 transition-colors font-display">${loser.team.name}</h3>
            <p class="text-xs text-slate-400 font-medium truncate mt-0.5">${loser.team.manager}</p>
          </div>
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="h-14 flex items-center my-2.5 text-xs text-slate-400">Veri bulunamadı</div>
      `;
    }

    lowestCard.onclick = () => {
      if (loser?.team?.id) window.openManagerModal(loser.team.id);
    };

    lowestCard.innerHTML = `
      <div class="fpl-hero-glow bg-rose-500/15"></div>
      
      <!-- Card Header -->
      <div class="h-6 flex items-center justify-between relative z-10 min-w-0">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span class="w-2 h-2 rounded-full shrink-0 bg-rose-400 shadow-[0_0_8px_#fb7185]"></span>
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 font-display truncate">Haftanın Cahili</span>
        </div>
        <span class="px-2 py-0.5 rounded-md bg-rose-400/10 border border-rose-400/20 text-rose-300 text-[10px] font-bold font-display whitespace-nowrap shrink-0" title="Seçili haftada en düşük puanı alan takım">
          GW ${selectedGameweek}
        </span>
      </div>

      <!-- Hero Subject -->
      ${bodyHtml}

      <!-- Metric Footer -->
      <div class="h-9 pt-2.5 border-t border-white/5 flex items-center justify-between relative z-10 min-w-0">
        <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate mr-1">Haftanın En Düşük Puanı</span>
        <div class="flex items-baseline gap-1 font-display shrink-0">
          <span class="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums">${highlights.minGwScore}</span>
          <span class="text-xs font-bold text-rose-400/70">P</span>
        </div>
      </div>
    `;
  }

  // 4. Lig Ortalaması & Sezon Dengesi
  const averageCard = document.getElementById('card-average');
  if (averageCard) {
    averageCard.className = "fpl-hero-card fpl-hero-emerald group";
    const scoreDiff = (highlights.maxGwScore - highlights.minGwScore) || 0;

    averageCard.onclick = () => {
      document.getElementById('standings-tbody')?.scrollIntoView({ behavior: 'smooth' });
    };

    averageCard.innerHTML = `
      <div class="fpl-hero-glow bg-emerald-500/15"></div>
      
      <!-- Card Header -->
      <div class="h-6 flex items-center justify-between relative z-10 min-w-0">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <span class="w-2 h-2 rounded-full shrink-0 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 font-display truncate">Lig Ortalaması</span>
        </div>
        <span class="px-2 py-0.5 rounded-md bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-[10px] font-bold font-display whitespace-nowrap shrink-0" title="Lig genel ortalamaları ve farklar">
          GW ${selectedGameweek}
        </span>
      </div>

      <!-- Hero Subject (Matches other cards 100%!) -->
      <div class="h-14 flex items-center gap-3.5 my-2.5 relative z-10 min-w-0">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md shrink-0 ring-2 ring-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-teal-700/30 text-emerald-300 transition-transform group-hover:scale-105 duration-200">
          <i class="fa-solid fa-chart-simple text-lg"></i>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base sm:text-lg font-black text-white tracking-tight truncate leading-tight group-hover:text-emerald-300 transition-colors font-display">9 Takım Dengesi</h3>
          <p class="text-xs text-slate-400 font-medium truncate mt-0.5">Zirve-Dip: <span class="text-slate-200 font-bold tabular-nums">+${scoreDiff} P</span> • Genel: <span class="text-slate-200 font-bold tabular-nums">${highlights.overallAverage} P</span></p>
        </div>
      </div>

      <!-- Metric Footer -->
      <div class="h-9 pt-2.5 border-t border-white/5 flex items-center justify-between relative z-10 min-w-0">
        <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate mr-1">Haftalık Lig Ortalaması</span>
        <div class="flex items-baseline gap-1 font-display shrink-0">
          <span class="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">${highlights.gwAverage}</span>
          <span class="text-xs font-bold text-emerald-400/70">P</span>
        </div>
      </div>
    `;
  }
}

/**
 * 3.5. Render League-Wide Badges Showcase (5 Cards with Badge Holders & Counts)
 */
function renderLeagueBadgesSection() {
  const container = document.getElementById('league-badges-grid');
  if (!container) return;

  const badgesOverview = getLeagueBadgesOverview(leagueData, selectedGameweek);
  if (!badgesOverview || badgesOverview.length === 0) return;

  // Theme map for 5 badges
  const badgeThemeMap = {
    merdivenler_krali: {
      heroClass: "fpl-hero-gold",
      glowColor: "bg-amber-500/15",
      dotClass: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
      titleColor: "text-amber-300",
      chipClass: "bg-amber-400/10 border-amber-400/20 text-amber-300"
    },
    hat_trick: {
      heroClass: "fpl-hero-cyan",
      glowColor: "bg-cyan-500/15",
      dotClass: "bg-cyan-400 shadow-[0_0_8px_#04f5ff]",
      titleColor: "text-cyan-300",
      chipClass: "bg-cyan-400/10 border-cyan-400/20 text-cyan-300"
    },
    yuzler_kulubu: {
      heroClass: "fpl-hero-emerald",
      glowColor: "bg-emerald-500/15",
      dotClass: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
      titleColor: "text-emerald-300",
      chipClass: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300"
    },
    istikrar_abidesi: {
      heroClass: "fpl-hero-purple",
      glowColor: "bg-purple-500/15",
      dotClass: "bg-purple-400 shadow-[0_0_8px_#c084fc]",
      titleColor: "text-purple-300",
      chipClass: "bg-purple-400/10 border-purple-400/20 text-purple-300"
    },
    futbol_cahili: {
      heroClass: "fpl-hero-rose",
      glowColor: "bg-rose-500/15",
      dotClass: "bg-rose-400 shadow-[0_0_8px_#fb7185]",
      titleColor: "text-rose-300",
      chipClass: "bg-rose-400/10 border-rose-400/20 text-rose-300"
    }
  };

  container.innerHTML = badgesOverview.map(badge => {
    const theme = badgeThemeMap[badge.id] || {
      heroClass: "fpl-hero-purple",
      glowColor: "bg-purple-500/15",
      dotClass: "bg-purple-400 shadow-[0_0_8px_#c084fc]",
      titleColor: "text-purple-300",
      chipClass: "bg-purple-400/10 border-purple-400/20 text-purple-300"
    };

    let holdersHtml = '';
    if (badge.holders.length > 0) {
      holdersHtml = `
        <div class="space-y-1.5 min-h-[76px] max-h-48 overflow-y-auto pr-0.5 relative z-10">
          ${badge.holders.map(h => `
            <div 
              class="flex items-center justify-between p-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 cursor-pointer transition-all duration-200 group/holder"
              onclick="window.openManagerModal('${h.team.id}')"
              title="${h.team.name} (${h.team.manager}) - ${h.detail}"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-sm shrink-0 group-hover/holder:scale-110 transition-transform">${h.team.avatar}</span>
                <span class="text-xs font-bold text-slate-200 group-hover/holder:text-white truncate font-display">${h.team.name}</span>
              </div>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-black font-display tabular-nums shrink-0 border ${badge.pillClass}">
                x${h.count}
              </span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      holdersHtml = `
        <div class="h-[76px] flex flex-col items-center justify-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-slate-500 text-[11px] relative z-10">
          <i class="fa-solid fa-lock text-xs mb-1 block opacity-50"></i>
          <span class="font-medium">Henüz kazanan yok</span>
        </div>
      `;
    }

    return `
      <div class="fpl-badge-card ${theme.heroClass} group">
        <div class="fpl-hero-glow ${theme.glowColor}"></div>
        
        <div>
          <!-- Card Header Tier (Locked height & single line) -->
          <div class="h-7 flex items-center justify-between gap-1.5 relative z-10 mb-2.5 min-w-0">
            <div class="flex items-center gap-1.5 min-w-0 flex-1">
              <span class="w-2 h-2 rounded-full shrink-0 ${theme.dotClass}"></span>
              <span class="text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-wide ${theme.titleColor} font-display truncate" title="${badge.title}">
                ${badge.title}
              </span>
            </div>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold font-display border whitespace-nowrap shrink-0 ${theme.chipClass}">
              ${badge.holders.length > 0 ? `${badge.holders.length} Takım` : 'Kilitli'}
            </span>
          </div>

          <!-- Visual Crest Hero (Fixed 80px Canvas) -->
          <div class="relative group/badge my-2 text-center z-10 h-20 flex items-center justify-center">
            <div class="w-20 h-20 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <img 
                src="${badge.image}" 
                alt="${badge.title}" 
                class="w-full h-full object-contain filter drop-shadow-lg" 
                loading="lazy"
              />
            </div>
          </div>

          <!-- Description (Fixed 36px Height Box) -->
          <div class="h-9 flex items-center justify-center text-center mb-2 px-0.5 relative z-10">
            <p class="text-[11px] text-slate-400 leading-snug font-medium line-clamp-2">${badge.desc}</p>
          </div>

          <!-- List of Holders -->
          ${holdersHtml}
        </div>

        <!-- Card Footer -->
        <div class="h-8 pt-2.5 mt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-medium relative z-10">
          <span class="uppercase tracking-wider font-bold">Durum</span>
          <span class="font-bold font-display ${badge.holders.length > 0 ? 'text-emerald-400' : 'text-slate-500'}">
            ${badge.holders.length > 0 ? '🏆 Açık' : '🔒 Kilitli'}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 4. Render Standings Table (with Interactive Column Sorting & Podium Styling)
 */
export function handleTableSort(sortKey) {
  if (tableSortKey === sortKey) {
    tableSortOrder = tableSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    tableSortKey = sortKey;
    tableSortOrder = (sortKey === 'rank' || sortKey === 'name') ? 'asc' : 'desc';
  }
  renderStandingsTable();
}

function renderStandingsTable() {
  const tableBody = document.getElementById('standings-tbody');
  if (!tableBody) return;

  const standings = calculateStandings(leagueData, selectedGameweek);

  // Apply active column sorting
  standings.sort((a, b) => {
    const factor = tableSortOrder === 'asc' ? 1 : -1;
    if (tableSortKey === 'rank') return (a.rank - b.rank) * factor;
    if (tableSortKey === 'name') return a.team.name.localeCompare(b.team.name, 'tr') * factor;
    if (tableSortKey === 'gwPoints') return (a.gwPoints - b.gwPoints) * factor;
    if (tableSortKey === 'totalPoints') return (a.totalPoints - b.totalPoints) * factor;
    return 0;
  });

  // Update sort indicators on headers
  ['rank', 'name', 'gwPoints', 'totalPoints'].forEach(key => {
    const icon = document.getElementById(`sort-icon-${key}`);
    if (icon) {
      if (tableSortKey === key) {
        icon.className = 'text-[10px] ml-0.5 text-emerald-400 font-bold';
        icon.innerText = tableSortOrder === 'asc' ? '▲' : '▼';
      } else {
        icon.className = 'text-[10px] ml-0.5 opacity-25';
        icon.innerText = '↕';
      }
    }
  });

  tableBody.innerHTML = standings.map((item) => {
    let rankBadgeClass = "rank-badge-default";
    let crownIcon = '';
    if (item.rank === 1) {
      rankBadgeClass = "rank-badge-1";
      crownIcon = ' 👑';
    } else if (item.rank === 2) {
      rankBadgeClass = "rank-badge-2";
    } else if (item.rank === 3) {
      rankBadgeClass = "rank-badge-3";
    } else if (item.rank === 9) {
      rankBadgeClass = "rank-badge-last";
    }

    let changeHtml = `<span class="text-slate-500 text-xs font-semibold">▬</span>`;
    if (item.rankChange > 0) {
      changeHtml = `<span class="text-emerald-400 text-xs font-black flex items-center justify-center font-display">▲ ${item.rankChange}</span>`;
    } else if (item.rankChange < 0) {
      changeHtml = `<span class="text-rose-400 text-xs font-black flex items-center justify-center font-display">▼ ${Math.abs(item.rankChange)}</span>`;
    }

    const formHtml = item.form.map(score => {
      let bg = "bg-white/[0.05] text-slate-300 border border-white/10";
      if (score >= 75) {
        bg = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-black";
      } else if (score < 55) {
        bg = "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold";
      }
      return `<span class="form-pill ${bg}">${score}</span>`;
    }).join(' ');

    const gapText = item.gapToLeader === 0 
      ? `<span class="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 font-extrabold text-xs border border-emerald-500/25 font-display">Lider</span>` 
      : `<span class="text-slate-400 text-xs font-bold font-display tabular-nums">-${item.gapToLeader} P</span>`;

    const lvl = getManagerLevel(item.totalPoints);
    const badges = getTeamBadges(leagueData, item.team.id, selectedGameweek);
    const unlockedBadges = badges.filter(b => b.unlocked);
    const badgeIcons = unlockedBadges.map(b => `<span title="${b.name}: ${b.desc}" class="cursor-help inline-block hover:scale-125 transition-transform">${b.icon}</span>`).join(' ');

    return `
      <tr class="table-row-item border-b border-white/[0.04] cursor-pointer group" data-team-id="${item.team.id}" onclick="window.openManagerModal('${item.team.id}')">
        <!-- Rank -->
        <td class="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
          <span class="rank-badge ${rankBadgeClass}">
            ${item.rank}
          </span>
        </td>

        <!-- Rank Change -->
        <td class="py-3.5 px-2 text-center hidden sm:table-cell whitespace-nowrap">
          ${changeHtml}
        </td>

        <!-- Team & Manager -->
        <td class="py-3.5 px-3 sm:px-4">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md shrink-0 text-white ring-2 ring-white/10 transition-transform group-hover:scale-105" style="background: ${item.team.gradient}">
              ${item.team.avatar}
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 font-black text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors truncate font-display">
                <span class="truncate">${item.team.name}${crownIcon}</span>
                <span class="px-2 py-0.5 text-[10px] font-black rounded-lg border ${lvl.badgeColor} shrink-0 font-display">
                  ${lvl.icon} Lv ${lvl.level}
                </span>
                <span class="text-xs shrink-0 flex items-center gap-0.5">${badgeIcons}</span>
              </div>
              <div class="text-xs text-slate-400 truncate mt-0.5 font-medium">${item.team.manager} • <span class="text-slate-500 font-semibold">${lvl.title}</span></div>
            </div>
          </div>
        </td>

        <!-- GW Score -->
        <td class="py-3.5 px-3 text-center whitespace-nowrap">
          <span class="inline-block px-3 py-1 rounded-xl bg-white/[0.04] border border-white/5 text-slate-100 font-black text-xs sm:text-sm font-display tabular-nums">
            ${item.gwPoints} <span class="text-[10px] text-slate-400 font-bold">P</span>
          </span>
        </td>

        <!-- Total Points -->
        <td class="py-3.5 px-3 text-center whitespace-nowrap">
          <div class="flex items-baseline justify-center gap-1 font-display">
            <span class="text-base sm:text-xl font-black ${item.rank === 1 ? 'text-amber-400' : 'text-emerald-400'} tabular-nums">${item.totalPoints}</span>
            <span class="text-[10px] font-bold ${item.rank === 1 ? 'text-amber-400/70' : 'text-emerald-400/70'}">P</span>
          </div>
        </td>

        <!-- Gap to Leader -->
        <td class="py-3.5 px-3 text-center hidden md:table-cell whitespace-nowrap">
          ${gapText}
        </td>

        <!-- Form Trend -->
        <td class="py-3.5 px-3 text-center hidden lg:table-cell whitespace-nowrap">
          <div class="flex items-center justify-center gap-1">
            ${formHtml}
          </div>
        </td>

        <!-- Action -->
        <td class="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
          <button class="w-8 h-8 rounded-xl bg-white/[0.04] group-hover:bg-emerald-500/20 group-hover:text-emerald-300 text-slate-400 transition flex items-center justify-center ml-auto border border-transparent group-hover:border-emerald-500/30" title="Menajer Karnesi">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const progData = getProgressionData(leagueData);
  tableBody.querySelectorAll('.table-row-item').forEach(row => {
    const teamId = row.getAttribute('data-team-id');
    if (!teamId) return;

    row.addEventListener('mouseenter', () => {
      updateFilterPillsUI(teamId);
      updateChartFocus(teamId, progData);
    });

    row.addEventListener('mouseleave', () => {
      const target = pinnedTeamId || 'all';
      updateFilterPillsUI(target);
      updateChartFocus(target, progData);
    });
  });
}

/**
 * 5. Render Selected Chart or Matrix
 */
function renderActiveChart() {
  const progData = getProgressionData(leagueData);
  const standings = calculateStandings(leagueData, selectedGameweek);

  const matrixContainer = document.getElementById('chart-matrix-wrapper');
  const rankWrapper = document.getElementById('chart-rank-wrapper');
  const pointsWrapper = document.getElementById('chart-points-wrapper');
  const filterPillsContainer = document.getElementById('team-filter-section');

  // Hide all chart containers first
  if (matrixContainer) matrixContainer.classList.add('hidden');
  if (rankWrapper) rankWrapper.classList.add('hidden');
  if (pointsWrapper) pointsWrapper.classList.add('hidden');
  if (filterPillsContainer) filterPillsContainer.classList.add('hidden');

  const infoFooterText = document.getElementById('chart-info-footer-text');

  if (currentActiveChartTab === 'rank') {
    if (filterPillsContainer) filterPillsContainer.classList.remove('hidden');
    if (rankWrapper) {
      rankWrapper.classList.remove('hidden');
      renderRankChart('chart-canvas-rank', progData);
    }
    if (infoFooterText) {
      infoFooterText.innerText = 'Takımların haftalık sıralama değişimleri (Bump Chart). Tek bir takımı öne çıkarmak için yukarıdaki filtre butonlarını kullanabilirsiniz.';
    }
  } else if (currentActiveChartTab === 'points') {
    if (filterPillsContainer) filterPillsContainer.classList.remove('hidden');
    if (pointsWrapper) {
      pointsWrapper.classList.remove('hidden');
      renderPointsChart('chart-canvas-points', progData);
    }
    if (infoFooterText) {
      infoFooterText.innerText = 'Takımların haftalık kümülatif toplam puan yarış çizgisi. Zirve farklarını ve puan kopmalarını takip edebilirsiniz.';
    }
  } else if (currentActiveChartTab === 'matrix') {
    if (matrixContainer) {
      matrixContainer.classList.remove('hidden');
      renderLadderMatrix('chart-matrix-wrapper', progData, standings);
    }
    if (infoFooterText) {
      infoFooterText.innerText = 'Tabloda her haftanın 1., 2. ve 3. basamakları altın, gümüş ve bronz kutucuklarla gösterilmektedir.';
    }
  }
}

/**
 * 6. Event Listeners Setup
 */
function setupEventListeners() {
  const gwSelect = document.getElementById('gameweek-select');
  if (gwSelect) {
    gwSelect.addEventListener('change', (e) => {
      selectedGameweek = parseInt(e.target.value, 10);
      renderAll();
    });
  }

  // Chart Tabs Switcher
  const chartTabButtons = document.querySelectorAll('.chart-tab-btn');
  chartTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      chartTabButtons.forEach(b => {
        b.classList.remove('bg-emerald-500', 'text-slate-950', 'font-bold');
        b.classList.add('text-slate-400', 'hover:text-white');
      });
      const target = e.currentTarget;
      target.classList.add('bg-emerald-500', 'text-slate-950', 'font-bold');
      target.classList.remove('text-slate-400', 'hover:text-white');

      currentActiveChartTab = target.getAttribute('data-tab');
      renderActiveChart();
    });
  });

  // Sortable Table Headers
  document.querySelectorAll('.sortable-th').forEach(th => {
    th.addEventListener('click', (e) => {
      const sortKey = e.currentTarget.getAttribute('data-sort');
      if (sortKey) handleTableSort(sortKey);
    });
  });

  // Modal Triggers
  document.getElementById('btn-add-gameweek')?.addEventListener('click', openAddGameweekModal);
  document.getElementById('btn-h2h')?.addEventListener('click', openHeadToHeadModal);
  document.getElementById('btn-data-management')?.addEventListener('click', openDataManagementModal);

  document.getElementById('logo-box')?.addEventListener('click', triggerCelebration);
}

/**
 * Confetti celebration effect
 */
export function triggerCelebration() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#00ff87', '#e90052', '#04f5ff', '#fbbf24']
    });
  }
}

/**
 * MODAL 1: Add / Edit Gameweek Data Modal
 */
function openAddGameweekModal() {
  const modal = document.getElementById('modal-add-gw');
  if (!modal) return;

  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  const nextGw = gws.length > 0 ? gws[gws.length - 1].gw + 1 : 1;

  const formContainer = document.getElementById('gw-form-inputs');
  const gwNumberInput = document.getElementById('input-gw-number');
  if (gwNumberInput) gwNumberInput.value = nextGw;

  if (formContainer) {
    formContainer.innerHTML = leagueData.teams.map(team => `
      <div class="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0 ring-1 ring-white/10" style="background: ${team.gradient}">
            ${team.avatar}
          </div>
          <div>
            <div class="font-black text-sm text-white font-display">${team.name}</div>
            <div class="text-xs text-slate-400 font-medium">${team.manager}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input 
            type="number" 
            id="score-input-${team.id}" 
            data-team-id="${team.id}" 
            placeholder="0" 
            min="0" 
            max="200"
            class="w-20 px-3 py-1.5 rounded-xl bg-slate-900 border-slate-700/80 text-white border text-center font-black font-display text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none"
          />
          <span class="text-xs text-emerald-400 font-bold font-display">P</span>
        </div>
      </div>
    `).join('');
  }

  gwNumberInput?.addEventListener('change', (e) => {
    const gwVal = parseInt(e.target.value, 10);
    const existingGw = leagueData.gameweeks.find(g => g.gw === gwVal);
    leagueData.teams.forEach(team => {
      const input = document.getElementById(`score-input-${team.id}`);
      if (input) {
        input.value = existingGw?.scores[team.id] ?? '';
      }
    });
  });

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// Save Add Gameweek Form
document.getElementById('form-add-gw')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const gwNumber = parseInt(document.getElementById('input-gw-number').value, 10);
  if (isNaN(gwNumber) || gwNumber < 1) {
    showToast('Lütfen geçerli bir hafta numarası girin.', 'error');
    return;
  }

  const scores = {};
  leagueData.teams.forEach(team => {
    const input = document.getElementById(`score-input-${team.id}`);
    scores[team.id] = input ? parseInt(input.value || 0, 10) : 0;
  });

  const existingIdx = leagueData.gameweeks.findIndex(g => g.gw === gwNumber);
  if (existingIdx >= 0) {
    leagueData.gameweeks[existingIdx] = { gw: gwNumber, scores };
  } else {
    leagueData.gameweeks.push({ gw: gwNumber, scores });
  }

  leagueData.gameweeks.sort((a, b) => a.gw - b.gw);
  saveLeagueData(leagueData);
  selectedGameweek = gwNumber;

  closeModal('modal-add-gw');
  renderAll();
  triggerCelebration();
  showToast(`Hafta ${gwNumber} puanları başarıyla kaydedildi!`, 'success');
});

/**
 * MODAL 2: 1v1 Head to Head Modal
 */
function openHeadToHeadModal() {
  const modal = document.getElementById('modal-h2h');
  if (!modal) return;

  const select1 = document.getElementById('h2h-select-team1');
  const select2 = document.getElementById('h2h-select-team2');

  if (select1 && select2) {
    const optionsHtml = leagueData.teams.map(t => `<option value="${t.id}">${t.name} (${t.manager})</option>`).join('');
    select1.innerHTML = optionsHtml;
    select2.innerHTML = optionsHtml;

    select1.value = leagueData.teams[0].id;
    select2.value = leagueData.teams[1].id;

    updateH2HView();

    select1.onchange = updateH2HView;
    select2.onchange = updateH2HView;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function updateH2HView() {
  const t1Id = document.getElementById('h2h-select-team1')?.value;
  const t2Id = document.getElementById('h2h-select-team2')?.value;
  const container = document.getElementById('h2h-results-container');
  if (!container) return;

  if (t1Id === t2Id) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 bg-white/[0.02] rounded-2xl border border-dashed border-white/10">
        <i class="fa-solid fa-people-arrows text-3xl mb-2 text-slate-500"></i>
        <p class="font-medium">Lütfen karşılaştırmak için 2 farklı menajer seçin.</p>
      </div>
    `;
    return;
  }

  const h2h = getHeadToHead(leagueData, t1Id, t2Id);
  if (!h2h) return;

  container.innerHTML = `
    <!-- Clear Explanation Note -->
    <div class="text-xs text-slate-400 mb-4 bg-white/[0.03] p-3 rounded-xl border border-white/5 flex items-center gap-2.5 font-medium">
      <i class="fa-solid fa-circle-info text-cyan-400 shrink-0 text-sm"></i>
      <span>İki menajerin haftalık skor karşılaştırması. O hafta kim daha yüksek puan aldıysa o haftayı kazanmış sayılır.</span>
    </div>

    <!-- Match Scoreboard (Esports HUD Style) -->
    <div class="p-5 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 relative overflow-hidden">
      <div class="absolute top-0 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none"></div>

      <div class="flex items-center justify-between gap-3">
        <!-- Team 1 -->
        <div class="flex items-center gap-3 w-5/12 min-w-0">
          <div class="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 ring-2 ring-white/10 transition-transform group-hover:scale-105" style="background: ${h2h.t1.gradient}">
            ${h2h.t1.avatar}
          </div>
          <div class="min-w-0">
            <div class="font-black text-white text-sm sm:text-base truncate font-display">${h2h.t1.name}</div>
            <div class="text-xs text-slate-400 truncate font-medium">${h2h.t1.manager}</div>
            <div class="text-[11px] text-cyan-300/90 mt-0.5 font-bold font-display tabular-nums">${h2h.t1Total} Toplam Puan</div>
          </div>
        </div>

        <!-- Center Score (Kazanılan Hafta) -->
        <div class="flex flex-col items-center justify-center px-2 shrink-0">
          <div class="flex items-baseline gap-2 font-display">
            <span class="text-3xl sm:text-4xl font-black ${h2h.t1Wins > h2h.t2Wins ? 'text-emerald-400' : (h2h.t1Wins === h2h.t2Wins ? 'text-white' : 'text-slate-500')} tabular-nums">${h2h.t1Wins}</span>
            <span class="text-slate-600 font-bold text-lg">-</span>
            <span class="text-3xl sm:text-4xl font-black ${h2h.t2Wins > h2h.t1Wins ? 'text-purple-400' : (h2h.t1Wins === h2h.t2Wins ? 'text-white' : 'text-slate-500')} tabular-nums">${h2h.t2Wins}</span>
          </div>
          <span class="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider font-display mt-0.5">Kazanılan Hafta</span>
          <span class="text-[10px] text-slate-500 font-bold mt-0.5">(${h2h.draws} Beraberlik)</span>
        </div>

        <!-- Team 2 -->
        <div class="flex items-center justify-end gap-3 w-5/12 min-w-0 text-right">
          <div class="min-w-0">
            <div class="font-black text-white text-sm sm:text-base truncate font-display">${h2h.t2.name}</div>
            <div class="text-xs text-slate-400 truncate font-medium">${h2h.t2.manager}</div>
            <div class="text-[11px] text-purple-300/90 mt-0.5 font-bold font-display tabular-nums">${h2h.t2Total} Toplam Puan</div>
          </div>
          <div class="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 ring-2 ring-white/10 transition-transform group-hover:scale-105" style="background: ${h2h.t2.gradient}">
            ${h2h.t2.avatar}
          </div>
        </div>
      </div>

      <!-- Verdict Banner -->
      <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-center text-center">
        ${h2h.t1Wins > h2h.t2Wins 
          ? `<span class="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-xs font-display">🏆 <b>${h2h.t1.name}</b>, rakibine karşı <b>${h2h.t1Wins - h2h.t2Wins} hafta</b> daha fazla kazandı!</span>`
          : (h2h.t2Wins > h2h.t1Wins
            ? `<span class="px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-black text-xs font-display">🏆 <b>${h2h.t2.name}</b>, rakibine karşı <b>${h2h.t2Wins - h2h.t1Wins} hafta</b> daha fazla kazandı!</span>`
            : `<span class="px-3.5 py-1 rounded-full bg-white/5 text-slate-300 font-bold text-xs font-display">⚖️ Her iki menajer de eşit sayıda (${h2h.t1Wins} hafta) üstünlük sağladı!</span>`
          )
        }
      </div>
    </div>

    <!-- Week by Week Matchups -->
    <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2 font-display">
      <i class="fa-solid fa-list-ol text-cyan-400"></i> Hafta Hafta Karşılaşma Skorları
    </h4>
    <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
      ${h2h.matchups.map(m => {
        const isT1 = m.winner === 't1';
        const isT2 = m.winner === 't2';

        return `
          <div class="flex items-center justify-between p-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs transition">
            <span class="font-black text-slate-400 w-14 font-display tabular-nums">GW ${m.gw}</span>
            <div class="flex items-center gap-3 font-display tabular-nums">
              <span class="font-black ${isT1 ? 'text-emerald-400 text-sm' : 'text-slate-400'}">${m.s1} P</span>
              <span class="text-slate-600 text-xs">-</span>
              <span class="font-black ${isT2 ? 'text-purple-400 text-sm' : 'text-slate-400'}">${m.s2} P</span>
            </div>
            <div class="w-36 text-right">
              ${isT1 ? `<span class="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 truncate inline-block max-w-full font-display">Kazandı: ${h2h.t1.name}</span>` :
                (isT2 ? `<span class="px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-400 text-[11px] font-bold border border-purple-500/20 truncate inline-block max-w-full font-display">Kazandı: ${h2h.t2.name}</span>` :
                `<span class="px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-400 text-[11px] font-medium font-display">Berabere</span>`
                )
              }
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * MODAL 3: Menajer Karnesi / Detay Kartı (RPG Level + 5 Badges Vitrini)
 */
window.openManagerModal = function(teamId) {
  const modal = document.getElementById('modal-manager');
  if (!modal) return;

  const team = leagueData.teams.find(t => t.id === teamId);
  if (!team) return;

  const progData = getProgressionData(leagueData);
  const teamProg = progData.teams.find(tp => tp.team.id === teamId);
  const standings = calculateStandings(leagueData, selectedGameweek);
  const currentStanding = standings.find(s => s.team.id === teamId);

  if (!teamProg || !currentStanding) return;

  const scores = teamProg.gwScores;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  const weeksAtFirst = teamProg.ranks.filter(r => r === 1).length;
  const podiumWeeks = teamProg.ranks.filter(r => r <= 3).length;

  const lvl = getManagerLevel(currentStanding.totalPoints);
  const badges = getTeamBadges(leagueData, teamId, selectedGameweek);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  const container = document.getElementById('manager-modal-content');
  if (container) {
    container.innerHTML = `
      <!-- Manager Hero Header -->
      <div class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-4 relative overflow-hidden">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0 text-white ring-2 ring-white/20" style="background: ${team.gradient}">
          ${team.avatar}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-lg sm:text-xl font-black text-white truncate font-display">${team.name}</h3>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-display">
              #${currentStanding.rank}. Sıra
            </span>
          </div>
          <p class="text-xs text-slate-400 truncate font-medium">${team.manager}</p>
          <div class="mt-2.5 flex flex-wrap gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/5 text-slate-300 font-medium">Toplam: <b class="text-white font-display tabular-nums font-black">${currentStanding.totalPoints} P</b></span>
            <span class="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/5 text-slate-300 font-medium">Ortalama: <b class="text-white font-display tabular-nums font-black">${avgScore} P</b></span>
            <span class="px-2.5 py-1 rounded-xl bg-white/[0.05] border border-white/5 text-slate-300 font-medium">Galibiyet: <b class="text-white font-display tabular-nums font-black">${currentStanding.winsCount}</b></span>
          </div>
        </div>
      </div>

      <!-- RPG Level & Title Banner -->
      <div class="p-4 rounded-2xl bg-white/[0.04] border border-white/5 mb-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10">${lvl.icon}</span>
            <div>
              <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-display">Menajer Rütbesi (Seviye ${lvl.level})</div>
              <div class="text-base font-black text-white font-display">${lvl.title}</div>
            </div>
          </div>
          <span class="px-3 py-1 rounded-xl text-xs font-black border font-display ${lvl.badgeColor}">
            Seviye ${lvl.level} / 5
          </span>
        </div>
        <!-- XP Progress Bar -->
        <div class="space-y-1.5">
          <div class="flex justify-between text-[11px] font-bold text-slate-400 font-display">
            <span>${currentStanding.totalPoints} Puan</span>
            <span>${lvl.level === 5 ? 'MAX RÜTBE' : `${lvl.max} Puan (Sonraki Seviye)`}</span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-slate-900/90 overflow-hidden border border-white/5">
            <div class="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 transition-all duration-500 shadow-[0_0_10px_#00ff87]" style="width: ${lvl.progressPct}%"></div>
          </div>
        </div>
      </div>

      <!-- Badges Showcase (5 Rozet Vitrini) -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-display">
            <i class="fa-solid fa-medal text-amber-400"></i> Kazanılan Başarımlar & Rozetler
          </h4>
          <span class="text-xs font-black text-amber-400 font-display">${unlockedCount} / ${badges.length} Açıldı</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${badges.map(b => `
            <div class="p-3 rounded-2xl border transition-all flex items-center gap-3 min-h-[72px] ${
              b.unlocked 
                ? `${b.badgeClass} shadow-md bg-white/[0.04]` 
                : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
            }">
              <div class="w-12 h-12 shrink-0 flex items-center justify-center ${b.unlocked ? 'filter drop-shadow-md' : 'opacity-30 grayscale'}">
                <img 
                  src="${b.image}" 
                  alt="${b.name}" 
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <div class="font-black text-xs ${b.unlocked ? 'text-white' : 'text-slate-400'} font-display">${b.name}</div>
                  ${b.unlocked 
                    ? `<span class="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-display border border-emerald-500/30">AÇILDI ✨</span>`
                    : `<span class="text-[9px] text-slate-500 font-bold font-display"><i class="fa-solid fa-lock text-[8px] mr-0.5"></i> Kilitli</span>`
                  }
                </div>
                <div class="text-[11px] ${b.unlocked ? 'text-slate-300' : 'text-slate-500'} mt-0.5 leading-snug font-medium">${b.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick 4-Grid Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <div class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-display">En Yüksek Skor</div>
          <div class="text-xl font-black mt-1 font-display tabular-nums">${maxScore} P</div>
        </div>
        <div class="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <div class="text-[10px] text-rose-400 font-bold uppercase tracking-wider font-display">En Düşük Skor</div>
          <div class="text-xl font-black mt-1 font-display tabular-nums">${minScore} P</div>
        </div>
        <div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
          <div class="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-display">1. Sıra Haftası</div>
          <div class="text-xl font-black mt-1 font-display tabular-nums">${weeksAtFirst} Hafta</div>
        </div>
        <div class="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
          <div class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-display">İlk 3 (Podyum)</div>
          <div class="text-xl font-black mt-1 font-display tabular-nums">${podiumWeeks} Hafta</div>
        </div>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

/**
 * MODAL 5: Data Management & FPL API & Yedekleme
 */
function openDataManagementModal() {
  const modal = document.getElementById('modal-data');
  if (!modal) return;

  const fplIdInput = document.getElementById('input-fpl-league-id');
  if (fplIdInput) fplIdInput.value = leagueData.leagueId || '';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// FPL API Fetch Button Action
document.getElementById('btn-fetch-fpl')?.addEventListener('click', async () => {
  const leagueId = document.getElementById('input-fpl-league-id')?.value;
  const statusEl = document.getElementById('fpl-fetch-status');
  if (!leagueId) {
    showToast("Lütfen bir Lig ID numarası girin.", "error");
    return;
  }

  if (statusEl) {
    statusEl.innerHTML = `<span class="text-cyan-400"><i class="fa-solid fa-spinner fa-spin mr-1"></i> FPL sunucularına bağlanılıyor...</span>`;
  }

  try {
    const fetched = await fetchFplLeagueStandings(leagueId);
    leagueData.leagueId = leagueId;
    saveLeagueData(leagueData);

    if (statusEl) {
      statusEl.innerHTML = `<span class="text-emerald-400"><i class="fa-solid fa-check mr-1"></i> Lig bağlandı: <b>${fetched.leagueName}</b>!</span>`;
    }
    showToast(`FPL Lig bilgileri başarıyla bağlandı!`, 'success');
  } catch (err) {
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-rose-400"><i class="fa-solid fa-triangle-exclamation mr-1"></i> ${err.message}</span>`;
    }
  }
});

// Export JSON Backup
document.getElementById('btn-export-json')?.addEventListener('click', () => {
  const jsonStr = JSON.stringify(leagueData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `merdivenim_geldi_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Yedek JSON dosyası indirildi!', 'success');
});

// Import JSON Backup
document.getElementById('input-import-json')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (imported.teams && imported.gameweeks) {
        leagueData = imported;
        saveLeagueData(leagueData);
        initApp();
        renderAll();
        closeModal('modal-data');
        showToast('Yedek veriler başarıyla geri yüklendi!', 'success');
      } else {
        throw new Error('Geçersiz dosya formatı.');
      }
    } catch (err) {
      showToast('Yedek dosyası okunamadı: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
});

// Reset to GW1 Initial Data
document.getElementById('btn-reset-data')?.addEventListener('click', () => {
  if (confirm("Tüm lig verilerini varsayılan 1. Hafta (GW1) durumuna sıfırlamak istediğinize emin misiniz?")) {
    leagueData = resetLeagueData();
    initApp();
    renderAll();
    closeModal('modal-data');
    showToast("Veriler 1. Hafta başlangıcına sıfırlandı.", "info");
  }
});

/**
 * Universal Modal Closer
 */
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  let bg = "bg-slate-900 text-white shadow-xl";
  if (type === 'success') bg = "bg-emerald-800 text-white";
  if (type === 'error') bg = "bg-rose-800 text-white";

  toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 flex items-center gap-3 ${bg}`;
  toast.innerHTML = `
    <span class="text-xs font-semibold">${message}</span>
    <button onclick="this.parentElement.classList.add('opacity-0', 'pointer-events-none')" class="text-xs opacity-60 hover:opacity-100">&times;</button>
  `;

  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 4000);
}
