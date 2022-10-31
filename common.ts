import * as util from './util';
import { Artboard } from './util';

function ancestry(node: BaseNode): BaseNode[] {
  let a: BaseNode[] = [];
  let current: BaseNode = node;
  while (current?.parent && current.parent.type !== 'DOCUMENT') {
    a.unshift(current.parent);
    current = current.parent as BaseNode;
  }
  return a;
}

export function nearestCommonSectionOrPage(targetArtboards: Artboard[]): SectionNode | PageNode {
  if (!targetArtboards.length) {
    console.log('short');
    return figma.currentPage;
  }

  const allAncestries = targetArtboards.map(a => [...ancestry(a), a]);
  if (allAncestries.length === 1) {
    return allAncestries[0].reverse().find(p => p.type === 'SECTION' || p.type === 'PAGE') as SectionNode | PageNode;
  }

  let depth = 0;
  while (depth < 1000) {
    let current: BaseNode = allAncestries[0][depth];
    if (!current) {
      break;
    }
    for (let i = 1; i < allAncestries.length; i++) {
      if (allAncestries[i][depth] !== current || (current.type !== 'SECTION' && current.type !== 'PAGE')) {
        if (depth >= 1) {
          return allAncestries[0][depth - 1] as SectionNode | PageNode;
        } else {
          return figma.currentPage;
        }
      }
    }
    ++depth;
  }

  return figma.currentPage;
}

export function collectTargetArtboards(): Artboard[] {
  let sectionOrPage: PageNode | SectionNode = figma.currentPage;
  if (figma.currentPage.selection.length) {
    let selectedArtboards = figma.currentPage.selection
      .map(node => util.getContainingArtboard(node))
      .filter(node => !!node) as FrameNode[];
    if (selectedArtboards.length >= 2) {
      return selectedArtboards;
    }

    // return the nearest section or page
    sectionOrPage = nearestCommonSectionOrPage([selectedArtboards[0]]);
  }

  // otherwise, all artboards on the page
  return sectionOrPage.children.filter(node => util.isArtboard(node)) as Artboard[];
}
