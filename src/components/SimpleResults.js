/**
 * SimpleResults Component
 * A simplified, reliable results display component with minimal dependencies
 */

import { translate } from '../utils/i18n.js';

export function SimpleResults(scores) {
  // Validate that scores exist
  if (!scores || typeof scores !== 'object') {
    console.error('Invalid scores object provided to SimpleResults:', scores);
    return createErrorMessage('No valid scores available');
  }
  
  try {
    const container = document.createElement('div');
    container.className = 'simple-results-container';
    container.style.padding = '20px';
    container.style.backgroundColor = '#fff';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    
    // Add a header
    const header = document.createElement('h2');
    header.textContent = translate('Results Summary');
    header.style.color = '#333';
    header.style.marginTop = '0';
    header.style.marginBottom = '20px';
    header.style.textAlign = 'center';
    container.appendChild(header);
    
    // Helper to get color based on score - updated with new thresholds
    const getEIColor = (score) => {
      if (score >= 85) return '#2E7D32'; // Dark Green
      if (score >= 70) return '#4CAF50'; // Green
      if (score >= 55) return '#FFB300'; // Yellow
      return '#C62828'; // Red
    };
    
    const getPracticalityColor = (score) => {
      if (score >= 75) return '#77008f'; // Dark Blue
      if (score >= 50) return '#7C3AED'; // Blue
      return '#C084FC'; // Magenta
    };
    // Combined EI + PPI palette
const getTotalColor = (score) => {
  if (score >= 85) return '#523e60'; // Deep violet‑green mix
  if (score >= 70) return '#64749e'; // Slate lavender mix
  if (score >= 55) return '#df9b7e'; // Soft coral mix
  return '#c35692';                   // Dusty magenta mix
};

    // Get interpretations - updated with new interpretation text
    const getEIInterpretation = (score) => {
      if (score >= 85) return translate('Ideal green');
      if (score >= 70) return translate('Green');
      if (score >= 55) return translate('Acceptable green');
      return translate('Non green');
    };
    
    const getPracticalityInterpretation = (score) => {
      if (score >= 75) return translate('Excellent');
      if (score >= 50) return translate('Acceptable');
      return translate('Impractical');
    };
    
    const getTotalInterpretation = (score) => {
      if (score >= 75) return translate('Highly Recommended');
      if (score >= 50) return translate('Recommended');
      if (score >= 25) return translate('Needs Improvement');
      return translate('Not Recommended');
    };
    
    // 1. Create Dual Semi-Circular Gauges ("Speedometer Style")
    const dualGaugesContainer = document.createElement('div');
    dualGaugesContainer.className = 'dual-gauges-container';
    dualGaugesContainer.style.display = 'flex';
    dualGaugesContainer.style.flexDirection = 'column';
    dualGaugesContainer.style.alignItems = 'center';
    dualGaugesContainer.style.marginBottom = '30px';
    dualGaugesContainer.style.padding = '20px';
    dualGaugesContainer.style.backgroundColor = 'white';
    dualGaugesContainer.style.borderRadius = '10px';
    dualGaugesContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    
    const gaugesTitle = document.createElement('h3');
    gaugesTitle.textContent = translate('EI & PPI Indexes');
    gaugesTitle.style.margin = '0 0 20px 0';
    gaugesTitle.style.textAlign = 'center';
    dualGaugesContainer.appendChild(gaugesTitle);
    
    // Create the dual gauges
    const gaugesWrapper = document.createElement('div');
    gaugesWrapper.style.display = 'flex';
    gaugesWrapper.style.justifyContent = 'center';
    gaugesWrapper.style.flexWrap = 'wrap';
    gaugesWrapper.style.gap = '20px';
    gaugesWrapper.style.marginBottom = '15px';
    
    // Create EI gauge - updated with new thresholds
    const eiGauge = createSemiCircularGauge(
      translate('Environmental  Index'),
      scores.eiIndex,
      [
        { value: 55, color: '#C62828', label: translate('Non green') },
        { value: 70, color: '#FFB300', label: translate('Acceptable green') },
        { value: 85, color: '#4CAF50', label: translate('Green') },
        { value: 100, color: '#2E7D32', label: translate('Ideal green') }
      ]
    );
    gaugesWrapper.appendChild(eiGauge);
    
    // Create Practicality gauge
const practicalityGauge = createSemiCircularGauge(
  translate('Performance Practicality Index'),
  scores.practicality,
  [
    { value: 50, color: '#C084FC', label: translate('Impractical') },
    { value: 75, color: '#7C3AED', label: translate('Acceptable') },
    { value: 100, color: '#77008f', label: translate('Excellent') }
  ]
);
    gaugesWrapper.appendChild(practicalityGauge);
    
    dualGaugesContainer.appendChild(gaugesWrapper);
    
    // Total score display below the gauges
    const totalScoreDisplay = document.createElement('div');
    totalScoreDisplay.style.backgroundColor = '#f8f9fa';
    totalScoreDisplay.style.padding = '15px 25px';
    totalScoreDisplay.style.borderRadius = '50px';
    totalScoreDisplay.style.display = 'flex';
    totalScoreDisplay.style.alignItems = 'center';
    totalScoreDisplay.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
    totalScoreDisplay.style.marginTop = '10px';
    
    const totalLabel = document.createElement('span');
    totalLabel.textContent = translate('TOTAL SCORE:');
    totalLabel.style.fontWeight = 'bold';
    totalLabel.style.marginRight = '10px';
    totalScoreDisplay.appendChild(totalLabel);
    
    const totalValue = document.createElement('span');
    totalValue.textContent = scores.total.toFixed(1);
    totalValue.style.fontWeight = 'bold';
    totalValue.style.fontSize = '24px';
    totalValue.style.color = getEIColor(scores.total);
    totalScoreDisplay.appendChild(totalValue);
    
    const totalInterpretation = document.createElement('span');
    totalInterpretation.textContent = ` - ${getTotalInterpretation(scores.total)}`;
    totalInterpretation.style.marginLeft = '10px';
    totalInterpretation.style.fontStyle = 'italic';
    totalInterpretation.style.color = getEIColor(scores.total);
    totalScoreDisplay.appendChild(totalInterpretation);
    
    dualGaugesContainer.appendChild(totalScoreDisplay);
    container.appendChild(dualGaugesContainer);
    
    // 2. Add circular gauges in a row (original circular gauges)
    const gaugesContainer = document.createElement('div');
    gaugesContainer.className = 'gauges-container';
    gaugesContainer.style.display = 'flex';
    gaugesContainer.style.flexWrap = 'wrap';
    gaugesContainer.style.justifyContent = 'space-around';
    gaugesContainer.style.margin = '20px 0 30px';
    
    // Create Environmental Index (EI) gauge
    const eiCircularGauge = createGaugeCard(
      translate('Environmental Index (EI)'), 
      scores.eiIndex, 
      getEIInterpretation(scores.eiIndex),
      getEIColor(scores.eiIndex),
      '50%'
    );
    gaugesContainer.appendChild(eiCircularGauge);
    
    // Create Practicality gauge
    const practicalityCircularGauge = createGaugeCard(
      translate('Performance Practicality Index (PPI)'), 
      scores.practicality, 
      getPracticalityInterpretation(scores.practicality),
      getPracticalityColor(scores.practicality),
      '50%'
    );
    gaugesContainer.appendChild(practicalityCircularGauge);
    
    // Create Total Score gauge
    const totalGauge = createGaugeCard(
      translate('EPPI Score'), 
      scores.total, 
      getTotalInterpretation(scores.total),
      getTotalColor(scores.total),
      '100%'
    );
    // Make the total gauge slightly larger
    // totalGauge.style.transform = 'scale(1.1)';
    // totalGauge.style.zIndex = '1';
    gaugesContainer.appendChild(totalGauge);
    
    container.appendChild(gaugesContainer);
    
    // Create a flex layout row for radar chart and bar charts
    const chartsRow = document.createElement('div');
    chartsRow.style.display = 'flex';
    chartsRow.style.flexWrap = 'wrap';
    chartsRow.style.gap = '20px';
    chartsRow.style.marginBottom = '30px';
    
    // 3. Create Radar Chart (Spider Chart) 
    const radarChartContainer = document.createElement('div');
    radarChartContainer.className = 'radar-chart-container';
    radarChartContainer.style.flex = '1';
    radarChartContainer.style.minWidth = '300px';
    radarChartContainer.style.padding = '20px';
    radarChartContainer.style.backgroundColor = 'white';
    radarChartContainer.style.borderRadius = '10px';
    radarChartContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    
    const radarTitle = document.createElement('h3');
    radarTitle.textContent = translate('Radar Chart: Environmental Index (EI) + Performance Practicality Index (PPI)');
    radarTitle.style.margin = '0 0 20px 0';
    radarTitle.style.textAlign = 'center';
    radarChartContainer.appendChild(radarTitle);
    
    // Collect the component scores
    const radarData = [];
    
    if (scores.samplePrep !== undefined) {
      radarData.push({
        name: translate('Sample Prep'),
        value: scores.samplePrep,
        color: getEIColor(scores.samplePrep)
      });
    }
    
    if (scores.instrumentation !== undefined) {
      radarData.push({
        name: translate('Instrumentation'),
        value: scores.instrumentation,
        color: getEIColor(scores.instrumentation)
      });
    }
    
    if (scores.reagent !== undefined) {
      radarData.push({
        name: translate('Reagent'),
        value: scores.reagent,
        color: getEIColor(scores.reagent)
      });
    }
    
    if (scores.waste !== undefined) {
      radarData.push({
        name: translate('Waste'),
        value: scores.waste,
        color: getEIColor(scores.waste)
      });
    }
    
    // Add practicality as the fifth axis
    radarData.push({
      name: translate('Performance Practicality Index (PPI)'),
      value: scores.practicality,
      color: getPracticalityColor(scores.practicality)
    });
    
    // Add the radar chart
    const radarChartElement = createRadarChart(radarData);
    radarChartElement.id = 'radarChart';
    radarChartContainer.appendChild(radarChartElement);
    
    // Add download button for the radar chart
    // const downloadRadarBtn = document.createElement('button');
    // downloadRadarBtn.className = 'download-chart-btn';
    // downloadRadarBtn.textContent = translate('Download Radar Chart');
    // downloadRadarBtn.style.backgroundColor = '#7d3c98';
    // downloadRadarBtn.style.color = 'white';
    // downloadRadarBtn.style.border = 'none';
    // downloadRadarBtn.style.borderRadius = '4px';
    // downloadRadarBtn.style.padding = '8px 16px';
    // downloadRadarBtn.style.margin = '10px auto';
    // downloadRadarBtn.style.cursor = 'pointer';
    // downloadRadarBtn.style.display = 'block';
    // downloadRadarBtn.addEventListener('click', () => {
    //   downloadChartAsPNG('radarChart', 'Radar-Chart-SIRW-Practicality');
    // });
    
    // radarChartContainer.appendChild(downloadRadarBtn);
    // chartsRow.appendChild(radarChartContainer);
    
    // Create horizontal bar charts for component scores
    const componentChartsContainer = document.createElement('div');
    componentChartsContainer.className = 'component-charts-container';
    componentChartsContainer.style.flex = '1';
    componentChartsContainer.style.minWidth = '300px';
    componentChartsContainer.style.backgroundColor = '#f8f9fa';
    componentChartsContainer.style.padding = '20px';
    componentChartsContainer.style.borderRadius = '8px';
    
    const componentTitle = document.createElement('h3');
    componentTitle.textContent = translate('EPPI Components');
    componentTitle.style.marginTop = '0';
    componentTitle.style.marginBottom = '20px';
    componentTitle.style.textAlign = 'center';
    componentChartsContainer.appendChild(componentTitle);
    
    // Add the component horizontal bar charts
    if (scores.samplePrep !== undefined) {
      componentChartsContainer.appendChild(createHorizontalBar(
        translate('Sample Preparation'), 
        scores.samplePrep, 
        100, 
        getEIColor(scores.samplePrep)
      ));
    }
    
    if (scores.instrumentation !== undefined) {
      componentChartsContainer.appendChild(createHorizontalBar(
        translate('Instrumentation'), 
        scores.instrumentation, 
        100, 
        getEIColor(scores.instrumentation)
      ));
    }
    
    if (scores.reagent !== undefined) {
      componentChartsContainer.appendChild(createHorizontalBar(
        translate('Reagents'), 
        scores.reagent, 
        100, 
        getEIColor(scores.reagent)
      ));
    }
    
    if (scores.waste !== undefined) {
      componentChartsContainer.appendChild(createHorizontalBar(
        translate('Waste'), 
        scores.waste, 
        100, 
        getEIColor(scores.waste)
      ));
    }
    
    // Add practicality horizontal bar
    componentChartsContainer.appendChild(createHorizontalBar(
      translate('PPI'), 
      scores.practicality, 
      100, 
      getPracticalityColor(scores.practicality)
    ));
    
    chartsRow.appendChild(componentChartsContainer);
    container.appendChild(chartsRow);
    
    // 4. Create Dual-Column Histogram
    // const histogramContainer = document.createElement('div');
    // histogramContainer.className = 'histogram-container';
    // histogramContainer.style.marginBottom = '30px';
    // histogramContainer.style.padding = '20px';
    // histogramContainer.style.backgroundColor = 'white';
    // histogramContainer.style.borderRadius = '10px';
    // histogramContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    
    // const histogramTitle = document.createElement('h3');
    // histogramTitle.textContent = translate('Dual-Column Histogram: EI & Performance Practicality Index (PPI)');
    // histogramTitle.style.margin = '0 0 20px 0';
    // histogramTitle.style.textAlign = 'center';
    // histogramContainer.appendChild(histogramTitle);
    
    // Create the dual-column histogram
    // const histogramData = [
    //   {
    //     label: translate('Environmental Index (EI)'),
    //     value: scores.eiIndex,
    //     color: getEIColor(scores.eiIndex),
    //     weight: '50%'
    //   },
    //   {
    //     label: translate('PPI'),
    //     value: scores.practicality,
    //     color: getPracticalityColor(scores.practicality),
    //     weight: '50%'
    //   }
    // ];
    
    // const dualColumnHistogramElement = createDualColumnHistogram(histogramData);
    // dualColumnHistogramElement.id = 'dualColumnHistogram';
    // histogramContainer.appendChild(dualColumnHistogramElement);
    
    // Add download button for the dual-column histogram
    // const downloadHistogramBtn = document.createElement('button');
    // downloadHistogramBtn.className = 'download-chart-btn';
    // downloadHistogramBtn.textContent = translate('Download Histogram');
    // downloadHistogramBtn.style.backgroundColor = '#007bff';
    // downloadHistogramBtn.style.color = 'white';
    // downloadHistogramBtn.style.border = 'none';
    // downloadHistogramBtn.style.borderRadius = '4px';
    // downloadHistogramBtn.style.padding = '8px 16px';
    // downloadHistogramBtn.style.margin = '10px auto';
    // downloadHistogramBtn.style.cursor = 'pointer';
    // downloadHistogramBtn.style.display = 'block';
    // downloadHistogramBtn.addEventListener('click', () => {
    //   downloadChartAsPNG('dualColumnHistogram', 'Dual-Index-Histogram');
    // });
    
    // histogramContainer.appendChild(downloadHistogramBtn);
    // container.appendChild(histogramContainer);
    
    // Create the detailed scores table section
    const scoresSection = createScoresSection(scores);
    container.appendChild(scoresSection);
    
    // Add interpretation guide
    const interpretationSection = createInterpretationGuide(scores);
    container.appendChild(interpretationSection);
    
    // Add export buttons section
    const buttonsSection = document.createElement('div');
    buttonsSection.style.marginTop = '30px';
    buttonsSection.style.textAlign = 'center';
    
    const exportDesc = document.createElement('p');
    exportDesc.textContent = translate('You can save this calculation or export it in various formats:');
    exportDesc.style.marginBottom = '15px';
    buttonsSection.appendChild(exportDesc);
    
    container.appendChild(buttonsSection);
    
    return container;
  } catch (error) {
    console.error('Error rendering SimpleResults:', error);
    return createErrorMessage('Could not display results');
  }
}

// Function to create a gauge card
function createGaugeCard(title, value, interpretation, color, weight) {
  const card = document.createElement('div');
  card.className = 'gauge-card';
  card.style.backgroundColor = 'white';
  card.style.borderRadius = '10px';
  card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  card.style.padding = '20px';
  card.style.width = '180px';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.alignItems = 'center';
  card.style.margin = '10px';
  card.style.position = 'relative';
  
  // Add weight label in the corner
  if (weight) {
    const weightLabel = document.createElement('div');
    weightLabel.textContent = weight;
    weightLabel.style.position = 'absolute';
    weightLabel.style.top = '10px';
    weightLabel.style.right = '10px';
    weightLabel.style.backgroundColor = '#f8f9fa';
    weightLabel.style.padding = '3px 8px';
    weightLabel.style.borderRadius = '12px';
    weightLabel.style.fontSize = '12px';
    weightLabel.style.fontWeight = 'bold';
    card.appendChild(weightLabel);
  }
  
  // Title
  const titleElement = document.createElement('div');
  titleElement.textContent = title;
  titleElement.style.fontSize = '16px';
  titleElement.style.fontWeight = 'bold';
  titleElement.style.marginBottom = '15px';
  titleElement.style.textAlign = 'center';
  card.appendChild(titleElement);
  
  // SVG Gauge
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '140');
  svg.setAttribute('height', '140');
  svg.setAttribute('viewBox', '0 0 100 100');
  
  // Background circle
  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', '50');
  bgCircle.setAttribute('cy', '50');
  bgCircle.setAttribute('r', '40');
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', '#e6e6e6');
  bgCircle.setAttribute('stroke-width', '8');
  svg.appendChild(bgCircle);
  
  // Value circle - the gauge itself
  const valueCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  valueCircle.setAttribute('cx', '50');
  valueCircle.setAttribute('cy', '50');
  valueCircle.setAttribute('r', '40');
  valueCircle.setAttribute('fill', 'none');
  valueCircle.setAttribute('stroke', color);
  valueCircle.setAttribute('stroke-width', '8');
  
  // Calculate the circumference
  const circumference = 2 * Math.PI * 40;
  valueCircle.setAttribute('stroke-dasharray', circumference);
  
  // Calculate the value to display in the gauge (0-100%)
  const valuePercent = value / 100;
  const dashOffset = circumference * (1 - valuePercent);
  valueCircle.setAttribute('stroke-dashoffset', dashOffset);
  
  // Rotate to start from the top
  valueCircle.setAttribute('transform', 'rotate(-90 50 50)');
  svg.appendChild(valueCircle);
  
  // Value text in the center
  const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  valueText.setAttribute('x', '50');
  valueText.setAttribute('y', '50');
  valueText.setAttribute('text-anchor', 'middle');
  valueText.setAttribute('dominant-baseline', 'middle');
  valueText.setAttribute('fill', color);
  valueText.setAttribute('font-size', '22');
  valueText.setAttribute('font-weight', 'bold');
  valueText.textContent = value.toFixed(1);
  svg.appendChild(valueText);
  
  card.appendChild(svg);
  
  // Interpretation
  const interpretationElement = document.createElement('div');
  interpretationElement.textContent = interpretation;
  interpretationElement.style.backgroundColor = `${color}22`;
  interpretationElement.style.color = color;
  interpretationElement.style.padding = '5px 10px';
  interpretationElement.style.borderRadius = '4px';
  interpretationElement.style.fontWeight = 'bold';
  interpretationElement.style.fontSize = '14px';
  interpretationElement.style.marginTop = '10px';
  interpretationElement.style.textAlign = 'center';
  card.appendChild(interpretationElement);
  
  return card;
}

// Function to create a semi-circular gauge
function createSemiCircularGauge(title, value, segments) {
  const container = document.createElement('div');
  container.className = 'semi-circular-gauge';
  container.style.width = '280px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.padding = '10px';
  
  const titleElement = document.createElement('div');
  titleElement.textContent = title;
  titleElement.style.fontWeight = 'bold';
  titleElement.style.marginBottom = '15px';
  titleElement.style.textAlign = 'center';
  container.appendChild(titleElement);

  // Create SVG element for the gauge
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '260');
  svg.setAttribute('height', '140');
  svg.setAttribute('viewBox', '0 0 260 140');
  
  // Get the current segment color based on value
  const getCurrentSegmentColor = () => {
    for (let i = 0; i < segments.length; i++) {
      if (value <= segments[i].value) {
        return segments[i].color;
      }
    }
    return segments[segments.length - 1].color;
  };
  
  // Create the colored segments
  const centerX = 130;
  const centerY = 130;
  const radius = 100;
  
  // Draw arc segments
  let startAngle = -180;
  let cumulativeValue = 0;
  
  segments.forEach((segment, index) => {
    const segmentValue = index === 0 ? segment.value : segment.value - segments[index - 1].value;
    cumulativeValue = segment.value;
    
    // Calculate the end angle for this segment
    const angleRange = 180; // semi-circle is 180 degrees
    const endAngle = startAngle + (segmentValue / 100) * angleRange;
    
    // Create the segment path
    const segmentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Calculate the arc points
    const startX = centerX + radius * Math.cos(startAngle * Math.PI / 180);
    const startY = centerY + radius * Math.sin(startAngle * Math.PI / 180);
    const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
    const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);
    
    // Create the arc path
    const largeArcFlag = (endAngle - startAngle > 180) ? 1 : 0;
    const pathData = [
      `M ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `L ${centerX} ${centerY}`,
      'Z'
    ].join(' ');
    
    segmentPath.setAttribute('d', pathData);
    segmentPath.setAttribute('fill', segment.color);
    segmentPath.setAttribute('stroke', 'white');
    segmentPath.setAttribute('stroke-width', '1');
    
    // Add segments to SVG
    svg.appendChild(segmentPath);
    
    // Add segment labels
    const labelAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius - 20;
    const labelX = centerX + labelRadius * Math.cos(labelAngle * Math.PI / 180);
    const labelY = centerY + labelRadius * Math.sin(labelAngle * Math.PI / 180);
    
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', labelX);
    label.setAttribute('y', labelY);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '10');
    label.setAttribute('fill', 'white');
    label.setAttribute('font-weight', 'bold');
    label.textContent = segment.value;
    svg.appendChild(label);
    
    // Update the start angle for the next segment
    startAngle = endAngle;
  });
  
  // Add the needle
  const needleLength = radius;
  const needleAngle = -180 + (value / 100) * 180;
  const needleEndX = centerX + needleLength * Math.cos(needleAngle * Math.PI / 180);
  const needleEndY = centerY + needleLength * Math.sin(needleAngle * Math.PI / 180);
  
  // Draw needle with arrow shape
  const needlePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const arrowWidth = 6;
  
  const needleAngleRad = needleAngle * Math.PI / 180;
  const perpAngle1 = needleAngleRad + Math.PI / 2;
  const perpAngle2 = needleAngleRad - Math.PI / 2;
  
  const arrowX1 = needleEndX + arrowWidth * Math.cos(perpAngle1);
  const arrowY1 = needleEndY + arrowWidth * Math.sin(perpAngle1);
  const arrowX2 = needleEndX + arrowWidth * Math.cos(perpAngle2);
  const arrowY2 = needleEndY + arrowWidth * Math.sin(perpAngle2);
  
  const needlePathData = [
    `M ${centerX} ${centerY}`,
    `L ${arrowX1} ${arrowY1}`,
    `L ${needleEndX} ${needleEndY}`,
    `L ${arrowX2} ${arrowY2}`,
    'Z'
  ].join(' ');
  
  // needlePath.setAttribute('d', needlePathData);
  // needlePath.setAttribute('fill', '#333');
  // svg.appendChild(needlePath);
  
  // Add center circle
  const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', centerX);
  centerCircle.setAttribute('cy', centerY);
  centerCircle.setAttribute('r', '8');
  centerCircle.setAttribute('fill', '#333');
  centerCircle.setAttribute('stroke', 'white');
  centerCircle.setAttribute('stroke-width', '2');
  svg.appendChild(centerCircle);
  
  // Add the current value text
  const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  valueText.setAttribute('x', centerX);
  valueText.setAttribute('y', centerY - 30);
  valueText.setAttribute('text-anchor', 'middle');
  valueText.setAttribute('font-size', '22');
  valueText.setAttribute('font-weight', 'bold');
  valueText.setAttribute('fill', '#000000');
  valueText.textContent = value.toFixed(1);
  svg.appendChild(valueText);
  
  container.appendChild(svg);
  
  // Add the legend
  const legend = document.createElement('div');
  legend.style.display = 'flex';
  legend.style.flexWrap = 'wrap';
  legend.style.justifyContent = 'flex-start';
  legend.style.marginTop = '5px';
  
  segments.forEach(segment => {
    const legendItem = document.createElement('div');
    legendItem.style.display = 'flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.margin = '5px 10px';
    if (segment.label === translate('Green')) {
  legendItem.style.width = '29%';
}
    
    const colorBox = document.createElement('div');
    colorBox.style.width = '12px';
    colorBox.style.height = '12px';
    colorBox.style.backgroundColor = segment.color;
    colorBox.style.marginRight = '5px';
    colorBox.style.borderRadius = '2px';
    legendItem.appendChild(colorBox);
    
const labelText = document.createElement('div'); // changed from <span> to <div>
labelText.textContent = segment.label;
labelText.style.fontSize = '12px';
labelText.style.textAlign = 'left';
labelText.style.flex = '1'; // allows left alignment to take effect
legendItem.appendChild(labelText);


    
    legend.appendChild(legendItem);
  });
  
  container.appendChild(legend);
  
  return container;
}

// Function to create a horizontal bar chart
function createHorizontalBar(label, value, maxValue, color) {
  const container = document.createElement('div');
  container.className = 'horizontal-bar';
  container.style.marginBottom = '15px';
  
  // Label container
  const labelContainer = document.createElement('div');
  labelContainer.style.display = 'flex';
  labelContainer.style.justifyContent = 'space-between';
  labelContainer.style.flexWrap = 'wrap';
  labelContainer.style.marginBottom = '4px';
  
  // Label
  const labelElement = document.createElement('div');
  labelElement.textContent = label;
  labelElement.style.fontWeight = 'bold';
  labelElement.style.minWidth   = '120px';
  labelContainer.appendChild(labelElement);
  
  // Value
  const valueElement = document.createElement('div');
  valueElement.textContent = value.toFixed(1);
  valueElement.style.fontWeight = 'bold';
  valueElement.style.color = color;
  labelContainer.appendChild(valueElement);
  
  container.appendChild(labelContainer);
  
  // Bar container
  const barContainer = document.createElement('div');
  barContainer.style.height = '12px';
  barContainer.style.backgroundColor = '#e6e6e6';
  barContainer.style.borderRadius = '6px';
  barContainer.style.overflow = 'hidden';
  
  // Bar fill
  const barFill = document.createElement('div');
  barFill.style.height = '100%';
  barFill.style.width = `${(value / maxValue) * 100}%`;
  barFill.style.backgroundColor = color;
  barFill.style.borderRadius = '6px';
  
  barContainer.appendChild(barFill);
  container.appendChild(barContainer);
  
  return container;
}

// Function to create a radar chart
function createRadarChart(dataPoints) {
  const container = document.createElement('div');
  container.className = 'radar-chart';
  container.style.width = '100%';
  container.style.height = '300px';
  container.style.position = 'relative';
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'radarChartSvg'; // Add ID for direct access
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '-10 -10 220 220');
  
  // Center point of the radar
  const centerX = 100;
  const centerY = 100;
  const radius = 90;  // Radius of the radar
  
  // Function to convert polar coordinates to cartesian
  const polarToCartesian = (angle, distance) => {
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: centerX + (distance * Math.cos(radians)),
      y: centerY + (distance * Math.sin(radians))
    };
  };
  
  // Draw the radar background (concentric circles and spokes)
  const addRadarBackground = () => {
    // Group for background elements
    const backgroundGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    backgroundGroup.setAttribute('class', 'radar-background');
    backgroundGroup.setAttribute('fill', 'none');
    backgroundGroup.setAttribute('stroke', '#ddd');
    backgroundGroup.setAttribute('stroke-width', '1');
    
    // Add concentric circles (25%, 50%, 75%, 100%)
    [25, 50, 75, 100].forEach(level => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', centerX);
      circle.setAttribute('cy', centerY);
      circle.setAttribute('r', radius * (level / 100));
      backgroundGroup.appendChild(circle);
      
      // Add level text
      const levelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      levelText.setAttribute('x', centerX);
      levelText.setAttribute('y', centerY - radius * (level / 100) - 2);
      levelText.setAttribute('text-anchor', 'middle');
      levelText.setAttribute('font-size', '8');
      levelText.setAttribute('fill', '#999');
      levelText.textContent = level;
      backgroundGroup.appendChild(levelText);
    });
    
    // Add spokes (lines from center to each axis point)
    const numPoints = dataPoints.length;
    const angleStep = 360 / numPoints;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const point = polarToCartesian(angle, radius);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX);
      line.setAttribute('y1', centerY);
      line.setAttribute('x2', point.x);
      line.setAttribute('y2', point.y);
      backgroundGroup.appendChild(line);
      
      // Add axis labels
      const labelPoint = polarToCartesian(angle, radius + 10);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', labelPoint.x);
      label.setAttribute('y', labelPoint.y);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', '#333');
      label.setAttribute('font-weight', 'bold');
      label.textContent = dataPoints[i].name;
      backgroundGroup.appendChild(label);
    }
    
    svg.appendChild(backgroundGroup);
  };
  
  // Draw the data polygon
  const addDataPolygon = () => {
    const numPoints = dataPoints.length;
    const angleStep = 360 / numPoints;
    
    // Create polygon points
    let polygonPoints = '';
    
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const value = dataPoints[i].value;
      const distance = (value / 100) * radius;
      const point = polarToCartesian(angle, distance);
      
      polygonPoints += `${point.x},${point.y} `;
    }
    
    // Create the data polygon
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', polygonPoints);
    polygon.setAttribute('fill', 'rgba(70, 130, 180, 0.2)');
    polygon.setAttribute('stroke', 'rgba(70, 130, 180, 0.8)');
    polygon.setAttribute('stroke-width', '2');
    svg.appendChild(polygon);
    
    // Add data points
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep;
      const value = dataPoints[i].value;
      const distance = (value / 100) * radius;
      const point = polarToCartesian(angle, distance);
      
      // Create the point
      const pointCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pointCircle.setAttribute('cx', point.x);
      pointCircle.setAttribute('cy', point.y);
      pointCircle.setAttribute('r', '4');
      pointCircle.setAttribute('fill', dataPoints[i].color);
      pointCircle.setAttribute('stroke', 'white');
      pointCircle.setAttribute('stroke-width', '1');
      svg.appendChild(pointCircle);
      
      // Add value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', point.x);
      valueText.setAttribute('y', point.y - 7);
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '10');
      valueText.setAttribute('font-weight', 'bold');
      valueText.setAttribute('fill', dataPoints[i].color);
      valueText.textContent = value.toFixed(1);
      svg.appendChild(valueText);
    }
  };
  
  // Build the radar chart
  addRadarBackground();
  addDataPolygon();
  
  container.appendChild(svg);
  return container;
}

function createScoresSection(scores) {
  const section = document.createElement('div');
  section.className = 'scores-section';
  section.style.marginBottom = '30px';
  
  // Create main table for scores
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '20px';
  
  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.style.backgroundColor = '#f5f5f5';
  
  const categoryHeader = document.createElement('th');
  categoryHeader.textContent = translate('Category');
  categoryHeader.style.padding = '12px 15px';
  categoryHeader.style.textAlign = 'left';
  categoryHeader.style.borderBottom = '2px solid #ddd';
  headerRow.appendChild(categoryHeader);
  
  const scoreHeader = document.createElement('th');
  scoreHeader.textContent = translate('Score');
  scoreHeader.style.padding = '12px 15px';
  scoreHeader.style.textAlign = 'right';
  scoreHeader.style.borderBottom = '2px solid #ddd';
  headerRow.appendChild(scoreHeader);
  
  const weightHeader = document.createElement('th');
  weightHeader.textContent = translate('Weight');
  weightHeader.style.padding = '12px 15px';
  weightHeader.style.textAlign = 'right';
  weightHeader.style.borderBottom = '2px solid #ddd';
  headerRow.appendChild(weightHeader);
  
  // Interpretation column removed as requested
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Create table body
  const tbody = document.createElement('tbody');
  
  // Helper to get interpretation text based on score
  const getEIInterpretation = (score) => {
    if (score >= 90) return translate('Ideal Green Method');
    if (score >= 85) return translate('Environmentally sustainable with Minimal Impact');
    if (score >= 65) return translate('Acceptable green');
    return translate('Unsustainable method with Serious Impact');
  };
  
  const getPracticalityInterpretation = (score) => {
    if (score >= 75) return translate('Excellent');
    if (score >= 50) return translate('Acceptable');
    return translate('Impractical');
  };
  
  const getTotalInterpretation = (score) => {
    if (score >= 75) return translate('Highly Recommended');
    if (score >= 50) return translate('Recommended');
    if (score >= 25) return translate('Needs Improvement');
    return translate('Not Recommended');
  };
  
  // Helper to get color based on score
  const getEIColor = (score) => {
    if (score >= 90) return '#2E7D32'; // Dark Green
    if (score >= 85) return '#4CAF50'; // Light Green
    if (score >= 65) return '#FFB300'; // Yellow/Amber
    return '#C62828'; // Red
  };
  
  const getPracticalityColor = (score) => {
    if (score >= 75) return '#77008f'; // Dark Blue
    if (score >= 50) return '#7C3AED'; // Light Blue
    return '#C084FC'; // Magenta
  };
  
  // Add row for Environmental Index (EI)
  tbody.appendChild(createScoreRow(
    translate('Environmental Index (EI)'), 
    scores.eiIndex, 
    '50%',
    getEIInterpretation(scores.eiIndex),
    getEIColor(scores.eiIndex)
  ));
  
  // Add row for Practicality
  tbody.appendChild(createScoreRow(
    translate('Performance Practicality Index (PPI)'), 
    scores.practicality, 
    '50%',
    getPracticalityInterpretation(scores.practicality),
    getPracticalityColor(scores.practicality)
  ));
  
  // Add row for total score
  const totalRow = createScoreRow(
    translate('TOTAL SCORE'), 
    scores.total, 
    '100%',
    getTotalInterpretation(scores.total),
    getEIColor(scores.total)
  );
  totalRow.style.backgroundColor = '#f9f9f9';
  totalRow.style.fontWeight = 'bold';
  totalRow.style.fontSize = '16px';
  tbody.appendChild(totalRow);
  
  // Add component scores if available
  if (scores.samplePrep) {
    tbody.appendChild(createScoreRow(
      translate('Sample Preparation'), 
      scores.samplePrep, 
      '-',
      getEIInterpretation(scores.samplePrep),
      getEIColor(scores.samplePrep)
    ));
  }
  
  if (scores.instrumentation) {
    tbody.appendChild(createScoreRow(
      translate('Instrumentation'), 
      scores.instrumentation, 
      '-',
      getEIInterpretation(scores.instrumentation),
      getEIColor(scores.instrumentation)
    ));
  }
  
  if (scores.reagent) {
    tbody.appendChild(createScoreRow(
      translate('Reagents'), 
      scores.reagent, 
      '-',
      getEIInterpretation(scores.reagent),
      getEIColor(scores.reagent)
    ));
  }
  
  if (scores.waste) {
    tbody.appendChild(createScoreRow(
      translate('Waste'), 
      scores.waste, 
      '-',
      getEIInterpretation(scores.waste),
      getEIColor(scores.waste)
    ));
  }
  
  table.appendChild(tbody);
  section.appendChild(table);
  
  return section;
}

function createScoreRow(label, score, weight, interpretation, color) {
  const row = document.createElement('tr');
  row.style.borderBottom = '1px solid #ddd';
  
  const labelCell = document.createElement('td');
  labelCell.textContent = label;
  labelCell.style.padding = '12px 15px';
  labelCell.style.fontWeight = 'bold';
  row.appendChild(labelCell);
  
  const scoreCell = document.createElement('td');
  scoreCell.textContent = score.toFixed(1);
  scoreCell.style.padding = '12px 15px';
  scoreCell.style.textAlign = 'right';
  scoreCell.style.fontWeight = 'bold';
  scoreCell.style.color = '#000000'; // Changed to black as requested
  row.appendChild(scoreCell);
  
  const weightCell = document.createElement('td');
  weightCell.textContent = weight;
  weightCell.style.padding = '12px 15px';
  weightCell.style.textAlign = 'right';
  row.appendChild(weightCell);
  
  // Interpretation column removed as requested
  
  return row;
}

// Function to create a dual-column histogram
function createDualColumnHistogram(data) {
  const container = document.createElement('div');
  container.className = 'dual-column-histogram';
  container.style.width = '100%';
  container.style.height = '250px';
  container.style.position = 'relative';
  container.style.marginTop = '10px';
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'dualColumnHistogramSvg'; // Add ID for direct access
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 400 250');
  
  // Draw background grid lines and labels
  const addGrid = () => {
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('class', 'grid');
    gridGroup.setAttribute('stroke', '#ddd');
    gridGroup.setAttribute('stroke-width', '1');
    
    // Horizontal grid lines (25%, 50%, 75%, 100%)
    [0, 25, 50, 75, 100].forEach(level => {
      const y = 200 - (level / 100) * 150;
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '50');
      line.setAttribute('y1', y);
      line.setAttribute('x2', '350');
      line.setAttribute('y2', y);
      line.setAttribute('stroke-dasharray', level === 0 ? 'none' : '3,3');
      gridGroup.appendChild(line);
      
      // Add label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '40');
      label.setAttribute('y', y + 5);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', '#666');
      label.textContent = level;
      gridGroup.appendChild(label);
    });
    
    // Y-axis label
    const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yAxisLabel.setAttribute('x', '15');
    yAxisLabel.setAttribute('y', '125');
    yAxisLabel.setAttribute('text-anchor', 'middle');
    yAxisLabel.setAttribute('font-size', '12');
    yAxisLabel.setAttribute('fill', '#333');
    yAxisLabel.setAttribute('transform', 'rotate(-90, 15, 125)');
    yAxisLabel.textContent = 'Score';
    gridGroup.appendChild(yAxisLabel);
    
    svg.appendChild(gridGroup);
  };
  
  // Add the data columns
  const addColumns = () => {
    const columnWidth = 60;
    const gap = 60;
    let x = 100;
    
    data.forEach(item => {
      // Column
      const column = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      column.setAttribute('x', x);
      column.setAttribute('y', 200 - (item.value / 100) * 150);
      column.setAttribute('width', columnWidth);
      column.setAttribute('height', (item.value / 100) * 150);
      column.setAttribute('fill', item.color);
      column.setAttribute('rx', '4');
      column.setAttribute('ry', '4');
      svg.appendChild(column);
      
      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x + columnWidth / 2);
      label.setAttribute('y', '220');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '12');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('fill', '#333');
      label.textContent = item.label;
      svg.appendChild(label);
      
      // Weight label
      if (item.weight) {
        const weightLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        weightLabel.setAttribute('x', x + columnWidth / 2);
        weightLabel.setAttribute('y', '235');
        weightLabel.setAttribute('text-anchor', 'middle');
        weightLabel.setAttribute('font-size', '10');
        weightLabel.setAttribute('fill', '#666');
        weightLabel.textContent = item.weight;
        svg.appendChild(weightLabel);
      }
      
      // Value on top of column
      const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueLabel.setAttribute('x', x + columnWidth / 2);
      valueLabel.setAttribute('y', 200 - (item.value / 100) * 150 - 5);
      valueLabel.setAttribute('text-anchor', 'middle');
      valueLabel.setAttribute('font-size', '12');
      valueLabel.setAttribute('font-weight', 'bold');
      valueLabel.setAttribute('fill', item.color);
      valueLabel.textContent = item.value.toFixed(1);
      svg.appendChild(valueLabel);
      
      x += columnWidth + gap;
    });
  };
  
  // Draw background pattern
  const addPattern = () => {
    // Create pattern definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'grid-pattern');
    pattern.setAttribute('width', '10');
    pattern.setAttribute('height', '10');
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const patternPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    patternPath.setAttribute('d', 'M 10 0 L 0 0 0 10');
    patternPath.setAttribute('fill', 'none');
    patternPath.setAttribute('stroke', '#f5f5f5');
    patternPath.setAttribute('stroke-width', '1');
    
    pattern.appendChild(patternPath);
    defs.appendChild(pattern);
    
    // Add background with pattern
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('x', '50');
    background.setAttribute('y', '50');
    background.setAttribute('width', '300');
    background.setAttribute('height', '150');
    background.setAttribute('fill', 'url(#grid-pattern)');
    
    svg.appendChild(defs);
    svg.appendChild(background);
  };
  
  // Build the histogram
  addPattern();
  addGrid();
  addColumns();
  
  container.appendChild(svg);
  return container;
}

function createInterpretationGuide(scores) {
  const container = document.createElement('div');
  container.className = 'interpretation-guide';
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';
  container.style.flexWrap = 'wrap';
  container.style.gap = '20px';
  container.style.marginTop = '20px';
  
  // Environmental Index (EI) interpretation - updated with new ranges
  const eiGuide = document.createElement('div');
  eiGuide.className = 'guide-section';
  eiGuide.style.flex = '1';
  eiGuide.style.minWidth = '300px';
  eiGuide.style.backgroundColor = '#f9f9f9';
  eiGuide.style.padding = '15px';
  eiGuide.style.borderRadius = '8px';
  eiGuide.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  
  const eiHeader = document.createElement('h3');
  eiHeader.textContent = translate('Environmental Index (EI) Interpretation');
  eiHeader.style.marginTop = '0';
  eiHeader.style.marginBottom = '10px';
  eiHeader.style.fontSize = '16px';
  eiHeader.style.borderBottom = '1px solid #ddd';
  eiHeader.style.paddingBottom = '5px';
  eiGuide.appendChild(eiHeader);
  
  const eiScales = [
    { range: '85-100', desc: translate('Ideal green'), color: '#2E7D32' },
    { range: '70-84', desc: translate('Green Method'), color: '#4CAF50' },
    { range: '55-69', desc: translate('Acceptable green'), color: '#FFB300' },
    { range: '<55', desc: translate('Unsustainable Non-Green Method with Serious Impact'), color: '#C62828' }
  ];
  
  const eiScaleList = createScaleList(eiScales, scores.eiIndex);
  eiGuide.appendChild(eiScaleList);
  
  // Practicality Scale interpretation
  const practicalityGuide = document.createElement('div');
  practicalityGuide.className = 'guide-section';
  practicalityGuide.style.flex = '1';
  practicalityGuide.style.minWidth = '300px';
  practicalityGuide.style.backgroundColor = '#f9f9f9';
  practicalityGuide.style.padding = '15px';
  practicalityGuide.style.borderRadius = '8px';
  practicalityGuide.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  
  const practicalityHeader = document.createElement('h3');
  practicalityHeader.textContent = translate('Performance Practicality Index (PPI) Interpretation');
  practicalityHeader.style.marginTop = '0';
  practicalityHeader.style.marginBottom = '10px';
  practicalityHeader.style.fontSize = '16px';
  practicalityHeader.style.borderBottom = '1px solid #ddd';
  practicalityHeader.style.paddingBottom = '5px';
  practicalityGuide.appendChild(practicalityHeader);
  
  const practicalityScales = [
    { range: '75-100', desc: translate('Excellent'), color: '#77008f' },
    { range: '50-74', desc: translate('Acceptable'), color: '#7C3AED' },
    { range: '<50', desc: translate('Impractical'), color: '#C084FC' }
  ];
  
  const practicalityScaleList = createScaleList(practicalityScales, scores.practicality);
  practicalityGuide.appendChild(practicalityScaleList);
  
  container.appendChild(eiGuide);
  container.appendChild(practicalityGuide);
  
  return container;
}

function createScaleList(scales, currentScore) {
  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = '0';
  list.style.margin = '0';
  
  // Helper to check if this range applies to the current score
  const isInRange = (range, score) => {
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(Number);
      return score >= min && score <= max;
    } else if (range.startsWith('<')) {
      return score < Number(range.substring(1));
    } else if (range.startsWith('>')) {
      return score > Number(range.substring(1));
    }
    return false;
  };
  
  scales.forEach(scale => {
    const item = document.createElement('li');
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.padding = '8px 0';
    item.style.borderBottom = '1px dotted #ddd';
    
    // Active state highlighting
    const isActive = isInRange(scale.range, currentScore);
    if (isActive) {
      item.style.backgroundColor = `${scale.color}22`;
      item.style.padding = '8px';
      item.style.borderRadius = '4px';
      item.style.fontWeight = 'bold';
    }
    
    // Color indicator
    const colorIndicator = document.createElement('span');
    colorIndicator.style.display = 'inline-block';
    colorIndicator.style.width = '12px';
    colorIndicator.style.height = '12px';
    colorIndicator.style.backgroundColor = scale.color;
    colorIndicator.style.borderRadius = '50%';
    colorIndicator.style.marginRight = '8px';
    item.appendChild(colorIndicator);
    
    // Range text
    const rangeText = document.createElement('span');
    rangeText.textContent = scale.range;
    rangeText.style.minWidth = '50px';
    rangeText.style.marginRight = '8px';
    rangeText.style.fontWeight = isActive ? 'bold' : 'normal';
    item.appendChild(rangeText);
    
    // Description text
    const descText = document.createElement('span');
    descText.textContent = scale.desc;
    descText.style.flex = '1';
    item.appendChild(descText);
    
    // Checkmark for active item
    if (isActive) {
      const checkmark = document.createElement('span');
      checkmark.textContent = '✓';
      checkmark.style.marginLeft = '5px';
      checkmark.style.color = scale.color;
      checkmark.style.fontWeight = 'bold';
      item.appendChild(checkmark);
    }
    
    list.appendChild(item);
  });
  
  return list;
}

// Function to download a chart SVG as a PNG image
function downloadChartAsPNG(chartId, filename) {
  // First try to find the direct SVG with its specific ID
  let svgElement = document.getElementById(chartId + 'Svg');
  
  // If not found, try the container element
  if (!svgElement) {
    const containerElement = document.getElementById(chartId);
    if (containerElement) {
      svgElement = containerElement.querySelector('svg');
    }
  }
  
  // If still not found, try any SVG within the named container
  if (!svgElement) {
    const elements = document.querySelectorAll(`#${chartId} svg, .${chartId} svg, [data-chart-id="${chartId}"] svg`);
    if (elements.length > 0) {
      svgElement = elements[0];
    }
  }
  
  if (!svgElement) {
    console.error(`Chart SVG with ID ${chartId} or related not found`);
    alert(translate('Could not find the chart to download. Please try again.'));
    return;
  }
  
  try {
    console.log('Found SVG to download:', chartId);
    
    // Create a new high-resolution SVG for download only (don't modify the displayed one)
    const downloadSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    // Copy the SVG content but with fixed high-resolution dimensions
    // Different settings for each chart type to optimize quality
    if (chartId === 'radarChart') {
      downloadSvg.setAttribute('width', '1200');
      downloadSvg.setAttribute('height', '1200');
      downloadSvg.setAttribute('viewBox', '-10 -10 220 220');
    } else {
      downloadSvg.setAttribute('width', '1600');
      downloadSvg.setAttribute('height', '1000');
      downloadSvg.setAttribute('viewBox', '0 0 400 250');
    }
    
    // Copy all child nodes from the original SVG
    const svgChildren = Array.from(svgElement.childNodes);
    for (const child of svgChildren) {
      downloadSvg.appendChild(child.cloneNode(true));
    }
    
    // Add white background for cleaner image
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'white');
    downloadSvg.insertBefore(background, downloadSvg.firstChild);
    
    // Convert to data URL
    const svgData = new XMLSerializer().serializeToString(downloadSvg);
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create a canvas with the same high-resolution dimensions
    const canvas = document.createElement('canvas');
    const width = parseFloat(downloadSvg.getAttribute('width'));
    const height = parseFloat(downloadSvg.getAttribute('height'));
    
    // No need for scaling factor since we're already using high-resolution dimensions
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the SVG to the canvas
    const img = new Image();
    
    img.onload = function() {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(svgUrl);
      
      // Convert to PNG and download with high quality
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png', 1.0); // 1.0 = highest quality
    };
    
    img.src = svgUrl;
  } catch (error) {
    console.error('Error downloading chart as PNG:', error);
    alert(translate('Failed to download the chart. Please try again.'));
  }
}

function createErrorMessage(message) {
  const container = document.createElement('div');
  container.className = 'error-message';
  container.style.padding = '20px';
  container.style.backgroundColor = '#fff9fa';
  container.style.border = '1px solid #dc3545';
  container.style.borderRadius = '8px';
  container.style.color = '#dc3545';
  container.style.margin = '20px 0';
  container.style.textAlign = 'center';
  
  const icon = document.createElement('div');
  icon.innerHTML = '⚠️';
  icon.style.fontSize = '28px';
  icon.style.marginBottom = '10px';
  container.appendChild(icon);
  
  const text = document.createElement('p');
  text.textContent = message || translate('Error displaying results');
  text.style.margin = '0';
  text.style.fontSize = '16px';
  container.appendChild(text);
  
  const helpText = document.createElement('p');
  helpText.textContent = translate('Please try filling out all fields and try again.');
  helpText.style.marginTop = '10px';
  helpText.style.fontSize = '14px';
  container.appendChild(helpText);
  
  return container;
}