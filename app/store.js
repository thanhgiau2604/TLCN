var redux = require("redux");
var reducer = require("./reducer/reducer.js");

var store = redux.createStore(reducer, redux.compose(
    window.devToolsExtension?window.devToolsExtension(): f=>f
));

module.exports = store;
