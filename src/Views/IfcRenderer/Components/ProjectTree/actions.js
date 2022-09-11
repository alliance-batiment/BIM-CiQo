const hashMapSpatialStructures = (spatialStructures, hash, parentID = 0) => spatialStructures.reduce((acc, structure) => {
  acc[structure.expressID] = structure;
  acc[structure.expressID].parentsIds = acc[parentID] && acc[parentID].parentsIds ? [...acc[parentID].parentsIds, structure.expressID] : [structure.expressID];
  acc[structure.expressID].childrenIds = getChildNodes([structure.expressID], acc[structure.expressID])
  if (structure.children) {
    acc = hashMapSpatialStructures(structure.children, acc, structure.expressID);
    acc[structure.expressID].parentID = parentID;
  }
  return acc;
}, hash)

function getChildNodes(nodeID, spatialStructures) {
  let childNodes = [nodeID[0]];

  //GET Object
  const elem = spatialStructures;
  function traverseChildren(spatialStructures) {
    if (spatialStructures.children && spatialStructures.children.length > 0) {
      spatialStructures.children.forEach((child) => {
        childNodes.push(child.expressID);
        traverseChildren(child);
      });
    }
  }

  traverseChildren(elem);
  return childNodes;
};

function addExpandedNodes(tree) {
  const hashMapTree = hashMapSpatialStructures(tree, {});
  return { originalStructureTree: tree, hashMapTree };
};

function recomputeToVtree(selectedItems) {
  const computeSelectedItems = selectedItems.reduce((acc, val) => {
    acc[val] = {
      open: true
    };
    return acc;
  }, {});
  return computeSelectedItems;
}

function manageNodeSelection(oldSelectedItems, selectedItems, childrenIds, nodeId) {
  let selectedTree = selectedItems;
  if (oldSelectedItems.length > 0) {
    if (oldSelectedItems.includes(parseInt(nodeId))) {
      const indexOfExistingItem = oldSelectedItems.indexOf(parseInt(nodeId));
      const newSelectedItems = oldSelectedItems
        .filter((_, i) => i !== indexOfExistingItem)
        .filter((selectedItem) => {
          return !childrenIds.includes(selectedItem);
        });
      selectedTree = newSelectedItems;
    } else {
      selectedTree = [...new Set(oldSelectedItems.concat([...selectedItems, parseInt(nodeId)]))]
    }
  }
  return selectedTree;
}

async function highlightOnTreeView(selected, viewer) {
  const mapSelected = selected.map((item) => parseInt(item, 10));
  await viewer.IFC.pickIfcItemsByID(0, mapSelected);
}

export const loadTree = (dispatch) => (tree, eids) => {
  const { originalStructureTree, hashMapTree } = addExpandedNodes(tree);
  let selectedItems = eids;
  if (eids.length === 1) {
    const selectedIFCObject = hashMapTree[eids[0]];
    const { childrenIds, parentsIds } = selectedIFCObject ?? { childrenIds: [], parentsIds: [] };
    selectedItems = [...eids, ...childrenIds, ...parentsIds]
  }

  const vtree = recomputeToVtree(selectedItems);
  dispatch({
    type: 'LOAD_DATA',
    payload: {
      originalStructureTree: originalStructureTree,
      hashMapTree: hashMapTree,
      vtree: vtree,
      selected: selectedItems
    },
  });
}

export const toggleNode = (dispatch) => async (selected, hashMapTree, nodeId, viewer) => {

  const { childrenIds, parentsIds } = hashMapTree[nodeId] ?? { childrenIds: [], parentsIds: [] };
  let familyTreeIds = [...parentsIds, ...childrenIds];
  let oldFamilyTreeIds = selected;
  const selectedItemsUpdated = manageNodeSelection(oldFamilyTreeIds, familyTreeIds, childrenIds, nodeId)

  const computeToTree = selectedItemsUpdated.map((item) => item.toString())
  const newVtree = recomputeToVtree(computeToTree);

  await highlightOnTreeView(computeToTree, viewer)

  dispatch({
    type: 'SELECT_CHILDREN',
    payload: {
      selected: selectedItemsUpdated,
      vtree: newVtree
    },
  });
}

export const deselectAllNodes = (dispatch) => async (viewer) => {
  await viewer.IFC.unpickIfcItems();
  dispatch({
    type: 'RESET_TREE'
  });
}