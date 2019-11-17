var redux = require("redux");
var cart = require("./cart");
var reducer = redux.combineReducers({
    cart:cart
});

module.exports = reducer;