import { translate } from './i18n.js';

// Create main loader function
export function createLoader() {
  // Remove any existing loaders
  const existingLoader = document.querySelector('.loader-container');
  if (existingLoader) {
    document.body.removeChild(existingLoader);
  }
  
  // Create the loader container
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'loader-container';
  
  // Create chemistry beaker
  const beaker = document.createElement('div');
  beaker.className = 'chemistry-beaker';
  
  // Create liquid
  const liquid = document.createElement('div');
  liquid.className = 'beaker-liquid';
  
  // Create bubbles
  for (let i = 1; i <= 3; i++) {
    const bubble = document.createElement('div');
    bubble.className = `beaker-bubbles bubble-${i}`;
    beaker.appendChild(bubble);
  }
  
  beaker.appendChild(liquid);
  loaderContainer.appendChild(beaker);
  
  // Create molecule animation
  const moleculeContainer = document.createElement('div');
  moleculeContainer.className = 'molecule-container';
  
  for (let i = 1; i <= 3; i++) {
    const molecule = document.createElement('div');
    molecule.className = `molecule molecule-${i}`;
    
    const atom = document.createElement('div');
    atom.className = 'atom';
    molecule.appendChild(atom);
    
    moleculeContainer.appendChild(molecule);
  }
  
  loaderContainer.appendChild(moleculeContainer);
  
  // Add loading text
  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loadingText.textContent = translate('Processing chemistry data...');
  loaderContainer.appendChild(loadingText);
  
  return loaderContainer;
}

// Function to show loading animation
export function showLoader(message = null) {
  const loader = createLoader();
  
  if (message) {
    const loadingText = loader.querySelector('.loading-text');
    loadingText.textContent = translate(message);
  }
  
  document.body.appendChild(loader);
  
  // Return a function to hide the loader
  return function hideLoader() {
    loader.classList.add('loader-hidden');
    
    // After animation completes, remove the loader
    setTimeout(() => {
      if (document.body.contains(loader)) {
        document.body.removeChild(loader);
      }
    }, 500);
  };
}

// Tab transition animation with enhanced effects
export function animateTabTransition(oldTab, newTab, callback) {
  if (oldTab) {
    // Add more dynamic fade-out with slight scale reduction
    oldTab.classList.add('fade-out');
    oldTab.style.transform = 'scale(0.98)';
    oldTab.style.opacity = '0';
    oldTab.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    
    setTimeout(() => {
      oldTab.style.display = 'none';
      oldTab.classList.remove('fade-out');
      oldTab.style.transform = '';
      oldTab.style.opacity = '';
      
      if (newTab) {
        // Prepare new tab for entrance animation
        newTab.style.display = 'block';
        newTab.style.opacity = '0';
        newTab.style.transform = 'scale(1.02)';
        newTab.classList.add('fade-in');
        
        // Trigger reflow to ensure animation applies
        newTab.offsetHeight;
        
        // Apply entrance animation
        newTab.style.opacity = '1';
        newTab.style.transform = 'scale(1)';
        newTab.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        
        setTimeout(() => {
          newTab.classList.remove('fade-in');
          newTab.style.transform = '';
          newTab.style.transition = '';
          if (callback) callback();
        }, 500);
      } else if (callback) {
        callback();
      }
    }, 300);
  } else if (newTab) {
    newTab.style.display = 'block';
    newTab.classList.add('fade-in');
    
    setTimeout(() => {
      newTab.classList.remove('fade-in');
      if (callback) callback();
    }, 500);
  } else if (callback) {
    callback();
  }
}

// Create a chemical reaction animation for transitions
export function createReactionAnimation(container, callback) {
  const reactionContainer = document.createElement('div');
  reactionContainer.className = 'reaction-animation';
  
  const reactant = document.createElement('div');
  reactant.className = 'reactant';
  
  const arrow = document.createElement('div');
  arrow.className = 'arrow';
  
  const product = document.createElement('div');
  product.className = 'product';
  
  reactionContainer.appendChild(reactant);
  reactionContainer.appendChild(arrow);
  reactionContainer.appendChild(product);
  
  container.appendChild(reactionContainer);
  
  // Remove the animation after completion
  setTimeout(() => {
    container.removeChild(reactionContainer);
    if (callback) callback();
  }, 3000);
}

// Create a page transition effect for initial load
export function createPageTransition() {
  const transition = document.createElement('div');
  transition.className = 'page-transition';
  
  // Create a loading spinner
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  transition.appendChild(spinner);
  
  // Add loading text
  const loadingText = document.createElement('div');
  loadingText.className = 'loading-text';
  loadingText.textContent = translate('Initializing Environmental, Practicality, and Performance Index (EPPI)(EI & PPI)...');
  transition.appendChild(loadingText);
  
  document.body.appendChild(transition);
  
  // Remove after animation completes
  setTimeout(() => {
    transition.style.display = 'none';
    document.body.removeChild(transition);
  }, 1500);
}

// Timer to show chemistry facts during loading
export const chemistryFacts = [
  translate('Green chemistry aims to minimize the use of hazardous substances.'),
  translate('The 12 Principles of Green Chemistry guide environmentally friendly approaches.'),
  translate('Analytical chemistry plays a crucial role in environmental monitoring.'),
  translate('Sustainable analytical methods reduce waste and energy consumption.'),
  translate('Solvents can contribute significantly to the environmental impact of a method.'),
  translate('Reagent selection can dramatically affect the environmental footprint.'),
  translate('Water is generally the greenest solvent for chemical processes.'),
  translate('The Dual Index system helps quantify both environmental impact and practicality of analytical methods.'),
  translate('High-throughput methods often have a lower per-sample environmental impact.'),
  translate('Automated sample preparation can help reduce chemical waste.'),
  translate('Instrument energy consumption contributes to a method\'s carbon footprint.')
];

// Function to show animated loading with rotating chemistry facts
export function showLoadingWithFacts(container, duration = 3000) {
  const loader = createLoader();
  container.appendChild(loader);
  
  const loadingText = loader.querySelector('.loading-text');
  let factIndex = Math.floor(Math.random() * chemistryFacts.length);
  
  // Set initial fact
  loadingText.textContent = chemistryFacts[factIndex];
  
  // Change fact every few seconds
  const factInterval = setInterval(() => {
    factIndex = (factIndex + 1) % chemistryFacts.length;
    
    // Fade out current text
    loadingText.style.opacity = 0;
    
    // Fade in new text after a short delay
    setTimeout(() => {
      loadingText.textContent = chemistryFacts[factIndex];
      loadingText.style.opacity = 1;
    }, 300);
  }, 3000);
  
  // Return a function to hide the loader
  return function hideLoader() {
    clearInterval(factInterval);
    loader.classList.add('loader-hidden');
    
    // After animation completes, remove the loader
    setTimeout(() => {
      if (container.contains(loader)) {
        container.removeChild(loader);
      }
    }, 500);
  };
}