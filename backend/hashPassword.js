const bcrypt = require('bcryptjs');

const password = 'password';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
