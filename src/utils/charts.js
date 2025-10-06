// ─── src/utils/charts.js ───

// Helper to pick a color based on “EI‐style” numerical score:
export function getEIColor(score) {
  if (score >= 85) return '#2E7D32'; // Dark Green
  if (score >= 70) return '#4CAF50'; // Green
  if (score >= 55) return '#FFB300'; // Yellow
  return '#C62828';                  // Red
}

export function getPracticalityColor(score) {
  if (score >= 75)      return '#77008f';   // 🔵 Excellent Practicality
  else if (score >= 50) return '#7C3AED';  // 🔷 Acceptable Practicality
  else                   return '#C084FC';    // 🟣 Impractical
}
// A tiny horizontal progress‐bar helper:
export function createHorizontalProgressBar(score, maxScore, color, label) {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'horizontal-progress-container';
  progressContainer.style.width = '100%';
  progressContainer.style.marginBottom = '15px';

  const labelDiv = document.createElement('div');
  labelDiv.className = 'progress-label';
  labelDiv.style.display = 'flex';
  labelDiv.style.justifyContent = 'space-between';
  labelDiv.style.marginBottom = '5px';

  const nameSpan = document.createElement('span');
  nameSpan.textContent = label;
  nameSpan.style.fontWeight = 'bold';

  const valueSpan = document.createElement('span');
  valueSpan.textContent = score.toFixed(1);
  valueSpan.style.color = color;
  valueSpan.style.fontWeight = 'bold';

  labelDiv.appendChild(nameSpan);
  labelDiv.appendChild(valueSpan);
  progressContainer.appendChild(labelDiv);

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar-bg';
  progressBar.style.height = '10px';
  progressBar.style.width = '100%';
  progressBar.style.backgroundColor = '#e6e6e6';
  progressBar.style.borderRadius = '5px';            // ← pill‑shaped background
  progressBar.style.overflow = 'hidden';
  // add subtle inset shadow for depth
  progressBar.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)';

  const progressFill = document.createElement('div');
  progressFill.className = 'progress-bar-fill';
  progressFill.style.height = '100%';
  progressFill.style.width = `${(score / maxScore) * 100}%`;
  progressFill.style.backgroundColor = color;
  // match fill radius to background for perfectly smooth edges
  progressFill.style.borderRadius = '10px';
  // add gentle highlight on top
  progressFill.style.boxShadow = 'inset 0 -1px 2px rgba(255, 255, 255, 0.8)';
  // smooth animating change if value updates
  progressFill.style.transition = 'width 0.4s ease';

  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressBar);

  return progressContainer;
}

// Coxcomb Chart – PPI occupies 50 % of circle.
// Label placement now **static via constants** – edit the four values below to adjust.
// Per‑slice overrides (labelDX / labelDY) still work if you need fine tweaks.

// >>> STATIC OFFSETS <<<
const PPI_LABEL_DX   = -20;   // Practicality X shift  (‑ = left, + = right)
const PPI_LABEL_DY   = -14;   // Practicality Y shift  (‑ = up,  + = down)
const OTHER_LABEL_DX = 20;     // All other labels X shift
const OTHER_LABEL_DY = -14;   // All other labels Y shift

/**
 * @param {Array} dataPoints – [{name, value, color, labelDX?, labelDY?}, …]
 */
export function createCoxcombChart(dataPoints) {
  if (!Array.isArray(dataPoints)) {
    dataPoints = [
      { name: 'Sample Preparation', value: dataPoints.samplePrep,      color: getEIColor(dataPoints.samplePrep) },
      { name: 'Instrumentation',    value: dataPoints.instrumentation, color: getEIColor(dataPoints.instrumentation) },
      { name: 'Reagents',           value: dataPoints.reagent,         color: getEIColor(dataPoints.reagent) },
      { name: 'Waste',              value: dataPoints.waste,           color: getEIColor(dataPoints.waste) },
      { name: 'PPI',       value: dataPoints.practicality,    color: getPracticalityColor(dataPoints.practicality) }
    ];
  }

  const container = document.createElement('div');
  container.className = 'coxcomb-chart-container';
  container.style.position = 'relative';
  // ► To make the chart render larger or smaller on your page,
  //    you can set container.style.width/height here,
  //    or override .coxcomb-chart-container in your CSS.

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg   = document.createElementNS(svgNS, 'svg');

  // ► To change the internal drawing size, adjust viewBox and these constants:
  svg.setAttribute('viewBox', '0 0 380 380'); // ← change these numbers
  svg.setAttribute('width', '100%');
  svg.setAttribute('height','100%');

  const centerX   = 187;  // ← if you change viewBox, update centerX = viewBoxWidth/2
  const centerY   = 187;  // ← same for centerY
  const maxRadius = 112;  // ← controls the maximum slice radius

  // — defs for per‑slice drop‑shadow
  const defs = document.createElementNS(svgNS, 'defs');
  defs.innerHTML = `
    <filter id="slice-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.25)"/>
    </filter>`;
  svg.appendChild(defs);

  // Background rings
  [25, 50, 75, 100].forEach(level => {
    const r = (level / 100) * maxRadius;
    const ring = document.createElementNS(svgNS, 'circle');
    ring.setAttribute('cx', centerX);
    ring.setAttribute('cy', centerY);
    ring.setAttribute('r', r);
    ring.setAttribute('stroke', '#e0e0e0');
    ring.setAttribute('stroke-width', 1);
    ring.setAttribute('fill', 'none');
    svg.appendChild(ring);

    const lbl = document.createElementNS(svgNS, 'text');
    lbl.setAttribute('x', centerX + 4);
    lbl.setAttribute('y', centerY - r + 12);
    lbl.setAttribute('font-size', 9);
    lbl.setAttribute('fill', '#999');
    lbl.textContent = level;
    svg.appendChild(lbl);
  });

  // Angle allocation: PPI slice = 50%
  const othersCnt = dataPoints.length - 1;
  const ppiUnits  = othersCnt;
  const unitAngle = (2 * Math.PI) / (ppiUnits + othersCnt);

  let current = -Math.PI / 2;
  dataPoints.forEach(pt => {
    const isPPI  = /practicality|ppi/i.test(pt.name);
    const sweep  = isPPI ? ppiUnits * unitAngle : unitAngle;
    const radius = (pt.value / 100) * maxRadius;

    const start = current;
    const end   = current + sweep;
    const x1 = centerX + Math.cos(start) * radius;
    const y1 = centerY + Math.sin(start) * radius;
    const x2 = centerX + Math.cos(end)   * radius;
    const y2 = centerY + Math.sin(end)   * radius;
    const largeArc = sweep > Math.PI ? 1 : 0;

    // slice with shadow + thick, rounded white border
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d',
      `M ${centerX} ${centerY}` +
      ` L ${x1} ${y1}` +
      ` A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}` +
      ' Z'
    );
    path.setAttribute('fill', pt.color);
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', '3');              // ← thicker border
    path.setAttribute('stroke-linejoin', 'round');       // ← smooth joins
    path.setAttribute('stroke-linecap', 'round');        // ← smooth caps
    path.setAttribute('filter', 'url(#slice-shadow)');
    svg.appendChild(path);

    // Mid‑angle helpers
    const mid    = (start + end) / 2;
    const cosMid = Math.cos(mid);
    const sinMid = Math.sin(mid);

    // Dot
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('cx', centerX + cosMid * radius);
    dot.setAttribute('cy', centerY + sinMid * radius);
    dot.setAttribute('r', 6);
    dot.setAttribute('fill', '#fff');
    dot.setAttribute('stroke', pt.color);
    dot.setAttribute('stroke-width', 3);
    svg.appendChild(dot);

    // Score
    const scoreDist = radius + 24;
    const sx = centerX + cosMid * scoreDist;
    const sy = centerY + sinMid * scoreDist;
    const score = document.createElementNS(svgNS, 'text');
    score.setAttribute('x', sx);
    score.setAttribute('y', sy);
    score.setAttribute('text-anchor', 'middle');
    score.setAttribute('font-size', 12);
    score.setAttribute('font-weight', 700);
    score.setAttribute('fill', pt.color);
    score.textContent = pt.value.toFixed(1);
    svg.appendChild(score);

    // Label offsets
    let dx = isPPI ? PPI_LABEL_DX : OTHER_LABEL_DX;
    let dy = isPPI ? PPI_LABEL_DY : OTHER_LABEL_DY;
    if (pt.labelDX !== undefined) dx = pt.labelDX;
    if (pt.labelDY !== undefined) dy = pt.labelDY;

    // Category label
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', sx + dx);
    label.setAttribute('y', sy + dy);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', 13);
    label.setAttribute('font-weight', 600);
    label.setAttribute('fill', '#333');
    label.textContent = pt.name;
    svg.appendChild(label);

    current = end;
  });

  // Center mean circle + text
  // Center mean circle + text
// ⚠️ We want a fixed denominator of 2 instead of the number of slices
// Center mean circle + text  — EPPI = 50% EI + 50% PPI
const eiValues = dataPoints.filter(p => !/ppi|practicality/i.test(p.name));  // the 4 EI axes
const ei       = eiValues.reduce((sum, p) => sum + p.value, 0) / eiValues.length;  // EI average
const ppi      = (dataPoints.find(p => /ppi|practicality/i.test(p.name)) || {}).value || 0; // PPI slice
const mean     = (ei * 0.5) + (ppi * 0.5);  // EPPI score shown in the chart centre


  const cc = document.createElementNS(svgNS, 'circle');
  cc.setAttribute('cx', centerX);
  cc.setAttribute('cy', centerY);
  cc.setAttribute('r', maxRadius * 0.15);
  cc.setAttribute('fill', '#fafafa');
  svg.appendChild(cc);

  const mt = document.createElementNS(svgNS, 'text');
  mt.setAttribute('x', centerX);
  mt.setAttribute('y', centerY + 4);
  mt.setAttribute('text-anchor', 'middle');
  mt.setAttribute('font-size', (maxRadius * 0.10).toFixed(0));
  mt.setAttribute('font-weight', 700);
  mt.setAttribute('fill', '#000');
  mt.textContent = mean.toFixed(1);
  svg.appendChild(mt);

  container.appendChild(svg);
  return container;
}


