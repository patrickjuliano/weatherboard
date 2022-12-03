function checkString(string) {
    if (!string || typeof string !== 'string' || string.trim().length === 0) throw 'You must provide a valid non-empty string';
    return string.trim();
}

function checkEmail(string) {
    let res = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (res.test(string)){
        return true;
    } else throw 'Email is not valid';
}

function checkMatchingStrings(str1, str2) {
    if (str1 === str2) {
        return true;
    } else throw 'Strings do not match';
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
    checkEmail,
    checkMatchingStrings,
    checkNumber,
    checkTimestamp
}