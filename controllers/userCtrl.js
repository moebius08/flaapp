const {
    create,
    getAllUser,
    getUserbyId,
    updateUserbyId,
    deleteUserbyId,
    getUserByUserEmail,
    checkEmail
} = require('../service/user.service');
const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken');


module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        if (body.password.length >= 6) {
            checkEmail(body.email, (err, result) => {
                if (!result) {
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
                } else {
                    return res.status(401).json({
                        success: 0,
                        message: "Email already in use"
                    })
                }
            })
        } else {
            return res.status(401).json({
                success: 0,
                message: "Password must be greater than or equal to 6"
            })
        }
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
                return res.status(400).json({
                    success: 0,
                    message: "No User Found",
                })
            }
            const result = compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = sign({ result: results }, "secretkey", {
                    expiresIn: "24h"
                });
                return res.status(200).json({
                    success: 1,
                    message: "Login Succesfuly",
                    token: jsontoken,
                });
            } else {
                return res.status(401).json({
                    success: 0,
                    message: "Invalid Email or Password",

                })
            }
        });
    }
}