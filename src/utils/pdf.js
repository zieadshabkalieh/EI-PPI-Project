// src/utils/pdf.js – version 6.12 (2025‑07‑17)
// Polished, spacious, professional layout.
// ‑ Helpers declared first (in scope for generatePDF).
// ‑ Clear 32‑pt breaks between top‑level sections.
// ‑ Automatic page breaks before large blocks.
// ‑ All content from v6.11 preserved.

import { translate } from './i18n.js';
import { createCoxcombChart } from './charts.js';

/* ============================================================= */
/*                    EXTERNAL LIBRARIES URLs                    */
/* ============================================================= */
const JS_PDF_URL      = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
const AUTOTABLE_URL   = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.30/jspdf.plugin.autotable.min.js';
const HTML2CANVAS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
const isElectron = typeof window !== 'undefined' && window.process?.versions?.electron;
/* ============================================================= */
/*                         HELPERS FIRST                         */
/* ============================================================= */
function loadScript(src){
  return new Promise((res,rej)=>{
    if(document.querySelector(`script[src="${src}"]`)) return res();
    const s=document.createElement('script'); s.src=src; s.async=false;
    s.onload=res; s.onerror=()=>rej(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function drawProgressBars(doc,scores,y,pageW,pageH,margin){
  const barH=8,spaceBefore=12,spaceAfter=28,maxW=pageW-margin*2-100;
  const rows=[
    ['Sample Preparation',scores.samplePrep,'#2ecc71'],
    ['Instrumentation',scores.instrumentation,'#27ae60'],
    ['Reagent',scores.reagent,'#1abc9c'],
    ['Waste',scores.waste,'#16a085'],
    ['PPI',scores.practicality,'#7F5CFF']
  ];
  for(const[r,v,c] of rows){
    if(y+spaceBefore+barH+spaceAfter>pageH-margin){doc.addPage();y=margin;}
    doc.setFontSize(10).setFont(undefined,'bold').text(r,margin,y+spaceBefore);
    const bx=margin+100; doc.setFillColor('#e6e6e6'); doc.rect(bx,y+spaceBefore+4,maxW,barH,'F');
    doc.setFillColor(c); doc.rect(bx,y+spaceBefore+4,(v/100)*maxW,barH,'F');
    doc.setFontSize(9).setFont(undefined,'normal').text(v.toFixed(1),bx+maxW+6,y+spaceBefore+barH+4);
    y+=spaceBefore+barH+spaceAfter;
  }
  return y;
}

async function drawCoxcomb(doc,scores,y,pageW,pageH,margin){
  const holder=document.createElement('div'); holder.style.position='absolute'; holder.style.top='-9999px'; document.body.appendChild(holder);
  holder.appendChild(createCoxcombChart({
    samplePrep:scores.samplePrep,
    instrumentation:scores.instrumentation,
    reagent:scores.reagent,
    waste:scores.waste,
    practicality:scores.practicality
  }));
  const DPR = window.devicePixelRatio || 1;
const canvas = await window.html2canvas(holder.firstChild, {
  backgroundColor: '#fff',
  scale: DPR * 2        // high‑DPI capture
});

  if(y+canvas.height*((pageW-margin*2)/canvas.width)>pageH-margin){doc.addPage();y=margin;}
  doc.setFont(undefined,'bold').setFontSize(14).text(translate('Component Distribution Chart'),pageW/2,y,{align:'center'}); y+=24;
  const imgW=pageW-margin*2,imgH=(canvas.height*imgW)/canvas.width;
  doc.addImage(canvas.toDataURL('image/png'),'PNG',margin,y,imgW,Math.min(imgH,pageH-y-margin));
  return y+imgH+32;
}

function getTotalInterpretation(s){return s>=75?translate('Highly Recommended'):s>=50?translate('Recommended'):s>=25?translate('Needs Improvement'):translate('Not Recommended');}
function isRangeActive(range,val){if(range.includes('-')){const[mi,ma]=range.split('-').map(Number);return val>=mi&&val<=ma;}if(range.startsWith('<'))return val<Number(range.slice(1));if(range.startsWith('>'))return val>Number(range.slice(1));return false;}

function drawInterpretations(doc,scores,y,pageW,pageH,margin){
  const blocks=[
    {title:translate('Environmental Index (EI) Interpretation'),score:scores.eiIndex,list:[
      ['85-100',translate('Ideal green'),'#2E7D32'],
      ['70-84',translate('Green Method'),'#4CAF50'],
      ['55-69',translate('Acceptable green'),'#FFB300'],
      ['<55',translate('Unsustainable Non-Green Method with Serious Impact'),'#C62828']
    ]},
    {title:translate('Performance Practicality Index (PPI) Interpretation'),score:scores.practicality,list:[
      ['75-100',translate('Excellent'),'#77008f'],
      ['50-74',translate('Acceptable'),'#7C3AED'],
      ['<50',translate('Impractical'),'#C084FC']
    ]}
  ];
  for(const blk of blocks){
    if(y+120>pageH-margin){doc.addPage();y=margin;}
    doc.setFont(undefined,'bold').setFontSize(12).text(blk.title,margin,y); y+=18;
    for(const[r,d,c] of blk.list){
      doc.setFillColor(c); doc.rect(margin,y,8,8,'F');
      doc.setFontSize(10).setFont(undefined,'normal').text(`${r}: ${d}`,margin+12,y+8);
      if(isRangeActive(r,blk.score)) doc.text('✓',pageW-margin-6,y+8,{align:'right'});
      y+=16;
    }
    y+=14;
  }
  return y;
}

function createSemiCircularGauge(title,value,segments){
  const box=document.createElement('div'); box.style.display='flex'; box.style.flexDirection='column'; box.style.alignItems='center'; box.style.width='280px';
  const ttl=document.createElement('div'); ttl.textContent=title; ttl.style.fontWeight='bold'; ttl.style.marginBottom='10px'; box.appendChild(ttl);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('width','260'); svg.setAttribute('height','140'); svg.setAttribute('viewBox','0 0 260 140');
  const cx=130,cy=130,r=100; let start=-180;
  segments.forEach((seg,i)=>{const prev=i?segments[i-1].value:0; const sweep=(seg.value-prev)/100*180; const end=start+sweep;
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    const sx=cx+r*Math.cos(start*Math.PI/180), sy=cy+r*Math.sin(start*Math.PI/180);
    const ex=cx+r*Math.cos(end*Math.PI/180), ey=cy+r*Math.sin(end*Math.PI/180);
    p.setAttribute('d',`M ${sx} ${sy} A ${r} ${r} 0 ${sweep>180?1:0} 1 ${ex} ${ey} L ${cx} ${cy} Z`);
    p.setAttribute('fill',seg.color); svg.appendChild(p); start=end;});
  const ang=-180+value/100*180; const nx=cx+r*Math.cos(ang*Math.PI/180), ny=cy+r*Math.sin(ang*Math.PI/180);
  const needle=document.createElementNS('http://www.w3.org/2000/svg','line'); needle.setAttribute('x1',cx); needle.setAttribute('y1',cy); needle.setAttribute('x2',nx); needle.setAttribute('y2',ny); needle.setAttribute('stroke','#000'); needle.setAttribute('stroke-width','3'); svg.appendChild(needle);
  const hub=document.createElementNS('http://www.w3.org/2000/svg','circle'); hub.setAttribute('cx',cx); hub.setAttribute('cy',cy); hub.setAttribute('r','6'); hub.setAttribute('fill','#000'); svg.appendChild(hub);
  const txt=document.createElementNS('http://www.w3.org/2000/svg','text'); txt.setAttribute('x',cx); txt.setAttribute('y',cy-28); txt.setAttribute('text-anchor','middle'); txt.setAttribute('font-size','20'); txt.setAttribute('font-weight','bold'); txt.textContent=value.toFixed(1); svg.appendChild(txt);
  box.appendChild(svg); return box;
}

async function drawSimpleResultsSection(doc,scores,y,pageW,pageH,margin){
  doc.setFont(undefined,'bold').setFontSize(18).text(translate('Results Summary'),pageW/2,y,{align:'center'}); y+=32;
  doc.setFontSize(14).text(translate('EI & PPI Indexes'),pageW/2,y,{align:'center'}); y+=28;

  const EI_SEG=[{value:55,color:'#C62828'},{value:70,color:'#FFB300'},{value:85,color:'#4CAF50'},{value:100,color:'#2E7D32'}];
  const PPI_SEG=[{value:50,color:'#C084FC'},{value:75,color:'#7C3AED'},{value:100,color:'#77008f'}];
  const off=document.createElement('div'); off.style.position='absolute'; off.style.top='-9999px'; document.body.appendChild(off);
  const wrap=document.createElement('div'); wrap.style.display='flex'; wrap.style.justifyContent='center'; wrap.style.gap='60px';
  wrap.appendChild(createSemiCircularGauge(translate('Environmental Impact Index'),scores.eiIndex,EI_SEG));
  wrap.appendChild(createSemiCircularGauge(translate('Performance Practicality Index (PPI)'),scores.practicality,PPI_SEG));
  off.appendChild(wrap);
  const DPR = window.devicePixelRatio || 1;
const cv = await window.html2canvas(wrap, {
  backgroundColor: '#fff',
  scale: DPR * 2
});

  const gW=pageW-margin*2,gH=(cv.height*gW)/cv.width; if(y+gH>pageH-margin){doc.addPage();y=margin;}
  doc.addImage(cv.toDataURL('image/png'),'PNG',margin,y,gW,gH); y+=gH+28;

  const banner=`${translate('TOTAL SCORE:')} ${scores.total.toFixed(1)}   -   ${getTotalInterpretation(scores.total)}`;
  doc.setFont(undefined,'bold').setFontSize(14).text(banner,pageW/2,y,{align:'center'}); y+=40;

  const r=46,gap=76,totalW=3*r*2+2*gap; let cx=pageW/2-totalW/2+r; const cy=y+r;
  const gauge=(x,val,col,lab,w)=>{doc.setDrawColor('#e6e6e6'); doc.setLineWidth(8); doc.circle(x,cy,r);
    doc.setDrawColor(col); doc.circle(x,cy,r,'S'); doc.setFontSize(11).text(val.toFixed(1),x,cy+4,{align:'center'});
    doc.setFontSize(8).text(w,x+r-6,cy-r-4,{align:'right'}); doc.setFontSize(10).text(lab,x,cy+r+16,{align:'center'});} ;
  gauge(cx,scores.eiIndex,'#2E7D32',translate('Environmental Index (EI)'),'50%'); cx+=gap+2*r;
  gauge(cx,scores.practicality,'#77008f',translate('Performance Practicality Index (PPI)'),'50%'); cx+=gap+2*r;
  gauge(cx,scores.total,'#523e60',translate('EPPI Score'),'100%'); y+=r*2+50;

  doc.setFont(undefined,'bold').setFontSize(12).text(translate('EPPI Components'),margin,y); y+=22;
  const bar=(lbl,val,clr)=>{const labelW=150,bGap=8,barW=pageW-margin*2-labelW-bGap-40; doc.setFontSize(10).text(lbl,margin,y+8);
    const bx=margin+labelW; doc.setFillColor('#e6e6e6'); doc.rect(bx,y+2,barW,8,'F'); doc.setFillColor(clr); doc.rect(bx,y+2,(val/100)*barW,8,'F'); doc.setFontSize(9).text(val.toFixed(1),bx+barW+bGap,y+8); y+=22;};
  bar(translate('Sample Preparation'),scores.samplePrep,'#2ecc71');
  bar(translate('Instrumentation'),scores.instrumentation,'#27ae60');
  bar(translate('Reagents'),scores.reagent,'#1abc9c');
  bar(translate('Waste'),scores.waste,'#16a085');
  bar(translate('PPI'),scores.practicality,'#77008f'); y+=28;

  doc.autoTable({
    startY:y,
    margin:{left:margin,right:margin},
    head:[[translate('Category'),translate('Score'),translate('Weight')]],
    body:[
      ['Environmental Index (EI)',scores.eiIndex.toFixed(1),'50%'],
      ['Performance Practicality Index (PPI)',scores.practicality.toFixed(1),'50%'],
      [{content:translate('TOTAL SCORE'),styles:{fontStyle:'bold'}},scores.total.toFixed(1),'100%'],
      ['Sample Preparation',scores.samplePrep.toFixed(1),'-'],
      ['Instrumentation',scores.instrumentation.toFixed(1),'-'],
      ['Reagents',scores.reagent.toFixed(1),'-'],
      ['Waste',scores.waste.toFixed(1),'-']
    ],
    styles:{fontSize:9,cellPadding:3},
    headStyles:{fillColor:[245,245,245],textColor:40}
  });
  y=doc.lastAutoTable.finalY+30;

  y=drawInterpretations(doc,scores,y,pageW,pageH,margin);

  if(y+28>pageH-margin){doc.addPage();y=margin;}
  // doc.setFont(undefined,'normal').setFontSize(10).text(translate('You can save this calculation or export it in various formats:'),margin,y);
  return y+20;
}

/* ============================================================= */
/*                         MAIN EXPORT                           */
/* ============================================================= */
export async function generatePDF(state){
  await loadScript(JS_PDF_URL);
  await loadScript(AUTOTABLE_URL);
  await loadScript(HTML2CANVAS_URL);

  const{jsPDF}=window.jspdf; const doc=new jsPDF({unit:'pt',format:'a4'});
  const pageW=doc.internal.pageSize.getWidth(), pageH=doc.internal.pageSize.getHeight(), margin=40; let y=margin;
  const totalPages=()=>doc.getNumberOfPages(), addFooter=pg=>{doc.setPage(pg); doc.setFontSize(10).setTextColor('#888'); doc.text(`${translate('Page')} ${pg} / ${totalPages()}`,pageW-margin,pageH-20,{align:'right'});};

 /* COVER -------------------------------------------------------- */
// ---------- robust logo loader (works in browser *and* Electron) ----------
const logoURL    = isElectron && window.paths?.asset
  ? `file://${window.paths.asset('logo.png')}`
  : '../../assets/logo.png';

const logoImg = new Image();
logoImg.src   = logoURL;

await new Promise(res => {
  logoImg.onload  = res;          // continue when loaded
  logoImg.onerror = () => res();  // ...or when it fails – we'll just skip it
});

if (logoImg.complete && logoImg.naturalWidth) {
  const logoW = 70;
  const logoH = (logoImg.height / logoImg.width) * logoW;
  doc.addImage(logoImg, 'PNG', margin, y, logoW, logoH);
  y += logoH + 40;                // bump text only if we actually drew it
}


  doc.setFont(undefined,'bold').setFontSize(20).text(translate('Environmental, Practicality, and Performance Index (EPPI)'),pageW/2,y,{align:'center'}); y+=40;
  doc.setFont(undefined,'normal').setFontSize(12).text(`${translate('Date')}: ${new Date().toLocaleDateString()}`,margin,y); y+=50;

  /* MAIN TABLE --------------------------------------------------- */
  doc.autoTable({
    startY:y,
    margin:{left:margin,right:margin},
    head:[[translate('Component'),translate('Score')]],
    body:[
      ['Sample Preparation',state.scores.samplePrep.toFixed(1)],
      ['Instrumentation',state.scores.instrumentation.toFixed(1)],
      ['Reagent',state.scores.reagent.toFixed(1)],
      ['Waste',state.scores.waste.toFixed(1)],
      ['PPI',state.scores.practicality.toFixed(1)],
      [{content:translate('Total'),styles:{fontStyle:'bold'}},state.scores.total.toFixed(1)]
    ],
    styles:{fontSize:10,cellPadding:4},
    headStyles:{fillColor:[60,120,204]}
  }); y=doc.lastAutoTable.finalY+40;

  /* PROGRESS BARS ------------------------------------------------ */
  y=drawProgressBars(doc,state.scores,y,pageW,pageH,margin)+10;

  /* COXCOMB CHART ------------------------------------------------ */
  y=await drawCoxcomb(doc,state.scores,y,pageW,pageH,margin)+10;

  /* SIMPLE RESULTS ---------------------------------------------- */
  doc.addPage(); y=margin;
  y=await drawSimpleResultsSection(doc,state.scores,y,pageW,pageH,margin)+32;

  /* FOOTERS & SAVE --------------------------------------------- */
  for(let pg=1;pg<=totalPages();pg++) addFooter(pg);
  const fileName = `EPPI_Report_${new Date().toISOString().slice(0,10)}.pdf`;

/* In a browser we keep the old behaviour; in Electron we push the raw bytes
   to the main‑process so it can open the normal Save dialog and write to disk. */
if (isElectron && window.api?.savePdf) {
  const arrayBuffer = doc.output('arraybuffer');          // <— nothing else changes
  window.api.savePdf(arrayBuffer, fileName);              // preload bridge
} else {
  doc.save(fileName);                                     // web download
}

}
