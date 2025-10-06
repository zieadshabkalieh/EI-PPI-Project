import { translate } from './i18n.js';

// Base function for creating a tab-specific loader
function createBaseLoader() {
  // Remove any existing loaders
  const existingLoader = document.querySelector('.loader-container');
  if (existingLoader) {
    document.body.removeChild(existingLoader);
  }
  
  // Create the loader container
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'loader-container';
  
  // Add loading text container (will be filled by specific animations)
  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loaderContainer.appendChild(loadingText);
  
  return { loaderContainer, loadingText };
}

// Sample Preparation Animation - Advanced Auto-Sampler
export function createSamplePrepLoader() {
  const { loaderContainer, loadingText } = createBaseLoader();
  
  // Create a high-end autosampler animation
  const mortarContainer = document.createElement('div');
  mortarContainer.className = 'analytical-animation mortar-container';
  
  // Create autosampler base
  const autosamplerBase = document.createElement('div');
  autosamplerBase.className = 'autosampler-base';
  mortarContainer.appendChild(autosamplerBase);
  
  // Create carousel
  const carousel = document.createElement('div');
  carousel.className = 'carousel';
  mortarContainer.appendChild(carousel);
  
  // Create sample vials
  for (let i = 1; i <= 5; i++) {
    const vial = document.createElement('div');
    vial.className = `sample-vial vial-${i}`;
    carousel.appendChild(vial);
  }
  
  // Create robotic arm
  const roboticArm = document.createElement('div');
  roboticArm.className = 'robotic-arm';
  
  // Create arm head
  const armHead = document.createElement('div');
  armHead.className = 'arm-head';
  
  // Create injector
  const injector = document.createElement('div');
  injector.className = 'injector';
  armHead.appendChild(injector);
  
  roboticArm.appendChild(armHead);
  mortarContainer.appendChild(roboticArm);
  
  // Create sample transfer animation
  const sampleTransfer = document.createElement('div');
  sampleTransfer.className = 'sample-transfer';
  mortarContainer.appendChild(sampleTransfer);
  
  loaderContainer.insertBefore(mortarContainer, loadingText);
  loadingText.textContent = translate('Auto-sampling in progress...');
  
  return loaderContainer;
}

// Instrumentation Animation - Modern HPLC System
export function createInstrumentationLoader() {
  const { loaderContainer, loadingText } = createBaseLoader();
  
  // Create a modern HPLC system animation
  const instrumentContainer = document.createElement('div');
  instrumentContainer.className = 'analytical-animation instrument-container';
  
  // Create the main HPLC system module
  const hplcSystem = document.createElement('div');
  hplcSystem.className = 'hplc-system';
  
  // Create system display
  const systemDisplay = document.createElement('div');
  systemDisplay.className = 'system-display';
  
  // Create display data visualization
  const displayData = document.createElement('div');
  displayData.className = 'display-data';
  systemDisplay.appendChild(displayData);
  
  hplcSystem.appendChild(systemDisplay);
  
  // Create column compartment
  const columnCompartment = document.createElement('div');
  columnCompartment.className = 'column-compartment';
  hplcSystem.appendChild(columnCompartment);
  
  // Create detector module
  const detectorModule = document.createElement('div');
  detectorModule.className = 'detector-module';
  
  // Create detector light
  const detectorLight = document.createElement('div');
  detectorLight.className = 'detector-light';
  detectorModule.appendChild(detectorLight);
  
  hplcSystem.appendChild(detectorModule);
  
  // Create connection tube
  const connectionTube = document.createElement('div');
  connectionTube.className = 'connection-tube';
  hplcSystem.appendChild(connectionTube);
  
  instrumentContainer.appendChild(hplcSystem);
  
  // Create data screen with chromatogram
  const dataScreen = document.createElement('div');
  dataScreen.className = 'data-screen';
  
  // Create chromatogram display
  const chromatogram = document.createElement('div');
  chromatogram.className = 'chromatogram';
  
  // Create peaks for the chromatogram
  for (let i = 0; i < 4; i++) {
    const peak = document.createElement('div');
    peak.className = `chromatogram-peak peak-${i+1}`;
    chromatogram.appendChild(peak);
  }
  
  dataScreen.appendChild(chromatogram);
  instrumentContainer.appendChild(dataScreen);
  
  loaderContainer.insertBefore(instrumentContainer, loadingText);
  loadingText.textContent = translate('Configuring high-resolution chromatography system...');
  
  return loaderContainer;
}

// Reagent Animation
export function createReagentLoader() {
  const { loaderContainer, loadingText } = createBaseLoader();
  
  // Create a reagent mixing animation
  const reagentContainer = document.createElement('div');
  reagentContainer.className = 'analytical-animation reagent-container';
  
  // Create flask
  const flask = document.createElement('div');
  flask.className = 'reagent-flask';
  
  // Create reagent liquid
  const liquid = document.createElement('div');
  liquid.className = 'reagent-liquid';
  flask.appendChild(liquid);
  
  // Create bubbles in the flask
  for (let i = 0; i < 6; i++) {
    const bubble = document.createElement('div');
    bubble.className = `reagent-bubble bubble-${i+1}`;
    liquid.appendChild(bubble);
  }
  
  reagentContainer.appendChild(flask);
  
  // Create a pipette
  const pipette = document.createElement('div');
  pipette.className = 'pipette';
  
  // Create a pipette drop
  const pipetteDrop = document.createElement('div');
  pipetteDrop.className = 'pipette-drop';
  pipette.appendChild(pipetteDrop);
  
  reagentContainer.appendChild(pipette);
  
  loaderContainer.insertBefore(reagentContainer, loadingText);
  loadingText.textContent = translate('Preparing reagents...');
  
  return loaderContainer;
}

// Waste Animation
export function createWasteLoader() {
  const { loaderContainer, loadingText } = createBaseLoader();
  
  // Create a waste treatment animation
  const wasteContainer = document.createElement('div');
  wasteContainer.className = 'analytical-animation waste-container';
  
  // Create waste container
  const wasteFlask = document.createElement('div');
  wasteFlask.className = 'waste-flask';
  
  // Create waste liquid
  const wasteLiquid = document.createElement('div');
  wasteLiquid.className = 'waste-liquid';
  wasteFlask.appendChild(wasteLiquid);
  
  // Create bubbles in the waste
  for (let i = 0; i < 4; i++) {
    const bubble = document.createElement('div');
    bubble.className = `waste-bubble w-bubble-${i+1}`;
    wasteLiquid.appendChild(bubble);
  }
  
  wasteContainer.appendChild(wasteFlask);
  
  // Create filter/treatment
  const filter = document.createElement('div');
  filter.className = 'waste-filter';
  
  // Create filter particles
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement('div');
    particle.className = `filter-particle fp-${i+1}`;
    filter.appendChild(particle);
  }
  
  wasteContainer.appendChild(filter);
  
  loaderContainer.insertBefore(wasteContainer, loadingText);
  loadingText.textContent = translate('Analyzing waste management...');
  
  return loaderContainer;
}

// Results Animation
export function createResultsLoader() {
  const { loaderContainer, loadingText } = createBaseLoader();
  
  // Create a results/data analysis animation
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'analytical-animation results-container';
  
  // Create graph paper background
  const graphPaper = document.createElement('div');
  graphPaper.className = 'graph-paper';
  
  // Create graph lines
  for (let i = 0; i < 6; i++) {
    const hLine = document.createElement('div');
    hLine.className = `graph-line h-line h-line-${i}`;
    graphPaper.appendChild(hLine);
    
    const vLine = document.createElement('div');
    vLine.className = `graph-line v-line v-line-${i}`;
    graphPaper.appendChild(vLine);
  }
  
  resultsContainer.appendChild(graphPaper);
  
  // Create data points that animate
  for (let i = 0; i < 5; i++) {
    const dataPoint = document.createElement('div');
    dataPoint.className = `data-point point-${i+1}`;
    resultsContainer.appendChild(dataPoint);
  }
  
  // Create a trend line
  const trendLine = document.createElement('div');
  trendLine.className = 'trend-line';
  resultsContainer.appendChild(trendLine);
  
  loaderContainer.insertBefore(resultsContainer, loadingText);
  loadingText.textContent = translate('Analyzing results...');
  
  return loaderContainer;
}

// Templates Animation
export function createTemplatesLoader() {
  const { loaderContainer, loadingText } = createBaseLoader();
  
  // Create a templates/document animation
  const templatesContainer = document.createElement('div');
  templatesContainer.className = 'analytical-animation templates-container-anim';
  
  // Create stacked documents effect
  for (let i = 0; i < 3; i++) {
    const document = document.createElement('div');
    document.className = `template-document doc-${i+1}`;
    
    // Add document lines
    for (let j = 0; j < 4; j++) {
      const line = document.createElement('div');
      line.className = `doc-line line-${j+1}`;
      document.appendChild(line);
    }
    
    templatesContainer.appendChild(document);
  }
  
  // Create animated checkmark
  const checkmark = document.createElement('div');
  checkmark.className = 'template-checkmark';
  templatesContainer.appendChild(checkmark);
  
  loaderContainer.insertBefore(templatesContainer, loadingText);
  loadingText.textContent = translate('Loading analytical method templates...');
  
  return loaderContainer;
}

// Function to show the appropriate loader based on tab
export function showTabLoader(tabId) {
  // This is now a no-op function that immediately returns a hideLoader function
  // No actual loader is shown to avoid any animation freezes
  
  // Return a function to "hide" the loader (immediately does nothing)
  return function hideLoader() {
    // No-op function
  };
}