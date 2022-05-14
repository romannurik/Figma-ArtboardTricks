import { isArtboard } from "../../util";

export default async function fitToContents() {
  if (figma.command.startsWith('relaunch')) {
    performFitWithPadding(0, true);
    figma.closePlugin();
    return;
  }

  figma.parameters.on('input', ({ key, query, result }: ParameterInputEvent) => {
    if (!figma.currentPage.selection.length) {
      result.setError('Select something first!');
      return;
    }
  

    switch (key) {
      case 'padding': {
        const padding = parseInt(query, 10);
        isNaN(padding)
          ? result.setSuggestions([])
          : result.setSuggestions([padding.toString()]);
        break;
      }
    }
  });

  figma.on('run', ({ parameters }: RunEvent) => {
    if (!figma.currentPage.selection.length) {
      figma.notify('Select something first!');
      figma.closePlugin();
      return;
    }
  
    const padding = parseInt(parameters?.padding, 10);
    isNaN(padding)
      ? performFitWithPadding(0, true)
      : performFitWithPadding(padding, false);
    figma.closePlugin();
  });
}

export function performFitWithPadding(padding: number, useSavedPadding = false) {
  let artboards = collectSelectedArtboards();

  for (let artboard of artboards) {
    let visibleChildren = artboard.children.filter(c => c.visible);
    if (!visibleChildren.length) {
      continue;
    }

    let artboardPadding = padding;
    if (useSavedPadding) {
      try {
        let savedPadding = parseInt(artboard.getPluginData('padding'), 10);
        if (!isNaN(savedPadding)) {
          artboardPadding = savedPadding;
        }
      } catch (e) { }
    }

    // collect boundaries
    let bounds = visibleChildren
      .reduce(({ l, t, r, b }, child) => {
        return {
          l: Math.min(child.x, l),
          t: Math.min(child.y, t),
          r: Math.max(child.x + child.width, r),
          b: Math.max(child.y + child.height, b),
        }
      }, { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity });

    // expand boundaries to padding
    bounds.l -= artboardPadding;
    bounds.t -= artboardPadding;
    bounds.r += artboardPadding;
    bounds.b += artboardPadding;

    // resize and reposition artboard
    artboard.resizeWithoutConstraints(
      bounds.r - bounds.l,
      bounds.b - bounds.t);

    // reposition layers
    artboard.x += bounds.l;
    artboard.y += bounds.t;
    artboard.children.forEach(child => {
      child.x -= bounds.l;
      child.y -= bounds.t;
    });

    // persist data and add relaunch buttons
    if (!useSavedPadding) {
      artboard.setPluginData('padding', String(padding));
      artboard.setRelaunchData({
        'relaunch_fit-to-contents': `With ${padding} padding`
      });
    }
  }
}

function collectSelectedArtboards(): FrameNode[] {
  return [...new Set(figma.currentPage.selection
    .map(node => {
      while (node.parent && node.parent.type != 'PAGE') {
        node = node.parent as SceneNode;
      }
      return node;
    })
    .filter(node => isArtboard(node))) as Set<FrameNode>];
}