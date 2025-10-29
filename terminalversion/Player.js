import readlineSync from "readline-sync";


function input(prompt) {
    return readlineSync.question(prompt);
  }

class Player{
    constructor(downCards, upCards, handCards,num){
        this.downCards=downCards;
        this.upCards=upCards;
        this.handCards = handCards;
        this.cardTaken = false;
        this.playerNum = num; 
    }

    showCards(){
        console.log(`Player ${this.playerNum+1}`);
        this.showDown();
        this.showUp();
        this.showHand(false);
    }

    showDown(){
        let down = "DOWN: ";
        for(let i=0;i<this.downCards.length;i++){
            down += " "+ "X"+" ";
        }
        console.log(down);
    }

    showUp(){
        let up = "UP: ";
        for(let i=0;i<this.upCards.length;i++){
            up += ` ${ this.upCards[i].value  }${this.upCards[i].color} `;
        }
        console.log(up)
    }

    showHand(newHand){
        let hand = "";
        if(newHand==true){
            hand += "NEWHAND:";
        }else{hand += "HAND:";}

            for(let i=0;i<this.handCards.length;i++){
                hand += ` ${ this.handCards[i].value  }${this.handCards[i].color} `;
            }
        console.log(hand);
    }

    // ANVÄND
    takeCard(deck){
        if((this.handCards.length<3) && (deck.length != 0)){
            this.handCards.push(deck[0]);
            this.cardTaken = true;
        }else{
            this.cardTaken = false;
        }
    }

    // HALVT ANVÄND??
    // Returns wether a player can make a move or not
    canPlay(stack, cardsType){
        if(stack.length==0){
            return true;
        }
        const stackTop = stack[stack.length-1];

        if(cardsType =="Hand"){
            for(let i=0;i<this.handCards.length;i++){
                if((this.handCards[i].value>=stackTop.value)||(this.handCards[i].value==2)||(this.handCards[i].value==10)){
                    return true;
                }
            }
            return false;
        } 
            for(let i=0;i<this.upCards.length;i++){
                if((this.upCards[i].value>=stackTop.value)||(this.upCards[i].value==2)||(this.upCards[i].value==10)){
                    return true;
                }
            }
            return false;
        
    }

    // ANVÄND
    playWithHand(stack){
        let playedCard;
        if(this.canPlay(stack, "Hand")){
            let play = input("Play card nr: ");
            let turnOver = false;
            if(stack.length>0){ // If stack not empty, check if the move is legal
                while(!turnOver){ // Let player pick until they pick a legal card
                    const stackTop = stack[stack.length-1];
                    if((this.handCards[play-1].value>=stackTop.value)||(this.handCards[play-1].value==2)||(this.handCards[play-1].value==10)){
                        turnOver=true;
                    }else{
                        play = input("Choose another card nr: ");
                    }    
                }
            }
            // Update stack, playerhand and deck
            playedCard = this.handCards[play-1];
            this.handCards.splice(play-1,1);
        }else{
            console.log("You can't make a move!")
            this.takeStack(stack);
            playedCard = null;
        }
        return playedCard;
    }


    playWithUp(stack){
        let playedCard;
        if(this.canPlay(stack,"Up")){
            let play = input("Play upcard nr: ");
            let turnOver = false;
            if(stack.length>0){ // If stack not empty, check if the move is legal
                while(!turnOver){ // Let player pick until they pick a legal card
                    const stackTop = stack[stack.length-1];
                    if((this.upCards[play-1].value>=stackTop.value)||(this.upCards[play-1].value==2)||(this.upCards[play-1].value==10)){
                        turnOver=true;
                    }else{
                        play = input("Choose another upcard nr: ");
                    }    
                }
            }
            // Update stack, playerhand and deck
            playedCard = this.upCards[play-1];
            this.upCards.splice(play-1,1);
        }else{
            const takenCard = input("You can't make a move!\nPick an upcard to move to your hand: ");
            this.handCards.push(this.upCards[takenCard-1]);
            this.takeStack(stack);
            this.playedCard = null;
            }
        return playedCard;
    }

    playWithDown(stack){
        let playedCard;
        const play = input("Play downcard nr: ");
        if(stack.length>0){ // If stack not empty, check if the move is legal
            const stackTop = stack[stack.length-1];
            if((this.downCards[play-1].value>=stackTop.value)||(this.downCards[play-1].value==2)||(this.downCards[play-1].value==10)){
                // Update stack, playerhand and deck
                playedCard = this.downCards[play-1];
                this.downCards.splice(play-1,1);
                console.log("Successful pick :)")
            }else{
                playedCard = null;
                this.handCards.push(this.downCards[play-1]);
                this.downCards.splice(play-1,1)
                this.takeStack(stack);
                console.log("Unsuccessful pick :(")
            }    
        }
        return playedCard;
    }


    // HALVT ANVÄND
    playCard(stack,deck) {
        this.showCards();
        let playedCard;
        if(this.handCards.length != 0){
            playedCard=this.playWithHand(stack);
            this.takeCard(deck);
        }else if(this.upCards.length != 0){
            playedCard=this.playWithUp(stack);
        }else{
            playedCard=this.playWithDown(stack);
        }
        this.showHand(true);
        return playedCard;
    }

    takeStack(stack){
        for(let i=0;i<stack.length;i++){
            this.handCards.push(stack[i]);
        }

    }
}
export default Player;