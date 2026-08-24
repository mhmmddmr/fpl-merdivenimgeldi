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
  renderWeeklyScoreChart,
  renderDominanceChart
} from './charts.js';

import { fetchFplLeagueStandings } from './fplApi.js';

// Application State
let leagueData = loadLeagueData();
let selectedGameweek = null; // null means latest GW
let currentActiveChartTab = 'rank'; // 'rank' | 'points' | 'weekly' | 'dominance'

// DOM Elements Initialization
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
  renderAll();
});

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
  renderActiveChart();
}

/**
 * 1. Render Header GW Selector & Badges
 */
function renderHeaderControls() {
  const gws = [...leagueData.gameweeks].sort((a, b) => a.gw - b.gw);
  const latestGw = gws.length > 0 ? gws[gws.length - 1].gw : 1;
  if (!selectedGameweek) selectedGameweek = latestGw;

  // Render GW selector dropdown in table header
  const gwSelect = document.getElementById('gameweek-select');
  if (gwSelect) {
    gwSelect.innerHTML = gws.map(g => `
      <option value="${g.gw}" ${g.gw === selectedGameweek ? 'selected' : ''}>
        Hafta ${g.gw} (GW ${g.gw})
      </option>
    `).join('');
  }

  // Update hero badge
  const heroBadge = document.getElementById('current-gw-badge');
  if (heroBadge) {
    heroBadge.innerText = `Gameweek ${selectedGameweek} / Toplam ${latestGw} Hafta`;
  }
}

/**
 * 2. Render 4 Top Highlight Cards
 */
function renderHighlightCards() {
  const highlights = getStatHighlights(leagueData, selectedGameweek);
  if (!highlights) return;

  // 1. Current Leader(s)
  const leaderCard = document.getElementById('card-leader');
  if (leaderCard) {
    const leaderNames = highlights.leaders.map(l => l.team.name).join(', ');
    const leaderManagers = highlights.leaders.map(l => l.team.manager).join(', ');
    const topScore = highlights.leaders[0]?.totalPoints || 0;
    leaderCard.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
          <i class="fa-solid fa-crown text-yellow-400"></i> Güncel Lider${highlights.leaders.length > 1 ? 'ler' : ''}
        </span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">1. Basamak</span>
      </div>
      <div class="text-xl font-black text-white truncate" title="${leaderNames}">${leaderNames}</div>
      <div class="text-xs text-slate-400 truncate">${leaderManagers}</div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-2xl font-black text-emerald-400">${topScore}</span>
        <span class="text-xs text-slate-400">Toplam Puan</span>
      </div>
    `;
  }

  // 2. Gameweek Winner (Haftanın Fatihi)
  const gwWinnerCard = document.getElementById('card-gw-winner');
  if (gwWinnerCard) {
    const winnerNames = highlights.gwWinners.map(w => w.team.name).join(', ');
    const winnerManagers = highlights.gwWinners.map(w => w.team.manager).join(', ');
    gwWinnerCard.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase tracking-wider text-fuchsia-400 font-bold flex items-center gap-1.5">
          <i class="fa-solid fa-bolt text-yellow-400"></i> Haftanın Fatihi (GW ${selectedGameweek})
        </span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 font-mono">Hafta Rekoru</span>
      </div>
      <div class="text-xl font-black text-white truncate" title="${winnerNames}">${winnerNames}</div>
      <div class="text-xs text-slate-400 truncate">${winnerManagers}</div>
      <div class="mt-3 flex items-baseline gap-2">
        <span class="text-2xl font-black text-fuchsia-400">${highlights.maxGwScore}</span>
        <span class="text-xs text-slate-400">Haftalık Puan</span>
      </div>
    `;
  }

  // 3. Ladder Climber (Merdiveni Tırmanan)
  const climberCard = document.getElementById('card-climber');
  if (climberCard) {
    if (highlights.topClimber) {
      climberCard.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-stairs text-cyan-400"></i> Merdiveni Tırmanan
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">+${highlights.topClimber.climb} Sıra</span>
        </div>
        <div class="text-xl font-black text-white truncate">${highlights.topClimber.team.name}</div>
        <div class="text-xs text-slate-400 truncate">${highlights.topClimber.team.manager}</div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-black text-cyan-400">▲ +${highlights.topClimber.climb}</span>
          <span class="text-xs text-slate-400">Basamak Yükseldi</span>
        </div>
      `;
    } else {
      climberCard.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-stairs text-cyan-400"></i> Merdiven Durumu
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">1. Hafta</span>
        </div>
        <div class="text-lg font-bold text-slate-200">İlk Hafta Başlangıcı</div>
        <div class="text-xs text-slate-400 mt-1">Sıralama değişimleri 2. haftadan itibaren aktifleşir.</div>
        <div class="mt-3 text-xs text-cyan-400">9 Takım Kıyasıya Yarışta!</div>
      `;
    }
  }

  // 4. Wooden Spoon / Average Card (Merdivenden Düşen / Ortalama)
  const averageCard = document.getElementById('card-average');
  if (averageCard) {
    const lowestNames = highlights.gwLowest.map(l => l.team.name).join(', ');
    averageCard.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
          <i class="fa-solid fa-chart-simple text-amber-400"></i> Lig Ortalaması & Dip
        </span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">GW ${selectedGameweek}</span>
      </div>
      <div class="flex items-baseline justify-between">
        <div>
          <div class="text-2xl font-black text-amber-400">${highlights.gwAverage} <span class="text-xs font-normal text-slate-400">ort. puan</span></div>
          <div class="text-xs text-slate-400">Toplam Ort: ${highlights.overallAverage} P</div>
        </div>
        <div class="text-right">
          <div class="text-xs text-rose-400 font-bold flex items-center justify-end gap-1">
            <i class="fa-solid fa-spoon text-rose-400"></i> En Düşük: ${highlights.minGwScore} P
          </div>
          <div class="text-[11px] text-slate-400 max-w-[120px] truncate" title="${lowestNames}">${lowestNames}</div>
        </div>
      </div>
    `;
  }
}

/**
 * 3. Render Standings Table
 */
function renderStandingsTable() {
  const tableBody = document.getElementById('standings-tbody');
  if (!tableBody) return;

  const standings = calculateStandings(leagueData, selectedGameweek);

  tableBody.innerHTML = standings.map((item, index) => {
    // Rank styling
    let rankBadgeClass = "rank-badge-default";
    let rankIcon = `#${item.rank}`;
    if (item.rank === 1) {
      rankBadgeClass = "rank-badge-1";
      rankIcon = "🥇 1";
    } else if (item.rank === 2) {
      rankBadgeClass = "rank-badge-2";
      rankIcon = "🥈 2";
    } else if (item.rank === 3) {
      rankBadgeClass = "rank-badge-3";
      rankIcon = "🥉 3";
    }

    // Rank Change
    let changeHtml = `<span class="text-slate-500 text-xs font-semibold">▬</span>`;
    if (item.rankChange > 0) {
      changeHtml = `<span class="text-emerald-400 text-xs font-bold flex items-center">▲ ${item.rankChange}</span>`;
    } else if (item.rankChange < 0) {
      changeHtml = `<span class="text-rose-400 text-xs font-bold flex items-center">▼ ${Math.abs(item.rankChange)}</span>`;
    }

    // Form Sparkline Pills (Last 5 gameweek scores)
    const formHtml = item.form.map(score => {
      let bg = "bg-slate-800 text-slate-300 border border-slate-700";
      if (score >= 35) bg = "bg-emerald-950 text-emerald-300 border border-emerald-700/50";
      else if (score < 28) bg = "bg-rose-950 text-rose-300 border border-rose-700/50";
      return `<span class="form-pill ${bg}">${score}</span>`;
    }).join(' ');

    const gapText = item.gapToLeader === 0 ? `<span class="text-emerald-400 font-bold">LİDER</span>` : `<span class="text-slate-400">-${item.gapToLeader}</span>`;

    return `
      <tr class="table-row-hover border-b border-white/5 cursor-pointer" onclick="window.openManagerModal('${item.team.id}')">
        <!-- Rank -->
        <td class="py-4 px-3 sm:px-4 text-center">
          <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs ${rankBadgeClass}">
            ${rankIcon}
          </span>
        </td>

        <!-- Rank Change -->
        <td class="py-4 px-2 text-center hidden sm:table-cell">
          ${changeHtml}
        </td>

        <!-- Team & Manager -->
        <td class="py-4 px-3 sm:px-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold shadow-md shrink-0" style="background: ${item.team.gradient}">
              ${item.team.avatar}
            </div>
            <div>
              <div class="font-bold text-white text-sm sm:text-base group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                ${item.team.name}
              </div>
              <div class="text-xs text-slate-400">${item.team.manager}</div>
            </div>
          </div>
        </td>

        <!-- GW Score -->
        <td class="py-4 px-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-md bg-white/5 font-mono font-bold text-sm sm:text-base text-slate-100">
            ${item.gwPoints}
          </span>
        </td>

        <!-- Total Points -->
        <td class="py-4 px-3 text-center">
          <span class="text-base sm:text-lg font-black text-emerald-400 font-mono">
            ${item.totalPoints}
          </span>
        </td>

        <!-- Gap to Leader -->
        <td class="py-4 px-3 text-center font-mono text-xs hidden md:table-cell">
          ${gapText}
        </td>

        <!-- Form Trend -->
        <td class="py-4 px-3 text-center hidden lg:table-cell">
          <div class="flex items-center justify-center gap-1">
            ${formHtml}
          </div>
        </td>

        <!-- Action -->
        <td class="py-4 px-3 text-right">
          <button class="p-1.5 px-3 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-xs font-semibold border border-purple-700/50 transition">
            İncele <i class="fa-solid fa-chevron-right ml-1 text-[10px]"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * 4. Render Selected Chart
 */
function renderActiveChart() {
  const progData = getProgressionData(leagueData);
  const standings = calculateStandings(leagueData, selectedGameweek);
  const dominanceData = getLeaderboardDominance(leagueData);
  const highlights = getStatHighlights(leagueData, selectedGameweek);

  if (currentActiveChartTab === 'rank') {
    renderRankChart('chart-canvas', progData);
  } else if (currentActiveChartTab === 'points') {
    renderPointsChart('chart-canvas', progData);
  } else if (currentActiveChartTab === 'weekly') {
    renderWeeklyScoreChart('chart-canvas', standings, highlights?.gwAverage || 0);
  } else if (currentActiveChartTab === 'dominance') {
    renderDominanceChart('chart-canvas', dominanceData);
  }
}

/**
 * 5. Event Listeners Setup
 */
function setupEventListeners() {
  // Gameweek dropdown change
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
        b.classList.remove('bg-emerald-500', 'text-slate-900', 'font-bold');
        b.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-white/5');
      });
      const target = e.currentTarget;
      target.classList.add('bg-emerald-500', 'text-slate-900', 'font-bold');
      target.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-white/5');

      currentActiveChartTab = target.getAttribute('data-tab');
      renderActiveChart();
    });
  });

  // Modal Triggers
  document.getElementById('btn-add-gameweek')?.addEventListener('click', openAddGameweekModal);
  document.getElementById('btn-h2h')?.addEventListener('click', openHeadToHeadModal);
  document.getElementById('btn-records')?.addEventListener('click', openRecordsModal);
  document.getElementById('btn-data-management')?.addEventListener('click', openDataManagementModal);

  // Trigger confetti on header logo click
  document.getElementById('logo-box')?.addEventListener('click', triggerCelebration);
}

/**
 * Confetti celebration effect
 */
export function triggerCelebration() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ff85', '#e90052', '#04f5ff', '#ffd700']
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

  // Generate 9 inputs for teams
  if (formContainer) {
    formContainer.innerHTML = leagueData.teams.map(team => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
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
            class="w-20 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-center font-bold focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <span class="text-xs text-slate-500">Puan</span>
        </div>
      </div>
    `).join('');
  }

  // Prepopulate if editing existing GW
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

  // Modal open
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

  // Check if GW already exists -> update, else add
  const existingIdx = leagueData.gameweeks.findIndex(g => g.gw === gwNumber);
  if (existingIdx >= 0) {
    leagueData.gameweeks[existingIdx] = { gw: gwNumber, scores };
  } else {
    leagueData.gameweeks.push({ gw: gwNumber, scores });
  }

  // Sort gameweeks
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
        <i class="fa-solid fa-people-arrows text-3xl mb-2 text-slate-600"></i>
        <p>Lütfen karşılaştırmak için 2 farklı menajer seçin.</p>
      </div>
    `;
    return;
  }

  const h2h = getHeadToHead(leagueData, t1Id, t2Id);
  if (!h2h) return;

  container.innerHTML = `
    <!-- Top H2H Scoreboard -->
    <div class="grid grid-cols-3 items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-center mb-6">
      <div>
        <div class="text-2xl">${h2h.t1.avatar}</div>
        <div class="font-bold text-white text-sm sm:text-base truncate">${h2h.t1.name}</div>
        <div class="text-xs text-slate-400">${h2h.t1.manager}</div>
        <div class="mt-2 text-2xl font-black text-emerald-400">${h2h.t1Wins} <span class="text-xs font-normal text-slate-400">Galibiyet</span></div>
        <div class="text-xs text-slate-400">${h2h.t1Total} Toplam Puan</div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-500">VS</span>
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
        <div class="text-xs text-slate-400">${h2h.t2.manager}</div>
        <div class="mt-2 text-2xl font-black text-purple-400">${h2h.t2Wins} <span class="text-xs font-normal text-slate-400">Galibiyet</span></div>
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
        let badge = m.winner === 't1' ? `<span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">${h2h.t1.name} Aldı</span>` :
                    (m.winner === 't2' ? `<span class="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">${h2h.t2.name} Aldı</span>` :
                    `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Berabere</span>`);

        return `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-white/5 text-xs sm:text-sm">
            <span class="font-mono font-bold text-slate-400 w-16">GW ${m.gw}</span>
            <div class="flex items-center gap-4">
              <span class="${t1Class}">${m.s1} P</span>
              <span class="text-slate-600">-</span>
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
 * MODAL 3: Manager Profile Deep Dive Modal
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
      <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/5 mb-6">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0" style="background: ${team.gradient}">
          ${team.avatar}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="text-xl font-black text-white">${team.name}</h3>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-white/10 text-emerald-400 font-mono">
              #${currentStanding.rank}. Sıra
            </span>
          </div>
          <p class="text-sm text-slate-400">${team.manager}</p>
          <div class="mt-2 flex flex-wrap gap-2 text-xs">
            <span class="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">Toplam: <b>${currentStanding.totalPoints} P</b></span>
            <span class="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">Ort: <b>${avgScore} P/Hafta</b></span>
            <span class="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">Hafta Galibiyeti: <b>${currentStanding.winsCount}</b></span>
          </div>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/30">
          <div class="text-xs text-emerald-400 font-bold">En İyi Hafta Skoru</div>
          <div class="text-2xl font-black text-emerald-300 mt-1">${maxScore} P</div>
        </div>
        <div class="p-3 rounded-xl bg-rose-950/40 border border-rose-800/30">
          <div class="text-xs text-rose-400 font-bold">En Düşük Hafta Skoru</div>
          <div class="text-2xl font-black text-rose-300 mt-1">${minScore} P</div>
        </div>
      </div>

      <!-- Week by Week History -->
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i class="fa-solid fa-chart-line text-emerald-400"></i> Haftalık Performans Geçmişi
      </h4>
      <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
        ${progData.gwList.map((gw, idx) => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-xs sm:text-sm">
            <span class="font-mono font-bold text-slate-400">Gameweek ${gw}</span>
            <span class="font-mono text-slate-300">${teamProg.ranks[idx]}. Sıra</span>
            <span class="font-mono font-bold text-emerald-400">${teamProg.gwScores[idx]} Puan</span>
            <span class="font-mono text-xs text-slate-500">Kümülatif: ${teamProg.cumulativePoints[idx]} P</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

/**
 * MODAL 4: League Records & Hall of Fame Modal
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
        <div class="p-4 rounded-2xl bg-gradient-to-br from-yellow-950/40 to-slate-900 border border-yellow-700/40">
          <div class="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-crown text-base"></i> Merdiven Kralı
          </div>
          <div class="text-lg font-black text-white mt-2">${records.merdivenKrali.team.name}</div>
          <div class="text-xs text-slate-400">${records.merdivenKrali.team.manager}</div>
          <div class="mt-2 text-xl font-bold text-yellow-400">
            ${records.merdivenKrali.weeksAtNumberOne} Hafta <span class="text-xs text-slate-400 font-normal">Zirvede Kaldı</span>
          </div>
        </div>

        <!-- En Yüksek Tek Hafta Skoru -->
        <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-700/40">
          <div class="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-fire text-base"></i> Hafta Rekoru
          </div>
          <div class="text-lg font-black text-white mt-2 truncate" title="${highTeams}">${highTeams}</div>
          <div class="text-xs text-slate-400">Gameweek ${records.highestScoreRecord.gw}</div>
          <div class="mt-2 text-xl font-bold text-emerald-400">
            ${records.highestScoreRecord.score} Puan <span class="text-xs text-slate-400 font-normal">Tek Haftada</span>
          </div>
        </div>

        <!-- En İstikrarlı Menajer -->
        <div class="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-700/40">
          <div class="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-bullseye text-base"></i> İstikrar Abidesi
          </div>
          <div class="text-lg font-black text-white mt-2">${records.mostConsistent.team.name}</div>
          <div class="text-xs text-slate-400">${records.mostConsistent.team.manager}</div>
          <div class="mt-2 text-xl font-bold text-cyan-400">
            ${records.mostConsistent.avg} P <span class="text-xs text-slate-400 font-normal">(Sapma: ±${records.mostConsistent.stdDev})</span>
          </div>
        </div>

        <!-- Tahta Kaşık (En Düşük Hafta Skoru) -->
        <div class="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-700/40">
          <div class="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <i class="fa-solid fa-snowflake text-base"></i> En Soğuk Duş
          </div>
          <div class="text-lg font-black text-white mt-2 truncate" title="${lowTeams}">${lowTeams}</div>
          <div class="text-xs text-slate-400">Gameweek ${records.lowestScoreRecord.gw}</div>
          <div class="mt-2 text-xl font-bold text-rose-400">
            ${records.lowestScoreRecord.score} Puan <span class="text-xs text-slate-400 font-normal">En Düşük Skor</span>
          </div>
        </div>
      </div>

      <!-- Zirvede Kalma Tablosu -->
      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
        <i class="fa-solid fa-trophy text-yellow-400"></i> Liderlik Koltuğu Süreleri
      </h4>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        ${dominance.map(d => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <span>${d.team.avatar}</span>
              <span class="font-bold text-white">${d.team.name}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-yellow-400 font-bold">${d.weeksAtNumberOne} Hafta #1</span>
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
 * MODAL 5: Data Management & FPL Fetch Modal
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
      statusEl.innerHTML = `<span class="text-emerald-400"><i class="fa-solid fa-check mr-1"></i> Lig bulundu: <b>${fetched.leagueName}</b>!</span>`;
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

  let bg = "bg-slate-900 border-slate-700 text-white";
  if (type === 'success') bg = "bg-emerald-950 border-emerald-500 text-emerald-200";
  if (type === 'error') bg = "bg-rose-950 border-rose-500 text-rose-200";

  toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 flex items-center gap-3 ${bg}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.classList.add('opacity-0', 'pointer-events-none')" class="text-xs opacity-60 hover:opacity-100">&times;</button>
  `;

  toast.classList.remove('opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 4000);
}
