var day = function () {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    nowday = day.toString()+month.toString()+year.toString();
    return nowday;
}
console.log(day());