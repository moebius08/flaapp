const db = require('../databaseConnection/db')

module.exports = {
    create: (data, callback) => {
        db.query(
            'insert into user(name, email, password) values(?,?,?)', [
                data.name,
                data.email,
                data.password
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        );
    },
    checkEmail: (email, callback) => {
        db.query(
            'SELECT * FROM user WHERE email = ?', [email],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            })
    },
    getAllUser: (callback) => {
        db.query(
            `SELECT * FROM user`, [],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getUserbyId: (id, callback) => {
        db.query(
            `SELECT * FROM user where id = ?`, [id],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },
    updateUserbyId: (data, callback) => {
        db.query(
            `UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?`, [
                data.id,
                data.name,
                data.email,
                data.password
            ],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },
    deleteUserbyId: (data, callback) => {
        db.query(
            `DELETE FROM user WHERE id = ?`, [data],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    },
    getUserByUserEmail: (data, callback) => {
        db.query(
            `SELECT * from user WHERE email = ?`, [data],
            (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results[0]);
            }
        )
    },
    insertFirstLevel: (user_id, callback) => {
        db.query(
            `INSERT INTO user_level (user_id, level_id, unlocked, progress) VALUES (?, 1,1,0)`, [user_id], (error, results, fields) => {
                if (error) {
                    return callback(error);
                }
                return callback(null, results);
            }
        )
    }
}