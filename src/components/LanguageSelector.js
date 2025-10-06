import { getCurrentLanguage, setLanguage, languageNames } from '../utils/i18n.js';
import { translate } from '../utils/i18n.js';

export function LanguageSelector() {
//   // List of implemented languages
//   const implementedLanguages = ['en', 'es', 'zh', 'fr', 'ja', 'hi', 'ar'];
  
  const container = document.createElement('div');
//   container.className = 'language-selector';
//   container.style.position = 'relative';
//   container.style.display = 'inline-block';
//   container.style.zIndex = '100';
  
//   // Create dropdown button with current language
//   const dropdownButton = document.createElement('button');
//   dropdownButton.className = 'language-dropdown-button';
//   dropdownButton.style.display = 'flex';
//   dropdownButton.style.alignItems = 'center';
//   dropdownButton.style.padding = '8px 12px';
//   dropdownButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
//   dropdownButton.style.border = '1px solid rgba(255, 255, 255, 0.3)';
//   dropdownButton.style.borderRadius = '4px';
//   dropdownButton.style.cursor = 'pointer';
//   dropdownButton.style.fontWeight = 'bold';
//   dropdownButton.style.color = 'white';
//   dropdownButton.style.transition = 'all 0.3s ease';
//   dropdownButton.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  
//   // Add hover effect
//   dropdownButton.addEventListener('mouseover', () => {
//     dropdownButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
//     dropdownButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
//   });
  
//   dropdownButton.addEventListener('mouseout', () => {
//     dropdownButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
//     dropdownButton.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
//   });
  
//   // Globe icon
//   const globeIcon = document.createElement('span');
//   globeIcon.className = 'globe-icon';
//   globeIcon.textContent = '🌐';
//   globeIcon.style.marginRight = '8px';
//   dropdownButton.appendChild(globeIcon);
  
//   // Current language text
//   const currentLangText = document.createElement('span');
//   currentLangText.textContent = languageNames[getCurrentLanguage()];
//   dropdownButton.appendChild(currentLangText);
  
//   // Dropdown arrow
//   const arrow = document.createElement('span');
//   arrow.className = 'dropdown-arrow';
//   arrow.textContent = '▼';
//   arrow.style.fontSize = '10px';
//   arrow.style.marginLeft = '8px';
//   arrow.style.opacity = '0.7';
//   dropdownButton.appendChild(arrow);
  
//   // Create dropdown content
//   const dropdownContent = document.createElement('div');
//   dropdownContent.className = 'language-dropdown-content';
//   dropdownContent.style.display = 'none';
//   dropdownContent.style.position = 'absolute';
//   dropdownContent.style.backgroundColor = 'white';
//   dropdownContent.style.minWidth = '180px';
//   dropdownContent.style.boxShadow = '0px 8px 20px rgba(0,0,0,0.15)';
//   dropdownContent.style.zIndex = '1000';
//   dropdownContent.style.borderRadius = '8px';
//   dropdownContent.style.marginTop = '8px';
//   dropdownContent.style.right = '0';
//   dropdownContent.style.overflow = 'hidden';
//   dropdownContent.style.opacity = '0';
//   dropdownContent.style.transform = 'translateY(-10px)';
//   dropdownContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
//   // Header in dropdown
//   const dropdownHeader = document.createElement('div');
//   dropdownHeader.className = 'dropdown-header';
//   dropdownHeader.textContent = translate('Language');
//   dropdownHeader.style.padding = '12px 16px';
//   dropdownHeader.style.borderBottom = '1px solid #eee';
//   dropdownHeader.style.fontWeight = 'bold';
//   dropdownHeader.style.color = '#666';
//   dropdownContent.appendChild(dropdownHeader);
  
//   // Populate options for implemented languages
//   implementedLanguages.forEach(langCode => {
//     const option = document.createElement('div');
//     option.className = `lang-option ${langCode === getCurrentLanguage() ? 'active' : ''}`;
//     option.setAttribute('data-lang', langCode);
//     option.style.padding = '12px 16px';
//     option.style.cursor = 'pointer';
//     option.style.display = 'flex';
//     option.style.alignItems = 'center';
//     option.style.justifyContent = 'space-between';
//     option.style.backgroundColor = langCode === getCurrentLanguage() ? '#f0f7ff' : 'transparent';
    
//     const langName = document.createElement('span');
//     langName.textContent = languageNames[langCode];
//     option.appendChild(langName);
    
//     // Add check mark for current language
//     if (langCode === getCurrentLanguage()) {
//       const checkMark = document.createElement('span');
//       checkMark.textContent = '✓';
//       checkMark.style.fontWeight = 'bold';
//       checkMark.style.color = '#007bff';
//       option.appendChild(checkMark);
//     }
    
//     // Add transition for smooth hover effects
//     option.style.transition = 'all 0.2s ease';
    
//     // Enhanced hover effect
//     option.addEventListener('mouseover', () => {
//       if (langCode !== getCurrentLanguage()) {
//         option.style.backgroundColor = '#f5f5f5';
//         option.style.paddingLeft = '20px';
//       }
//     });
    
//     option.addEventListener('mouseout', () => {
//       if (langCode !== getCurrentLanguage()) {
//         option.style.backgroundColor = 'transparent';
//         option.style.paddingLeft = '16px';
//       }
//     });
    
//     // Click event to change language
//     option.addEventListener('click', () => {
//       if (langCode !== getCurrentLanguage()) {
//         setLanguage(langCode);
        
//         // Create and dispatch a custom event to notify components that need to update their content
//         const languageChangeEvent = new CustomEvent('languageChanged', { 
//           detail: { language: langCode } 
//         });
//         document.dispatchEvent(languageChangeEvent);
        
//         // Update UI without reloading
//         dropdownButton.childNodes[1].textContent = languageNames[langCode];
//         dropdownContent.style.display = 'none';
        
//         // Reload the page to apply the new language to all components
//         // Using a small delay to allow the event to be processed first
//         setTimeout(() => {
//           window.location.reload();
//         }, 100);
//       } else {
//         // Just close the dropdown if selecting current language
//         dropdownContent.style.display = 'none';
//       }
//     });
    
//     dropdownContent.appendChild(option);
//   });
  
//   // Toggle dropdown on button click
//   dropdownButton.addEventListener('click', (e) => {
//     e.stopPropagation();
//     const isVisible = dropdownContent.style.display === 'block';
    
//     if (isVisible) {
//       // Hide dropdown with animation
//       dropdownContent.style.opacity = '0';
//       dropdownContent.style.transform = 'translateY(-10px)';
      
//       // After animation completes, hide the element
//       setTimeout(() => {
//         dropdownContent.style.display = 'none';
//       }, 300);
//     } else {
//       // Show dropdown and start animation
//       dropdownContent.style.display = 'block';
      
//       // Trigger animation in next frame (necessary for the transition to work)
//       setTimeout(() => {
//         dropdownContent.style.opacity = '1';
//         dropdownContent.style.transform = 'translateY(0)';
//       }, 10);
//     }
    
//     // Update arrow direction
//     arrow.textContent = isVisible ? '▼' : '▲';
//   });
  
//   // Close dropdown when clicking elsewhere
//   document.addEventListener('click', () => {
//     if (dropdownContent.style.display === 'block') {
//       // Hide with animation
//       dropdownContent.style.opacity = '0';
//       dropdownContent.style.transform = 'translateY(-10px)';
      
//       // After animation completes, hide the element
//       setTimeout(() => {
//         dropdownContent.style.display = 'none';
//       }, 300);
      
//       arrow.textContent = '▼';
//     }
//   });
  
//   // Prevent clicks inside dropdown from closing it
//   dropdownContent.addEventListener('click', (e) => {
//     e.stopPropagation();
//   });
  
//   // Append elements to container
//   container.appendChild(dropdownButton);
//   container.appendChild(dropdownContent);
  
  return container;
}