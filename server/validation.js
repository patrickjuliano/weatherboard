function checkString(string) {
    if (!string || typeof string !== 'string' || string.trim().length === 0) throw 'You must provide a valid non-empty string';
    return string.trim();
}

module.exports = {
    checkString
}