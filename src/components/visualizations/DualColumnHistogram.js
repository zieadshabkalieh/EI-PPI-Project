/**
 * Dual-Column Histogram Component
 * This component visualizes the SIRW scores and Performance Practicality Index (PPI) side by side
 * with appropriate color coding.
 */

import { translate } from '../../utils/i18n.js';

export function DualColumnHistogram(sirwScore, practicalityScore) {
  // Container for the visualization
  const container = document.createElement('div');
  container.className = 'dual-histogram-container';
  
  // Title for the visualization
  const title = document.createElement('h3');
  title.textContent = translate('Component Comparison: SIRW & Performance Practicality Index (PPI)');
  title.style.textAlign = 'center';
  title.style.marginBottom = '20px';
  container.appendChild(title);
  
  // Description
  const description = document.createElement('p');
  description.textContent = translate('This chart compares the Environmental Impact (SIRW) score with the Performance Performance Practicality Index (PPI) Index (PPI), showing the balance between environmental sustainability and practical feasibility.');
  description.style.textAlign = 'center';
  description.style.marginBottom = '30px';
  description.style.color = '#666';
  container.appendChild(description);
  
  // Chart container with fixed height
  const chartContainer = document.createElement('div');
  chartContainer.className = 'histogram-chart-container';
  chartContainer.style.height = '400px';
  chartContainer.style.position = 'relative';
  chartContainer.style.marginBottom = '50px';
  
  // Calculate scores for display - convert to 0-100 scale if needed
  const sirwDisplayScore = Math.min(100, Math.max(0, sirwScore));
  const practicalityDisplayScore = Math.min(100, Math.max(0, practicalityScore));
  
  // Determine color classes based on score ranges
  let sirwColorClass;
  if (sirwDisplayScore === 0) {
    sirwColorClass = 'chart-ideal';
  } else if (sirwDisplayScore <= 25) {
    sirwColorClass = 'chart-good';
  } else if (sirwDisplayScore <= 50) {
    sirwColorClass = 'chart-medium';
  } else {
    sirwColorClass = 'chart-bad';
  }
  
  let practicalityColorClass;
  if (practicalityDisplayScore >= 75) {
    practicalityColorClass = 'practicality-excellent-column';
  } else if (practicalityDisplayScore >= 50) {
    practicalityColorClass = 'practicality-acceptable-column';
  } else {
    practicalityColorClass = 'practicality-impractical-column';
  }
  
  // Create columns
  const sirwColumn = document.createElement('div');
  sirwColumn.className = 'histogram-column sirw-column ' + sirwColorClass;
  sirwColumn.style.height = sirwDisplayScore + '%';
  sirwColumn.style.width = '80px';
  sirwColumn.style.position = 'absolute';
  sirwColumn.style.bottom = '0';
  sirwColumn.style.left = '25%';
  sirwColumn.style.transform = 'translateX(-50%)';
  sirwColumn.style.borderRadius = '8px 8px 0 0';
  // Removed transition to prevent animation issues
  
  // Label for SIRW column
  const sirwLabel = document.createElement('div');
  sirwLabel.className = 'column-label';
  sirwLabel.textContent = translate('SIRW Score');
  sirwLabel.style.position = 'absolute';
  sirwLabel.style.bottom = '-30px';
  sirwLabel.style.left = '0';
  sirwLabel.style.right = '0';
  sirwLabel.style.textAlign = 'center';
  sirwLabel.style.fontWeight = 'bold';
  sirwColumn.appendChild(sirwLabel);
  
  // Score display for SIRW
  const sirwScoreDisplay = document.createElement('div');
  sirwScoreDisplay.className = 'column-score';
  sirwScoreDisplay.textContent = sirwDisplayScore.toFixed(1);
  sirwScoreDisplay.style.position = 'absolute';
  sirwScoreDisplay.style.top = '-25px';
  sirwScoreDisplay.style.left = '0';
  sirwScoreDisplay.style.right = '0';
  sirwScoreDisplay.style.textAlign = 'center';
  sirwScoreDisplay.style.fontWeight = 'bold';
  sirwColumn.appendChild(sirwScoreDisplay);
  
  const practicalityColumn = document.createElement('div');
  practicalityColumn.className = 'histogram-column practicality-column ' + practicalityColorClass;
  practicalityColumn.style.height = practicalityDisplayScore + '%';
  practicalityColumn.style.width = '80px';
  practicalityColumn.style.position = 'absolute';
  practicalityColumn.style.bottom = '0';
  practicalityColumn.style.left = '75%';
  practicalityColumn.style.transform = 'translateX(-50%)';
  practicalityColumn.style.borderRadius = '8px 8px 0 0';
  // Removed transition to prevent animation issues
  
  // Label for Practicality column
  const practicalityLabel = document.createElement('div');
  practicalityLabel.className = 'column-label';
  practicalityLabel.textContent = translate('Performance Practicality Index (PPI) Score');
  practicalityLabel.style.position = 'absolute';
  practicalityLabel.style.bottom = '-30px';
  practicalityLabel.style.left = '0';
  practicalityLabel.style.right = '0';
  practicalityLabel.style.textAlign = 'center';
  practicalityLabel.style.fontWeight = 'bold';
  practicalityColumn.appendChild(practicalityLabel);
  
  // Score display for Practicality
  const practicalityScoreDisplay = document.createElement('div');
  practicalityScoreDisplay.className = 'column-score';
  practicalityScoreDisplay.textContent = practicalityDisplayScore.toFixed(1);
  practicalityScoreDisplay.style.position = 'absolute';
  practicalityScoreDisplay.style.top = '-25px';
  practicalityScoreDisplay.style.left = '0';
  practicalityScoreDisplay.style.right = '0';
  practicalityScoreDisplay.style.textAlign = 'center';
  practicalityScoreDisplay.style.fontWeight = 'bold';
  practicalityColumn.appendChild(practicalityScoreDisplay);
  
  // Grid lines for better readability
  for (let i = 0; i <= 100; i += 25) {
    const gridLine = document.createElement('div');
    gridLine.className = 'grid-line';
    gridLine.style.position = 'absolute';
    gridLine.style.left = '0';
    gridLine.style.right = '0';
    gridLine.style.bottom = i + '%';
    gridLine.style.borderBottom = i === 0 ? '2px solid #333' : '1px dashed #ccc';
    gridLine.style.zIndex = '1';
    
    // Add labels for grid lines
    if (i > 0) {
      const gridLabel = document.createElement('div');
      gridLabel.textContent = (100 - i) + '';
      gridLabel.style.position = 'absolute';
      gridLabel.style.left = '-25px';
      gridLabel.style.fontSize = '12px';
      gridLabel.style.color = '#777';
      gridLine.appendChild(gridLabel);
    }
    
    chartContainer.appendChild(gridLine);
  }
  
  // Add columns to chart
  chartContainer.appendChild(sirwColumn);
  chartContainer.appendChild(practicalityColumn);
  container.appendChild(chartContainer);
  
  // Legend
  const legend = document.createElement('div');
  legend.className = 'histogram-legend';
  legend.style.display = 'flex';
  legend.style.justifyContent = 'center';
  legend.style.flexWrap = 'wrap';
  legend.style.gap = '15px';
  legend.style.marginTop = '20px';
  
  // SIRW Legend Items
  const sirwLegendTitle = document.createElement('div');
  sirwLegendTitle.className = 'legend-title';
  sirwLegendTitle.textContent = translate('SIRW Score Interpretation:');
  sirwLegendTitle.style.flexBasis = '100%';
  sirwLegendTitle.style.fontWeight = 'bold';
  sirwLegendTitle.style.marginBottom = '10px';
  sirwLegendTitle.style.textAlign = 'center';
  legend.appendChild(sirwLegendTitle);
  
  const legendItems = [
    { color: 'dark-green', label: translate('Ideal') },
    { color: 'light-green', label: translate('Minimal Impact (1-25)') },
    { color: 'yellow', label: translate('Considerable Impact (26-50)') },
    { color: 'red', label: translate('Serious Impact (>50)') },
  ];
  
  legendItems.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.style.display = 'flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.margin = '0 5px';
    
    const colorBox = document.createElement('span');
    colorBox.className = 'color-dot ' + item.color;
    colorBox.style.marginRight = '5px';
    legendItem.appendChild(colorBox);
    
    const label = document.createElement('span');
    label.textContent = item.label;
    legendItem.appendChild(label);
    
    legend.appendChild(legendItem);
  });
  
  // Practicality Legend Items
  const practicalityLegendTitle = document.createElement('div');
  practicalityLegendTitle.className = 'legend-title';
  practicalityLegendTitle.textContent = translate('Performance Practicality Index (PPI) Score Interpretation:');
  practicalityLegendTitle.style.flexBasis = '100%';
  practicalityLegendTitle.style.fontWeight = 'bold';
  practicalityLegendTitle.style.marginTop = '15px';
  practicalityLegendTitle.style.marginBottom = '10px';
  practicalityLegendTitle.style.textAlign = 'center';
  legend.appendChild(practicalityLegendTitle);
  
  const practicalityLegendItems = [
    { color: 'dark-blue', label: translate('Excellent (75-100)') },
    { color: 'light-blue', label: translate('Acceptable (50-74)') },
    { color: 'magenta', label: translate('Impractical (<50)') }
  ];
  
  practicalityLegendItems.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.style.display = 'flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.margin = '0 5px';
    
    const colorBox = document.createElement('span');
    colorBox.className = 'color-dot ' + item.color;
    colorBox.style.marginRight = '5px';
    legendItem.appendChild(colorBox);
    
    const label = document.createElement('span');
    label.textContent = item.label;
    legendItem.appendChild(label);
    
    legend.appendChild(legendItem);
  });
  
  container.appendChild(legend);
  
  return container;
}