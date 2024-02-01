//Has all logic for wizards table in Database(CREATE, SELECT, DELETE)
//Interacting with Database brings in our client.js -->db
const client = require("./client");
//Create a wizard in Database and add SALT require bcrypt
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

//Write a function to create the user in the Database
async function createUser ({ username, password }) {
   
 //Serious calculations add const hashed PWD
     const hashedPwd = await bcrypt.hash(password, SALT_COUNT);
 //Change password on array after SQL to [username, hashedPWD];
//When we run SELECT * FROM wizards --> We should see hashed passwords
try{
    const {rows: [user]} = await client.query(`
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING 
    RETURNING id, username
    `,
    [username, hashedPwd]);
    return user;
} catch (err) {
    throw err;
}
}
    //This gets actual object out of array
    //Pick out rows object, result of the query
    //Destructure array an pick out it's object aka the variable name { user }
    //Then console.log or return;

    //get a user and a user's password
    async function getUser({ username, password }) {
        if(!username || !password) {
            return;
        }
        try{
            const user = await getUserByUsername(username);
            if(!user) return; //Gets us out of function immediatly 
            //Will return undefined
            const hashedPassword = user.password;
            const passwordsMatch = await bcrypt.compare(password, hashedPassword);
            //IF MATCH, Return True
            //IF NOT, Return False
            if(!passwordsMatch) return;
            //Otherwise delete user.password from DB
            delete user.password;
            return user;
        } catch (err) {
            throw err;
        }
    }

    //Get a User by userId
    async function getUserById(userId) {
        //First get the user
        try{
            const {rows:[user]} = await client.query(`
                SELECT * FROM users
                WHERE id = $1;
            `,[userId]);
            //If doesnt exist Return null; value
            if (!user) return null;
            //If DOES,:
            //delete the 'password' key from the returned object
            delete user.password;
            return user;
        } catch (err) {
            throw err;//Handled by middleware
    }
}

  //Get a User by userName
  async function getUserByUsername(userName) {
   console.log("Getting User");
    try{
        const {rows} = await client.query(`
        SELECT * FROM users 
        WHERE username = $1;
        `, [userName]);
        //IF NOT FOUND- Return Null
        if(!rows || rows.length ===0) return null;
    const [user] = rows;
    //If user is found, delete password key from the returned object
    delete user.password;
    console.log("User", user);
    return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}



module.exports = { createUser, getUser, getUserById, getUserByUsername, };

