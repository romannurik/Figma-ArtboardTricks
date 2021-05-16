interface PrefsIframeToMain {
  savePrefs(args: { prefs: any });
  cancel();
}

interface PrefsMainToIframe {
  init(args: { prefs: any });
}