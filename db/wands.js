const client = require("./client");
const axios = require("axios");

//Wand Components Endpoints Async Function
async function createInitialWands() {
    console.log('Creating wand seed data...');
    try{
    const wandCoresResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wand-cores`);
    const wandWoodsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wand-woods`);

    const wandCores = wandCoresResponse.data;
    const wandWoods = wandWoodsResponse.data;

    const wandsToCreate = [
      { core: 'Phoenix feather', wood: 'Oak' },
      { core: 'Dragon heartstring', wood: 'Holly' },
      { core: 'Veela hair', wood: 'Mahogany' },
      { core: 'Unicorn tail hair', wood: 'Cherry' },
      { core: 'Thestral tail hair', wood: 'Ebony' },
      { core: 'Kelpie mane', wood: 'Maple' },
      { core: 'Thunderbird tail feather', wood: 'Cypress' },
      { core: 'Rougarou hair', wood: 'Birch' },
      { core: 'Wampus cat hair', wood: 'Yew' }
    ];
        //INSERT wand cores into the database
    await Promise.all(
        wandCores.map(async (core) => {
            const result = await client.query(
                `INSERT INTO wand_cores (core)
                VALUES ($1)
                RETURNING *;
                `,
                [core]
        );
        console.log("Inserted wand core:", result.rows[0]);
    })
    );
    //Wand woods
    await Promise.all(
        wandWoods.map(async (wood) => {
            const result = await client.query(
                `INSERT INTO wand_woods (wood)
                VALUES ($1)
                RETURNING *;
                `,
                [wood]
            );
            console.log("Inserted wand wood:", result.rows[0]);
        })
    );

    const createdWands = await Promise.all(
        wandsToCreate.map(async (wand) => {
            const result = await client.query(`
            INSERT INTO wands (core_id, wood_id)
            VALUES ($1, $2)
            RETURNING *;
            `, [wand.core, wand.wood]
            );
            console.log("Inserted wand:", result.rows[0]);
        })
    );
        console.log("Finished creating wands!");
        return createdWands;
    } catch (error) {
        console.error("Error creating wands:", error);
        throw error;
    }
}
async function getAllWandCores() {
    try{
        const { rows: wandCores } = await client.query(`
        SELECT * FROM wand_cores;
        `);
        return wandCores;
    } catch (err) {
        throw err;
    }
}

async function getAllWandWoods() {
    try{
        const { rows } = await client.query(`
        SELECT * FROM wand_woods;
        `);
        return { woods: rows };
    } catch (err) {
        throw err;
    }
}

// Wizard's Wand Endpoints
async function getWizardWandById(wizardId) {
    try{
        const { rows: [wand] } = await client.query(`
        SELECT * FROM wizards
        JOIN wands ON wizards.id = wands."wizardId"
        WHERE wizards.id = $1;
        `, [wizardId]);
        return wand;
    } catch (err) {
        throw err;
    }
}

async function assignWandToWizard(wizardId, { core, wood, house }) {
    try{
        const { rows: [wand] } = await client.query(`
        INSERT INTO wands ("wizardId", "core", "wood", "house")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [wizardId, core, wood, house]);
        return wand;
    } catch (err) {
        throw err;
    }
}

async function removeWandFromWizard(wizardId) {
    try{
        const { rows: [wand] } = await client.query(`
        DELETE FROM wands
        WHERE "wizard_id" = $1
        RETURNING *;
      `, [wizardId]);
      return wand;
    } catch (err) {
        throw err;
    }
}

async function getAllWizards() {
    try{
        const { rows } = await client.query(`
        SELECT * FROM wizards;
        `);
        return rows;
    } catch (err) {
        throw err;
    }
}

async function getWizardById(wizardId) {
    try{
        const { rows } = await client.query(`
        SELECT * FROM wizards 
        WHERE id = $1;
        `, [wizardId]);
        return rows[0];
    } catch (err) {
        throw err;
    }
}

async function createWizard({ name, house }) {
    try{
        const { rows } = await client.query(`
        INSERT INTO wizards (name, house)
        VALUES ($1, $2)
        RETURNING *;
        `, [name, house]);
        return rows[0];
    } catch (err) {
    throw err;
    }
}

async function searchWizardsByName(name) {
    try{
        const { rows } = await client.query(`
        SELECT * FROM wizards
        WHERE name ILIKE $1;
        `, [`%${name}%`]);
        return rows;
    } catch (err) {
        throw err;
    }
}
    
    const getWandOptions = async () => {
        try {
          const wandCores = await getAllWandCores();
          const wandWoods = (await getAllWandWoods()).woods;
          const houses = ["Gryffindor", "Hufflepuff", "Slytherin", "Ravenclaw"];
      
          return {
            cores: wandCores,
            woods: wandWoods,
            houses: houses,
          };
        } catch (error) {
          throw error;
        }
    };
    async function searchWizards(searchCriteria) {
        try {
          const { house, wizardId, name } = searchCriteria;
          const queryString = `
            SELECT * FROM wizards
            WHERE ($1 IS NULL OR house = $1)
              AND ($2 IS NULL OR id = $2)
              AND ($3 IS NULL OR name ILIKE $3);
          `;
          const { rows } = await client.query(queryString, [house, wizardId, `%${name}%`]);
          return rows;
        } catch (err) {
          throw err;
        }
      }
      
      // Fetch additional details for a wizard
      async function fetchWizardDetails(wizardId) {
        try {
          const queryString = `
            SELECT * FROM wizards
            WHERE id = $1;
          `;
          const { rows } = await client.query(queryString, [wizardId]);
          return rows[0];
        } catch (err) {
          throw err;
        }
      }

      async function getAllHouses() {
        try {
            const { rows } = await client.query(`
                SELECT * FROM houses;
            `);
            return rows;
        } catch (err) {
            throw err;
        }
    }
      
    
      
      module.exports = {
        createInitialWands,
        getAllWandCores,
        getAllWandWoods,
        getWizardWandById,
        assignWandToWizard,
        removeWandFromWizard,
        getAllWizards,
        getWizardById,
        createWizard,
        searchWizardsByName,
        getWandOptions,
        searchWizards,
        fetchWizardDetails,
        getAllHouses, 
      };