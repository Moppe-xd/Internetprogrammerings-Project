/**
 * @class Room
 * 
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar rum-objekt
 */
class Room {
    constructor(name) {
      this.name = name;
      this.users = [];
      this.messages = [];
    }
  
    /**
     * Add a message.
     * @param {String} message - The message to add.
     * @returns {void}
     */
    addMessage(message) {
      this.messages.push(message);
    }

    addUser(user){
      this.users.push(user);
    }

    getUsers(){
      return this.users;
    }
  }
  
  export default Room;
  