function checkString(string) {
    if (!string || typeof string !== 'string' || string.trim().length === 0) throw 'You must provide a valid non-empty string';
    return string.trim();
}

function checkNumber(num) {
    if (typeof num === 'string') num = checkString(num);
    num = Number(num);
    if (isNaN(num)) throw 'You must provide a valid number';
    return num;
}

module.exports = {
    checkString,
    checkNumber
}