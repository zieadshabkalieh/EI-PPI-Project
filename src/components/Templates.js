import { methodTemplates, createTemplate } from '../data/templates.js';
import { translate } from '../utils/i18n.js';
import { showLoader } from '../utils/animations.js';

export function Templates(onSelectTemplate, onSaveTemplate, currentState) {
  const container = document.createElement('div');
  container.className = 'templates-container';
  
  // Create header
  const header = document.createElement('h2');
  header.textContent = translate('Method Templates');
  header.className = 'section-title';
  container.appendChild(header);
  
  // Add description
  const description = document.createElement('p');
  description.textContent = translate('Select a template for your analytical method or create a new one from your current settings.');
  description.className = 'template-description';
  container.appendChild(description);
  
  // Create template cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'template-cards';
  
  // Create a template card for each template
  methodTemplates.forEach(template => {
    const card = createTemplateCard(template, onSelectTemplate);
    cardsContainer.appendChild(card);
  });
  
  // Add "Create New Template" card
  const createNewCard = createNewTemplateCard(currentState, onSaveTemplate);
  cardsContainer.appendChild(createNewCard);
  
  container.appendChild(cardsContainer);
  
  return container;
}

// Function to create a template card element
function createTemplateCard(template, onSelect) {
  const card = document.createElement('div');
  card.className = 'template-card';
  card.dataset.templateId = template.id;
  
  // Card header with method name
  const cardHeader = document.createElement('div');
  cardHeader.className = 'template-card-header';
  
  const methodName = document.createElement('h3');
  methodName.textContent = template.name;
  cardHeader.appendChild(methodName);
  
  card.appendChild(cardHeader);
  
  // Card body with description
  const cardBody = document.createElement('div');
  cardBody.className = 'template-card-body';
  
  const methodDescription = document.createElement('p');
  methodDescription.textContent = template.description;
  cardBody.appendChild(methodDescription);
  
  // Add some key characteristics
  const characteristics = document.createElement('div');
  characteristics.className = 'template-characteristics';
  
  // Sample preparation
  const samplePrepItem = document.createElement('div');
  samplePrepItem.className = 'characteristic-item';
  samplePrepItem.innerHTML = `<strong>${translate('Sample Prep')}:</strong> ${getComplexityLevel(template.data.samplePrep)}`;
  characteristics.appendChild(samplePrepItem);
  
  // Instrumentation
  const instrumentationItem = document.createElement('div');
  instrumentationItem.className = 'characteristic-item';
  instrumentationItem.innerHTML = `<strong>${translate('Energy')}:</strong> ${getEnergyLevel(template.data.instrumentation)}`;
  characteristics.appendChild(instrumentationItem);
  
  // Reagents
  const reagentsItem = document.createElement('div');
  reagentsItem.className = 'characteristic-item';
  reagentsItem.innerHTML = `<strong>${translate('Reagents')}:</strong> ${template.data.reagents.length}`;
  characteristics.appendChild(reagentsItem);
  
  // EI Score estimate
  const scoreEstimate = getEstimatedScore(template.data);
  const scoreItem = document.createElement('div');
  scoreItem.className = 'characteristic-item';
  scoreItem.innerHTML = `<strong>${translate('Est. EI Score')}:</strong> <span class="${getScoreClass(scoreEstimate)}">${scoreEstimate}</span>`;
  characteristics.appendChild(scoreItem);
  
  cardBody.appendChild(characteristics);
  
  card.appendChild(cardBody);
  
  // Card footer with actions
  const cardFooter = document.createElement('div');
  cardFooter.className = 'template-card-footer';
  
  const useButton = document.createElement('button');
  useButton.className = 'btn btn-primary btn-sm';
  useButton.textContent = translate('Use Template');
  useButton.addEventListener('click', () => {
    const hideLoader = showLoader(translate('Loading template...'));
    
    // Add a small delay to show the loader
    setTimeout(() => {
      onSelect(template);
      hideLoader();
    }, 800);
  });
  
  cardFooter.appendChild(useButton);
  card.appendChild(cardFooter);
  
  return card;
}

// Function to create a "Create New Template" card
function createNewTemplateCard(currentState, onSaveTemplate) {
  const card = document.createElement('div');
  card.className = 'template-card new-template-card';
  
  // Card header
  const cardHeader = document.createElement('div');
  cardHeader.className = 'template-card-header';
  
  const title = document.createElement('h3');
  title.textContent = translate('Create New Template');
  cardHeader.appendChild(title);
  
  card.appendChild(cardHeader);
  
  // Card body
  const cardBody = document.createElement('div');
  cardBody.className = 'template-card-body';
  
  const description = document.createElement('p');
  description.textContent = translate('Save your current method settings as a new template for future use.');
  cardBody.appendChild(description);
  
  // Form for new template
  const form = document.createElement('div');
  form.className = 'new-template-form';
  
  // Template name
  const nameGroup = document.createElement('div');
  nameGroup.className = 'form-group';
  
  const nameLabel = document.createElement('label');
  nameLabel.textContent = translate('Template Name');
  nameLabel.htmlFor = 'template-name';
  nameGroup.appendChild(nameLabel);
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'template-name';
  nameInput.className = 'form-control';
  nameInput.placeholder = translate('Enter a name for your template');
  nameGroup.appendChild(nameInput);
  
  form.appendChild(nameGroup);
  
  // Template description
  const descGroup = document.createElement('div');
  descGroup.className = 'form-group';
  
  const descLabel = document.createElement('label');
  descLabel.textContent = translate('Description');
  descLabel.htmlFor = 'template-description';
  descGroup.appendChild(descLabel);
  
  const descInput = document.createElement('textarea');
  descInput.id = 'template-description';
  descInput.className = 'form-control';
  descInput.placeholder = translate('Describe your analytical method');
  descInput.rows = 3;
  descGroup.appendChild(descInput);
  
  form.appendChild(descGroup);
  
  cardBody.appendChild(form);
  card.appendChild(cardBody);
  
  // Card footer with save button
  const cardFooter = document.createElement('div');
  cardFooter.className = 'template-card-footer';
  
  const saveButton = document.createElement('button');
  saveButton.className = 'btn btn-success btn-sm';
  saveButton.textContent = translate('Save as Template');
  saveButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    
    if (!name) {
      alert(translate('Please enter a template name'));
      return;
    }
    
    const hideLoader = showLoader(translate('Saving template...'));
    
    // Add a small delay to show the loader
    setTimeout(() => {
      const newTemplate = createTemplate(name, description, currentState);
      onSaveTemplate(newTemplate);
      hideLoader();
      
      // Reset the form
      nameInput.value = '';
      descInput.value = '';
    }, 800);
  });
  
  cardFooter.appendChild(saveButton);
  card.appendChild(cardFooter);
  
  return card;
}

// Helper function to get complexity level text
function getComplexityLevel(samplePrep) {
  if (samplePrep.sampleType === 'complex' || samplePrep.derivatization || samplePrep.purification) {
    return translate('Complex');
  }
  if (samplePrep.extractionNeeded !== 'no' || samplePrep.nonGreenSolvent) {
    return translate('Moderate');
  }
  return translate('Simple');
}

// Helper function to get energy level text
function getEnergyLevel(instrumentation) {
  switch(instrumentation.energy) {
    case 'high':
      return translate('High');
    case 'medium':
      return translate('Medium');
    case 'low':
      return translate('Low');
    default:
      return translate('Minimal');
  }
}

// Helper function to get a very rough estimate of EI score based on template data
function getEstimatedScore(data) {
  let score = 0;
  
  // Sample prep contribution
  if (data.samplePrep.nonGreenSolvent) score += 10;
  if (data.samplePrep.energyConsumption) score += 5;
  if (data.samplePrep.purification) score += 5;
  if (data.samplePrep.derivatization) score += 10;
  if (data.samplePrep.extractionNeeded !== 'no') score += 8;
  
  // Instrumentation contribution
  if (data.instrumentation.energy === 'high') score += 15;
  else if (data.instrumentation.energy === 'medium') score += 10;
  else if (data.instrumentation.energy === 'low') score += 5;
  
  if (data.instrumentation.vaporEmission) score += 8;
  
  // Reagents contribution
  data.reagents.forEach(reagent => {
    if (reagent.signalWord === 'danger') score += 8;
    else if (reagent.signalWord === 'warning') score += 4;
    
    if (reagent.volume === 'large') score += 6;
    else if (reagent.volume === 'medium') score += 3;
  });
  
  // Waste contribution
  if (data.waste.volume === 'more10') score += 15;
  else if (data.waste.volume === 'less10') score += 10;
  else if (data.waste.volume === 'less5') score += 5;
  
  if (!data.waste.biodegradable) score += 5;
  if (data.waste.treatment === 'incineration') score += 10;
  
  return Math.min(Math.round(score), 100);
}

// Helper function to get the appropriate color class for a score
function getScoreClass(score) {
  if (score === 0) return 'result-ideal';
  if (score <= 25) return 'result-good';
  if (score <= 50) return 'result-medium';
  return 'result-bad';
}