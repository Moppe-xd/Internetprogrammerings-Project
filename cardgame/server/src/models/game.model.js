/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar spel-objekt
 */


class Game{
    constructor(id,playerOne,playerTwo,playerThree,playerFour,cards){
        this.id = id;
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.playerThree = playerThree
        this.playerFour = playerFour
        this.cards = cards;
        this.stack = [];
        this.turn = 1;
    }
    getCardsInDeck(){
        return this.cards;
    }

    getTurn(){
        return this.turn;
    }

    setDeck(deck){
        this.deck = deck;
    }

    setStack(stack){
        this.stack = stack;
    }

    setTurn(turn){
        this.turn = turn;
    }

}
export default Game;