export interface Prefs {
  xSpacing: number;
  ySpacing: number;
}

const DEFAULT_PREFS: Prefs = {
  xSpacing: 100,
  ySpacing: 400,
};

export function resolvePrefs(node?: BaseNode): Prefs {
  let prefs = { ...DEFAULT_PREFS };

  try {
    prefs = { ...prefs, ...JSON.parse(node?.getPluginData('prefs') || '{}') };
  } catch (e) { }

  return prefs;
}