/**
 * Radar Chart Component
 * This component creates a radar chart with 5 axes:
 * 4 SIRW components (Sample Preparation, Instrumentation, Reagents, Waste)
 * and 1 Performance Practicality Index (PPI)
 */

import { translate } from '../../utils/i18n.js';

export function RadarChart(scores) {
  // Container for the visualization
  const container = document.createElement('div');
  container.className = 'radar-chart-container';
  
  // Title for the visualization
  const title = document.createElement('h3');
  title.textContent = translate('Method Profile: SIRW & Performance Practicality Index (PPI) Radar');
  title.style.textAlign = 'center';
  title.style.marginBottom = '20px';
  container.appendChild(title);
  
  // Description
  const description = document.createElement('p');
  description.textContent = translate('This radar chart provides a comprehensive view of your method, showing the relationship between all SIRW components and the Performance Practicality Index (PPI).');
  description.style.textAlign = 'center';
  description.style.marginBottom = '30px';
  description.style.color = '#666';
  container.appendChild(description);
  
  // Canvas for the radar chart
  const canvasContainer = document.createElement('div');
  canvasContainer.style.width = '100%';
  canvasContainer.style.height = '500px';
  canvasContainer.style.position = 'relative';
  canvasContainer.style.margin = '0 auto';
  canvasContainer.style.maxWidth = '600px';
  
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 500;
  canvas.style.width = '100%';
  canvas.style.maxWidth = '600px';
  canvas.style.margin = '0 auto';
  canvas.style.display = 'block';
  
  canvasContainer.appendChild(canvas);
  container.appendChild(canvasContainer);
  
  // Get canvas context for drawing
  const ctx = canvas.getContext('2d');
  
  // Define radar chart parameters
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 50;
  
  // Scale scores for the radar chart (0-100 scale), inverting SIRW scores
  // For SIRW components, lower scores are better, so we invert them for the radar display
  const samplePrepScore = 100 - Math.min(100, scores.samplePrep);
  const instrumentationScore = 100 - Math.min(100, scores.instrumentation);
  const reagentScore = 100 - Math.min(100, scores.reagent);
  const wasteScore = 100 - Math.min(100, scores.waste);
  
  // For practicality, higher scores are better, so we keep them as is
  const practicalityScore = Math.min(100, scores.practicality);
  
  // Define the 5 axes (the radar points)
  const axes = [
    { name: translate('Sample Preparation'), value: samplePrepScore, color: 'rgb(52, 152, 219)' },
    { name: translate('Instrumentation'), value: instrumentationScore, color: 'rgb(155, 89, 182)' },
    { name: translate('Reagents'), value: reagentScore, color: 'rgb(243, 156, 18)' },
    { name: translate('Waste'), value: wasteScore, color: 'rgb(26, 188, 156)' },
    { name: translate('Performance Practicality Index (PPI)'), value: practicalityScore, color: 'rgb(142, 68, 173)' }
  ];
  
  // Number of axes
  const axesCount = axes.length;
  
  // Draw the radar background (grid)
  drawRadarGrid(ctx, centerX, centerY, radius, axesCount);
  
  // Draw axes labels
  drawLabels(ctx, centerX, centerY, radius, axes);
  
  // Draw the radar data polygon
  drawRadarPolygon(ctx, centerX, centerY, radius, axes);
  
  // Draw legend
  drawLegend(container, axes);
  
  // Add score explanation
  const explanation = document.createElement('div');
  explanation.className = 'radar-explanation';
  explanation.style.margin = '30px auto 0';
  explanation.style.maxWidth = '600px';
  explanation.style.padding = '15px';
  explanation.style.backgroundColor = '#f9f9f9';
  explanation.style.borderRadius = '8px';
  explanation.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  
  const explanationTitle = document.createElement('h4');
  explanationTitle.textContent = translate('How to Read This Chart');
  explanationTitle.style.marginTop = '0';
  explanationTitle.style.marginBottom = '10px';
  explanation.appendChild(explanationTitle);
  
  const explanationText = document.createElement('p');
  explanationText.innerHTML = translate('This radar chart shows all five components of your method assessment. For the SIRW components (Sample Preparation, Instrumentation, Reagents, and Waste), <strong>a larger area indicates BETTER environmental performance</strong> (lower impact scores). For Practicality, <strong>a larger area also indicates BETTER practical feasibility</strong> (higher practicality score).');
  explanationText.style.margin = '0';
  explanationText.style.lineHeight = '1.5';
  explanation.appendChild(explanationText);
  
  container.appendChild(explanation);
  
  return container;
  
  // Function to draw the radar grid
  function drawRadarGrid(ctx, centerX, centerY, radius, axesCount) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw circular grid lines
    const gridLevels = 5; // Number of circular grid lines
    ctx.strokeStyle = '#ddd';
    ctx.setLineDash([1, 3]); // Dashed lines for the grid
    
    for (let i = 1; i <= gridLevels; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * (i / gridLevels), 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw axis lines
    ctx.setLineDash([]); // Solid lines for the axes
    ctx.strokeStyle = '#aaa';
    
    for (let i = 0; i < axesCount; i++) {
      const angle = Math.PI * 2 * (i / axesCount) - Math.PI / 2; // Start from top (subtract PI/2)
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      );
      ctx.stroke();
    }
  }
  
  // Function to draw axes labels
  function drawLabels(ctx, centerX, centerY, radius, axes) {
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'center';
    
    axes.forEach((axis, i) => {
      const angle = Math.PI * 2 * (i / axes.length) - Math.PI / 2; // Start from top (subtract PI/2)
      
      // Position labels outside the radar
      const labelRadius = radius + 25;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      // Adjust vertical alignment based on position
      if (angle === -Math.PI / 2) { // Top
        ctx.textBaseline = 'bottom';
      } else if (angle === Math.PI / 2) { // Bottom
        ctx.textBaseline = 'top';
      } else {
        ctx.textBaseline = 'middle';
      }
      
      // Draw background for better readability
      const textWidth = ctx.measureText(axis.name).width;
      const padding = 5;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(
        x - textWidth / 2 - padding,
        y - 10,
        textWidth + padding * 2,
        20
      );
      
      // Draw label text
      ctx.fillStyle = '#333';
      ctx.fillText(axis.name, x, y);
    });
  }
  
  // Function to draw the radar data polygon
  function drawRadarPolygon(ctx, centerX, centerY, radius, axes) {
    // Draw the data polygon
    ctx.beginPath();
    
    axes.forEach((axis, i) => {
      const angle = Math.PI * 2 * (i / axes.length) - Math.PI / 2; // Start from top (subtract PI/2)
      const value = axis.value / 100; // Normalize to 0-1 range
      
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.closePath();
    
    // Fill with a semi-transparent gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(52, 152, 219, 0.7)');
    gradient.addColorStop(1, 'rgba(155, 89, 182, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw the outline with a slightly darker color
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(52, 152, 219, 0.8)';
    ctx.stroke();
    
    // Draw data points
    axes.forEach((axis, i) => {
      const angle = Math.PI * 2 * (i / axes.length) - Math.PI / 2;
      const value = axis.value / 100;
      
      const x = centerX + radius * value * Math.cos(angle);
      const y = centerY + radius * value * Math.sin(angle);
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = axis.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Display value next to point
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Position the value text
      const textRadius = radius * value + 15;
      const textX = centerX + textRadius * Math.cos(angle);
      const textY = centerY + textRadius * Math.sin(angle);
      
      // Draw value with original scale (inverted back for SIRW components)
      let displayValue;
      if (i < 4) { // SIRW components
        displayValue = (100 - axis.value).toFixed(0);
      } else { // Practicality
        displayValue = axis.value.toFixed(0);
      }
      
      // Draw background for better readability
      const textWidth = ctx.measureText(displayValue).width;
      const padding = 3;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(
        textX - textWidth / 2 - padding,
        textY - 8,
        textWidth + padding * 2,
        16
      );
      
      // Draw value text
      ctx.fillStyle = '#333';
      ctx.fillText(displayValue, textX, textY);
    });
  }
  
  // Function to draw the legend
  function drawLegend(container, axes) {
    const legend = document.createElement('div');
    legend.className = 'radar-legend';
    legend.style.display = 'flex';
    legend.style.flexWrap = 'wrap';
    legend.style.justifyContent = 'center';
    legend.style.marginTop = '20px';
    legend.style.gap = '15px';
    
    // Create legend for each axis
    axes.forEach(axis => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      legendItem.style.marginBottom = '5px';
      
      const colorBox = document.createElement('span');
      colorBox.style.width = '12px';
      colorBox.style.height = '12px';
      colorBox.style.backgroundColor = axis.color;
      colorBox.style.display = 'inline-block';
      colorBox.style.marginRight = '5px';
      colorBox.style.borderRadius = '2px';
      
      legendItem.appendChild(colorBox);
      
      const label = document.createElement('span');
      label.textContent = axis.name;
      legendItem.appendChild(label);
      
      legend.appendChild(legendItem);
    });
    
    container.appendChild(legend);
  }
}