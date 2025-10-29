import { Router } from "express";
import model from "../model.js";
import dbPromise from "../db.js";
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Tar hand om backend login
 * Huvudsakligen återanvänt från Labb 4.2
 */

const router = Router();

router.get("/user", (req,res) =>{
  if(req.session.authenticated){
    console.log("Logged in on backend");
    res.status(200).json({ authenticated: true });
  }
  else{
    console.log("Not Logged in on the backend");
    res.status(200).json({ authenticated: false });
  }
});

// Vid login-försök
router.post("/login", async (req,res) =>{
  const {username} = req.body;
  const {password} = req.body;
  let userExist = false;
    let isPasswordCorrect = true;
  
  const { id } = req.session;
  
  const db = await dbPromise;

  // Kollar rätt lösenord och användare finns
  await db.each(
    "SELECT * FROM users WHERE username = (?)", 
    username,
    (err, row) => {
      if (err) {
        throw new Error(err);
      }
      userExist = true;
      if (row.password !== password) {
        isPasswordCorrect = false;
      }
    }
  );
  
  if(userExist && isPasswordCorrect){
    // Create a new user with the given name and associate it with the currently active session
    model.createUser(id, username);
    req.session.user = {username};
    req.session.authenticated = true;
    req.session.save((err) => {
      if (err) console.error(err);
      else{
        console.debug(`Saved user: ${JSON.stringify(model.findUserById(id))}`);
        res.status(200).json({ authenticated: true });
      };
    });
  }else{
    res.status(200).json({ authenticated: false });
  }
});

router.delete("/logout", (req,res) =>{
  req.session.destroy();
  console.log("logged out");
  res.status(200).end();
});

// Kanske värt att flytta denna del till en room.controller / game.controller
router.get("/rooms" , (req,res) =>{
  const rooms = model.getRooms()
  res.status(200).json({ rooms})
});

export default { router };