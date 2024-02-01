//client js backend
//Use pg liabrary
//Look up postgres 
//We are creating client object then exporting it.
const { Client } = require("pg");//We use this as a constructor
// client objects interact with node code
// pg is another kind of client and allows us to interct with DB and server
//Installed on local machine


//Provide client with connection via "string"
//"string" tells it where to connect and what DB are interacting and located
const connectionString = process.env.wizards; //Database Name HERE
//https://localhost:8080/wizards
//Create a client object to pass through code
const client = new Client ({
    //creates new objects Data passing needed
    connectionString,
    ssi: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false}: undefined,
});//SSI: Secure Protocal to transmitt data from one part of a connection to another

//Export clientDB.js at the bottom of file type
module.exports = client;





