import { translate } from '../../utils/i18n.js';
import { calculateInstrumentationScore } from '../../utils/calculations.js';
import {
  getEIColor,
  getPracticalityColor,   // ← add this
  createHorizontalProgressBar,
  createCoxcombChart
} from '../../utils/charts.js';
// ←── You must define makeCollapsible here, just like you did in SamplePrep:
function makeCollapsible(headerEl, contentEl) {
  headerEl.style.cursor = 'pointer';
  contentEl.style.display = 'none';
  headerEl.addEventListener('click', () => {
    if (contentEl.style.display === 'none') {
      contentEl.style.display = '';
    } else {
      contentEl.style.display = 'none';
    }
  });
}

export function InstrumentationForm(state, onChange, scores) {
  const form = document.createElement('div');
  form.className = 'form-section card instrumentation-card';
  
  const title = document.createElement('h3');
  title.textContent = translate('Instrumentation');
  form.appendChild(title);
  
   // Info card with detailed explanation
  const infoCard = document.createElement('div');
  infoCard.className = 'info-card info-card-instrumentation';

  const infoCardTitle = document.createElement('div');
  infoCardTitle.className = 'info-card-title';
  // — add this to mark it as the clickable header:
  infoCardTitle.classList.add('collapsible-title');
  infoCardTitle.textContent = translate('About Instrumentation');
  infoCard.appendChild(infoCardTitle);

  const infoCardContent = document.createElement('div');
  infoCardContent.className = 'info-card-content';
  infoCardContent.innerHTML = `
    <p>${translate(
      'This page helps you calculate the Instrumentation Score for your analytical method. The score evaluates the following parameters:'
    )}</p>
    <ol>
      <li>${translate('Energy Consumption')}</li>
      <li>${translate('Other factors (Emission of Vapors, Automation, Miniaturization, etc)')}</li>
    </ol>
    <p>${translate(
      'Please fill in the information below to calculate your Instrumentation Score.'
    )}</p>
    <p><strong>${translate('Examples of energy consumption:')}</strong></p>
    <ul>
      <li>${translate('0 kWh per sample: Visual tests, physical measurements without instruments')}</li>
      <li>${translate('≤0.1 kWh per sample: Spectrophotometers, simple electrochemical methods')}</li>
      <li>${translate('≤1.5 kWh per sample: HPLC, GC, simple MS systems')}</li>
      <li>${translate('≥1.5 kWh per sample: HPLC-MS/MS, ICP-MS, other high-energy instruments')}</li>
    </ul>
  `;
  infoCard.appendChild(infoCardContent);

  // — call makeCollapsible right here, before appending to the form:
  makeCollapsible(infoCardTitle, infoCardContent);

  // — now append the entire infoCard to the form
  form.appendChild(infoCard);

  
  // Energy consumption section
  const energySection = document.createElement('div');
  energySection.className = 'form-section energy-consumption-section';
  
  const energyGroup = createFormGroup(
    translate('Energy Consumption'),
    'energy',
    [
      { value: 'non', label: translate('Non-instrumental methods (0 kWh)'), score: '100' },
      { value: 'low', label: translate('≤0.1 kWh per sample'), score: '95' },
      { value: 'moderate', label: translate('≤1.5 kWh per sample'), score: '85' },
      { value: 'high', label: translate('>1.5 kWh per sample'), score: '75' }
    ],
    state.energy,
    (value) => onChange('energy', value)
  );
  energyGroup.classList.add('instrumentation-option');
  energySection.appendChild(energyGroup);
  form.appendChild(energySection);
  
  // Additional factors spacing
  const additionalFactorsSpacing = document.createElement('div');
  additionalFactorsSpacing.id = 'samplingProcedureOptions';
  additionalFactorsSpacing.style.marginLeft = '20px';
  additionalFactorsSpacing.style.padding = '10px';
  additionalFactorsSpacing.style.backgroundColor = '#f9f9f9';
  additionalFactorsSpacing.style.borderRadius = '5px';
  additionalFactorsSpacing.style.marginBottom = '15px';
  form.appendChild(additionalFactorsSpacing);
  
  // Emissions section
  const emissionsSection = document.createElement('div');
  emissionsSection.className = 'form-section emissions-section';
  
  // Emission of Vapors
  const vaporGroup = createFormGroup(
    translate('Emission of Vapors'),
    'vaporEmission',
    [
      { value: 'yes', label: translate('Yes'), score: '-20' },
      { value: 'no', label: translate('No'), score: '0' }
    ],
    state.vaporEmission ? 'yes' : 'no',
    (value) => onChange('vaporEmission', value === 'yes')
  );
  vaporGroup.classList.add('instrumentation-option');
  emissionsSection.appendChild(vaporGroup);
  form.appendChild(emissionsSection);
  
  // Automation section
  const automationSection = document.createElement('div');
  automationSection.className = 'form-section automation-section';
  
  // Manual / automation level
const automatedGroup = createFormGroup(
  translate('Manual / automation level (non | semi | automated)'),
  'nonAutomated',
  [
    { value: 'automated', label: translate('Automated'),      score: '+2' },
    { value: 'semi',      label: translate('Semi automated'), score: '-2' },
    { value: 'non',       label: translate('Non automated'),  score: '-5' }
  ],
  state.nonAutomated ?? 'automated',          // default selection = automated
  (value) => onChange('nonAutomated', value)  // store string directly
);
  automatedGroup.classList.add('instrumentation-option');
  automationSection.appendChild(automatedGroup);
  form.appendChild(automationSection);
  
  // Multianalyte section
  const multianalyteSection = document.createElement('div');
  multianalyteSection.className = 'form-section multianalyte-section';
  
  // Multianalyte capability
  const multianalyteGroup = createFormGroup(
    translate('Multianalyte/multiparameter method'),
    'multianalyte',
    [
      { value: 'yes', label: translate('Yes'), score: 'Add 5 to the total score' },
      { value: 'no', label: translate('No'), score: '0' }
    ],
    state.multianalyte ? 'yes' : 'no',
    (value) => onChange('multianalyte', value === 'yes')
  );
  multianalyteGroup.classList.add('instrumentation-option');
  multianalyteSection.appendChild(multianalyteGroup);
  form.appendChild(multianalyteSection);
  
  // Miniaturized section
  const miniaturizedSection = document.createElement('div');
  miniaturizedSection.className = 'form-section miniaturized-section';
  
  // Miniaturized instrument
  const miniaturizedGroup = createFormGroup(
    translate('Miniaturized and/or portable instrument'),
    'miniaturized',
    [
      { value: 'yes', label: translate('Yes'), score: 'Add 10 to the total score' },
      { value: 'no', label: translate('No'), score: '0' }
    ],
    state.miniaturized ? 'yes' : 'no',
    (value) => onChange('miniaturized', value === 'yes')
  );
  miniaturizedGroup.classList.add('instrumentation-option');
  miniaturizedSection.appendChild(miniaturizedGroup);
  form.appendChild(miniaturizedSection);
  
  // Add formula note
  const formulaNote = document.createElement('div');
  formulaNote.className = 'formula-note';
  formulaNote.style.marginTop = '20px';
  formulaNote.style.padding = '15px';
  formulaNote.style.backgroundColor = '#f0f8ff';
  formulaNote.style.borderLeft = '4px solid var(--instrumentation-color)';
  formulaNote.style.borderRadius = '8px';
  formulaNote.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
  formulaNote.innerHTML = translate('The instrumentation score is based on the energy consumption (100-75 points) as the base score, with adjustments for vapor emissions (-20), manual methods. Additionally, multianalyte/multiparameter methods add 5 points to the total score, and miniaturized/portable instruments add 10 points to the total score. The overall score cannot exceed 100.');
  form.appendChild(formulaNote);
  // 1) Compute the instrumentation score:
  const currentInstScore = calculateInstrumentationScore(state); // 0–100

  // 2) Pin a horizontal progress bar in the top‐right:
  const instProgressBar = createHorizontalProgressBar(
    currentInstScore,
    100,
    '#77008f',
    translate('Instrumentation Score')
  );
  form.style.position = 'relative';
  instProgressBar.style.position = 'absolute';
  instProgressBar.style.top = '20px';
  instProgressBar.style.right = '20px';
  instProgressBar.style.width = '180px';
  form.appendChild(instProgressBar);

// 3) Build the full five‐slice array just as SamplePreparationForm does:
const radarData = [];

// (a) Sample Prep axis
if (scores.samplePrep !== undefined) {
  radarData.push({
    name: translate('Sample Prep'),
    value: scores.samplePrep,
    color: getEIColor(scores.samplePrep)
  });
}

// (b) Instrumentation axis (this form’s own score)
radarData.push({
  name: translate('Instrumentation'),
  value: currentInstScore,
  color: getEIColor(currentInstScore)
});

// (c) Reagent axis
if (scores.reagent !== undefined) {
  radarData.push({
    name: translate('Reagent'),
    value: scores.reagent,
    color: getEIColor(scores.reagent)
  });
}

// (d) Waste axis
if (scores.waste !== undefined) {
  radarData.push({
    name: translate('Waste'),
    value: scores.waste,
    color: getEIColor(scores.waste)
  });
}

// (e) Practicality axis (always last)
  if (scores.practicality   !== undefined) radarData.push({
    name: 'PPI',
    value: scores.practicality,
    color: getPracticalityColor(scores.practicality),
  });


/* =========================================================================
 *  Responsive EI / PPI sidebar – chart never disappears on small screens
 * ========================================================================= */

// 1) Remove any previous chart instance
const prev = document.getElementById('coxcombChart');
if (prev) prev.remove();

// 2) Build a new Coxcomb chart
const coxcombChart = createCoxcombChart(radarData);
coxcombChart.id = 'coxcombChart';
coxcombChart.style.cssText = `
  width: 120%;          /* let CSS decide the final size */
  max-width: 420px;     /* hard cap so it never overflows */
  height: auto;
  pointer-events: none;
`;

// 3) Split the “Performance Practicality Index” title over lines
const svg   = coxcombChart.querySelector('svg');
const SHIFT = 20;
if (svg) {
  svg.querySelectorAll('text').forEach(t => {
    if (t.textContent.includes('Performance Practicality Index')) {
      const y = parseFloat(t.getAttribute('y')) || 0;
      t.setAttribute('y', y - 50);
      const x = parseFloat(t.getAttribute('x')) || 0;
      t.setAttribute('x', x + SHIFT);

      const raw   = t.textContent.replace(/\s*\(PPI\)/, ' (PPI)');
      const words = raw.split(/\s+/);

      t.textContent = '';
      words.forEach((w, i) => {
        const span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        span.setAttribute('x', t.getAttribute('x'));
        span.setAttribute('dy', i === 0 ? '0' : '1.2em');
        span.textContent = w;
        t.appendChild(span);
      });
    }
  });
}

// 4) Calculate the two headline scores
const ppiScore = scores.practicality ?? 0;
const eiScore  = (
  (scores.samplePrep      ?? 0) +
  (scores.instrumentation ?? 0) +
  (scores.reagent         ?? 0) +
  (scores.waste           ?? 0)
) / 4;

// 5) Helper to create one card
function makeCard(title, value, color) {
  const c = document.createElement('div');
  c.className = 'score-card';
  c.style.cssText = `
    width: 150px;
    max-width: 47%;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0,0,0,.1);
    font-family: system-ui, sans-serif;
    pointer-events: none;
    box-sizing: border-box;
  `;

  const h4 = document.createElement('h4');
  h4.textContent = title;
  h4.style.cssText = `
    margin: 0;
    font-size: .75rem;
    font-weight: 600;
    color: #444;
    text-align: center;
  `;

  const span = document.createElement('span');
  span.textContent = `${value.toFixed(1)} %`;
  span.style.cssText = `
    font-size: 1.4rem;
    font-weight: 700;
    color: ${color};
  `;

  c.appendChild(h4);
  c.appendChild(span);
  return c;
}

const ppiCard = makeCard('Performance Practicality Index (PPI)', ppiScore, getPracticalityColor(ppiScore));
const eiCard  = makeCard('Environmental Index (EI)',            eiScore,  getEIColor(eiScore));

// 6) Sidebar container (create only if it doesn’t exist)
let sidebar = document.getElementById('ei-ppi-sidebar');
if (!sidebar) {
  sidebar = document.createElement('div');
  sidebar.id = 'ei-ppi-sidebar';
  document.body.appendChild(sidebar);
} else {
  // Remove the previous wrapper so we don’t end up with two .cards
  const oldCards = sidebar.querySelector('.cards');
  if (oldCards) oldCards.remove();
}


// 7) Global responsive CSS (inject only once)
if (!document.getElementById('ei-ppi-styles')) {
  const style = document.createElement('style');
  style.id = 'ei-ppi-styles';
  style.textContent = `
    :root {
      --sidebar-w: clamp(280px, 40vw, 420px);
    }
    body {
      margin-right: var(--sidebar-w);
    }
    #ei-ppi-sidebar {
      position: fixed;
      top: 25vh;
      right: 0vw;
      width: var(--sidebar-w);
      padding: 0 2vw;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      transform-origin: top right;
      z-index: 10000;
      pointer-events: none;
    }
    #ei-ppi-sidebar .cards {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      
      margin-right: 10px;
      width: 95%;
    }
    /* Small screens: stack under content and shrink chart */
    @media (max-width: 900px) {
      body { margin-right: 0; }
      #ei-ppi-sidebar {
        position: static;
        margin: 20px auto;
        align-items: center;
      }op
      #coxcombChart { max-width: 320px; }
    }
    /* Very small screens: scale chart further so it never vanishes */
    @media (max-width: 600px) {
      #coxcombChart { max-width: 260px; }
    }
    /* Ensure SVG fills the div */
    #coxcombChart svg {
      width: 100%;
      height: auto;
    }
  `;
  document.head.appendChild(style);
}

// 8) Assemble sidebar content
const wrap = document.createElement('div');
wrap.className = 'cards';
wrap.appendChild(ppiCard);
wrap.appendChild(eiCard);

sidebar.appendChild(coxcombChart);
sidebar.appendChild(wrap);

// 9) Keep zoom scaling consistent
function refreshScale() {
  sidebar.style.transform = `scale(${1 / window.devicePixelRatio})`;
}
refreshScale();
window.addEventListener('resize', refreshScale);
window.matchMedia('(resolution)').addEventListener('change', refreshScale);




  return form;
}

function createFormGroup(label, name, options, selectedValue, onChange) {
  const group = document.createElement('div');
  group.className = 'form-group';
  
  const groupLabel = document.createElement('label');
  groupLabel.textContent = label;
  groupLabel.htmlFor = name;
  groupLabel.style.fontSize = '1.2rem';
  groupLabel.style.fontWeight = '600';
  groupLabel.style.margin = '15px';
  groupLabel.style.display = 'block';
  group.appendChild(groupLabel);
  
  options.forEach((option, index) => {
    // Create custom radio container
    const radioContainer = document.createElement('label');
    radioContainer.className = 'custom-radio-container';
    radioContainer.htmlFor = `${name}_${option.value}`;
    
    // Create actual radio input (hidden)
    const radio = document.createElement('input');
    radio.className = 'custom-radio-input';
    radio.type = 'radio';
    radio.id = `${name}_${option.value}`;
    radio.name = name;
    radio.value = option.value;
    radio.checked = selectedValue === option.value;
    radio.addEventListener('change', () => onChange(option.value));
    
    // Create custom radio visual element
    const radioCheckmark = document.createElement('span');
    radioCheckmark.className = 'radio-checkmark';
    
    // Create label text
    const labelText = document.createTextNode(option.label);
    
    // Create score display
    const scoreSpan = document.createElement('span');
    scoreSpan.className = 'option-score';
    scoreSpan.textContent = option.score;
    
    // Append all elements
    radioContainer.appendChild(radio);
    radioContainer.appendChild(radioCheckmark);
    radioContainer.appendChild(labelText);
    radioContainer.appendChild(scoreSpan);
    
    group.appendChild(radioContainer);
  });
  
  return group;
}
