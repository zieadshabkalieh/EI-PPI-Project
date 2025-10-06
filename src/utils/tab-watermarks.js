/**
 * Tab-specific background watermarks
 * These watermarks provide visual context for each tab with a light, non-intrusive design
 */

// Create and append a watermark to a tab container
export function createTabWatermark(tabContainer, tabId) {
  // Remove any existing watermark
  const existingWatermark = tabContainer.querySelector('.tab-watermark');
  if (existingWatermark) {
    tabContainer.removeChild(existingWatermark);
  }
  
  // Create watermark container
  const watermark = document.createElement('div');
  watermark.className = `tab-watermark ${tabId}-watermark`;
  
  // Add tab-specific watermark elements
  switch(tabId) {
    case 'samplePrep':
      createSamplePrepWatermark(watermark);
      break;
    case 'instrumentation':
      createInstrumentationWatermark(watermark);
      break;
    case 'reagent':
      createReagentWatermark(watermark);
      break;
    case 'waste':
      createWasteWatermark(watermark);
      break;
    case 'results':
      createResultsWatermark(watermark);
      break;
    case 'saved':
      createSavedCalculationsWatermark(watermark);
      break;
  }
  
  // Add watermark to the tab container as the first child (background)
  if (tabContainer.firstChild) {
    tabContainer.insertBefore(watermark, tabContainer.firstChild);
  } else {
    tabContainer.appendChild(watermark);
  }
}

// Sample Preparation Watermark
function createSamplePrepWatermark(container) {
  // Sample preparation equipment silhouette
  const equipment = document.createElement('div');
  equipment.className = 'watermark-icon sample-prep-icon';
  
  // Create mortar and pestle silhouette
  const mortar = document.createElement('div');
  mortar.className = 'watermark-mortar';
  
  const pestle = document.createElement('div');
  pestle.className = 'watermark-pestle';
  
  equipment.appendChild(mortar);
  equipment.appendChild(pestle);
  
  // Create lab flask silhouette
  const flask = document.createElement('div');
  flask.className = 'watermark-flask';
  equipment.appendChild(flask);
  
  // Create filter funnel silhouette
  const funnel = document.createElement('div');
  funnel.className = 'watermark-funnel';
  equipment.appendChild(funnel);
  
  container.appendChild(equipment);
}

// Instrumentation Watermark
function createInstrumentationWatermark(container) {
  // High-end instrument silhouette
  const instrument = document.createElement('div');
  instrument.className = 'watermark-icon instrumentation-icon';
  
  // Create HPLC system silhouette
  const hplcSystem = document.createElement('div');
  hplcSystem.className = 'watermark-hplc';
  
  // Create modules for the HPLC
  const pumpModule = document.createElement('div');
  pumpModule.className = 'watermark-module pump-module';
  hplcSystem.appendChild(pumpModule);
  
  const columnModule = document.createElement('div');
  columnModule.className = 'watermark-module column-module';
  hplcSystem.appendChild(columnModule);
  
  const detectorModule = document.createElement('div');
  detectorModule.className = 'watermark-module detector-module';
  hplcSystem.appendChild(detectorModule);
  
  instrument.appendChild(hplcSystem);
  
  // Create spectrometer outline
  const spectrometer = document.createElement('div');
  spectrometer.className = 'watermark-spectrometer';
  instrument.appendChild(spectrometer);
  
  container.appendChild(instrument);
}

// Reagent Watermark
function createReagentWatermark(container) {
  // Chemical reagents silhouette
  const reagents = document.createElement('div');
  reagents.className = 'watermark-icon reagent-icon';
  
  // Create various chemical bottle/flask silhouettes
  const chemicalBottles = ['bottle1', 'bottle2', 'erlenmeyer', 'volumetric'];
  
  chemicalBottles.forEach(bottleType => {
    const bottle = document.createElement('div');
    bottle.className = `watermark-chemical ${bottleType}`;
    reagents.appendChild(bottle);
  });
  
  // Create molecular structure
  const molecule = document.createElement('div');
  molecule.className = 'watermark-molecule';
  
  // Add atoms and bonds to molecule
  for (let i = 0; i < 6; i++) {
    const atom = document.createElement('div');
    atom.className = `watermark-atom atom-${i+1}`;
    molecule.appendChild(atom);
    
    // Add bond lines between atoms
    if (i < 5) {
      const bond = document.createElement('div');
      bond.className = `watermark-bond bond-${i+1}`;
      molecule.appendChild(bond);
    }
  }
  
  reagents.appendChild(molecule);
  container.appendChild(reagents);
}

// Waste Management Watermark
function createWasteWatermark(container) {
  // Waste management silhouette
  const waste = document.createElement('div');
  waste.className = 'watermark-icon waste-icon';
  
  // Create waste treatment system silhouette
  const treatmentSystem = document.createElement('div');
  treatmentSystem.className = 'watermark-treatment';
  
  // Create waste container silhouette
  const wasteContainer = document.createElement('div');
  wasteContainer.className = 'watermark-waste-container';
  treatmentSystem.appendChild(wasteContainer);
  
  // Create filtration system silhouette
  const filtration = document.createElement('div');
  filtration.className = 'watermark-filtration';
  treatmentSystem.appendChild(filtration);
  
  // Create recycling symbol
  const recycling = document.createElement('div');
  recycling.className = 'watermark-recycling';
  
  // Create the three recycling arrows
  for (let i = 0; i < 3; i++) {
    const arrow = document.createElement('div');
    arrow.className = `recycling-arrow arrow-${i+1}`;
    recycling.appendChild(arrow);
  }
  
  waste.appendChild(treatmentSystem);
  waste.appendChild(recycling);
  container.appendChild(waste);
}

// Results Watermark
function createResultsWatermark(container) {
  // Results/reports silhouette
  const results = document.createElement('div');
  results.className = 'watermark-icon results-icon';
  
  // Create report document silhouette
  const report = document.createElement('div');
  report.className = 'watermark-report';
  
  // Create report lines
  for (let i = 0; i < 5; i++) {
    const line = document.createElement('div');
    line.className = `report-line line-${i+1}`;
    report.appendChild(line);
  }
  
  // Create graph/chart silhouette
  const chart = document.createElement('div');
  chart.className = 'watermark-chart';
  
  // Create bars for the chart
  for (let i = 0; i < 4; i++) {
    const bar = document.createElement('div');
    bar.className = `chart-bar bar-${i+1}`;
    chart.appendChild(bar);
  }
  
  results.appendChild(report);
  results.appendChild(chart);
  container.appendChild(results);
}

// Saved Calculations Watermark
function createSavedCalculationsWatermark(container) {
  // Saved data silhouette
  const saved = document.createElement('div');
  saved.className = 'watermark-icon saved-icon';
  
  // Create database/storage silhouette
  const database = document.createElement('div');
  database.className = 'watermark-database';
  
  // Create database records/layers
  for (let i = 0; i < 3; i++) {
    const record = document.createElement('div');
    record.className = `database-record record-${i+1}`;
    database.appendChild(record);
  }
  
  // Create folder with documents silhouette
  const folder = document.createElement('div');
  folder.className = 'watermark-folder';
  
  // Create documents in the folder
  for (let i = 0; i < 2; i++) {
    const doc = document.createElement('div');
    doc.className = `folder-document doc-${i+1}`;
    folder.appendChild(doc);
  }
  
  saved.appendChild(database);
  saved.appendChild(folder);
  container.appendChild(saved);
}