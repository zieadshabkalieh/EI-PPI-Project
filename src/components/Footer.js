// ─── src/components/Footer.js ───
import { translate } from '../utils/i18n.js';
const logoPath = new URL('/EI-PPI-Project/assets/logo.png', import.meta.url).href;

export function Footer() {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  // Optional: add some padding/top border in your CSS for spacing

  const wrapper = document.createElement('div');
  wrapper.className = 'container';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '8px';
  wrapper.style.padding = '20px 0';

  // Logo at the top of footer
  const logo = document.createElement('img');
  logo.src = logoPath;
  logo.alt = translate('App Logo');
  logo.style.height = '120px';
  logo.style.objectFit = 'contain';
  logo.style.marginBottom = '8px';
  wrapper.appendChild(logo);

  /* Copyright */
  const copyright = document.createElement('p');
  copyright.textContent = `© ${new Date().getFullYear()} ` +
    translate('Environmental, Practicality, and Performance Index (EPPI)');

  /* Reference */
   const reference = document.createElement('p');
   reference.textContent = translate(
     'Based on the Environmental Impact (EI) scale for analytical methods'
   );

  /* Developer credit */
  // Developer credit + icon
 const credit = document.createElement('p');
 credit.className = 'developer-credit';

const link = document.createElement('a');
link.href = 'https://zsktech.info/';
link.target = '_blank';
link.rel = 'noopener noreferrer';
link.style.display = 'inline-flex';
link.style.alignItems = 'center';
link.style.gap = '6px';
link.style.fontSize = '1.1rem';

// // Pick any small SVG/PNG you like and place it in /assets
 const devIcon = document.createElement('img');
 devIcon.src = new URL('../../assets/dev-icon.png', import.meta.url).href;

 devIcon.alt = '';
 devIcon.style.width  = '30px';
 devIcon.style.height = '30px';

 const label = document.createTextNode(
   translate('Developed by Eng. Ziead Shab Kalieh')

 );

 link.appendChild(devIcon);
 link.appendChild(label);
 credit.appendChild(link);


  /* Assemble */
   [copyright, reference, credit].forEach(el => wrapper.appendChild(el));
  //    [copyright].forEach(el => wrapper.appendChild(el));
  footer.appendChild(wrapper);

  return footer;
}
