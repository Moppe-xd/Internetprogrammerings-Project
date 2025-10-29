import Room from "./models/room.model.js";
import User from "./models/user.model.js";
import Player from "./models/player.model.js";
import Card from "./models/card.model.js";
import Game from "./models/game.model.js";

/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Håller flera funktioner som hanterar objekts på backenden.
 */

class Model {
  constructor() {
    this.rooms = {};
    this.users = {};
    this.Players = {};
    this.Games = {};

    this.io = undefined;
  }

  /**
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @returns {void}
   */
  init(io) {
    this.io = io;
  }

  // Skapar en spelinstace för ett visst rum.
  createGame(room){
    const deck = Model.createDeck()
    console.log(`Dags att skapa rum:${room}`);
    const players = room.getUsers();

    // Utgick från termialversionen av createPlayer() funktionen.
    this.Games[room.name] = [];
    this.Players[room.name] = [];
    const n = players.length;
    for(let i=0; i<n; i+=1){
      const j = (i)*9;
      this.Players[room.name].push(new Player(players[i],[deck[j],deck[j+1],deck[j+2]],[deck[j+3],deck[j+4],deck[j+5]],[deck[j+6],deck[j+7],deck[j+8]],i));
    }

    deck.splice(0,9*n);
    if(players.length === 2){
      this.Games[room.name] = new Game(room.name,this.Players[room.name][0],this.Players[room.name][1],null,null,deck);
    }
    if(players.length === 3){
      this.Games[room.name] = new Game(room.name,this.Players[room.name][0],this.Players[room.name][1],this.Players[room.name][2], null,deck);
    }
    else{
      this.Games[room.name] = new Game(room.name,this.Players[room.name][0],this.Players[room.name][1],this.Players[room.name][2], this.Players[room.name][2],deck);
    }
  }

  // Same function as createCards() in \terminalversion\CardGame.js
  static createDeck(){
    let cardList = [];
    const colorsList = ["Hearts", "Diamonds", "Spades", "Clubs"];
    for(let i=0; i<4; i+=1){
      for(let j=2; j<8; j+=1){
        cardList.push(new Card(j,colorsList[i]));
      }
    }
    // Blandar kortleken
    cardList = cardList.sort(() => 0.5 - Math.random());
    return cardList;
  }

  // Hämtar spelet från listan av spel utifrån rumnammet
  getGamebyID(key){
    return this.Games[key];
  }

  // Ändrar vems turn det är för ett visst spel!
  changeTurnOnGame(key){
    const turn = this.Games[key].getTurn();
    const n = this.getAmountOfPlayers(key);
    const newTurn = (turn % n)+1;
    this.Games[key].setTurn(newTurn);
  }
  
  // Uppdaterar en spelares kort på backenden.
  updatePlayer(key, i, HandCards, upCards, downCards){
    this.Players[key][i-1].setHandCards(HandCards);
    this.Players[key][i-1].setUpCards(upCards);
    this.Players[key][i-1].setDownCards(downCards);
  }

  // Hämtar en spelare för en spelinstans för deras ID i matchen
  getPlayerBynumber(key,i){
    return this.Players[key][i];
  }

  // Tar fram hur många spelare som är med i en spelinstance
  getAmountOfPlayers(key){
    return this.Players[key].length;
  }

  //Tar fram en spelare på deras ID.
  getPlayersbyID(key){
    return this.Players[key];
  }

  /**
   * Create a room with the given name.
   * @param {String} name - The name of the room.
   * @returns {void}
   */
  createRoom(name) {
    this.rooms[name] = new Room(name);
  }

  /**
   * Return the room object with the matching name.
   * @param {String} name - The name of the room.
   * @returns {Room}
   */
  findRoomByName(name) {
    return this.rooms[name];
  }

  /**
   * Return all the rooms.
   * @returns {Room[]}
   */
  getRooms() {
    return Object.values(this.rooms);
  }

  /**
   * Create a user with the given name.
   * @param {String} id - An unique identifier for the user session.
   * @param {String} name - The name of the user.
   * @returns {void}
   */
  createUser(id, name) {
    this.users[id] = new User(name);
  }

  /**
   * Return the user object with the matching id.
   * @param {String} id - An unique identifier for the user session.
   * @returns {User}
   */
  findUserById(id) {
    return this.users[id];
  }

  /**
   * Push out a message to all connected clients in the given room.
   * @param {Room} room - The room to add the message to.
   * @param {String} message - The message to add.
   * @returns {void}
   */
  broadcast(room, type, message) {
    // Något fungerar inte som det ska här. Jag kan inte skicka in speciell room,
    // this.io.to(room.name).emit(type, message);
    this.io.emit(type, message);
  }

  /**
   * Join a specified room.
   * @param {String} socketID - An unique identifier for the user socket.io session.
   * @param {Room} room - The room to join.
   * @returns {void}
   */
  join(socketId, room) {
    this.io.in(socketId).socketsJoin(room.name);
  }
}

export default new Model();
