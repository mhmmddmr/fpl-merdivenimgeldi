// Main Application Logic for "Merdivenim Geldi"

import {
  loadLeagueData,
  saveLeagueData,
  resetLeagueData
} from './data.js';

import {
  calculateStandings,
  getStatHighlights,
  getProgressionData,
  getLeaderboardDominance,
  getLeagueRecords,
  getHeadToHead
} from './stats.js';

import {
  renderRankChart,
  renderPointsChart,
  renderLadderMatrix,
  setFocusedTeam,
  getFocusedTeam
} from './charts.js';

import { fetchFplLeagueStandings } from './fplApi.js';

// Application State
let leagueData = loadLeagueData();
let selectedGameweek = null;
let currentActiveChartTab = 'matrix'; // Default to Matrix View

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
 * 2. Render Team Filter Pills for Chart
 */
function renderTeamFilterPills() {
  const filterContainer = document.getElementById('team-filter-container');
  if (!filterContainer) return;

  const currentFocus = getFocusedTeam();

  let pillsHtml = `
    <button data-filter="all" class="team-filter-chip px-2.5 py-1 rounded-lg text-xs font-bold transition ${
      currentFocus === 'all' 
        ? 'bg-white/20 text-white border border-white/30' 
        : 'bg-white/[0.04] text-slate-400 hover:text-white'
    }">
      Tüm Takımlar
    </button>
  `;

  leagueData.teams.forEach(t => {
    const isSelected = currentFocus === t.id;
    pillsHtml += `
      <button data-filter="${t.id}" class="team-filter-chip px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
        isSelected 
          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
          : 'bg-white/[0.04] text-slate-400 hover:text-white'
      }">
        <span>${t.avatar}</span>
        <span class="truncate max-w-[85px]">${t.name}</span>
      </button>
    `;
  });

  filterContainer.innerHTML = pillsHtml;

  filterContainer.querySelectorAll('.team-filter-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const teamId = e.currentTarget.getAttribute('data-filter');
      setFocusedTeam(teamId);
      renderTeamFilterPills();
      renderActiveChart();
    });
  });
}

/**
 * 3. Render 4 Top Highlight Cards
 */
function renderHighlightCards() {
  const highlights = getStatHighlights(leagueData, selectedGameweek);
  if (!highlights) return;

  // 1. Current Leader(s)
  const leaderCard = document.getElementById('card-leader');
  if (leaderCard) {
    const isMultiple = highlights.leaders.length > 1;
    const topScore = highlights.leaders[0]?.totalPoints || 0;

    let bodyHtml = '';
    if (isMultiple) {
      bodyHtml = `
        <div class="space-y-1.5 my-2.5">
          ${highlights.leaders.map(l => `
            <div class="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/[0.04] text-xs">
              <span class="font-bold text-white">${l.team.name}</span>
              <span class="text-slate-400 text-[11px]">${l.team.manager}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      const leader = highlights.leaders[0];
      bodyHtml = `
        <div class="flex items-center gap-3 my-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md shrink-0" style="background: ${leader.team.gradient}">
            ${leader.team.avatar}
          </div>
          <div class="min-w-0">
            <div class="text-base font-extrabold text-white truncate">${leader.team.name}</div>
            <div class="text-xs text-slate-400 truncate">${leader.team.manager}</div>
          </div>
        </div>
      `;
    }

    leaderCard.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="fpl-tag text-amber-400 bg-amber-400/10 border border-amber-400/20">
          <i class="fa-solid fa-crown text-[10px]"></i> Güncel Lider${isMultiple ? 'ler' : ''}
        </span>
        <span class="text-xs font-semibold text-slate-400">${isMultiple ? `${highlights.leaders.length} Takım Zirvede` : '1. Basamak'}</span>
      </div>
      ${bodyHtml}
      <div class="pt-2.5 border-t border-white/5 flex items-baseline justify-between">
        <span class="text-xs text-slate-400">Toplam Puan</span>
        <span class="text-2xl font-extrabold text-emerald-400 font-display">${topScore} <span class="text-xs text-slate-400 font-normal">P</span></span>
      </div>
    `;
  }

  // 2. Gameweek Winner (Haftanın Fatihi)
  const gwWinnerCard = document.getElementById('card-gw-winner');
  if (gwWinnerCard) {
    const isMultiple = highlights.gwWinners.length > 1;
    let bodyHtml = '';

    if (isMultiple) {
      bodyHtml = `
        <div class="space-y-1.5 my-2.5">
          ${highlights.gwWinners.map(w => `
            <div class="flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/[0.04] text-xs">
              <span class="font-bold text-white">${w.team.name}</span>
              <span class="text-slate-400 text-[11px]">${w.team.manager}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      const winner = highlights.gwWinners[0];
      bodyHtml = `
        <div class="flex items-center gap-3 my-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md shrink-0" style="background: ${winner.team.gradient}">
            ${winner.team.avatar}
          </div>
          <div class="min-w-0">
            <div class="text-base font-extrabold text-white truncate">${winner.team.name}</div>
            <div class="text-xs text-slate-400 truncate">${winner.team.manager}</div>
          </div>
        </div>
      `;
    }

    gwWinnerCard.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="fpl-tag text-purple-400 bg-purple-400/10 border border-purple-400/20">
          <i class="fa-solid fa-bolt text-[10px]"></i> Haftanın Fatihi
        </span>
        <span class="text-xs font-semibold text-slate-400">GW ${selectedGameweek}</span>
      </div>
      ${bodyHtml}
      <div class="pt-2.5 border-t border-white/5 flex items-baseline justify-between">
        <span class="text-xs text-slate-400">Haftalık Skor</span>
        <span class="text-2xl font-extrabold text-purple-400 font-display">${highlights.maxGwScore} <span class="text-xs text-slate-400 font-normal">P</span></span>
      </div>
    `;
  }

  // 3. Ladder Climber (Merdiveni Tırmanan)
  const climberCard = document.getElementById('card-climber');
  if (climberCard) {
    if (highlights.topClimber) {
      climberCard.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="fpl-tag text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
            <i class="fa-solid fa-arrow-trend-up text-[10px]"></i> Haftanın Çıkışı
          </span>
          <span class="text-xs font-semibold text-cyan-400">+${highlights.topClimber.climb} Sıra</span>
        </div>
        <div class="my-3">
          <div class="text-base font-extrabold text-white truncate">${highlights.topClimber.team.name}</div>
          <div class="text-xs text-slate-400 truncate">${highlights.topClimber.team.manager}</div>
        </div>
        <div class="pt-2.5 border-t border-white/5 flex items-baseline justify-between">
          <span class="text-xs text-slate-400">Sıralama Değişimi</span>
          <span class="text-2xl font-extrabold text-cyan-400 font-display">▲ +${highlights.topClimber.climb}</span>
        </div>
      `;
    } else {
      climberCard.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="fpl-tag text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
            <i class="fa-solid fa-stairs text-[10px]"></i> Merdiven Durumu
          </span>
          <span class="text-xs font-semibold text-slate-400">1. Hafta</span>
        </div>
        <div class="my-3">
          <div class="text-sm font-bold text-white">İlk Hafta Başlangıcı</div>
          <div class="text-xs text-slate-400 mt-0.5">Sıralama hareketleri 2. haftadan itibaren grafiğe yansır.</div>
        </div>
        <div class="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Toplam Takım</span>
          <span class="font-bold text-white">9 Menajer</span>
        </div>
      `;
    }
  }

  // 4. Wooden Spoon / Average Card (Lig İstatistikleri)
  const averageCard = document.getElementById('card-average');
  if (averageCard) {
    averageCard.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="fpl-tag text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
          <i class="fa-solid fa-chart-simple text-[10px]"></i> Lig İstatistikleri
        </span>
        <span class="text-xs font-semibold text-slate-400">GW ${selectedGameweek}</span>
      </div>
      <div class="grid grid-cols-2 gap-2 my-3">
        <div class="p-2 rounded-xl bg-white/[0.04]">
          <div class="text-[11px] text-slate-400 font-medium">Hafta Ortalaması</div>
          <div class="text-lg font-black text-emerald-400 font-display">${highlights.gwAverage} P</div>
        </div>
        <div class="p-2 rounded-xl bg-white/[0.04]">
          <div class="text-[11px] text-slate-400 font-medium">En Düşük Skor</div>
          <div class="text-lg font-black text-rose-400 font-display">${highlights.minGwScore} P</div>
        </div>
      </div>
      <div class="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>Genel Lig Ortalaması</span>
        <span class="font-bold text-white">${highlights.overallAverage} P</span>
      </div>
    `;
  }
}

/**
 * 4. Render Standings Table
 */
function renderStandingsTable() {
  const tableBody = document.getElementById('standings-tbody');
  if (!tableBody) return;

  const standings = calculateStandings(leagueData, selectedGameweek);

  tableBody.innerHTML = standings.map((item) => {
    let rankBadgeClass = "rank-badge-default";
    if (item.rank === 1) {
      rankBadgeClass = "rank-badge-1";
    } else if (item.rank === 2) {
      rankBadgeClass = "rank-badge-2";
    } else if (item.rank === 3) {
      rankBadgeClass = "rank-badge-3";
    }

    let changeHtml = `<span class="text-slate-500 text-xs font-semibold">▬</span>`;
    if (item.rankChange > 0) {
      changeHtml = `<span class="text-emerald-400 text-xs font-bold flex items-center justify-center">▲ ${item.rankChange}</span>`;
    } else if (item.rankChange < 0) {
      changeHtml = `<span class="text-rose-400 text-xs font-bold flex items-center justify-center">▼ ${Math.abs(item.rankChange)}</span>`;
    }

    const formHtml = item.form.map(score => {
      let bg = "bg-white/[0.05] text-slate-300 border border-white/10";
      if (score >= 75) {
        bg = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      } else if (score < 55) {
        bg = "bg-rose-500/20 text-rose-300 border border-rose-500/30";
      }
      return `<span class="form-pill ${bg}">${score}</span>`;
    }).join(' ');

    const gapText = item.gapToLeader === 0 
      ? `<span class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold text-xs">Lider</span>` 
      : `<span class="text-slate-400 text-xs font-semibold">-${item.gapToLeader} P</span>`;

    return `
      <tr class="table-row-item border-b border-white/[0.04] cursor-pointer" onclick="window.openManagerModal('${item.team.id}')">
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
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm shrink-0 text-white" style="background: ${item.team.gradient}">
              ${item.team.avatar}
            </div>
            <div class="min-w-0">
              <div class="font-bold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors truncate">
                ${item.team.name}
              </div>
              <div class="text-xs text-slate-400 truncate">${item.team.manager}</div>
            </div>
          </div>
        </td>

        <!-- GW Score -->
        <td class="py-3.5 px-3 text-center whitespace-nowrap">
          <span class="inline-block px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-200 font-bold text-sm">
            ${item.gwPoints}
          </span>
        </td>

        <!-- Total Points -->
        <td class="py-3.5 px-3 text-center whitespace-nowrap">
          <span class="text-base font-extrabold text-emerald-400 font-display">
            ${item.totalPoints}
          </span>
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
          <button class="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-400 hover:text-white transition flex items-center justify-center ml-auto" title="Menajer Detayı">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
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

  if (currentActiveChartTab === 'matrix') {
    if (matrixContainer) {
      matrixContainer.classList.remove('hidden');
      renderLadderMatrix('chart-matrix-wrapper', progData, standings);
    }
  } else if (currentActiveChartTab === 'rank') {
    if (filterPillsContainer) filterPillsContainer.classList.remove('hidden');
    if (rankWrapper) {
      rankWrapper.classList.remove('hidden');
      renderRankChart('chart-canvas-rank', progData);
    }
  } else if (currentActiveChartTab === 'points') {
    if (filterPillsContainer) filterPillsContainer.classList.remove('hidden');
    if (pointsWrapper) {
      pointsWrapper.classList.remove('hidden');
      renderPointsChart('chart-canvas-points', progData);
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

  // Modal Triggers
  document.getElementById('btn-add-gameweek')?.addEventListener('click', openAddGameweekModal);
  document.getElementById('btn-h2h')?.addEventListener('click', openHeadToHeadModal);
  document.getElementById('btn-records')?.addEventListener('click', openRecordsModal);
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
      <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <div class="flex items-center gap-3">
          <span class="text-xl">${team.avatar}</span>
          <div>
            <div class="font-bold text-sm text-white">${team.name}</div>
            <div class="text-xs text-slate-400">${team.manager}</div>
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
            class="w-20 px-3 py-1.5 rounded-lg bg-slate-900 border-slate-700 text-white border text-center font-bold focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <span class="text-xs text-slate-500">Puan</span>
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
      <div class="p-8 text-center text-slate-400">
        <i class="fa-solid fa-people-arrows text-3xl mb-2 text-slate-500"></i>
        <p>Lütfen karşılaştırmak için 2 farklı menajer seçin.</p>
      </div>
    `;
    return;
  }

  const h2h = getHeadToHead(leagueData, t1Id, t2Id);
  if (!h2h) return;

  container.innerHTML = `
    <!-- Top H2H Scoreboard -->
    <div class="grid grid-cols-3 items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-center mb-6">
      <div>
        <div class="text-2xl">${h2h.t1.avatar}</div>
        <div class="font-bold text-white text-sm sm:text-base truncate">${h2h.t1.name}</div>
        <div class="text-xs text-slate-400 truncate">${h2h.t1.manager}</div>
        <div class="mt-2 text-2xl font-black text-emerald-400 font-display">${h2h.t1Wins} <span class="text-xs font-normal text-slate-400">Galibiyet</span></div>
        <div class="text-xs text-slate-400">${h2h.t1Total} Toplam Puan</div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">VS</span>
        <div class="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 mt-2 font-mono">
          ${h2h.draws} Beraberlik
        </div>
        <div class="text-xs font-bold ${h2h.diff >= 0 ? 'text-emerald-400' : 'text-rose-400'} mt-2">
          Fark: ${h2h.diff > 0 ? '+' : ''}${h2h.diff} P
        </div>
      </div>

      <div>
        <div class="text-2xl">${h2h.t2.avatar}</div>
        <div class="font-bold text-white text-sm sm:text-base truncate">${h2h.t2.name}</div>
        <div class="text-xs text-slate-400 truncate">${h2h.t2.manager}</div>
        <div class="mt-2 text-2xl font-black text-purple-400 font-display">${h2h.t2Wins} <span class="text-xs font-normal text-slate-400">Galibiyet</span></div>
        <div class="text-xs text-slate-400">${h2h.t2Total} Toplam Puan</div>
      </div>
    </div>

    <!-- Week by Week Matchups -->
    <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
      <i class="fa-solid fa-list-ol text-emerald-400"></i> Hafta Hafta Kapışma Karnesi
    </h4>
    <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
      ${h2h.matchups.map(m => {
        let t1Class = m.winner === 't1' ? 'text-emerald-400 font-bold' : (m.winner === 'draw' ? 'text-slate-300' : 'text-slate-500');
        let t2Class = m.winner === 't2' ? 'text-purple-400 font-bold' : (m.winner === 'draw' ? 'text-slate-300' : 'text-slate-500');
        let badge = m.winner === 't1' ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">${h2h.t1.name}</span>` :
                    (m.winner === 't2' ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">${h2h.t2.name}</span>` :
                    `<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Berabere</span>`);

        return `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs sm:text-sm">
            <span class="font-bold text-slate-400 w-16">GW ${m.gw}</span>
            <div class="flex items-center gap-4 font-display">
              <span class="${t1Class}">${m.s1} P</span>
              <span class="text-slate-400">-</span>
              <span class="${t2Class}">${m.s2} P</span>
            </div>
            <div>${badge}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * MODAL 3: Menajer Karnesi / Detay Kartı
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

  const container = document.getElementById('manager-modal-content');
  if (container) {
    container.innerHTML = `
      <!-- Manager Header -->
      <div class="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-6">
        <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md shrink-0 text-white" style="background: ${team.gradient}">
          ${team.avatar}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-black text-white truncate">${team.name}</h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              #${currentStanding.rank}. Sıra
            </span>
          </div>
          <p class="text-xs text-slate-400 truncate">${team.manager}</p>
          <div class="mt-2 flex flex-wrap gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-300">Toplam: <b class="text-white">${currentStanding.totalPoints} P</b></span>
            <span class="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-300">Ortalama: <b class="text-white">${avgScore} P</b></span>
            <span class="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-300">Galibiyet: <b class="text-white">${currentStanding.winsCount}</b></span>
          </div>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <div class="text-xs text-emerald-400 font-semibold">En İyi Hafta Skoru</div>
          <div class="text-2xl font-black mt-1 font-display">${maxScore} P</div>
        </div>
        <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <div class="text-xs text-rose-400 font-semibold">En Düşük Hafta Skoru</div>
          <div class="text-2xl font-black mt-1 font-display">${minScore} P</div>
        </div>
      </div>

      <!-- Week by Week History -->
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i class="fa-solid fa-chart-line text-emerald-400"></i> Haftalık Performans Geçmişi
      </h4>
      <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
        ${progData.gwList.map((gw, idx) => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs sm:text-sm">
            <span class="font-bold text-slate-400">Gameweek ${gw}</span>
            <span class="text-slate-300">${teamProg.ranks[idx]}. Sıra</span>
            <span class="font-extrabold text-emerald-400 font-display">${teamProg.gwScores[idx]} Puan</span>
            <span class="text-xs text-slate-400">Kümülatif: ${teamProg.cumulativePoints[idx]} P</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

/**
 * MODAL 4: Lig Rekorları & Hall of Fame Modal
 */
function openRecordsModal() {
  const modal = document.getElementById('modal-records');
  if (!modal) return;

  const records = getLeagueRecords(leagueData);
  const dominance = getLeaderboardDominance(leagueData);
  const container = document.getElementById('records-content');

  if (container && records) {
    const highTeams = records.highestScoreRecord.teams.map(t => t.name).join(', ');
    const lowTeams = records.lowestScoreRecord.teams.map(t => t.name).join(', ');

    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <!-- Merdiven Kralı -->
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div class="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-crown text-base"></i> Merdiven Kralı
          </div>
          <div class="text-base font-extrabold text-white mt-2">${records.merdivenKrali.team.name}</div>
          <div class="text-xs text-slate-400">${records.merdivenKrali.team.manager}</div>
          <div class="mt-2 text-xl font-black text-amber-400 font-display">
            ${records.merdivenKrali.weeksAtNumberOne} Hafta <span class="text-xs text-slate-400 font-normal">Zirvede Kaldı</span>
          </div>
        </div>

        <!-- En Yüksek Tek Hafta Skoru -->
        <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <div class="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-fire text-base"></i> Hafta Rekoru
          </div>
          <div class="text-base font-extrabold text-white mt-2 truncate" title="${highTeams}">${highTeams}</div>
          <div class="text-xs text-slate-400">Gameweek ${records.highestScoreRecord.gw}</div>
          <div class="mt-2 text-xl font-black text-emerald-400 font-display">
            ${records.highestScoreRecord.score} Puan <span class="text-xs text-slate-400 font-normal">Tek Haftada</span>
          </div>
        </div>

        <!-- En İstikrarlı Menajer -->
        <div class="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <div class="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-bullseye text-base"></i> İstikrar Abidesi
          </div>
          <div class="text-base font-extrabold text-white mt-2">${records.mostConsistent.team.name}</div>
          <div class="text-xs text-slate-400">${records.mostConsistent.team.manager}</div>
          <div class="mt-2 text-xl font-black text-cyan-400 font-display">
            ${records.mostConsistent.avg} P <span class="text-xs text-slate-400 font-normal">(Sapma: ±${records.mostConsistent.stdDev})</span>
          </div>
        </div>

        <!-- En Soğuk Duş -->
        <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <div class="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-snowflake text-base"></i> En Soğuk Duş
          </div>
          <div class="text-base font-extrabold text-white mt-2 truncate" title="${lowTeams}">${lowTeams}</div>
          <div class="text-xs text-slate-400">Gameweek ${records.lowestScoreRecord.gw}</div>
          <div class="mt-2 text-xl font-black text-rose-400 font-display">
            ${records.lowestScoreRecord.score} Puan <span class="text-xs text-slate-400 font-normal">En Düşük Skor</span>
          </div>
        </div>
      </div>

      <!-- Zirvede Kalma Tablosu -->
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i class="fa-solid fa-trophy text-amber-400"></i> Liderlik Koltuğu Süreleri
      </h4>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        ${dominance.map(d => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <span>${d.team.avatar}</span>
              <span class="font-bold text-white">${d.team.name}</span>
            </div>
            <div class="flex items-center gap-3 font-display">
              <span class="text-amber-400 font-bold">${d.weeksAtNumberOne} Hafta Lider</span>
              <span class="text-slate-400 text-xs">${d.weeksInTop3} Hafta İlk 3</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

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
