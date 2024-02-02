const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, getUser, getUserById, getUserByUsername } = require("../db/users");
const { requireUser, requireAdmin } = require("./utils");
//Need to sign tokens 
const { JWT_SECRET = "sgfszgesgdsdsdbsjhgdndn" } = process.env;

//USERS.JS -->
// /api/users
router.get("/", (req, res) => {
    res.send("Hello from /api/users");
});

//Post api/users/login
//Try to get username and password from request
router.post("/login", async(req, res, next) => {
    //Check that request have both values, i.e. Check if username & password were provided
    //If not, Send a missingCredentialsError and a message
    //If no user, Send incorrectCredentialsError and a message
    //Otherwise, send a token
    //Send back an object with user's name + a useful message + token "Hi user name"
    //Handle errors
    
    //Extract variables
    const { username, password } = req.body;
    console.log("Inside login route", req.body);
    try {
    if(!username || !password) {
        //Check that request has both values (USN & PWD)
        console.log("missing credentials");
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and a password",
        });
    }
    const result = await getUserByUsername(username);
    console.log(result);
    // res.send(result);
    //query db for the user by the username and password
    //IF NOT USER, ---> Send an IncorrectCredentialsError and a message
    if(!result) {
        next({
            name: "IncorrectCrendentialsError",
            message: "Username or passoword is incorrect",
        });
        //Create a token
    } else {
        const token = jwt.sign({id: result.id, username: result.username}, JWT_SECRET,
            { expiresIn: '8w' }
            );
            console.log(token);
            //Send back an object with the user, and a useful message and the token
            res.send({ message: "Logged In Successfully!", token })
        }
//Handle Errors
 }  catch (err) {
    next(err);
    //pass middleware using next(err);
    }
});

//POST  /api/users/register
router.post("/register", async (req,res, next) => {
    //A user will submit a username and password
    //Check if user is existing already
    //Database query
    try{
        const { username, password } = req.body;
        //Find user in getUserByUsername
        const queriedUser = await getUserByUsername(username);
        if(!queriedUser) {
            res.status(401);
            next({
                name: "UserExistError",
                message: "A User by that username already exist",
            })
        } else if(password.length < 6) {
            send.status(401);
            next({
                name: "PasswordLengthError",
                message: "Password must be at least 6 characters long",
            });
        } else {
            //Create the user from user.js-->db import createUser function
            const user = await createUser({
                username,
                password,
            });
            if(!user) {
                next({
                    name: "UserCreationError",
                    message: "There was a problem creating yout account, Please Try Again!",
                });
            } else {
                //Create a Token
                const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET,
                    { expiresIn: '1w' }
                    );
                    res.send({ user, message: "Sign Up Successful!", token });
            }
        }

    } catch (err) {
        next(err);
    }
});

module.exports = router;