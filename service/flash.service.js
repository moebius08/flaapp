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
        l.name AS level_name, 
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
    },
    //Insert user_level and user_lesson when new register


    addLevelUserProgress: (data, callback) => {
        db.query(`INSERT INTO user_level (user_id, level_id, unlocked, progress) VALUES (?, ?, 1, 0)`, [data.user_id, data.level_id], (error, results, fields) => {
            if (error) {
                return callback(error)
            }
            return callback(null, results)
        })
    },
    getNextLevelId: (user_id, callback) => {
        // SQL statement to get the next level ID for a user
        const sql = `
            SELECT IFNULL(MAX(ul.level_id), 0) + 1 AS next_level_id
            FROM user_level ul
            WHERE ul.user_id = ?
        `;
        // Execute the SQL statement
        db.query(sql, [user_id], (error, results, fields) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            return callback(null, results);
        });
    },
    getProgressCount: (level_id, callback) => {
        // SQL statement to get the progress count and total lesson count
        const sql = `
            SELECT 
                ul.progress AS progress_count,
                COUNT(l.id) AS total_lesson_count
            FROM 
                user_level ul
            LEFT JOIN 
                lesson l ON l.level_id = ul.level_id
            WHERE 
                ul.level_id = ?
            GROUP BY 
                ul.level_id
        `;
        // Execute the SQL statement
        db.query(sql, [level_id], (error, results, fields) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            return callback(null, results);
        });
    }

}