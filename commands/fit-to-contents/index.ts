import { createMainThreadMessenger } from 'figma-messenger';

const messenger = createMainThreadMessenger<FitMainToIframe, FitIframeToMain>();

export default async function fitToContents({ relaunch }) {
  if (!figma.currentPage.selection.length) {
    figma.notify('Select something first!');
    figma.closePlugin();
    return;
  }

  if (relaunch) {
    await performFitWithPadding(0, true);
    figma.closePlugin();
    return;
  }

  let padding = await computeDefaultPadding(collectSelectedArtboards());
  figma.showUI(__html__);
  messenger.on('performFit', async ({ padding }) => {
    await performFitWithPadding(padding);
    figma.closePlugin();
  });
  messenger.on('cancel', () => figma.closePlugin());
  messenger.send('init', { padding });
}

export async function performFitWithPadding(padding, useSavedPadding = false) {
  // collect artboards
  let artboards = collectSelectedArtboards();

  for (let artboard of artboards) {
    let visibleChildren = artboard.children.filter(c => c.visible);
    if (!visibleChildren.length) {
      continue;
    }

    let artboardPadding = padding;
    if (useSavedPadding) {
      try {
        let savedPadding = parseInt(await artboard.getPluginData('padding'), 10);
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
      await artboard.setPluginData('padding', String(padding));
      artboard.setRelaunchData({
        'relaunch_fit-to-contents': `With ${padding}px padding`
      });
    }
  }
}

async function computeDefaultPadding(artboards: FrameNode[]): Promise<number> {
  for (let artboard of artboards) {
    try {
      let artboardPadding = parseInt(artboard.getPluginData('padding'), 10);
      if (!isNaN(artboardPadding)) {
        return artboardPadding;
      }
    } catch (e) { }
  }

  return 0;
}

function collectSelectedArtboards(): FrameNode[] {
  return [...new Set(figma.currentPage.selection
    .map(node => {
      while (node.parent && node.parent.type != 'PAGE') {
        node = node.parent as SceneNode;
      }
      return node;
    })
    .filter(node => node && node.type == 'FRAME')) as Set<FrameNode>];
}