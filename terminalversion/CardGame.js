import Card from "./Card.js";
import Player from "./Player.js";

// ANVÄND
// Function to create the deck of cards that are used in the game.
function createCards(){
    const cardList = [];
    const colorsList = ["Heart", "Diamond" ,"Spade", "Clubs"];
    for(let i=0; i<4; i++){
        for(let j=2; j<9; j++){
            cardList.push(new Card(j,colorsList[i]));
        }
    }
    return cardList
}

// ANVÄND
// Function that creates players for the game
function createPlayers(deck,num){ // num so that amount of players can easiley be changed
    const players = [];
    for(let i=0; i<num;i++){
        const j = (i)*9
        players.push(new Player([deck[j],deck[j+1],deck[j+2]],[deck[j+3],deck[j+4],deck[j+5]],[deck[j+6],deck[j+7],deck[j+8]],i));
    }
    return players
}


// Function to check if any player have won the game.
function CheckWinner(players){
    for(let i = 0; i < players.length; i++){
        if (players[i].downCards.length === 0 && players[i].upCards.length === 0 && players[i].handCards.length === 0){
            return true;
        }
    }
    return false;
}

function showStack(stackTop){
    if(stackTop != undefined){
        console.log(`\nStack: ${  stackTop.value  }${stackTop.color}`);
    }else{
        console.log("\nStack: ");
    }
}

function turnTen(){
    let deck = createCards();


    // Shuffles the the deck!
    deck = deck.sort((a,b) => 0.5 - Math.random());

    for(let i=0;i<deck.length;i++){
        console.log(deck[i])
    }

    // Creates players with cards and updates the deck
    const num = 2;
    const players = createPlayers(deck,num);
    deck.splice(0,9*num);


    // En spelare får börja lägga ett kort och dess hand+stack uppdateras efter det
    const stack = [];
    let turn = Math.floor(Math.random() * num);
    let i = 0;
    while(!CheckWinner(players)){
        showStack(stack[stack.length-1]);
        const playedCard = players[turn].playCard(stack,deck);
        if(playedCard != null){ // If player made a move
            stack.push(playedCard);
            if(players[turn].cardTaken){
                deck.splice(0,1);
            }
            // If 2 or 10, same player
            if(playedCard.value == 10){
                    stack.splice(0,stack.length);
            }
            else if((playedCard.value != 2)){
                turn = (turn+1)%num; // Turen är slut, nästas tur.
                i++;
            }
        }else{ // If player didn't/couldn't make a move
            stack.splice(0,stack.length);
            turn = (turn+1)%num; // Turen är slut, nästas tur.
            i++;
        }
    }

}

turnTen()
