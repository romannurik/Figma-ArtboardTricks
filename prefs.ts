const DEFAULT_PREFS = {
  xSpacing: 100,
  ySpacing: 400,
};

export function resolvePagePrefs(page: PageNode) {
  let prefs = { ...DEFAULT_PREFS };

  try {
    let pagePrefs = JSON.parse(page.getPluginData('prefs'));
    prefs = { ...prefs, ...pagePrefs };
  } catch (e) { }

  return prefs;
}