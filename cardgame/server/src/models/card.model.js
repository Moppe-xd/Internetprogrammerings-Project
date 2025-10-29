/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hantar kort-objekt
 */


class Card{
    constructor(value, color){
        this.value = value;
        this.color = color;
        this.picture = this.CreatePicture();
    }

    getPicture(){
        return this.picture;
    }

    // Mappar varje kort till en bild som används på hemsidan.
    CreatePicture(){
        if(this.value <= 10){
            return `/img/${  this.value  }_of_${  this.color.toLowerCase()  }.png`
        }
        
            if(this.value === 11){
                return `/img/jack_of_${  this.color.toLowerCase()  }.png`
            }
            if(this.value === 12){
                return `/img/queen_of_${  this.color.toLowerCase()  }.png`
            }
            if(this.value === 13){
                return `/img/king_of_${  this.color.toLowerCase()  }.png`
            }
            
                return `/img/ace_of_${  this.color.toLowerCase()  }.png`
            
    }
}
export default Card;