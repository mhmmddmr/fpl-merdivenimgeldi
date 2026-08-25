// Chart.js Visualizations & Ladder Matrix for "Merdivenim Geldi"

let rankChartInstance = null;
let pointsChartInstance = null;
let weeklyChartInstance = null;
let dominanceChartInstance = null;
let focusedTeamId = 'all'; // 'all' or specific teamId

export function setFocusedTeam(teamId) {
  focusedTeamId = teamId;
}

export function getFocusedTeam() {
  return focusedTeamId;
}

function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

// Clean theme defaults for Chart.js
function setChartDefaults() {
  if (typeof Chart === 'undefined') return;
  const dark = isDarkMode();

  Chart.defaults.color = dark ? '#94a3b8' : '#475569';
  Chart.defaults.font.family = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = dark ? 'rgba(18, 11, 36, 0.95)' : 'rgba(15, 23, 42, 0.95)';
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold', size: 13 };
  Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
  Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
  Chart.defaults.plugins.tooltip.borderColor = dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 10;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  Chart.defaults.plugins.legend.labels.boxWidth = 8;
  Chart.defaults.plugins.legend.labels.padding = 10;
  Chart.defaults.plugins.legend.labels.font = { size: 11, weight: '600' };
}

/**
 * 1. Sıralama Değişimi (Bump Chart / Rank Progression with Focus & Spotlight)
 */
export function renderRankChart(canvasId, progressionData) {
  setChartDefaults();
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (rankChartInstance) {
    rankChartInstance.destroy();
  }

  const dark = isDarkMode();
  const { gwList, teams } = progressionData;
  const labels = gwList.map(gw => `GW ${gw}`);

  const datasets = teams.map(item => {
    const isHighlightSingle = focusedTeamId !== 'all' && focusedTeamId === item.team.id;

    let borderColor = item.team.color;
    let backgroundColor = item.team.color;
    let borderWidth = 2;
    let pointRadius = 3.5;

    if (focusedTeamId !== 'all') {
      if (isHighlightSingle) {
        borderWidth = 4;
        pointRadius = 6;
      } else {
        borderColor = dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        backgroundColor = borderColor;
        borderWidth = 1;
        pointRadius = 0;
      }
    }

    return {
      label: `${item.team.name}`,
      data: item.ranks,
      borderColor,
      backgroundColor,
      borderWidth,
      pointRadius,
      pointHoverRadius: 8,
      pointBackgroundColor: borderColor,
      pointBorderColor: dark ? '#120b24' : '#ffffff',
      pointBorderWidth: 2,
      tension: 0.15,
      order: isHighlightSingle ? 0 : 1,
      fill: false
    };
  });

  rankChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: focusedTeamId === 'all' ? 'nearest' : 'index',
        intersect: false,
      },
      scales: {
        y: {
          reverse: true,
          min: 1,
          max: 9,
          ticks: {
            stepSize: 1,
            callback: (val) => `${val}. Sıra`
          },
          grid: {
            color: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
          }
        },
        x: {
          grid: {
            color: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
          }
        }
      },
      plugins: {
        legend: {
          display: focusedTeamId === 'all',
          position: 'bottom',
          labels: {
            boxWidth: 8,
            font: { size: 10 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw}. Sıra`;
            }
          }
        }
      }
    }
  });
}

/**
 * 2. Kümülatif Puan Yarışı (Cumulative Points Progression)
 */
export function renderPointsChart(canvasId, progressionData) {
  setChartDefaults();
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (pointsChartInstance) {
    pointsChartInstance.destroy();
  }

  const dark = isDarkMode();
  const { gwList, teams } = progressionData;
  const labels = gwList.map(gw => `GW ${gw}`);

  const datasets = teams.map(item => {
    const isHighlightSingle = focusedTeamId !== 'all' && focusedTeamId === item.team.id;
    let borderColor = item.team.color;
    let borderWidth = 2;
    let pointRadius = 3;

    if (focusedTeamId !== 'all') {
      if (isHighlightSingle) {
        borderWidth = 4;
        pointRadius = 6;
      } else {
        borderColor = dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        borderWidth = 1;
        pointRadius = 0;
      }
    }

    return {
      label: `${item.team.name}`,
      data: item.cumulativePoints,
      borderColor,
      backgroundColor: borderColor,
      borderWidth,
      pointRadius,
      pointHoverRadius: 7,
      tension: 0.15,
      fill: false
    };
  });

  pointsChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: focusedTeamId === 'all' ? 'nearest' : 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
          },
          ticks: {
            callback: (val) => `${val} P`
          }
        },
        x: {
          grid: {
            color: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
          }
        }
      },
      plugins: {
        legend: {
          display: focusedTeamId === 'all',
          position: 'bottom',
          labels: {
            boxWidth: 8,
            font: { size: 10 }
          }
        }
      }
    }
  });
}

/**
 * 3. Haftalık Puan Karşılaştırması (Gameweek Bar Chart vs Average)
 */
export function renderWeeklyScoreChart(canvasId, standings, leagueAvg) {
  setChartDefaults();
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (weeklyChartInstance) {
    weeklyChartInstance.destroy();
  }

  const dark = isDarkMode();
  const sorted = [...standings].sort((a, b) => b.gwPoints - a.gwPoints);
  const labels = sorted.map(s => s.team.name);
  const data = sorted.map(s => s.gwPoints);
  const bgColors = sorted.map(s => s.team.color);

  weeklyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Haftalık Puan',
          data: data,
          backgroundColor: bgColors,
          borderRadius: 6,
          borderWidth: 0,
          barThickness: 22
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            afterLabel: (ctx) => `Menajer: ${sorted[ctx.dataIndex].team.manager}\nLig Ortalaması: ${leagueAvg} Puan`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
          },
          ticks: {
            callback: (val) => `${val} P`
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 11 },
            maxRotation: 35,
            minRotation: 20
          }
        }
      }
    }
  });
}

/**
 * 4. Zirve Hakimiyeti (Weeks at #1 Donut Chart)
 */
export function renderDominanceChart(canvasId, dominanceData) {
  setChartDefaults();
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (dominanceChartInstance) {
    dominanceChartInstance.destroy();
  }

  const dark = isDarkMode();
  const activeTeams = dominanceData.filter(d => d.weeksAtNumberOne > 0);
  const displayTeams = activeTeams.length > 0 ? activeTeams : dominanceData.slice(0, 5);

  const labels = displayTeams.map(d => `${d.team.name} (${d.weeksAtNumberOne} Hafta Lider)`);
  const data = displayTeams.map(d => d.weeksAtNumberOne || 1);
  const bgColors = displayTeams.map(d => d.team.color);

  dominanceChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: data,
          backgroundColor: bgColors,
          borderColor: dark ? '#120b24' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10,
            font: { size: 11 }
          }
        }
      },
      cutout: '70%'
    }
  });
}

/**
 * 5. Merdiven Matrisi (Ultra-Clean Heatmap Table View)
 */
export function renderLadderMatrix(containerId, progressionData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const dark = isDarkMode();
  const { gwList, teams } = progressionData;

  let tableHtml = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5">
            <th class="py-2.5 px-3 sticky left-0 bg-white dark:bg-[#120b24] z-10 whitespace-nowrap shadow-sm dark:shadow-none">Takım</th>
            ${gwList.map(gw => `<th class="py-2.5 px-2 text-center whitespace-nowrap">GW ${gw}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-white/[0.04]">
  `;

  teams.forEach(item => {
    tableHtml += `
      <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition">
        <td class="py-2.5 px-3 sticky left-0 bg-white dark:bg-[#120b24] z-10 whitespace-nowrap font-bold text-slate-800 dark:text-white flex items-center gap-2 shadow-sm dark:shadow-none">
          <span class="text-sm">${item.team.avatar}</span>
          <span class="truncate max-w-[110px]">${item.team.name}</span>
        </td>
    `;

    item.ranks.forEach(rank => {
      let badgeStyle = dark 
        ? "bg-white/[0.05] text-slate-400 border-white/10" 
        : "bg-slate-100 text-slate-600 border-slate-200";

      if (rank === 1) {
        badgeStyle = dark 
          ? "bg-amber-400/25 text-amber-300 border-amber-400/40 font-black" 
          : "bg-amber-100 text-amber-900 border-amber-300 font-black";
      } else if (rank === 2) {
        badgeStyle = dark 
          ? "bg-slate-300/20 text-slate-200 border-slate-300/30 font-bold" 
          : "bg-slate-200 text-slate-800 border-slate-300 font-bold";
      } else if (rank === 3) {
        badgeStyle = dark 
          ? "bg-orange-500/20 text-orange-300 border-orange-500/30 font-bold" 
          : "bg-orange-100 text-orange-900 border-orange-300 font-bold";
      } else if (rank >= 7) {
        badgeStyle = dark 
          ? "bg-rose-500/15 text-rose-300 border-rose-500/20" 
          : "bg-rose-50 text-rose-700 border-rose-200";
      }

      tableHtml += `
        <td class="py-2 px-1.5 text-center whitespace-nowrap">
          <span class="inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] border ${badgeStyle}">
            ${rank}
          </span>
        </td>
      `;
    });

    tableHtml += `</tr>`;
  });

  tableHtml += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHtml;
}
