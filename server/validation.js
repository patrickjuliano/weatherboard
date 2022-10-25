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

function checkTimestamp(dt) {
    dt = checkNumber(dt);
    if (!Number.isInteger(dt) || dt < 0) throw 'You must provide a non-negative integer';
    return dt;
}

module.exports = {
    checkString,
    checkNumber,
    checkTimestamp
}