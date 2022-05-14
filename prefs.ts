export interface Prefs {
  xSpacing: number;
  ySpacing: number;
}

const DEFAULT_PREFS: Prefs = {
  xSpacing: 100,
  ySpacing: 400,
};

export function resolvePagePrefs(page: PageNode): Prefs {
  let prefs = { ...DEFAULT_PREFS };

  try {
    let pagePrefs = JSON.parse(page.getPluginData('prefs'));
    prefs = { ...prefs, ...pagePrefs };
  } catch (e) { }

  return prefs;
}