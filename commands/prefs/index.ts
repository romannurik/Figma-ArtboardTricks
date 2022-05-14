import { on, showUI } from '@create-figma-plugin/utilities';
import * as prefs from '../../prefs';

export default function showPrefs() {
  showUI({
    height: 156,
    title: 'Artboard Tricks Preferences',
    // themeColors: true,
  }, {
    prefs: prefs.resolvePagePrefs(figma.currentPage)
  });
  on('SAVE_PREFS', ({ prefs }) => {
    let { xSpacing, ySpacing } = prefs;
    figma.currentPage.setPluginData('prefs', JSON.stringify({ xSpacing, ySpacing }));
    figma.closePlugin();
  });
  on('CANCEL', () => figma.closePlugin());
}
