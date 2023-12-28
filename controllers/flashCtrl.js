const {
    selectAllLevelsAndCompletedLevels,
    getNextLevelId,
    getProgressCount,
    addLevelUserProgress,
    incrementProgress,
    completedLessonByLevelId,
    lockedLessonByLevelId,
    lessonComplete
} = require("../service/flash.service");


module.exports = {
    showCurrentLevel: (req, res) => {
        const user_id = req.user.id;
        console.log(user_id)
        selectAllLevelsAndCompletedLevels(user_id, (err, result) => {
            console.log("Code Working Here")
            if (err) {
                console.log(err)
                return
            } else if (!result) {
                return res.json({
                    success: 0,
                    message: "No Level Started yet"
                });
            }
            return res.status(200).json({
                success: 1,
                data: result
            })
        })
    },
    levelUp: (req, res) => {
        const user_id = req.user.id;
        const body = req.body;
        const forProg = {
            user_id: user_id,
            level_id: body.level_id
        }
        console.log(user_id)

        getProgressCount(forProg, (err, result) => {
            if (err) {
                console.log(err);
                return res.json({
                    success: 0,
                    message: "Something went wrong"
                });
            }
            console.log(result)
            if (result.length === 0) {
                return res.json({
                    success: 0,
                    message: "Sending the wrong level_id"
                })
            }
            if (result[0].progress_count < result[0].total_lesson_count) {
                return res.json({
                    success: 0,
                    message: "Please Complete The Current Level First"
                })
            } else {
                getNextLevelId(user_id, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            success: 0,
                            message: "Something went wrong"
                        });
                    }
                    console.log(results[0].next_level_id - 2)
                    console.log(body.level_id)
                    if (results[0].next_level_id - 1 <= body.level_id) {
                        const data = {
                            user_id: user_id,
                            level_id: results[0].next_level_id
                        };
                        addLevelUserProgress(data, (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.json({
                                    success: 0,
                                    message: "Something went wrong"
                                })
                            } else if (!result) {
                                return res.json({
                                    success: 0,
                                    message: "Something went wrong"
                                })
                            } else {
                                return res.status(200).json({
                                    success: 1,
                                    data: result
                                })
                            }
                        })
                    } else {
                        return res.status(500).json({
                            success: 0,
                            message: "Bad level_id Passed"
                        })
                    }
                })
            }
        })
    },
    getAllLessons: (req, res) => {
        const user_id = req.user.id;
        const level_id = req.query.level_id;

        try {
            if (!level_id) {
                return res.status(407).json({
                    success: 0,
                    message: 'Invalid level ID'
                })
            } else {
                data = {
                    user_id: user_id,
                    level_id,
                }
                completedLessonByLevelId(data, (err, userLevel) => {
                    if (err) {
                        return res.status(500).json({
                            success: 0,
                            message: "DB FAILED"
                        })
                    } else {
                        lockedLessonByLevelId(data, (err, lessons) => {
                            if (err) {
                                return res.status(500).json({
                                    success: 0,
                                    message: "DB FAILED"
                                })
                            } else {
                                let formattedLessons = [];
                                userLevel.forEach(lesson => {
                                    formattedLessons.push({
                                        id: lesson.id,
                                        level_id: lesson.level_id,
                                        lesson: lesson.lesson,
                                        status: "completed"
                                    });
                                });
                                lessons.forEach((lesson, index) => {
                                    formattedLessons.push({
                                        id: lesson.id,
                                        level_id: lesson.level_id,
                                        lesson: lesson.lesson,
                                        status: index === 0 ? "unlocked" : "locked"
                                    });
                                });
                                return res.status(200).json({
                                    success: 1,
                                    data: formattedLessons
                                })
                            }
                        })
                    }
                })
            }
        } catch (error) {
            res.status(500).json({
                success: 0,
                error: error
            })
        }
    },

    completeLesson: (req, res) => {
        try {
            const user_id = req.user.id;
            const body = req.body
            data = {
                user_id: user_id,
                level_id: body.level_id,
                lesson_id: body.lesson_id
            }
            completedLessonByLevelId(data, (err, completedLessons) => {
                if (err) {
                    return res.json({
                        success: 0,
                        message: "DB FAILED"
                    })
                } else {
                    const isCompleted = completedLessons.some(lesson => lesson.id === data.lesson_id);
                    if (isCompleted) {
                        return res.status(200).json({
                            success: 1,
                            message: 'Lesson already completed'
                        })
                    } else {
                        lessonComplete(data, (err, result) => {
                            if (err) {
                                return res.json({
                                    success: 0,
                                    message: "DB FAILED"
                                })
                            } else {
                                incrementProgress(data, (err, result) => {
                                    if (err) {
                                        return res.json({
                                            success: 0,
                                            message: "DB FAILED"
                                        })
                                    }
                                })
                                return res.status(200).json({
                                    success: 1,
                                    message: 'Lesson Completed Congratulations'
                                })
                            }
                        })
                    }
                }
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: 0,
                error: error
            })
        }
    }
}