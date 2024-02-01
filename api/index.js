//Send request from index.js to api folder then api to various routers
//Find user token, get id out of that --> jwt
//Parse token, set user on the request object
//Middleware

//INDEX.JS --API
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
const {
    getAllWizards,
    getWizardById,
    createWizard,
    searchWizardsByName,
} = require("../db/wands");
const { requireAdmin } = require("./utils");
const { JWT_SECRET = "sgegegegebrsdbsrb" } = process.env;




async function authenticate(req, res, next) {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
    if(!auth) {
        //Get them out of middleware
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
        try{
            //Parse the token
            const parsedToken = jwt.verify(token, JWT_SECRET);
            console.log(parsedToken);
            
            const id = parsedToken && parsedToken.id//Second argumnet will only return if the first one exist
            if(id) { 
                req.user = await getUserById(id);//From jsonwebtoken 
            next();
        }
            } catch (err) {
                next(err);
            }
        } else {
            next({
                name: "AuthenticationHeaderError",
                message: `Authorization token must start with ${prefix}`,
            });
        }
    };
    // router.use(authenticate());
    router.use("/users", require("./users"));
    router.use("/wand-options", require("./wands"));
    //Call function to get all wizards from the database 
    router.get("/wizards", async (req, res, next) => {
        try{
            const wizards = await getAllWizards();
            res.json(wizards);
     } catch (err) {
            next(err);
        }
    });
    //Call function to get a wizard by ID from the database
    router.get("/wizards/:id", async (req, res, next) => {
        const wizardId = req.params.id;
        try{
            const wizard = await getWizardById(wizardId);
            res.json(wizard);
      } catch (err) {
            next(err);
        }
    });
    
    //Call a function to create a wizard in databse
    router.post("/wizards", requireAdmin, async (req, res, next) => {
        try{
            const { name, house } = req.body;
            const newWizard = await createWizard({ name, house });
            res.json(newWizard);
        } catch (err) {
            next(err);
        }
    });

    //Call function to search wizards by name in database
    router.get("/wizards/search", async (req, res, next) => {
        const { name } = req.query;
        try{
            const wizards = await searchWizardsByName(name);
            res.json(wizards);
        } catch (err) {
            next(err);
        }
    });

    
   module.exports = router;

