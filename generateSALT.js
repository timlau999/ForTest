const crypto = require('crypto');
const salt = crypto.randomBytes(16).toString('hex');
console.log(salt);
