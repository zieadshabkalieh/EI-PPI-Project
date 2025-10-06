import { translate } from '../../utils/i18n.js';
import { calculateWasteScore } from '../../utils/calculations.js';
import {
  getEIColor,
  getPracticalityColor,
  createHorizontalProgressBar,
  createCoxcombChart
} from '../../utils/charts.js';

// ─── add this helper exactly as in SamplePreparationForm ───
function makeCollapsible(headerEl, contentEl) {
  headerEl.style.cursor = 'pointer';
  contentEl.style.display = 'none';
  headerEl.addEventListener('click', () => {
    contentEl.style.display = contentEl.style.display === 'none' ? '' : 'none';
  });
}

export function WasteForm(state, onChange, scores) {
  const form = document.createElement('div');
  form.className = 'form-section card waste-card';
  form.style.position = 'relative';
  
  const title = document.createElement('h3');
  title.textContent = translate('Waste');
  form.appendChild(title);
  
  // Info card (collapsed by default)
  const infoCard = document.createElement('div');
  infoCard.className = 'info-card info-card-waste';
  const infoCardTitle = document.createElement('div');
  infoCardTitle.className = 'info-card-title collapsible-title';
  infoCardTitle.textContent = translate('About Waste Management');
  const infoCardContent = document.createElement('div');
  infoCardContent.className = 'info-card-content';
  infoCardContent.innerHTML = `
    <p>${translate('This page helps you calculate the Waste Score for your analytical method. The score assesses the environmental impact of waste generation, encouraging minimal waste production and proper waste management.')}</p>
    <p>${translate('Please fill in the information below to calculate your Waste Score.')}</p>
    <p><strong>${translate('Biodegradable vs. Non-biodegradable Waste')}</strong></p>
    <ul>
      <li>${translate('Biodegradable waste includes materials that can be broken down by natural processes, such as aqueous solutions, some organic solvents, and naturally derived compounds.')}</li>
      <li>${translate('Non-biodegradable waste includes materials that persist in the environment, such as halogenated solvents, heavy metals, and many synthetic compounds.')}</li>
    </ul>
    <p><strong>${translate('Waste Treatment Options')}</strong></p>
    <ul>
      <li>${translate('No treatment: Waste is disposed of without any treatment')}</li>
      <li>${translate('Treatment with reuse: Waste is treated and reused in the analytical process, reducing the overall environmental impact')}</li>
    </ul>
  `;
  makeCollapsible(infoCardTitle, infoCardContent);
  infoCard.append(infoCardTitle, infoCardContent);
  form.appendChild(infoCard);

  // ─── WASTE VOLUME ───
  const wasteVolumeSection = document.createElement('div');
  wasteVolumeSection.className = 'form-section waste-volume-section';
  const volumeGroup = createFormGroup(
    translate('Amount of Waste per Sample'),
    'volume',
    [
      { value: 'less1',           label: translate('< 1 mL (g)'),     score: '100' },
      { value: 'between1And10',   label: translate('1-10 mL (g)'),    score: '90'  },
      { value: 'between10And100', label: translate('11-100 mL (g)'), score: '60'  },
      { value: 'more100',         label: translate('> 100 mL (g)'),   score: '35'  }
    ],
    state.volume,
    v => onChange('volume', v)
  );
  volumeGroup.classList.add('waste-section');
  wasteVolumeSection.appendChild(volumeGroup);
  form.appendChild(wasteVolumeSection);

  // ─── BIODEGRADABILITY ───
  const biodegradabilitySection = document.createElement('div');
  biodegradabilitySection.className = 'form-section biodegradability-section';
  const biodegradableGroup = createFormGroup(
    translate('Waste Biodegradability'),
    'biodegradable',
    [
      { value: 'yes', label: translate('Biodegradable waste'),       score: '+10' },
      { value: 'no',  label: translate('Non-biodegradable waste'),   score: '-10' }
    ],
    state.biodegradable ? 'yes' : 'no',
    v => onChange('biodegradable', v === 'yes')
  );
  biodegradableGroup.classList.add('waste-section');
  biodegradabilitySection.appendChild(biodegradableGroup);
  form.appendChild(biodegradabilitySection);

  // ─── TREATMENT ───
  const treatmentSection = document.createElement('div');
  treatmentSection.className = 'form-section treatment-section';
  const treatmentGroup = createFormGroup(
    translate('Treatment'),
    'treatment',
    [
      { value: 'none',   label: translate('No treatment applied'),            score: '-5'  },
      { value: 'less10', label: translate('Treatment with reuse < 10 mL (g)'), score: '+10' },
      { value: 'more10', label: translate('Treatment with reuse > 10 mL (g)'), score: '+20' }
    ],
    state.treatment,
    v => onChange('treatment', v)
  );
  treatmentGroup.classList.add('waste-section');
  treatmentSection.appendChild(treatmentGroup);
  form.appendChild(treatmentSection);

  // ─── WASTE SCORE ───
  const currentWasteScore = calculateWasteScore(state);
  const wasteProgressBar = createHorizontalProgressBar(
    currentWasteScore, 100, getEIColor(currentWasteScore), translate('Waste Score')
  );
  form.style.position = 'relative';
  wasteProgressBar.style.position = 'absolute';
  wasteProgressBar.style.top = '20px';
  wasteProgressBar.style.right = '20px';
  wasteProgressBar.style.width = '180px';
  form.appendChild(wasteProgressBar);

  // ─── RADAR DATA ───
  const radarData = [];
  if (scores.samplePrep     !== undefined) radarData.push({ name: translate('Sample Prep'),      value: scores.samplePrep,      color: getEIColor(scores.samplePrep) });
  if (scores.instrumentation !== undefined) radarData.push({ name: translate('Instrumentation'),  value: scores.instrumentation, color: getEIColor(scores.instrumentation) });
  if (scores.reagent        !== undefined) radarData.push({ name: translate('Reagent'),          value: scores.reagent,         color: getEIColor(scores.reagent) });
  radarData.push({ name: translate('Waste'), value: currentWasteScore, color: getEIColor(currentWasteScore) });
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
  groupLabel.style.marginBottom = '15px';
  groupLabel.style.display = 'block';
  group.appendChild(groupLabel);

  options.forEach(option => {
    const radioContainer = document.createElement('label');
    radioContainer.className = 'custom-radio-container';
    radioContainer.htmlFor = `${name}_${option.value}`;

    const radio = document.createElement('input');
    radio.className = 'custom-radio-input';
    radio.type = 'radio';
    radio.id = `${name}_${option.value}`;
    radio.name = name;
    radio.value = option.value;
    radio.checked = selectedValue === option.value;
    radio.addEventListener('change', () => onChange(option.value));

    const radioCheckmark = document.createElement('span');
    radioCheckmark.className = 'radio-checkmark';

    const labelText = document.createTextNode(option.label);

    const scoreSpan = document.createElement('span');
    scoreSpan.className = 'option-score';
    scoreSpan.textContent = option.score;

    radioContainer.append(radio, radioCheckmark, labelText, scoreSpan);
    radioContainer.classList.add('waste-option');
    group.appendChild(radioContainer);
  });

  return group;
}
