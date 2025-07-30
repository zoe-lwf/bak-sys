export default function CollapsedReducer(preState = {isCollapsed: false}, action){
    switch (action.type) {
        case 'change_collapsed':
            return {isCollapsed: !preState.isCollapsed}
        default:
            return preState
    }
}