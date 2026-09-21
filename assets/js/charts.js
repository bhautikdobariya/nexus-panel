/**
 * NexusPanel – Charts Helper (charts.js)
 * Standalone chart configuration & factory functions.
 * Import in main.js or use independently.
 */

'use strict';

const ChartDefaults = {
  fontFamily: 'Inter, sans-serif',
  tooltipBg:  '#1c1f2b',
  gridColor:  'rgba(255,255,255,0.04)',
  tickColor:  '#8b92a9',
};

/**
 * Create a simple bar chart
 * @param {string} canvasId
 * @param {string[]} labels
 * @param {number[]} data
 * @param {string} color
 */
function createBarChart(canvasId, labels, data, color = '#7c6ff7') {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: color + '99',
        borderColor: color,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: ChartDefaults.gridColor }, ticks: { color: ChartDefaults.tickColor } },
        y: { grid: { color: ChartDefaults.gridColor }, ticks: { color: ChartDefaults.tickColor } },
      }
    }
  });
}

/**
 * Create a mini sparkline chart
 * @param {string} canvasId
 * @param {number[]} data
 * @param {string} color
 */
function createSparkline(canvasId, data, color = '#34d399') {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i),
      datasets: [{
        data,
        borderColor: color,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}
