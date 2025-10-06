// src/utils/excel.js – version 1.5 (2025‑07‑18)
// Generates a fully‑populated, print‑ready Excel workbook that mirrors every
// visual and numeric element of the PDF & SimpleResults page, including the
// Coxcomb chart, dual semi‑circular gauges, component horizontal bars and all
// numeric tables. Works in any modern browser (ES2020+).

/* ======================================================================= */
/*                               DEPENDENCIES                              */
/* ======================================================================= */
import { translate }          from './i18n.js';
import { createCoxcombChart } from './charts.js';

// External library URLs (UMD builds)
const EXCELJS_URL      = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js';
const HTML2CANVAS_URL  = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
const FILESAVER_URL    = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';

/* ======================================================================= */
/*                                UTILITIES                                */
/* ======================================================================= */
function loadScript(src){
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = () => res();
    s.onerror = () => rej(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function safeCanvasToPNG(el, scale = 3){
  try {
    const canvas = await window.html2canvas(el, { backgroundColor: '#ffffff', scale });
    return canvas.toDataURL('image/png').split(',')[1]; // Base64 payload only
  } catch(err) {
    console.warn('html2canvas failed:', err.message);
    return null;
  }
}

function isNumber(n){ return typeof n === 'number' && !Number.isNaN(n); }
function valOr0(v){ return isNumber(v) ? v : 0; }

/* ----------------------------------------------------------------------- */
/*                     COLOR PALETTES & HELPER GETTERS                     */
/* ----------------------------------------------------------------------- */
const COLS = {
  header: '3C78CC', zebra: 'F5F5F5',
  dGreen: '2E7D32', mGreen: '4CAF50', yellow: 'FFB300', red: 'C62828',
  purple: '77008f', magenta: 'C084FC', grey: 'E6E6E6'
};

const EI_SEG  = [
  { value: 55, color: '#C62828' },
  { value: 70, color: '#FFB300' },
  { value: 85, color: '#4CAF50' },
  { value: 100, color: '#2E7D32' }
];
const PPI_SEG = [
  { value: 50, color: '#C084FC' },
  { value: 75, color: '#7C3AED' },
  { value: 100, color: '#77008f' }
];

function getEIColor(score){
  if (score >= 85) return '#2E7D32';
  if (score >= 70) return '#4CAF50';
  if (score >= 55) return '#FFB300';
  return '#C62828';
}
function getPPIColor(score){
  if (score >= 75) return '#77008f';
  if (score >= 50) return '#7C3AED';
  return '#C084FC';
}

/* ======================================================================= */
/*                         DOM‑BASED CHART BUILDERS                        */
/* ======================================================================= */
// NOTE: These builders mirror the SimpleResults implementation so that the
// screenshots we embed in Excel look identical. All charts are rendered off‑
// screen, converted to PNG via html2canvas, and then discarded.

function createSemiCircularGauge(title, value, segments){
  const box = document.createElement('div');
  box.style.display = 'flex';
  box.style.flexDirection = 'column';
  box.style.alignItems = 'center';
  box.style.width = '280px';

  const ttl = document.createElement('div');
  ttl.textContent = title;
  ttl.style.fontWeight = 'bold';
  ttl.style.marginBottom = '12px';
  ttl.style.textAlign = 'center';
  box.appendChild(ttl);

  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('width','260');
  svg.setAttribute('height','140');
  svg.setAttribute('viewBox','0 0 260 140');

  const cx = 130, cy = 130, r = 100;
  let start = -180;
  segments.forEach((seg, i) => {
    const prev = i ? segments[i-1].value : 0;
    const sweep = ((seg.value - prev)/100) * 180;
    const end = start + sweep;
    const sx = cx + r * Math.cos(start * Math.PI/180);
    const sy = cy + r * Math.sin(start * Math.PI/180);
    const ex = cx + r * Math.cos(end   * Math.PI/180);
    const ey = cy + r * Math.sin(end   * Math.PI/180);

    const path = document.createElementNS(svg.namespaceURI,'path');
    path.setAttribute('d', `M ${sx} ${sy} A ${r} ${r} 0 ${sweep>180?1:0} 1 ${ex} ${ey} L ${cx} ${cy} Z`);
    path.setAttribute('fill', seg.color);
    svg.appendChild(path);

    start = end;
  });

  const needleAng = -180 + (value/100)*180;
  const nx = cx + r * Math.cos(needleAng * Math.PI/180);
  const ny = cy + r * Math.sin(needleAng * Math.PI/180);
  const needle = document.createElementNS(svg.namespaceURI,'line');
  needle.setAttribute('x1', cx); needle.setAttribute('y1', cy);
  needle.setAttribute('x2', nx); needle.setAttribute('y2', ny);
  needle.setAttribute('stroke','#000'); needle.setAttribute('stroke-width','3');
  svg.appendChild(needle);

  const hub = document.createElementNS(svg.namespaceURI,'circle');
  hub.setAttribute('cx', cx); hub.setAttribute('cy', cy);
  hub.setAttribute('r', '6'); hub.setAttribute('fill', '#000');
  svg.appendChild(hub);

  const txt = document.createElementNS(svg.namespaceURI,'text');
  txt.setAttribute('x', cx); txt.setAttribute('y', cy - 28);
  txt.setAttribute('text-anchor', 'middle');
  txt.setAttribute('font-size', '20');
  txt.setAttribute('font-weight', 'bold');
  txt.textContent = value.toFixed(1);
  svg.appendChild(txt);

  box.appendChild(svg);
  return box;
}

function createHorizontalBarsContainer(scores){
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.gap = '10px';
  wrap.style.padding = '20px';
  wrap.style.width = '620px';
  wrap.style.backgroundColor = '#ffffff';
  wrap.style.borderRadius = '10px';
  wrap.style.fontFamily = 'Calibri,Arial,sans-serif';

  const heading = document.createElement('h3');
  heading.textContent = translate('EPPI Components');
  heading.style.margin = '0 0 12px 0';
  heading.style.textAlign = 'center';
  wrap.appendChild(heading);

  const addBar = (label, val, color) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexDirection = 'column';
    row.style.gap = '4px';

    const lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.fontWeight = 'bold';
    row.appendChild(lbl);

    const barBg = document.createElement('div');
    barBg.style.height = '12px';
    barBg.style.borderRadius = '6px';
    barBg.style.backgroundColor = '#e6e6e6';
    barBg.style.overflow = 'hidden';

    const barFill = document.createElement('div');
    barFill.style.height = '100%';
    barFill.style.width = `${(val/100)*100}%`;
    barFill.style.backgroundColor = color;
    barBg.appendChild(barFill);

    row.appendChild(barBg);

    const valueTag = document.createElement('div');
    valueTag.textContent = val.toFixed(1);
    valueTag.style.fontSize = '12px';
    valueTag.style.fontWeight = 'bold';
    valueTag.style.alignSelf = 'flex-end';
    valueTag.style.color = color;
    row.appendChild(valueTag);

    wrap.appendChild(row);
  };

  addBar(translate('Sample Preparation'), scores.samplePrep,      getEIColor(scores.samplePrep));
  addBar(translate('Instrumentation'),    scores.instrumentation, getEIColor(scores.instrumentation));
  addBar(translate('Reagents'),           scores.reagent,         getEIColor(scores.reagent));
  addBar(translate('Waste'),              scores.waste,           getEIColor(scores.waste));
  addBar(translate('Performance Practicality Index (PPI)'),       scores.practicality,    getPPIColor(scores.practicality));

  return wrap;
}

/* ======================================================================= */
/*              EXCEL‑SPECIFIC HELPERS (STYLING & PAGE SETUP)              */
/* ======================================================================= */
function styleHeader(row){
  row.height = 22;
  row.font   = { name:'Calibri', size:12, bold:true, color:{ argb:'FFFFFFFF' } };
  row.alignment = { horizontal:'center', vertical:'middle' };
  row.fill  = { type:'pattern', pattern:'solid', fgColor:{ argb:COLS.header } };
  row.border= { bottom:{ style:'thin', color:{ argb:'FFBBBBBB' } } };
}

function applyZebra(ws, startRow){
  ws.eachRow({ includeEmpty:false }, (r, n) => {
    if (n >= startRow && n % 2 === 1) {
      r.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:COLS.zebra } };
    }
  });
}

function configurePrint(ws){
  ws.pageSetup = {
    paperSize: 9, // A4
    orientation: 'portrait',
    fitToPage:   true,
    fitToWidth:  1,
    fitToHeight: 1,
    horizontalCentered: true,
    verticalCentered:   false,
    margins: { left:0.7, right:0.7, top:0.75, bottom:0.75, header:0.3, footer:0.3 }
  };
}

/* ======================================================================= */
/*                     PUBLIC API – GENERATE WORKBOOK                      */
/* ======================================================================= */
export async function generateExcel(state={scores:{}}){
  console.log('[excel.js] Starting Excel export…');

  // Load external libs
  await loadScript(EXCELJS_URL);
  await loadScript(HTML2CANVAS_URL);
  await loadScript(FILESAVER_URL);

  const ExcelJSImport = window.ExcelJS?.default ?? window.ExcelJS;
  if (!ExcelJSImport?.Workbook) throw new Error('ExcelJS not available after script load');
  const Workbook = ExcelJSImport.Workbook;
  const saveAs   = window.saveAs;

  // Normalize state
// Normalize state  ─ keep the key called “ppi”
const s = {
  samplePrep:      valOr0(state.scores.samplePrep),
  instrumentation: valOr0(state.scores.instrumentation),
  reagent:         valOr0(state.scores.reagent),
  waste:           valOr0(state.scores.waste),
  ppi:             valOr0(state.scores.practicality),   // ← preferred key
  eiIndex:         valOr0(state.scores.eiIndex),
  total:           valOr0(state.scores.total)
};
s.practicality = s.ppi;  // alias for helper functions that still expect this name


  // Create workbook
  const wb = new Workbook();
  wb.creator = 'EPPI Suite';
  wb.created = new Date();

  // COVER SHEET
  const cover = wb.addWorksheet(translate('Cover'), { properties:{ defaultRowHeight:24 } });
  cover.columns = Array(5).fill({ width:18 });
// 1) read logo (works both in web & packaged desktop)
let logoBase64 = '';
try {
  const isElectron = !!(window.process?.versions?.electron);
  const logoURL    = isElectron && window.paths?.asset
    ? `file://${window.paths.asset('logo.png')}`
    : '../../assets/logo.png';

  const resp = await fetch(logoURL);
  const ab   = await resp.arrayBuffer();
  logoBase64 = btoa(String.fromCharCode(...new Uint8Array(ab)));
} catch (err) {
  console.warn('[excel.js] Logo load failed – continuing without it', err);
}

// 2) place it if we have it
if (logoBase64) {
  const logoId = wb.addImage({ base64: logoBase64, extension: 'png' });
  cover.addImage(logoId, {
    tl:  { col: 6, row: 0 },
    ext: { width: 250, height: 250 }
  });
}

  // Title and date
  cover.mergeCells('A5:E7');
  cover.getCell('A5').value     = translate('Environmental, Practicality, and Performance Index (EPPI)');
  cover.getCell('A5').font      = { name:'Calibri', size:20, bold:true, color:{ argb:'FFFFFFFF' } };
  cover.getCell('A5').alignment = { horizontal:'center', vertical:'middle' };
  cover.getCell('A5').fill      = { type:'pattern', pattern:'solid', fgColor:{ argb:COLS.header } };
  cover.getCell('A9').value     = translate('Date');
  cover.getCell('A9').font      = { bold:true };
  cover.getCell('B9').value     = new Date().toLocaleDateString();
  configurePrint(cover);

  // SCORES TAB
  const ws = wb.addWorksheet(translate('Scores'), { views:[{ state:'frozen', ySplit:1 }] });
  ws.columns = [
    { header:translate('Component'), key:'comp',  width:28 },
    { header:translate('Score'),     key:'score', width:14 },
    { header:translate('Weight'),    key:'weight',width:14 }
  ];
  styleHeader(ws.getRow(1));
  ws.addRows([
    [translate('Sample Preparation'), s.samplePrep.toFixed(1), '-'],
    [translate('Instrumentation'),    s.instrumentation.toFixed(1), '-'],
    [translate('Reagent'),            s.reagent.toFixed(1),         '-'],
    [translate('Waste'),              s.waste.toFixed(1),           '-'],
    [translate('Performance Practicality Index (PPI)'),       s.ppi.toFixed(1),    '50%'],
    [translate('Environmental Index (EI)'), s.eiIndex.toFixed(1),  '50%'],
    [{ richText:[{ text:translate('TOTAL SCORE'), font:{ bold:true } }] },
      s.total.toFixed(1), '100%']
  ]);
  applyZebra(ws, 2);
  configurePrint(ws);
  ws.pageSetup.printArea = 'A1:C100';

  // CHARTS TAB
  const charts = wb.addWorksheet(translate('Charts'), { properties:{ defaultRowHeight:18 } });
  charts.columns = [{ width:75 }];
  const hidden = document.createElement('div');
  hidden.style.position = 'absolute';
  hidden.style.top      = '-9999px';
  hidden.style.left     = '-9999px';
  document.body.appendChild(hidden);

  let currentRow = 1;

  // 1) Coxcomb
  try {
    const cox    = createCoxcombChart({
      samplePrep:     s.samplePrep,
      instrumentation:s.instrumentation,
      reagent:        s.reagent,
      waste:          s.waste,
      practicality:   s.ppi
    });
    hidden.appendChild(cox);
    const base64 = await safeCanvasToPNG(cox, 3);
    if (base64) {
      const imgId = wb.addImage({ base64, extension:'png' });
      charts.addImage(imgId, { tl:{ col:0, row:currentRow }, ext:{ width:650, height:650 } });
      currentRow += 35;
    }
  } catch(e) { console.warn('[excel.js] Coxcomb capture failed:', e.message); }

  // 2) Gauges
  try {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.justifyContent = 'center';
    wrap.style.gap = '80px';
    wrap.appendChild(createSemiCircularGauge(translate('Environmental Impact Index'), s.eiIndex, EI_SEG));
    wrap.appendChild(createSemiCircularGauge(translate('Performance Practicality Index (PPI)'), s.ppi, PPI_SEG));
    hidden.appendChild(wrap);

    const base64 = await safeCanvasToPNG(wrap, 3);
    if (base64) {
      const imgId = wb.addImage({ base64, extension:'png' });
      charts.addImage(imgId, { tl:{ col:0, row:currentRow }, ext:{ width:700, height:420 } });
      currentRow += 24;
    }
  } catch(e) { console.warn('[excel.js] Gauge capture failed:', e.message); }

  // 3) Horizontal bars
  try {
    const bars = createHorizontalBarsContainer(s);
    hidden.appendChild(bars);
    const base64 = await safeCanvasToPNG(bars,3);
    if (base64) {
      const imgId = wb.addImage({ base64, extension:'png' });
      charts.addImage(imgId, { tl:{ col:0, row:currentRow }, ext:{ width:650, height:500 } });
      currentRow += 28;
    }
  } catch(e) { console.warn('[excel.js] Horizontal bar capture failed:', e.message); }

  // 4) Full SimpleResults snapshot
  const simpleResultsEl = document.querySelector('.simple-results-container');
  if (simpleResultsEl) {
    try {
      const rect   = simpleResultsEl.getBoundingClientRect();
      const base64 = await safeCanvasToPNG(simpleResultsEl, 2);
      if (base64) {
        const overview = wb.addWorksheet(translate('Overview'),
                                         { properties:{ defaultRowHeight:18 } });
        overview.columns = [{ width:75 }];
        const imgId = wb.addImage({ base64, extension:'png' });
        const imgW = 950;
        const imgH = Math.round(rect.height * (imgW / rect.width));
        overview.addImage(imgId,
          { tl:{ col:0.5, row:1 }, ext:{ width:imgW, height:imgH } }
        );
        configurePrint(overview);
      }
    } catch(err) {
      console.warn('[excel.js] SimpleResults snapshot failed:', err.message);
    }
  }

  // INTERPRETATION TAB
  const interp = wb.addWorksheet(translate('Interpretation'));
  interp.columns = [{ width:26 }, { width:34 }, { width:12 }, { width:8 }];
  configurePrint(interp);

  let r = 2;
  const interpBlocks = [
    {
      title: translate('Environmental Index (EI) Interpretation'),
      score: s.eiIndex,
      list: [
        ['85-100', translate('Ideal green'), COLS.dGreen],
        ['70-84',  translate('Green Method'), COLS.mGreen],
        ['55-69',  translate('Acceptable green'), COLS.yellow],
        ['<55',    translate('Unsustainable Non-Green Method with Serious Impact'), COLS.red]
      ]
    },
    {
      title: translate('PPI Interpretation'),
      score: s.ppi,
      list: [
        ['75-100', translate('Excellent'), COLS.purple],
        ['50-74',  translate('Acceptable'), '7C3AED'],
        ['<50',    translate('Impractical'), COLS.magenta]
      ]
    }
  ];
  const isRangeActive = (range, val) => {
    if (range.includes('-')) {
      const [mi, ma] = range.split('-').map(Number);
      return val >= mi && val <= ma;
    }
    if (range.startsWith('<')) return val < Number(range.slice(1));
    if (range.startsWith('>')) return val > Number(range.slice(1));
    return false;
  };
  interpBlocks.forEach(blk => {
    interp.mergeCells(`A${r}:C${r}`);
    interp.getCell(`A${r}`).value = blk.title;
    interp.getCell(`A${r}`).font  = { bold:true, size:14 };
    r++;
    blk.list.forEach(([rng, desc, color]) => {
      interp.getCell(`A${r}`).value = rng;
      interp.getCell(`B${r}`).value = desc;
      interp.getCell(`C${r}`).fill  = { type:'pattern', pattern:'solid', fgColor:{ argb:color } };
      if (isRangeActive(rng, blk.score)) interp.getCell(`D${r}`).value = '✔';
      r++;
    });
    r += 2;
  });

  // SAVE
/* ---------- SAVE ---------- */
const buffer = await wb.xlsx.writeBuffer();
const fileName = `EPPI_Report_${new Date().toISOString().slice(0,10)}.xlsx`;
const isElectron = typeof window !== 'undefined' && window.process?.versions?.electron;

/* ▸ Desktop build (Electron) ‑‑> push raw bytes to the main process */
if (isElectron && window.api?.saveFile) {
  const bytes = (typeof Buffer !== 'undefined')
    ? Buffer.from(buffer)              // Node’s Buffer if it exists
    : new Uint8Array(buffer);          // fallback for strict isolation

  await window.api.saveFile({
    content:   bytes,
    defaultPath: fileName,
    filters:   [{ name: 'Excel', extensions: ['xlsx'] }],
  });

  console.log('[excel.js] Export complete (desktop):', fileName);

/* ▸ Web build ‑‑> keep the old FileSaver behaviour */
} else {
  const blob = new Blob(
    [buffer],
    { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  );
  saveAs(blob, fileName);
  console.log('[excel.js] Export complete (web):', fileName);
}

}
