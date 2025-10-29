import { Router } from "express";
import model from "../model.js";
import dbPromise from "../db.js";
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar spelet på back-end. Kommunicerar till alla klienterna när något händer i spelet och vad för värden allt har
 */

const router = Router();

router.get("/rooms/:roomName/join", (req,res) =>{
    console.log("Kommer till join");
    const { roomName } = req.params; // Tar detta från URL:en. Måste ha samma namn som i url!
    const { id } = req.session;

    // Tar fram Usern som gå med i rummet.
    const user = model.findUserById(id);
    console.log("found user");

    // Tar fram rummet som de gå med i.
    const room = model.findRoomByName(roomName);
    console.log("found Room");
    console.log(room);

    let alreadyIn = false;
    const userList = room.getUsers();
    for(let i = 0; i < userList.length; i+=1){
        if(user === userList[0]){
            alreadyIn = true;
        }
    }
    if(!alreadyIn){
        // Sparar i rummet att användaren är med i rummet.
        model.join(id,room);
        room.addUser(user);
        console.log(room);
        const playerID = room.getUsers().length;
        console.log(playerID);
        res.status(200).json({playerID});
    }
    else{
        console.log("Användaren redan i rummet! Skippar");
        res.status(200).end();
    }

});

// När spel startas
router.get("/rooms/:roomName/start", (req,res) =>{
    const { roomName } = req.params;
    const room = model.findRoomByName(roomName);

    if(room.getUsers().length < 2){// Om ej får starta
        res.status(200).json({start: false,player: null});
    }
    else{// Sätter upp spelstart
        model.createGame(room);
        const deck = model.getGamebyID(room.name).getCardsInDeck();
        const stack = []
        console.log(`försöker broadcasta i rummet: ${  room.name}`);
        model.broadcast(room,"start",true);

        const players = []
        for(let i = 0; i < model.getAmountOfPlayers(room.name); i+=1){
            players[i] = model.getPlayerBynumber(room.name,i);
        }

        res.status(200).json({start: true, players, stack, deck});
        model.broadcast(room,"Getplayer",[players, stack, deck]); // Sätter igång spelarna
    }
});

// Vid kontroll av om spelaren kan spela (när den inte kunde)
router.post("/rooms/:roomName/canplay",(req,res) => {
    const { stack } = req.body;
    const { deck } = req.body;
    const { playerCards } = req.body;
    const { roomName } = req.params;
        
    const room = model.findRoomByName(roomName);
    const game = model.getGamebyID(roomName);
    let turn = game.getTurn();
    
    model.updatePlayer(roomName,turn,playerCards[0],playerCards[1],playerCards[2]);
    model.changeTurnOnGame(roomName);
    console.log(`Stack: ${  stack}`)
    game.setStack(stack);
    turn = game.getTurn();
    const players = model.getPlayersbyID(roomName);
    model.broadcast(room,"playedCard",[stack,deck,true,turn,players]); // Uppdaterar till spelare att rundan är slut och vad som hänt
    res.status(200).end();
})

// När någon spelat ett kort
router.post("/rooms/:roomName/playcard", (req,res) => {
    const { stack } = req.body;
    const { deck } = req.body;
    const { playerCards } = req.body;
    const { roomName } = req.params;
    const {playerExtraTurn} = req.body;

    // Tar fram värden som behövs för att updatera spelinstansen.
    const room = model.findRoomByName(roomName);
    const game = model.getGamebyID(roomName);
    let turn = game.getTurn();
    

    // Uppdaterar spelar objektet
    model.updatePlayer(roomName,turn,playerCards[0],playerCards[1],playerCards[2]);
    
    // Ändrar turen på serversidan
    if(!playerExtraTurn){
        model.changeTurnOnGame(roomName);
    }

    // Uppdaterar decket och stacken på serversida
    game.setDeck(deck);
    game.setStack(stack);
    turn = game.getTurn();
    const players = model.getPlayersbyID(roomName);
    model.broadcast(room,"playedCard",[stack,deck,true,turn,players]); // Skickar ut vad som hände efter spelarens drag
    res.status(200).end();
});

// När någon vunnit
router.post("/rooms/:roomName/gameover", async (req,res) =>{ 
    const { roomName } = req.params;
    const { winner } = req.body;

    const room = model.findRoomByName(roomName);
    const players = model.getPlayersbyID(roomName);

    const db = await dbPromise;
    const losers = [];
    const dbPromiselist =[];
    // Uppdaterar alla spelarnas stats
    for(let i = 0; i < players.length;i+=1){
        if(winner !== i+1){
            losers.push(players[i].getUser().getName());
            const user = players[i].getUser().getName();
            console.log(user);
            dbPromiselist.push(db.run("UPDATE users SET amountOfGames = amountOfGames + 1 WHERE username = ?",[user]));
        }
        else{
            const user = players[winner-1].getUser().getName();
            console.log(user);
            dbPromiselist.push(db.run("UPDATE users SET amountOfGames = amountOfGames + 1 WHERE username = ?",[user]));
            dbPromiselist.push(db.run("UPDATE users SET amountOfWins = amountOfWins + 1 WHERE username = ?",[user]));
        }
    }

    await Promise.all(dbPromiselist);

    // Uppdaterar sparade spel
    if(players.length === 2){
        await db.run("INSERT INTO games(winner,loser1, loser2, loser3) VALUES (?,?,?,?)", [players[winner-1].getUser().getName(), losers[0], null, null]);
        console.log("Added match to database");
    }
    else if(players.length === 3){
        await db.run("INSERT INTO games(winner,loser1, loser2, loser3) VALUES (?,?,?,?)", [players[winner-1].getUser().getName(), losers[0], losers[1], null]);
    }
    else{
        await db.run("INSERT INTO games(winner,loser1, loser2, loser3) VALUES (?,?,?,?)", [players[winner-1].getUser().getName(), losers[0], losers[1], losers[2]]);
    }
    
    const message = `Player ${  winner  }Won the game!`;
    model.broadcast(room,"gameOver",[false,message]);
    res.status(200).json({start:false, meddelande:message});
})

export default { router };