import { createMainThreadMessenger } from 'figma-messenger';
import * as prefs from '../../prefs';

export default function showPrefs() {
  figma.showUI(__html__);
  const messenger = createMainThreadMessenger<PrefsMainToIframe, PrefsIframeToMain>();
  messenger.on('savePrefs', ({ prefs }) => {
    let { xSpacing, ySpacing } = prefs;
    figma.currentPage.setPluginData('prefs', JSON.stringify({ xSpacing, ySpacing }));
    figma.closePlugin();
  });
  messenger.on('cancel', () => figma.closePlugin());
  messenger.send('init', { prefs: prefs.resolvePagePrefs(figma.currentPage) });
}
