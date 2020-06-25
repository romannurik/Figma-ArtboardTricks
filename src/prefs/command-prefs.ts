import * as prefs from '../prefs';
import * as html from './prefs-ui.html';

export default function showPrefs() {
  setupMessageHandlers();
  figma.showUI(html);
  figma.ui.postMessage({
    type: 'current-prefs',
    prefs: prefs.resolvePagePrefs(figma.currentPage),
  });
}

function setupMessageHandlers() {
  figma.ui.onmessage = msg => {
    switch (msg.type) {
      case 'save-prefs': {
        let {prefs} = msg;
        let {xSpacing, ySpacing, shouldRename} = prefs;
        figma.currentPage.setPluginData('prefs', JSON.stringify({xSpacing, ySpacing, shouldRename}));
        figma.closePlugin();
        break;
      }

      case 'cancel-prefs': {
        figma.closePlugin();
        break;
      }
    }
  };
}
