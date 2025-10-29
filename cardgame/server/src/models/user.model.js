/**
 * @class User
 * 
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar användare-objekt
 */

class User {
    constructor(name) {
      this.name = name;
      this.currentRoom = null;
    }
  
    /**
     * Join a specified room.
     * @param {Room} room - The room to join.
     * @returns {void}
     */
    joinRoom(room) {
      this.currentRoom = room;
    }

    getName(){
      return this.name
    }
  }
  
  export default User;
  