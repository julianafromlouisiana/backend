//We need to import seedData.js Database (rebuildDB) into seed.js --> Open seed.js
//Import client object from clientDB
const client = require("./client");
const { rebuildDB } = require("./seedData.js");


rebuildDB()
.catch(console.error)
.finally((c) => client.end());
  
  //In package.json we need to create a couple of commands
  //Under "start": "node index.js",
  //"seed": "node./db/seed.js",
  //"seed:dev": "nodemon ./db/seed.js"

  //Then open terminal. 
  //Run CTRL + C to stop server from running
  // run ---> npm run seed:dev
  //CONNECTED TO CLIENT
  
    
    
    