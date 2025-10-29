import { Router } from "express";
import dbPromise from "../db.js";
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar account-sidan på backend. Hämtar från databas olika värden för användaren
 */

const router = Router();

router.post("/account", async (req,res) => {
    const { username } = req.body;
    const  matchlist  = [];

    const db = await dbPromise;
    //Räknar vinnarna vinster
    const rows = await db.get("SELECT * FROM users WHERE username = ?", username);
    const winrate = rows.amountOfWins / rows.amountOfGames;
    console.debug(`Winrate: ${  winrate}`);
    
    //Tar fram alla användarens matcher
    await db.each("SELECT * FROM games WHERE winner = ? OR loser1 = ? OR loser2 = ? OR loser3 = ?", 
        [username,username,username,username],
        (err, row) => {
            if (err) {
                throw new Error(err);
            }
            console.log(row);
            matchlist.push(row);
        }
    );

    res.status(200).json({winrate, matchlist});
});
export default { router };