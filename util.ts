
const ARTBOARD_NODE_TYPES: Set<SceneNode['type']> = new Set([
  'FRAME',
  'COMPONENT',
  'COMPONENT_SET',
]);

/**
 * Returns true if the given layer is an artboard-like object (i.e. an artboard
 * or a symbol master).
 */
export function isArtboard(node: SceneNode) {
  return node && ARTBOARD_NODE_TYPES.has(node.type) && node.parent && node.parent.type == 'PAGE';
}


export function getContainingArtboard(node: SceneNode): FrameNode | null {
  while (!!node && !isArtboard(node)) {
    node = node.parent as SceneNode;
  }

  return node as FrameNode;
}


/**
 * Reorders the given layers in the layer list based on their position in the array.
 * If they're in different containing groups, reorders locally within that group.
 */
export function reorderNodes(nodes: SceneNode[]) {
  // rearrange in layer list
  let indexesInParents = new Map<BaseNode & ChildrenMixin, number>();

  nodes.forEach(node => {
    let parent = node.parent;
    if (!parent) {
      return;
    }

    if (!indexesInParents.has(parent)) {
      let siblings = parent.children;
      indexesInParents.set(parent, siblings.findIndex(l => l.parent === parent && nodes.indexOf(l) >= 0));
    }

    parent.insertChild(indexesInParents.get(parent)!, node);
  });
}
