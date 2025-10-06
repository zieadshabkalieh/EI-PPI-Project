import { translate } from '../utils/i18n.js';
import { SCORE_COLORS } from '../data/constants.js';

export function Visualization(scores) {
  const visualizationContainer = document.createElement('div');
  visualizationContainer.className = 'form-section card';
  
  const title = document.createElement('h3');
  title.textContent = translate('Visualization');
  visualizationContainer.appendChild(title);
  
  // Create tab navigation for different chart types
  const chartTabs = document.createElement('div');
  chartTabs.className = 'tabs';
  
  // Add tab buttons
  const barChartTab = document.createElement('div');
  barChartTab.className = 'tab active';
  barChartTab.textContent = translate('Bar Chart');
  barChartTab.dataset.chartType = 'bar';
  chartTabs.appendChild(barChartTab);
  
  const radarChartTab = document.createElement('div');
  radarChartTab.className = 'tab';
  radarChartTab.textContent = translate('Radar Chart');
  radarChartTab.dataset.chartType = 'radar';
  chartTabs.appendChild(radarChartTab);
  
  const polarChartTab = document.createElement('div');
  polarChartTab.className = 'tab';
  polarChartTab.textContent = translate('Polar Area Chart');
  polarChartTab.dataset.chartType = 'polarArea';
  chartTabs.appendChild(polarChartTab);
  
  visualizationContainer.appendChild(chartTabs);
  
  // Create a container for each chart type
  const barChartContainer = document.createElement('div');
  barChartContainer.className = 'chart-container active';
  barChartContainer.dataset.chartType = 'bar';
  
  const radarChartContainer = document.createElement('div');
  radarChartContainer.className = 'chart-container';
  radarChartContainer.dataset.chartType = 'radar';
  radarChartContainer.style.display = 'none';
  
  const polarChartContainer = document.createElement('div');
  polarChartContainer.className = 'chart-container';
  polarChartContainer.dataset.chartType = 'polarArea';
  polarChartContainer.style.display = 'none';
  
  // Create canvases for each chart
  const barCanvas = document.createElement('canvas');
  barCanvas.id = 'barChart';
  barChartContainer.appendChild(barCanvas);
  
  const radarCanvas = document.createElement('canvas');
  radarCanvas.id = 'radarChart';
  radarChartContainer.appendChild(radarCanvas);
  
  const polarCanvas = document.createElement('canvas');
  polarCanvas.id = 'polarChart';
  polarChartContainer.appendChild(polarCanvas);
  
  visualizationContainer.appendChild(barChartContainer);
  visualizationContainer.appendChild(radarChartContainer);
  visualizationContainer.appendChild(polarChartContainer);
  
  // Create the score interpretation legend
  const legendContainer = document.createElement('div');
  legendContainer.className = 'legend-container';
  legendContainer.style.marginTop = '20px';
  legendContainer.style.display = 'flex';
  legendContainer.style.justifyContent = 'center';
  legendContainer.style.gap = '10px';
  legendContainer.style.flexWrap = 'wrap';
  
  // Create legend items for each score range
  Object.values(SCORE_COLORS).forEach(colorInfo => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.style.display = 'flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.marginRight = '10px';
    
    const colorBox = document.createElement('div');
    colorBox.style.width = '15px';
    colorBox.style.height = '15px';
    colorBox.style.backgroundColor = colorInfo.color;
    colorBox.style.marginRight = '5px';
    
    const label = document.createElement('span');
    label.textContent = `${colorInfo.range[0]}-${colorInfo.range[1]}: ${translate(colorInfo.label)}`;
    
    legendItem.appendChild(colorBox);
    legendItem.appendChild(label);
    legendContainer.appendChild(legendItem);
  });
  
  visualizationContainer.appendChild(legendContainer);
  
  // Total EI score container with visual indicator
  const totalScoreContainer = document.createElement('div');
  totalScoreContainer.className = 'total-score-container';
  totalScoreContainer.style.marginTop = '20px';
  totalScoreContainer.style.textAlign = 'center';
  
  // Get color based on total score
  let totalScoreColor;
  let colorClass;
  
  if (scores.total >= 75) {
    totalScoreColor = SCORE_COLORS.IDEAL.color;
    colorClass = SCORE_COLORS.IDEAL.className;
  } else if (scores.total >= 50) {
    totalScoreColor = SCORE_COLORS.GOOD.color;
    colorClass = SCORE_COLORS.GOOD.className;
  } else {
    totalScoreColor = SCORE_COLORS.BAD.color;
    colorClass = SCORE_COLORS.BAD.className;
  }
  
  // Create modern circular gauge
  const gaugeContainer = document.createElement('div');
  gaugeContainer.style.position = 'relative';
  gaugeContainer.style.width = '200px';
  gaugeContainer.style.height = '200px';
  gaugeContainer.style.margin = '0 auto';
  
  // Create SVG element for the gauge
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 120 120');
  
  // Background circle
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', '60');
  bgCircle.setAttribute('cy', '60');
  bgCircle.setAttribute('r', '54');
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', '#e6e6e6');
  bgCircle.setAttribute('stroke-width', '12');
  svg.appendChild(bgCircle);
  
  // Create gradient definition for the progress circle
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'scoreGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '0%');
  
  // Create gradient stops based on score ranges
  const gradientStops = [
    { offset: '0%', color: '#ff5252' },    // Red
    { offset: '25%', color: '#ff9800' },   // Orange (25)
    { offset: '50%', color: '#ffeb3b' },   // Yellow (50)
    { offset: '75%', color: '#8bc34a' },   // Light Green
    { offset: '100%', color: '#4caf50' }   // Green
  ];
  
  gradientStops.forEach(stop => {
    const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stopElement.setAttribute('offset', stop.offset);
    stopElement.setAttribute('stop-color', stop.color);
    gradient.appendChild(stopElement);
  });
  
  defs.appendChild(gradient);
  svg.appendChild(defs);
  
  // Progress circle (static, no animation)
  const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  progressCircle.setAttribute('cx', '60');
  progressCircle.setAttribute('cy', '60');
  progressCircle.setAttribute('r', '54');
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', totalScoreColor);
  progressCircle.setAttribute('stroke-width', '12');
  progressCircle.setAttribute('stroke-linecap', 'round');
  
  // Calculate the circumference and offset for the progress
  const circumference = 2 * Math.PI * 54;
  const progressValue = scores.total / 100;
  const offset = circumference * (1 - progressValue);
  
  progressCircle.setAttribute('stroke-dasharray', circumference);
  progressCircle.setAttribute('stroke-dashoffset', offset); // Set directly with no animation
  progressCircle.setAttribute('transform', 'rotate(-90 60 60)');
  svg.appendChild(progressCircle);
  
  // Score text in the middle
  const scoreText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  scoreText.setAttribute('x', '60');
  scoreText.setAttribute('y', '55');
  scoreText.setAttribute('text-anchor', 'middle');
  scoreText.setAttribute('dominant-baseline', 'middle');
  scoreText.setAttribute('font-size', '24');
  scoreText.setAttribute('font-weight', 'bold');
  scoreText.setAttribute('fill', totalScoreColor);
  scoreText.textContent = scores.total.toFixed(1);
  svg.appendChild(scoreText);
  
  // Label text below the score
  const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  labelText.setAttribute('x', '60');
  labelText.setAttribute('y', '75');
  labelText.setAttribute('text-anchor', 'middle');
  labelText.setAttribute('font-size', '10');
  labelText.setAttribute('fill', '#666');
  labelText.textContent = translate('EI Score');
  svg.appendChild(labelText);
  
  // Add the SVG to the gauge container
  gaugeContainer.appendChild(svg);
  
  const scoreInterpretation = document.createElement('div');
  scoreInterpretation.className = `score-interpretation ${colorClass}`;
  scoreInterpretation.style.marginTop = '10px';
  scoreInterpretation.style.padding = '10px';
  scoreInterpretation.style.borderRadius = '5px';
  scoreInterpretation.style.fontWeight = 'bold';
  
  if (scores.total >= 75) {
    scoreInterpretation.textContent = translate('Green and practical efficient method');
  } else if (scores.total >= 50) {
    scoreInterpretation.textContent = translate('Acceptable');
  } else {
    scoreInterpretation.textContent = translate('Non green and impractical');
  }
  
  totalScoreContainer.appendChild(gaugeContainer);
  totalScoreContainer.appendChild(scoreInterpretation);
  
  visualizationContainer.appendChild(totalScoreContainer);
  
  // Initialize charts immediately
  // Bar chart
  createBarChart(barCanvas, scores);
  
  // Radar chart
  createRadarChart(radarCanvas, scores);
  
  // Polar area chart
  createPolarAreaChart(polarCanvas, scores);
  
  // Add tab switching functionality
  const tabs = chartTabs.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all chart containers
      const chartContainers = visualizationContainer.querySelectorAll('.chart-container');
      chartContainers.forEach(container => {
        container.style.display = 'none';
      });
      
      // Show the selected chart container
      const chartType = tab.dataset.chartType;
      const selectedContainer = visualizationContainer.querySelector(`.chart-container[data-chart-type="${chartType}"]`);
      if (selectedContainer) {
        selectedContainer.style.display = 'block';
      }
    });
  });
  
  return visualizationContainer;
}

function createBarChart(canvas, scores) {
  const ctx = canvas.getContext('2d');
  
  // Determine which components are best and worst
  const componentScores = [
    { name: 'Sample Preparation', value: scores.samplePrep },
    { name: 'Instrumentation', value: scores.instrumentation },
    { name: 'Reagent', value: scores.reagent },
    { name: 'Waste', value: scores.waste }
  ];
  
  // Sort components to find highest and lowest (higher scores are better)
  const sortedComponents = [...componentScores].sort((a, b) => b.value - a.value);
  const highestComponent = sortedComponents[0];
  const lowestComponent = sortedComponents[sortedComponents.length - 1];
  
  // Component-specific colors - gradient colors based on score value
  const componentColors = componentScores.map(component => {
    // Gradient from red to green based on score value (higher is better)
    if (component.value >= 90) {
      return '#2E7D32'; // Bright green for excellent scores (90-100)
    } else if (component.value >= 75) {
      return '#4CAF50'; // Light green for good scores (75-89)
    } else if (component.value >= 60) {
      return '#AEEA00'; // Lime green for above average scores (60-74)
    } else if (component.value >= 50) {
      return '#FFB300'; // Amber for acceptable scores (50-59)
    } else if (component.value >= 40) {
      return '#FFAB00'; // Orange for concerning scores (40-49)
    } else if (component.value >= 25) {
      return '#FF6D00'; // Deep orange for poor scores (25-39)
    } else {
      return '#C62828'; // Red for very poor scores (0-24)
    }
  });
  
  // Create the chart
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: componentScores.map(c => c.name),
      datasets: [{
        label: translate('EI Component Scores'),
        data: componentScores.map(c => c.value),
        backgroundColor: componentColors,
        borderColor: componentColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Disable all animations
      plugins: {
        title: {
          display: true,
          text: translate('Component Scores Comparison'),
          font: {
            size: 18,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw.toFixed(1)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: translate('Score (0-100)'),
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        },
        x: {
          title: {
            display: false
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
  
  return chart;
}

function createRadarChart(canvas, scores) {
  const ctx = canvas.getContext('2d');
  
  // Component-specific colors for better visual distinction
  const componentColors = [
    'rgba(33, 150, 243, 0.7)',    // Blue for Sample Prep
    'rgba(156, 39, 176, 0.7)',    // Purple for Instrumentation
    'rgba(255, 152, 0, 0.7)',     // Orange for Reagent
    'rgba(76, 175, 80, 0.7)'      // Green for Waste
  ];
  
  const componentBorderColors = componentColors.map(color => color.replace('0.7', '1'));
  
  // Create the chart
  const chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        translate('Sample Preparation'), 
        translate('Instrumentation'), 
        translate('Reagent'), 
        translate('Waste')
      ],
      datasets: [{
        label: translate('Component Scores'),
        data: [
          scores.samplePrep,
          scores.instrumentation,
          scores.reagent,
          scores.waste
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: componentColors,
        pointBorderColor: componentBorderColors,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: componentBorderColors,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Disable all animations
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: translate('Environmental Impact Radar'),
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw.toFixed(1)}`;
            }
          }
        }
      }
    }
  });
  
  return chart;
}

function createPolarAreaChart(canvas, scores) {
  const ctx = canvas.getContext('2d');
  
  // Component-specific colors with improved vibrancy and contrast
  const componentColors = [
    'rgba(33, 150, 243, 0.8)',   // Bright blue for Sample Prep
    'rgba(156, 39, 176, 0.8)',   // Deep purple for Instrumentation
    'rgba(255, 152, 0, 0.8)',    // Vibrant orange for Reagent
    'rgba(76, 175, 80, 0.8)'     // Rich green for Waste
  ];
  
  // Create the chart
  const chart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: [
        translate('Sample Preparation'), 
        translate('Instrumentation'), 
        translate('Reagent'), 
        translate('Waste')
      ],
      datasets: [{
        data: [
          scores.samplePrep,
          scores.instrumentation,
          scores.reagent,
          scores.waste
        ],
        backgroundColor: componentColors,
        borderColor: componentColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Disable all animations
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: translate('EI Component Distribution'),
          font: {
            size: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw.toFixed(1)}`;
            }
          }
        }
      }
    }
  });
  
  return chart;
}
