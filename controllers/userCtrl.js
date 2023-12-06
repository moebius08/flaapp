const {
    create,
    getAllUser,
    getUserbyId,
    updateUserbyId,
    deleteUserbyId,
    getUserByUserEmail
} = require('../service/user.service');
const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken');


module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection Error"
                });
            }
            return res.status(200).json({
                success: 1,
                data: result
            })
        });
    },

    getAllUser: (req, res) => {
        getAllUser((err, result) => {
            if (err) {
                console.log(err);
                return
            }
            return res.status(200).json({
                success: 1,
                data: result
            })
        });
    },

    getUserbyId: (req, res) => {
        const id = req.params.id;
        getUserbyId(id, (err, result) => {
            if (err) {
                console.log(err);
                return;
            } else if (!result) {
                return res.json({
                    success: 0,
                    message: "User not found"
                });
            }
            return res.status(200).json({
                success: 1,
                data: result
            })
        })
    },
    updateUserbyId: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUserbyId(body, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection Error"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "User Updated Successfully"
            })
        });
    },
    deleteUserbyId: (req, res) => {
        const data = req.body;
        deleteUserbyId(data.id, (err, result) => {
            if (err) {
                return console.log(err);
            } else if (!result) {
                return res.json({
                    success: 0,
                    message: "Record Not Found",
                })
            }
            return res.json({ success: 1, message: "Record Deleted Successfuly" })
        })

    },
    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    success: 0,
                    data: results
                })
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, "secretkey", {
                    expiresIn: "24h"
                });
                return res.json({
                    success: 1,
                    message: "Login Succesfuly",
                    token: jsontoken,
                    result: results
                });
            } else {
                return res.json({
                    success: 0,
                    message: "Invalid Email or Password",

                })
            }
        });
    }

}