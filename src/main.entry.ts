import fitToContents from './fit-to-contents/command-fit-to-contents';
import showPrefs from './prefs/command-prefs';
import rearrangeGrid from './rearrange-grid/command-rearrange-grid';

switch (figma.command) {
  case 'relaunch-rearrange':
  case 'rearrange':
    rearrangeGrid();
    break;

  case 'prefs':
    showPrefs();
    break;
  
  case 'relaunch-fit-to-contents':
  case 'fit-to-contents':
    fitToContents(figma.command == 'relaunch-fit-to-contents');
    break;
  
  default:
    figma.notify(`Unknown command "${figma.command}"`);
    figma.closePlugin();
}
