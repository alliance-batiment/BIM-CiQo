function reducer(state, action) {
    switch (action.type) {
        case 'LOAD_DATA': {
            const { originalStructureTree, hashMapTree, vtree, selected } = action.payload;
            return { ...state, spatialStructures: originalStructureTree, hashMapTree: hashMapTree, vtree: vtree, selected: selected, loading: false };
        }
        case 'SET_EXPANDED':
            return { ...state, expanded: action.payload, loading: false, loadingCursor: false };
        case 'SELECT_CHILDREN':
            const { selected, vtree } = action.payload;
            return { ...state, selected: selected, vtree: vtree, expanded: null, loading: false };
        case 'RESET_TREE':
            return { ...state, selected: [], vtree: {}, expanded: null, loading: false };
        case 'LOADING':
            return { ...state, loading: true };
        case 'LOADING_CURSOR':
            return { ...state, loadingCursor: true };
        default:
            throw new Error();
    }
}

export default reducer;