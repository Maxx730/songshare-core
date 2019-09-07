let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit:100,
    host:'localhost',
    user:'root',
    password:'dRmario43'
});

module.exports = pool;