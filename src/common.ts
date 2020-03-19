import * as util from './util';

export function collectTargetArtboards(): FrameNode[] {
  if (figma.currentPage.selection.length) {
    let selectedArtboards = figma.currentPage.selection
        .map(node => util.getContainingArtboard(node))
        .filter(node => !!node) as FrameNode[];
    if (selectedArtboards.length >= 2) {
      return selectedArtboards;
    }
  }

  // otherwise, all artboards on the page
  return figma.currentPage.children.filter(node => util.isArtboard(node)) as FrameNode[];
}
