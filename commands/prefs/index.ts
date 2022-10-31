import { on, showUI } from '@create-figma-plugin/utilities';
import * as prefs from '../../prefs';
import * as common from '../../common';

export default function showPrefs() {
  let artboards = common.collectTargetArtboards();
  let sectionOrPage = common.nearestCommonSectionOrPage(artboards);

  showUI({
    height: 156,
    title: 'Artboard Tricks Preferences',
  }, {
    prefs: prefs.resolvePrefs(sectionOrPage),
    scope: (sectionOrPage.type === 'PAGE' ? 'page' : 'section') + ' "' + sectionOrPage.name + '"'
  });
  on('SAVE_PREFS', ({ prefs }) => {
    let { xSpacing, ySpacing } = prefs;
    sectionOrPage.setPluginData('prefs', JSON.stringify({ xSpacing, ySpacing }));
    figma.closePlugin();
  });
  on('CANCEL', () => figma.closePlugin());
}
