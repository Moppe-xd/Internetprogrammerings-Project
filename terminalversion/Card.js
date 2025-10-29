class Card{
    constructor(value, color){
        this.value=value;
        this.color=color;
        this.picture = this.getPicture();
        /* För att underlätta för oss så ska value vara ints i spannet 2-14 där 
        jack = 11
        queen = 12
        king = 13
        ace = 14 
        
        Color är string av typen "Hearts", "Clubs", "Spades", "Diamond".
        */
    }

    // Method for mapping the picture to the card.
    getPicture() {
        if(this.value <= 10){
            return `/img/${  this.value  }_of_${  this.color.toLowerCase()  }.png`;
        }
        
            if(this.value == 11){
                return `/img/` + `jack` + `_of_${  this.color.toLowerCase()  }.png`;
            }
            if(this.value == 12){
                return `/img/` + `queen` + `_of_${  this.color.toLowerCase()  }.png`;
            }
            if(this.value == 13){
                return `/img/` + `king` + `_of_${  this.color.toLowerCase()  }.png`;
            }
            if(this.value == 14){
                return `/img/` + `ace` + `_of_${  this.color.toLowerCase()  }.png`;
            }
        
    }
}
export default Card;