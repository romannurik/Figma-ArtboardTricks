interface FitIframeToMain {
  performFit(args: { padding: number });
  cancel();
}

interface FitMainToIframe {
  init(args: { padding: number });
}