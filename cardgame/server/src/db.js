import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolvePath } from "./util.js";

/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Skapar databasen och lägger in tester i den
 * Inspererad av util.js fån lab 3
 */

sqlite3.verbose();
async function setupDb() {
    const db = await open({
        filename: resolvePath("db.sqlite"),
        driver: sqlite3.Database,
    });
    
    // Droppar tables om de redan existerar.
    await db.run("DROP TABLE IF EXISTS users");
    await db.run("DROP TABLE IF EXISTS games");

    // Skapar två tables som används på hemsidan.
    await db.run("CREATE TABLE users(username TEXT PRIMARY KEY, password TEXT NO NULL, amountOfWins INTEGER,amountOfGames INTEGER)");
    await db.run("CREATE TABLE games(gameID INTEGER PRIMARY KEY AUTOINCREMENT, winner TEXT NO NULL, loser1 TEXT NO NULL,loser2 TEXT, loser3 TEXT)"); // Kanske använda foreign key här men vete fan 

    // Lägger in lite exempeldata i de två tabelsarna
    await db.run("INSERT INTO users (username,password,amountOfWins,amountOfGames) VALUES (?,?,?,?)",["test1","hej12",1,3]);
    await db.run("INSERT INTO users (username,password,amountOfWins,amountOfGames) VALUES (?,?,?,?)",["test2","hej12",2,3]);
    await db.run("INSERT INTO users (username,password,amountOfWins,amountOfGames) VALUES (?,?,?,?)",["test3","hej12",0,0]);
    await db.run("INSERT INTO users (username,password,amountOfWins,amountOfGames) VALUES (?,?,?,?)",["test4","hej12",0,0]);

    await db.run("INSERT INTO games(winner,loser1, loser2, loser3) VALUES (?,?,?,?)", ["test1","test2", null, null]);
    await db.run("INSERT INTO games(winner,loser1, loser2, loser3) VALUES (?,?,?,?)", ["test2","test1", null, null]);
    await db.run("INSERT INTO games(winner,loser1, loser2, loser3) VALUES (?,?,?,?)", ["test2","test1", null, null]);

    return db;
}

const dbPromise = setupDb()
export default dbPromise;