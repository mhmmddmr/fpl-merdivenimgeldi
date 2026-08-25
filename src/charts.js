// Chart.js Visualizations & Ladder Matrix for "Merdivenim Geldi"

let rankChartInstance = null;
let pointsChartInstance = null;
let focusedTeamId = 'all'; // 'all' or specific teamId

export function setFocusedTeam(teamId) {
  focusedTeamId = teamId;
}

export function getFocusedTeam() {
  return focusedTeamId;
}

// Premier League Dark Theme Defaults for Chart.js
function setChartDefaults() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(18, 11, 36, 0.95)';
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold', size: 13 };
  Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
  Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.12)';
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
  if (typeof Chart === 'undefined') return;
  setChartDefaults();
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (rankChartInstance) {
    rankChartInstance.destroy();
    rankChartInstance = null;
  }
  if (typeof Chart !== 'undefined') {
    const existing = Chart.getChart(ctx);
    if (existing) existing.destroy();
  }

  const { gwList, teams } = progressionData;
  const labels = gwList.map(gw => `GW ${gw}`);

  const datasets = teams.map(item => {
    const isHighlightSingle = focusedTeamId !== 'all' && focusedTeamId === item.team.id;

    let borderColor = item.team.color;
    let backgroundColor = item.team.color;
    let borderWidth = 3.2;
    let pointRadius = 4.5;

    if (focusedTeamId !== 'all') {
      if (isHighlightSingle) {
        borderWidth = 5.5;
        pointRadius = 7.5;
      } else {
        borderColor = 'rgba(255, 255, 255, 0.07)';
        backgroundColor = borderColor;
        borderWidth = 1.2;
        pointRadius = 0;
      }
    }

    return {
      teamId: item.team.id,
      label: `${item.team.name}`,
      data: item.ranks,
      borderColor,
      backgroundColor,
      borderWidth,
      pointRadius,
      pointHoverRadius: 9,
      pointBackgroundColor: borderColor,
      pointBorderColor: '#0a0618',
      pointBorderWidth: 2,
      tension: 0.25,
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
            color: 'rgba(255, 255, 255, 0.05)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)'
          }
        }
      },
      plugins: {
        legend: {
          display: focusedTeamId === 'all',
          position: 'bottom',
          labels: {
            boxWidth: 10,
            padding: 14,
            font: { size: 11, weight: '700' }
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
  if (typeof Chart === 'undefined') return;
  setChartDefaults();
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (pointsChartInstance) {
    pointsChartInstance.destroy();
    pointsChartInstance = null;
  }
  if (typeof Chart !== 'undefined') {
    const existing = Chart.getChart(ctx);
    if (existing) existing.destroy();
  }

  const { gwList, teams } = progressionData;
  const labels = gwList.map(gw => `GW ${gw}`);

  const datasets = teams.map(item => {
    const isHighlightSingle = focusedTeamId !== 'all' && focusedTeamId === item.team.id;
    let borderColor = item.team.color;
    let borderWidth = 3.2;
    let pointRadius = 3.5;

    if (focusedTeamId !== 'all') {
      if (isHighlightSingle) {
        borderWidth = 5.5;
        pointRadius = 7.5;
      } else {
        borderColor = 'rgba(255, 255, 255, 0.07)';
        borderWidth = 1.2;
        pointRadius = 0;
      }
    }

    return {
      teamId: item.team.id,
      label: `${item.team.name}`,
      data: item.cumulativePoints,
      borderColor,
      backgroundColor: borderColor,
      borderWidth,
      pointRadius,
      pointHoverRadius: 8,
      pointBackgroundColor: borderColor,
      pointBorderColor: '#0a0618',
      pointBorderWidth: 2,
      tension: 0.25,
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
            color: 'rgba(255, 255, 255, 0.06)'
          },
          ticks: {
            callback: (val) => `${val} P`
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          }
        }
      },
      plugins: {
        legend: {
          display: focusedTeamId === 'all',
          position: 'bottom',
          labels: {
            boxWidth: 8,
            font: { size: 11, weight: '600' }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw} Puan`;
            }
          }
        }
      }
    }
  });
}

/**
 * Instant Spotlight on Hover (60fps no-redraw fast update)
 */
export function updateChartFocus(teamId, progressionData) {
  setFocusedTeam(teamId);

  // 1. Update Rank Chart if active
  if (rankChartInstance && rankChartInstance.data && rankChartInstance.data.datasets) {
    const { teams } = progressionData;
    rankChartInstance.data.datasets.forEach(ds => {
      const teamItem = teams.find(t => t.team.id === ds.teamId || t.team.name === ds.label);
      const isTarget = teamId !== 'all' && (ds.teamId === teamId || (teamItem && teamItem.team.id === teamId));

      if (teamId === 'all') {
        ds.borderColor = teamItem ? teamItem.team.color : ds.borderColor;
        ds.backgroundColor = ds.borderColor;
        ds.borderWidth = 3.2;
        ds.pointRadius = 4.5;
        ds.order = 1;
      } else if (isTarget) {
        ds.borderColor = teamItem ? teamItem.team.color : ds.borderColor;
        ds.backgroundColor = ds.borderColor;
        ds.borderWidth = 5.5;
        ds.pointRadius = 7.5;
        ds.order = 0; // Bring to front
      } else {
        ds.borderColor = 'rgba(255, 255, 255, 0.07)';
        ds.backgroundColor = ds.borderColor;
        ds.borderWidth = 1.2;
        ds.pointRadius = 0;
        ds.order = 2; // Behind
      }
    });
    rankChartInstance.update('none');
  }

  // 2. Update Points Chart if active
  if (pointsChartInstance && pointsChartInstance.data && pointsChartInstance.data.datasets) {
    const { teams } = progressionData;
    pointsChartInstance.data.datasets.forEach(ds => {
      const teamItem = teams.find(t => t.team.id === ds.teamId || t.team.name === ds.label);
      const isTarget = teamId !== 'all' && (ds.teamId === teamId || (teamItem && teamItem.team.id === teamId));

      if (teamId === 'all') {
        ds.borderColor = teamItem ? teamItem.team.color : ds.borderColor;
        ds.backgroundColor = ds.borderColor;
        ds.borderWidth = 3.2;
        ds.pointRadius = 3.5;
        ds.order = 1;
      } else if (isTarget) {
        ds.borderColor = teamItem ? teamItem.team.color : ds.borderColor;
        ds.backgroundColor = ds.borderColor;
        ds.borderWidth = 5.5;
        ds.pointRadius = 7.5;
        ds.order = 0;
      } else {
        ds.borderColor = 'rgba(255, 255, 255, 0.07)';
        ds.backgroundColor = ds.borderColor;
        ds.borderWidth = 1.2;
        ds.pointRadius = 0;
        ds.order = 2;
      }
    });
    pointsChartInstance.update('none');
  }
}

/**
 * 3. Merdiven Matrisi (Ultra-Clean Heatmap Table View)
 */
export function renderLadderMatrix(containerId, progressionData, currentStandings = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { gwList, teams } = progressionData;

  // Sort teams according to current standings ranking (1st place at top)
  let sortedTeams = [...teams];
  if (currentStandings && currentStandings.length > 0) {
    const rankMap = new Map();
    currentStandings.forEach((s, idx) => rankMap.set(s.team.id, s.rank ?? idx + 1));
    sortedTeams.sort((a, b) => {
      const rA = rankMap.get(a.team.id) ?? 99;
      const rB = rankMap.get(b.team.id) ?? 99;
      return rA - rB;
    });
  } else {
    // Fallback: sort by last GW rank
    sortedTeams.sort((a, b) => {
      const rA = a.ranks[a.ranks.length - 1] ?? 99;
      const rB = b.ranks[b.ranks.length - 1] ?? 99;
      return rA - rB;
    });
  }

  let tableHtml = `
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="text-[10px] uppercase font-bold text-slate-400 border-b border-white/5">
            <th class="py-2.5 px-3 sticky left-0 bg-[#120b24] z-10 whitespace-nowrap"># Takım</th>
            ${gwList.map(gw => `<th class="py-2.5 px-2 text-center whitespace-nowrap">GW ${gw}</th>`).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/[0.04]">
  `;

  sortedTeams.forEach((item, index) => {
    const currentRank = (currentStandings?.find(s => s.team.id === item.team.id)?.rank) ?? (index + 1);

    tableHtml += `
      <tr class="hover:bg-white/[0.03] transition">
        <td class="py-2.5 px-3 sticky left-0 bg-[#120b24] z-10 whitespace-nowrap font-bold text-white flex items-center gap-2">
          <span class="text-[11px] font-extrabold w-4 text-slate-500">${currentRank}.</span>
          <span class="text-sm">${item.team.avatar}</span>
          <span class="truncate max-w-[110px]">${item.team.name}</span>
        </td>
    `;

    item.ranks.forEach(rank => {
      let badgeStyle = "bg-white/[0.05] text-slate-400 border-white/10";

      if (rank === 1) {
        badgeStyle = "bg-amber-400/25 text-amber-300 border-amber-400/40 font-black";
      } else if (rank === 2) {
        badgeStyle = "bg-slate-300/20 text-slate-200 border-slate-300/30 font-bold";
      } else if (rank === 3) {
        badgeStyle = "bg-orange-500/20 text-orange-300 border-orange-500/30 font-bold";
      } else if (rank >= 7) {
        badgeStyle = "bg-rose-500/15 text-rose-300 border-rose-500/20";
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
