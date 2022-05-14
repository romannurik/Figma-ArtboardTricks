import * as common from '../../common';
import * as util from '../../util';
import * as prefs from '../../prefs';

export default function rearrangeGrid() {
  let currentPrefs = prefs.resolvePagePrefs(figma.currentPage);
  let artboards = common.collectTargetArtboards();

  figma.currentPage.setRelaunchData({
    'relaunch_rearrange-grid': ''
  });

  // find row-starting artboards
  let rowStarterArtboards: FrameNode[] = [];
  artboards.forEach((artboard: FrameNode) => {
    let leftmostInRow = true;
    artboards.forEach(otherArtboard => {
      if (artboard === otherArtboard) {
        return;
      }

      if (otherArtboard.x < artboard.x) {
        if (artboard.y <= (otherArtboard.y + otherArtboard.height)
          && otherArtboard.y <= (artboard.y + artboard.height)) {
          leftmostInRow = false;
          return;
        }
      }
    });

    if (leftmostInRow) {
      rowStarterArtboards.push(artboard);
    }
  });

  // sort list of row-starting artboards
  rowStarterArtboards.sort((a, b) => a.y - b.y);

  // start a list of artboards for each row
  let rows: FrameNode[][] = [];
  let rowHeights: number[] = [];
  let artboardRows = new Map<FrameNode, number>();

  rowStarterArtboards.forEach((artboard: FrameNode, i) => {
    artboardRows.set(artboard, i);
    rows[i] = [artboard];
    rowHeights[i] = artboard.height;
  });

  // assign all other artboards to a row by
  // computing shortest distance between artboard vertical centers
  artboards.forEach(artboard => {
    if (rowStarterArtboards.indexOf(artboard) >= 0) {
      return;
    }

    let distanceToRowStarter = new Map();
    rowStarterArtboards.forEach(rowStarterArtboard => {
      distanceToRowStarter.set(rowStarterArtboard, Math.abs(
        rowStarterArtboard.y + rowStarterArtboard.height / 2 - (artboard.y + artboard.height / 2)));
    });

    let tmp = [...rowStarterArtboards];
    tmp.sort((a, b) => distanceToRowStarter.get(a) - distanceToRowStarter.get(b));

    let artboardRow = artboardRows.get(tmp[0])!;
    rows[artboardRow].push(artboard);

    // update row height
    rowHeights[artboardRow] = Math.max(rowHeights[artboardRow], artboard.height);
  });

  // sort each row by x position
  rows.forEach(artboardsInRow => artboardsInRow.sort((a, b) => a.x - b.x));

  // finally, arrange everything
  let originX = 0, originY = 0;
  if (rows.length >= 1 && rows[0].length >= 1) {
    originX = rows[0][0].x;
    originY = rows[0][0].y;
  }

  let y = originY;
  rows.forEach((artboardsInRow, r) => {
    let x = originX;
    artboardsInRow.forEach(artboard => {
      artboard.x = x;
      artboard.y = y;
      x += artboard.width + currentPrefs.xSpacing;
    });
    y += rowHeights[r] + currentPrefs.ySpacing;
  });

  // update artboard position in the sidebar
  let sortedArtboards: FrameNode[] = [];
  rows.forEach(artboardsInRow => {
    artboardsInRow.forEach(artboard => {
      sortedArtboards.push(artboard);
    });
  });

  // update artboard position in the sidebar
  util.reorderNodes(sortedArtboards);
  figma.closePlugin();
}
