const db = require('../databaseConnection/db');


module.exports = {
    selectAllLevels: (callback) => {
        db.query(`SELECT * from level`, [], (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results);
        })
    },
    selectLessonByLevel: (level_id, callback) => {
        db.query(`SELECT * FROM Lesson WHERE level_id = ?`, [level_id], (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results);
        })
    },
    selectLessonFlashCard: (data, callback) => {
        db.query(`SELECT * FROM LessonFlashCard WHERE lesson_id = ? AND flash_id = ? `, [data.level_id, data.flash_id], (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results);
        })
    },
    selectFlashCard: (id, callback) => {
        db.query(`SELECT * FROM flash_card WHERE id = ?`, [id], (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            return callback(null, results)
        })
    },
    selectAllLevelsAndCompletedLevels: (user_id, callback) => {
        db.query(`SELECT 
        u.id AS user_id, 
        l.id AS level_id, 
        IF(ul.level_id IS NULL, 0, 1) AS started,
        ul.progress AS progress
    FROM 
        level l
    LEFT JOIN 
        user_level ul ON l.id = ul.level_id AND ul.user_id = ?
    LEFT JOIN 
        user u ON u.id = ul.user_id`, [user_id], (error, results, fields) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            return callback(null, results)
        })
    }
}