    const express = require("express");
    const router = express.Router();
    
    

    const {
        getWandOptions,
        getAllWandCores,
        getAllWandWoods,
        getWizardWandById,
        assignWandToWizard,
        removeWandFromWizard,
        createWizard,
        getAllWizards,
        getWizardById,
        searchWizards,
        fetchWizardDetails,
        getAllHouses,
      } = require("../db/wands");

    const { requireUser, requireAdmin } = require("./utils");
    const { wandCores, wandWoods } = require("../db/wands");

    //Wand Options fetch
    router.get("/wand-options", async (req, res, next) => {
        try{
            const wandOptions = await getWandOptions();
            res.json(wandOptions);
        } catch (err) {
            next(err);
        }
    });

    //Wand Components Endpoints
    router.get("/wand-cores", async (req, res, next) => {
        try{
            const wandCores = await getAllWandCores();
            res.json(wandCores);
        } catch (err) {
            next(err);
        }
    });

    router.get("/wand-woods", async (req, res, next) => {
        try{
            const wandWoods = (await getAllWandWoods()).woods;
            res.json(wandWoods);
        } catch (err) {
            next(err);
        }
    });

    // Wizard's Wand Endpoints
    router.get("/wizards/:wizardId/wand", async (req, res, next) => {
        const wizardId = req.params.wizardId;
        try{
            const wizard = await getWizardById(wizardId);
            const wand = await getWizardWandById(wizardId);

            if (wizard && wand) {
                const wizardsWithWand = {
                    id: wizard.id,
                    name: wizard.name,
                    house: wizard.house,
                    wand: {
                        core: wand.core,
                        wood: wand.wood,
                        house: wand.house,
                    },
                };
            res.json(wizardsWithWand);
            } else {
                res.status(404).json({ message: "Wizard or wand not found" });
            }
        } catch (err) {
            next (err)
        }
    });

    router.put("/wizards/:id/wand", async (req, res, next) => {
        const wizardId = req.params.id;
        const { core, wood, house } = req.body;
        try{
            const wands = await assignWandToWizard(wizardId, { core, wood, house });
            res.json(wands);
        } catch (err) {
            next(err);
        }
    });

    router.delete("/wizards/:id/wand", async (req, res, next) => {
        const wizardId = req.params.id;
        try{   
            const wand = await removeWandFromWizard(wizardId);
            res.json(wand);
        } catch (err) {
            next(err);
        }
    });

    router.get("/wizards", async (req, res, next) => {
        try{
        const wizards = await getAllWizards();
        res.json(wizards);
        } catch (err) {
            next(err);
        }
        });

        // Search Criteria
        router.get("/wizards/search", async (req, res, next) => {
            try {
            const { house, wizardId, name } = req.query;
            const searchCriteria = { house, wizardId, name };
        
            const wizards = await searchWizards(searchCriteria);
            // Fetch details for each wizard using fetchWizardDetails
            const wizardsWithDetails = await Promise.all(
                wizards.map(async (wizard) => {
                const details = await fetchWizardDetails(wizard.id);
                return { ...wizard, details };
                })
            );
            res.json(wizardsWithDetails);
            } catch (err) {
            next(err);
            }
         });
         // Get all houses
        router.get("/houses", async (req, res, next) => {
            try {
                const houses = await getAllHouses();
                res.json(houses);
            } catch (err) {
                next(err);
            }
        });
        // Create Wizard Endpoint 
        router.post("/create-wizard", async (req, res, next) => {
            try {
                const { name, house } = req.body;

                // Validate input
                if (!name || !house) {
                    return res.status(400).json({ error: "Name and house are required fields." });
                }

                // Call the createWizard function to add a new wizard to the database
                const newWizard = await createWizard({ name, house });

                res.status(201).json(newWizard);
            } catch (err) {
                next(err);
            }
        });
        

    module.exports = router;