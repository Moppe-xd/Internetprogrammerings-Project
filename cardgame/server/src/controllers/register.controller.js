import { Router } from "express";
import model from "../model.js";
import dbPromise from "../db.js";

/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Tar hand om registering av ny användare på backend
 */

const router = Router();

export default { router };

router.post("/register", async (req, res) => {
    const {username} = req.body;
    const {password} = req.body;

    const {id} = req.session;

    // Kontrollerar att det ej finns någon användare i databasen med samma användarnamn.
    let uniqueUsername = true;
    const db = await dbPromise
    await db.each(
        "SELECT * FROM users WHERE username = (?)",
        username,
        (err) => {
            if (err){
                throw new Error(err);
            }
            uniqueUsername = false;
        }
    );

    // Om ingen användare fanns så läggs det nya kontot in i databasen och sedan direkt logas in på hemsidan.
    if(uniqueUsername){
        await db.run("INSERT INTO users (username,password,amountOfWins,amountOfGames) VALUES (?,?,?,?)",[username,password,0,0]);
            // Create a new user with the given name and associate it with the currently active session
            model.createUser(id, username);
            req.session.save((err) => {
            if (err) console.error(err);
            else{
                console.debug(`Saved user: ${JSON.stringify(model.findUserById(id))}`);
                res.status(200).json({ authenticated: true });
            };
        });
    }
    else{
        // Detta borde kanske stå på hemsidan. Värt att titta på i framtiden?
        console.log("User does exist");
        res.status(200).json({ authenticated: false });
    }
});