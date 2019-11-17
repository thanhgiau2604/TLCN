var cartReducer = (state=[],action) => {
    switch(action.type) {
        case 'UPDATE_PRODUCT':
            return action.newcart;
        default:
            return state;
    }
}

module.exports = cartReducer;