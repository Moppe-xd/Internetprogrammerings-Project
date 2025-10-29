/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar spelare-objekt
 */

class Player{
    constructor(user, downCards, upCards, handCards, num){
        this.user = user
        this.downCards = downCards;
        this.upCards = upCards;
        this.handCards = handCards;
        this.cardTaken = false;
        this.playerNum = num;
    }
    
    getDownCards(){
        return this.downCards;
    }

    getUpcards(){
        return this.upCards;
    }

    getHandCards(){
        return this.handCards;
    }

    getUser(){
        return this.user;
    }

    setHandCards(newhand){
        this.handCards = newhand;
    }

    setUpCards(newhand){
        this.upCards = newhand;
    }

    setDownCards(newhand){
        this.downCards = newhand;
    }
}

export default Player