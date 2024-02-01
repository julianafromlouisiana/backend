// Import client object from ./client
const client = require("./client");
const axios = require("axios");
const { createWizard } = require("./wands");
const { createUser } = require("./users");
 

async function dropTables() {
  console.log("Dropping all tables...");
  try {
    await client.query(`
      DROP TABLE IF EXISTS houses;
      DROP TABLE IF EXISTS wands;
      DROP TABLE IF EXISTS wizards;
      DROP TABLE IF EXISTS wand_cores;
      DROP TABLE IF EXISTS wand_woods;
      DROP TABLE IF EXISTS users;
    `);
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Building DB tables...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        house VARCHAR(225) DEFAULT 'Other Institution'
      );
      CREATE TABLE IF NOT EXISTS wand_cores (
        id SERIAL PRIMARY KEY,
        core VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wand_woods (
        id SERIAL PRIMARY KEY,
        wood VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS wizards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        house VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS wands (
        id SERIAL PRIMARY KEY,
        wizard_id INTEGER REFERENCES wizards(id),
        core_id INTEGER REFERENCES wand_cores(id),
        wood_id INTEGER REFERENCES wand_woods(id),
        house VARCHAR(255)
      );
      CREATE TABLE IF NOT EXISTS houses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    );
    
       INSERT INTO houses (name) VALUES
        ('Gryffindor'),
        ('Slytherin'),
        ('Hufflepuff'),
        ('Ravenclaw');
        

        
    `);
    console.log("Finished building tables!");
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Creating users seed data...");
  try {
    const usersToCreate = [
      { username: "QuidditchQuirk", password: "bludger" },
      { username: "SlythSpell", password: "snakes" },
      { username: "HallowHex", password: "seven7" },
      { username: "DobbyDaze", password: "letfreedomring" },
    ];

    const users = await Promise.all(usersToCreate.map(createUser));

    console.log("User created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.log("Error creating user!");
    throw error;
  }
}

async function createWandCores() {
  console.log("Creating wand core seed data...");
  try {
    const wandCoresToCreate = [
      "Phoenix feather",
      "Dragon heartstring",
      "Veela hair",
      // Add more cores as needed
    ];

    await Promise.all(
      wandCoresToCreate.map(async (core) => {
        const result = await client.query(
          `
          INSERT INTO wand_cores (core)
          VALUES ($1)
          RETURNING *;
        `,
          [core]
        );
        console.log("Inserted wand core:", result.rows[0]);
      })
    );
    console.log("Finished creating wand cores!");
  } catch (error) {
    console.error("Error creating wand cores:", error);
    throw error;
  }
}

async function createWandWoods() {
  console.log("Creating wand wood seed data...");
  try {
    const wandWoodsToCreate = [
      "Oak",
      "Holly",
      "Mahogany",
      // Add more woods as needed
    ];

    await Promise.all(
      wandWoodsToCreate.map(async (wood) => {
        const result = await client.query(
          `
          INSERT INTO wand_woods (wood)
          VALUES ($1)
          RETURNING *;
        `,
          [wood]
        );
        console.log("Inserted wand wood:", result.rows[0]);
      })
    );
    console.log("Finished creating wand woods!");
  } catch (error) {
    console.error("Error creating wand woods:", error);
    throw error;
  }
}

async function createInitialWands() {
  console.log("Creating wands seed data...");
  try {
    await createWandCores();
    await createWandWoods();

    const wandsToCreate = [
      { core: "Phoenix feather", wood: "Oak" },
      { core: "Dragon heartstring", wood: "Holly" },
      { core: "Veela hair", wood: "Mahogany" },
      
    ];

    const createdWands = await Promise.all(
      wandsToCreate.map(async (wand) => {
        const wandResult = await client.query(
          `
          INSERT INTO wands (core_id, wood_id)
          VALUES (
            (SELECT id FROM wand_cores WHERE core = $1),
            (SELECT id FROM wand_woods WHERE wood = $2)
          )
          RETURNING *;
        `,
          [wand.core, wand.wood]
        );
        console.log("Inserted wand:", wandResult.rows[0]);
        //INSERT wizard
        const wizardResult = await createWizard({
          name: `Dummy Wizard ${wandResult.rows[0].id}`,
          house: "Slytherin",  
        });
        console.log("Created wizard:", wizardResult);
        await client.query(
          `
          UPDATE wands
          SET wizard_id = $1
          WHERE id = $2;
          `,
          [wizardResult.id, wandResult.rows[0].id]
        );
        return wandResult.rows[0];
        })
    );
    console.log("Finished creating wands!");
    return createdWands;
  } catch (error) {
    console.error("Error creating wands:", error);
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();
    console.log("Connected to the Database client");

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialWands();
  } catch (error) {
    console.log("Error while rebuilding Database");
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = { rebuildDB };







//When you start you want Dummy Data  Seeded 
//1) Drop any pre-existing tables 2) recreate them 3)Send Data to Database

//Create a simple function that is async ---> No Arguments!
//Use client object to excute SQL query. This will run in Database or localhost (clientDB.js)
// This creates user tables
//Async operation in the code--> waits to finish We have to connect to Database to run SQL query
//Although client object, use (.then) and wait for response
//Query will NOT be run without (`back-ticks`);

//CREATE our DB tables in code above
//In rebuildDB , dropTables, createTables (use await keyword)

//Connect to Database wizards --> \c
//"YOU ARE NOW CONNECTED TO THE DATABASE"
//Should see table in Database: id, username, password (0) rows
//dropTables code above 
