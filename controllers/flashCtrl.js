const { selectAllLevelsAndCompletedLevels } = require("../service/flash.service");


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
            console.log("Code working here")
            return res.status(200).json({
                success: 1,
                data: result
            })
        })
    }
}