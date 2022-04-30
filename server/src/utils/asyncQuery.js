const { db }  = require('../app');

function asynqQuery(query, params) {
    return new Promise((resolve, reject) =>{
        db.query(query, params, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
}

module.exports.asynqQuery = asynqQuery;
