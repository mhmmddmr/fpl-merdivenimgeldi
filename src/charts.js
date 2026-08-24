// Chart.js Visualizations for "Merdivenim Geldi"

let rankChartInstance = null;
let pointsChartInstance = null;
let weeklyChartInstance = null;
let dominanceChartInstance = null;

// Clean dark theme defaults for Chart.js
function setChartDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.95)';
  Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
  Chart.defaults.plugins.tooltip.bodyColor = '#cbd5e1';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  Chart.defaults.plugins.legend.labels.padding = 16;
}

/**
 * 1. Sıralama Değişimi (Bump Chart / Rank Progression)
 */
export function renderRankChart(canvasId, progressionData) {
  setChartDefaults();
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  if (rankChartInstance) {
    rankChartInstance.destroy();
  }

  const { gwList, teams } = progressionData;
  const labels = gwList.map(gw => `GW ${gw}`);

  const datasets = teams.map(item => ({
    label: `${item.team.name} (${item.team.manager})`,
    data: item.ranks,
    borderColor: item.team.color,
    backgroundColor: item.team.color,
    borderWidth: 3,
    pointRadius: 6,
    pointHoverRadius: 9,
    pointBackgroundColor: item.team.color,
    pointBorderColor: '#0f172a',
    pointBorderWidth: 2,
    tension: 0.25,
    fill: false
  }));

  rankChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          reverse: true, // Rank 1 is at top
          min: 1,
          max: 9,
          ticks: {
            stepSize: 1,
            callback: (val) => `${val}. Sıra`
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.06)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.06)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            font: { size: 12 }
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

  const { gwList, teams } = progressionData;
  const labels = gwList.map(gw => `GW ${gw}`);

  const datasets = teams.map(item => ({
    label: `${item.team.name}`,
    data: item.cumulativePoints,
    borderColor: item.team.color,
    backgroundColor: item.team.color,
    borderWidth: 2.5,
    pointRadius: 5,
    pointHoverRadius: 8,
    tension: 0.2,
    fill: false
  }));

  pointsChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.06)'
          },
          ticks: {
            callback: (val) => `${val} Puan`
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.06)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            font: { size: 12 }
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

  // Sort by GW score descending
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
          borderRadius: 8,
          borderWidth: 0,
          barThickness: 28
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
            afterLabel: (ctx) => `Menajer: ${sorted[ctx.dataIndex].team.manager}\nLig Ort: ${leagueAvg} Puan`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.06)'
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
            maxRotation: 45,
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

  // Filter teams who spent at least 1 week in top 3 or #1
  const activeTeams = dominanceData.filter(d => d.weeksAtNumberOne > 0 || d.weeksInTop3 > 0);
  const displayTeams = activeTeams.length > 0 ? activeTeams : dominanceData.slice(0, 5);

  const labels = displayTeams.map(d => `${d.team.name} (${d.weeksAtNumberOne} Hafta Lider)`);
  const data = displayTeams.map(d => d.weeksAtNumberOne || 0.1); // slight for visibility
  const bgColors = displayTeams.map(d => d.team.color);

  dominanceChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: data,
          backgroundColor: bgColors,
          borderColor: '#0f172a',
          borderWidth: 3,
          hoverOffset: 8
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
            boxWidth: 12,
            font: { size: 12 }
          }
        }
      },
      cutout: '65%'
    }
  });
}
