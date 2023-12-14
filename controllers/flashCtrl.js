const {
    selectAllLevelsAndCompletedLevels,
    getNextLevelId,
    getProgressCount,
    addLevelUserProgress,
    incrementProgress
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
        console.log(user_id)
        getNextLevelId(user_id, (err, results) => {
            if (err) {
                console.log(err)
                return
            } else if (!results) {
                return res.json({
                    success: 0,
                    message: "Something went wrong"
                });
            }
            const forProg = {
                user_id: user_id,
                level_id: body.level_id
            }
            getProgressCount(forProg, (err, result) => {
                if (err) {
                    console.log(err)
                } else if (!result) {
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
                }
            })
        })
    },
    increment: (req, res) => {
        const user_id = req.user.id;
        const body = req.body
        console.log(user_id)
        data = {
            user_id: user_id,
            level_id: body.level_id
        }
        incrementProgress(data, (err, result) => {
            if (err) {
                return res.json({
                    success: 0,
                    message: "DB FAILED"
                })

            } else if (!result) {
                return res.json({
                    success: 0,
                    message: "Something went wrong again"
                })
            } else {
                return res.status(200).json({
                    success: 1,
                    message: "Progress up by 1"
                })
            }
        })
    }
}