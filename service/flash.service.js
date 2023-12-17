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
            SELECT MIN(l.id) AS next_level_id
            FROM level l
            WHERE l.id > (
                SELECT IFNULL(MAX(ul.level_id), 0)
                FROM user_level ul
                WHERE ul.user_id = ?
            )
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
    getProgressCount: (data, callback) => {
        // SQL statement to get the progress count and total lesson count
        const sql = `
            SELECT 
                ul.progress AS progress_count,
                (SELECT COUNT(*) FROM lesson WHERE level_id = ?) AS total_lesson_count
            FROM 
                user_level ul
            WHERE 
                ul.level_id = ? AND ul.user_id = ?
        `;
        // Execute the SQL statement
        db.query(sql, [data.level_id, data.level_id, data.user_id], (error, results, fields) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            return callback(null, results);
        });
    },

    incrementProgress: (data, callback) => {
        const sql = `
            UPDATE user_level 
            SET progress = progress + 1 
            WHERE user_id = ? AND level_id = ?
        `;

        // Execute the SQL statement
        db.query(sql, [data.user_id, data.level_id], (error, results, fields) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            return callback(null, results);
        });
    },

    completedLessonByLevelId: (data, callback) => {
        const sql = `SELECT lesson.* 
                        FROM lesson 
                        JOIN user_lesson 
                        ON lesson.id = user_lesson.lesson_id 
                        WHERE user_lesson.user_id = ? 
                        AND lesson.level_id = ?;
        `;
        db.query(sql, [data.user_id, data.level_id], (error, results, fields) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            return callback(null, results);
        })
    },
    lockedLessonByLevelId: (data, callback) => {
        const sql = `SELECT lesson.*
        FROM lesson
        WHERE NOT EXISTS (
        SELECT 1
        FROM user_lesson
        WHERE user_lesson.user_id = ?
        AND user_lesson.lesson_id = lesson.id
        )
        AND lesson.level_id = ?
        `
        db.query(sql, [data.user_id, data.level_id], (error, results, fields) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
            return callback(null, results);
        })
    },
}