import { translate } from '../utils/i18n.js';
import { LanguageSelector } from './LanguageSelector.js';
// adjust the path below to point at your actual logo file
const logoPath = new URL('../../assets/logo.png', import.meta.url).href;


export function Header() {
  const header = document.createElement('header');
  header.className = 'app-header';
  
  const headerContent = document.createElement('div');
  headerContent.className = 'container';
  
  // App title and controls wrapper
  const titleRow = document.createElement('div');
  titleRow.className = 'header-row';
  titleRow.style.display = 'flex';
  titleRow.style.alignItems = 'center';
  titleRow.style.justifyContent = 'space-between';
  titleRow.style.marginBottom = '10px';
  
  // Logo — you can tweak height/margin as needed
  const logo = document.createElement('img');
  logo.src = logoPath;
  logo.alt = translate('App Logo');
  logo.style.height = '180px';
  logo.style.marginRight = '15px';
  
  // App title
  const title = document.createElement('h1');
  title.textContent = translate('Environmental, Practicality, and Performance Index (EPPI)');
  title.style.margin = '0';  // reset any default margins
  
  // Create actions container for future use
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'header-actions';
  actionsContainer.style.display = 'flex';
  actionsContainer.style.gap = '10px';
  
  // Build the row: logo, title, then actions
  titleRow.appendChild(logo);
  titleRow.appendChild(title);
  titleRow.appendChild(actionsContainer);
  
  // Add our new language selector to actions container
  actionsContainer.appendChild(LanguageSelector());
  
  headerContent.appendChild(titleRow);
  header.appendChild(headerContent);
  
  // Initialize icons after adding to DOM
  setTimeout(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, 0);
  
  return header;
}

// Function to trigger download of the application as a ZIP package
function triggerDownload() {
  // Create modal to inform user about download
  const modal = document.createElement('div');
  modal.className = 'download-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';
  
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '5px';
  modalContent.style.maxWidth = '500px';
  modalContent.style.width = '90%';
  
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = translate('Download Application');
  
  const modalMessage = document.createElement('p');
  modalMessage.textContent = translate('The Environmental, Practicality, and Performance Index (EPPI) application will be downloaded as a ZIP file. Extract the contents to any location and open index.html to use the application offline on any device.');
  
  const modalInstructions = document.createElement('ul');
  modalInstructions.style.marginBottom = '20px';
  modalInstructions.style.paddingLeft = '20px';
  
  const instructions = [
    translate('Extract all files to a folder of your choice'),
    translate('Open the index.html file in any modern browser'),
    translate('The application will work completely offline'),
    translate('Your data will be stored on your device')
  ];
  
  instructions.forEach(instruction => {
    const li = document.createElement('li');
    li.textContent = instruction;
    li.style.margin = '5px 0';
    modalInstructions.appendChild(li);
  });
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'flex-end';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '20px';
  
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-secondary';
  cancelButton.textContent = translate('Cancel');
  cancelButton.onclick = () => document.body.removeChild(modal);
  
  const downloadButton = document.createElement('button');
  downloadButton.className = 'btn btn-primary';
  downloadButton.textContent = translate('Download Now');
  downloadButton.onclick = () => {
    // Close the modal
    document.body.removeChild(modal);
    
    // Create a link to the ZIP file
    const link = document.createElement('a');
    link.href = '/download/ei-calculator.zip';
    link.download = 'ei-calculator.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    showNotification(translate('Download started! Extract the ZIP file to use the application offline.'));
  };
  
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(downloadButton);
  
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalMessage);
  modalContent.appendChild(modalInstructions);
  modalContent.appendChild(buttonContainer);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Allow closing by clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Function to show a notification message
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = '#4CAF50';
  notification.style.color = 'white';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notification.style.zIndex = '1000';
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 5000);
}
