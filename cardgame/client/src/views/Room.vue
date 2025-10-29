<template>
  <div class="row flex-column vh-100 justify-content-between">
    <div class="col-3"></div>
    <div v-if="playing">
      <div class="col-12 d-flex justify-content-around">
        <div
          v-for="(opp, index) in opponents"
          :key="index"
          class="d-flex justify-content-center"
        >
          <ul
            v-if="opp[0] && opp[0].length > 0"
            class="list-group list-group-horizontal"
          >
            <li
              v-for="(card, i) in opp[0]"
              :key="i"
              type="button"
              class="list-group-item py-1"
              style="padding: 0; border: none"
            >
              <img
                src="/img/backside.png"
                alt="opponentUp"
                style="width: 80px; height: auto"
              />
            </li>
          </ul>
          <ul
            v-else-if="opp[1] && opp[1].length > 0"
            class="list-group list-group-horizontal"
          >
            <li
              v-for="(card, i) in opp[1]"
              :key="i"
              type="button"
              class="list-group-item py-1"
              style="padding: 0; border: none"
            >
              <img
                :src="`${card.picture}`"
                alt="card"
                style="width: 80px; height: auto"
              />
            </li>
          </ul>
          <ul
            v-else-if="opp[2] && opp[2].length > 0"
            class="list-group list-group-horizontal"
          >
            <li
              v-for="(card, i) in opp[2]"
              :key="i"
              type="button"
              class="list-group-item py-1"
              style="padding: 0; border: none"
            >
              <img
                src="/img/backside.png"
                alt="opponentDown"
                style="width: 80px; height: auto"
              />
            </li>
          </ul>
        </div>
      </div>
      <div
        class="col-12 d-flex justify-content-center align-items-center flex-grow-1"
      >
        <ul v-if="stack.length > 0 && showStack">
          <li
            type="button"
            class="list-group-item py-1"
            style="padding: 0; border: none"
          >
            <img
              :src="stack[stack.length - 1].picture"
              alt="card"
              style="width: 80px; height: auto"
            />
          </li>
        </ul>
        <ul v-else>
          <li
            type="button"
            class="list-group-item py-1"
            style="padding: 0; border: none"
          ></li>
        </ul>
      </div>
      <div class="col-12 d-flex justify-content-center">
        <ul
          v-if="playerHand.length > 0"
          class="list-group list-group-horizontal"
        >
          <li
            v-for="(card, i) in playerHand"
            :key="i"
            type="button"
            class="list-group-item py-1"
            style="padding: 0; border: none"
            @click="playCard(card, i)"
            :disabled="!playersTurn"
            :class="{ disabled: !playersTurn }"
          >
            <img
              :src="`${card.picture}`"
              alt="card"
              style="width: 80px; height: auto"
            />
          </li>
        </ul>
        <ul
          v-else-if="playerUpCards.length > 0"
          class="list-group list-group-horizontal"
        >
          <li
            v-for="(card, i) in playerUpCards"
            :key="i"
            type="button"
            class="list-group-item py-1"
            style="padding: 0; border: none"
            @click="playCard(card, i)"
            :disabled="!playersTurn"
            :class="{ disabled: !playersTurn }"
          >
            <img
              :src="`${card.picture}`"
              alt="card"
              style="width: 80px; height: auto"
            />
          </li>
        </ul>
        <ul
          v-else-if="playerDownCards.length > 0"
          class="list-group list-group-horizontal"
        >
          <li
            v-for="(card, i) in playerDownCards"
            :key="i"
            type="button"
            class="list-group-item py-1"
            style="padding: 0; border: none"
            @click="playCard(card, i)"
            :disabled="!playersTurn"
            :class="{ disabled: !playersTurn }"
          >
            <img
              src="/img/backside.png"
              alt="card"
              style="width: 80px; height: auto"
            />
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div class="col-3">
        <div v-if="playerID === 1">
          <button @click="startGame()">Start game</button>
        </div>
      </div>
    </div>
    <div v-if="showMessage">{{ message }}</div>
    <div class="col-3"></div>
  </div>
</template>

<script>
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar frontend för ett rum. Dels väntrummet innan spelstart, men sedan även hela spelet.
 * Hanterar klientens val under spelet och "rapporterar" tillbaka till servern.
 */

import io from "socket.io-client";
export default {
  name: "RoomView",
  components: {},
  data() {
    return {
      name: this.$route.params.name,
      playerHand: [],
      playerUpCards: [],
      playerDownCards: [],
      opponents: [],
      stack: [],
      showMessage: false,
      playing: false,
      message: "",
      socket: io.connect(),
      playersTurn: false,
      playerID: "",
      showStack: false,
    };
  },
  async mounted() {
    console.log(this.name);
    console.log("Stack mounted " + this.stack.length);
    await fetch(`/api/rooms/${this.name}/join`)
      .then((res) => res.json())
      .then(({ playerID }) => {
        console.log(playerID);
        this.playerID = playerID;
      });
    //TEMP! atm creates a new game instace every time the site loads!

    this.socket.on("start", (start) => {
      console.log("Stack start " + this.stack.length);
      console.log("Socket hör!");
      this.playing = start;
    });

    //Hämtar spelaren och dess motståndare
    this.socket.on("Getplayer", (list) => {
      console.log("Socket hör Getplayer");
      const players = list[0];
      let opponentIndex = 0;
      for (let i = 0; i < players.length; i++) {
        if (i + 1 === this.playerID) {
          this.playerHand = players[i].handCards;
          this.playerDownCards = players[i].downCards;
          this.playerUpCards = players[i].upCards;
        } else {
          this.opponents[opponentIndex] = [
            players[i].handCards,
            players[i].upCards,
            players[i].downCards,
          ];
          opponentIndex += 1;
        }
      }
      this.stack = list[2];
      this.deck = list[3];
    });

    //Uppdaterar status på korthögare och motståndare vid drag
    this.socket.on("playedCard", (list) => {
      console.log("Socket hör playedCard");
      this.stack = list[0];
      this.deck = list[1];
      if (this.playerID === list[3]) {
        this.playersTurn = list[2];
        this.showStack = true;
        this.canPlay();
      }
      let opponentIndex = 0;
      let players = list[4];
      console.log("Players: " + players);
      for (let i = 0; i < players.length; i++) {
        if (i + 1 !== this.playerID) {
          console.log("Opponent: " + i + " Updated");
          this.opponents[opponentIndex] = [
            players[i].handCards,
            players[i].upCards,
            players[i].downCards,
          ];
          opponentIndex += 1;
        }
      }
    });

    //Meddelar om spelet slut
    this.socket.on("gameOver", (list) => {
      this.playing = list[0];
      this.message = list[1];
      this.showMessage = true;
    });
  },
  methods: {
    //Startar spelet om det finns tillräckligt många med
    startGame() {
      this.showMessage = false;
      fetch(`/api/rooms/${this.name}/start`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then(({ start, players, stack, deck }) => {
          if (!start) {
            this.message =
              "För få spelare! Försök igen när en annan spelare har gått med!";
            this.showMessage = true;
          } else {
            this.playing = true;
            let player = players[0];
            this.playerHand = player.handCards;
            this.playerDownCards = player.downCards;
            this.playerUpCards = player.upCards;
            for (let i = 1; i < players; i++) {
              this.opponentHand[i] = players[i].handCards;
            }
            this.stack = stack;
            this.deck = deck;
            this.playersTurn = true;
          }
        });
    },

    //Kollar om spelaren får spela när dens tur, rapporterar till servern resultat om den ej kan
    canPlay() {
      let canPlay = false;
      if (this.stack.length == 0) {
        canPlay = true;
      } else {
        let stackTop = this.stack[this.stack.length - 1];
        if (this.playerHand.length !== 0) {
          for (let i = 0; i < this.playerHand.length; i++) {
            if (
              this.playerHand[i].value >= stackTop.value ||
              this.playerHand[i].value == 2 ||
              this.playerHand[i].value == 10
            ) {
              canPlay = true;
            }
          }
        } else if (this.playerUpCards.length !== 0) {
          for (let i = 0; i < this.playerUpCards.length; i++) {
            if (
              this.playerUpCards[i].value >= stackTop.value ||
              this.playerUpCards[i].value == 2 ||
              this.playerUpCards[i].value == 10
            ) {
              canPlay = true;
            }
          }
        } else {
          canPlay = true;
        }
        if (stackTop.value === 2 || stackTop.value === 10) {
          canPlay = true;
        }
      }
      if (!canPlay) {
        this.playersTurn = false;
        for (let i = 0; i < this.stack.length; i++) {
          this.playerHand.push(this.stack[i]);
        }
        this.showMessage = true;
        this.message = "Could not play any card, stack taken";
        this.stack = [];
        fetch(`/api/rooms/${this.name}/canplay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stack: this.stack,
            deck: this.deck,
            playerCards: [
              this.playerHand,
              this.playerUpCards,
              this.playerDownCards,
            ],
          }),
        });
      }
    },

    //Hanterar spelarens drag, hurvida det är korrekt, uppdaterar högar och retunerar resultat till servern
    playCard(playedCard, playNum) {
      this.showStack = true;
      this.showMessage = false;
      let playerWithCards;
      let cardType = "Down";
      if (this.playerHand.length !== 0) {
        cardType = "Hand";
      } else if (this.playerUpCards.length !== 0) {
        cardType = "Up";
      }

      if (cardType === "Hand") {
        playerWithCards = this.playerHand;
      } else if (cardType === "Up") {
        playerWithCards = this.playerUpCards;
      } else {
        playerWithCards = this.playerDownCards;
      }
      let playerExtraTurn = false;
      console.log(playerWithCards[playNum]);
      //Kollar om godkänt drag när stack ej tom
      if (this.stack.length > 0) {
        let stackTop = this.stack[this.stack.length - 1];
        if (
          playerWithCards[playNum].value >= stackTop.value ||
          playerWithCards[playNum].value === 2 ||
          playerWithCards[playNum].value === 10 ||
          stackTop.value === 2 ||
          stackTop.value === 10
        ) {
          if (
            playerWithCards[playNum].value === 2 ||
            playerWithCards[playNum].value === 10
          ) {
            playerExtraTurn = true;
          }

          playerWithCards.splice(playNum, 1);
          this.stack.push(playedCard);
          if (playedCard.value === 10) {
            this.stack = [];
          }
          if (cardType == "Hand") {
            //Hand plockar upp
            if (playerWithCards.length < 3 && this.deck.length !== 0) {
              playerWithCards.push(this.deck[0]);
              this.deck.splice(0, 1);
            }
          }

          if (cardType === "Hand") {
            this.playerHand = playerWithCards;
          } else if (cardType === "Up") {
            this.playerUpCards = playerWithCards;
          } else {
            this.playerDownCards = playerWithCards;
          }
          if (
            this.playerHand.length === 0 &&
            this.playerUpCards.length === 0 &&
            this.playerDownCards.length === 0
          ) {
            this.playersTurn = false;

            fetch(`/api/rooms/${this.name}/gameover`, {
              //Om spelaren vinner
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ winner: this.playerID }),
            })
              .then((res) => res.json())
              .then(({ play, meddelande }) => {
                this.playing = play;
                this.message = meddelande;
                this.showMessage = true;
              });
          } else {
            if (!playerExtraTurn) {
              //Om 2a eller 10a lades
              this.playersTurn = false;
            }
            if (cardType == "Down") {
              this.showMessage = true;
              this.message = "Successful pick!";
            }
            fetch(`/api/rooms/${this.name}/playcard`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                stack: this.stack,
                deck: this.deck,
                playerCards: [
                  this.playerHand,
                  this.playerUpCards,
                  this.playerDownCards,
                ],
                playerExtraTurn: playerExtraTurn,
              }),
            });
          }
        } else {
          //Om valt drag ej godkänt
          if (cardType == "Hand" || cardType == "Up") {
            this.showMessage = true;
            this.message = "Can not play this card! Try another";
          } else {
            //Om down är det godkänt men spelaren måste ta upp
            playerWithCards.splice(playNum, 1);
            this.stack.push(playedCard);
            for (let i = 0; i < this.stack.length; i++) {
              this.playerHand.push(this.stack[i]);
            }
            this.stack = [];
            this.playersTurn = false;

            this.showMessage = true;
            this.message = "Unsuccessful pick!";
            this.playerDownCards = playerWithCards;
            fetch(`/api/rooms/${this.name}/playcard`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                stack: this.stack,
                deck: this.deck,
                playerCards: [
                  this.playerHand,
                  this.playerUpCards,
                  this.playerDownCards,
                ],
                playerExtraTurn: playerExtraTurn,
              }),
            });
          }
        }
      } else {
        //Om tom stack, kan lägga vad som
        if (playedCard.value == 2 || playedCard.value == 10) {
          playerExtraTurn = true;
        }
        console;
        playerWithCards.splice(playNum, 1);
        this.stack.push(playedCard);
        if (playedCard.value === 10) {
          this.stack = [];
        }
        if (cardType == "Hand") {
          //Hand måste ta upp kort
          if (this.playerHand.length < 3 && this.deck.length != 0) {
            this.playerHand.push(this.deck[0]);
            this.deck.splice(0, 1);
          }
        }
        if (cardType === "Hand") {
          this.playerHand = playerWithCards;
        } else if (cardType === "Up") {
          this.playerUpCards = playerWithCards;
        } else {
          this.playerDownCards = playerWithCards;
        }
        if (
          this.playerHand.length === 0 &&
          this.playerUpCards.length === 0 &&
          this.playerDownCards.length === 0
        ) {
          this.playersTurn = false;

          fetch(`/api/rooms/${this.name}/gameover`, {
            //Om spelaren vinner
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ winner: this.playerID }),
          })
            .then((res) => res.json())
            .then(({ start, meddelande }) => {
              this.playing = start;
              this.message = meddelande;
              this.showMessage = true;
            });
        } else {
          if (!playerExtraTurn) {
            //Om 2a eller 10a lagd
            this.playersTurn = false;
          }
          fetch(`/api/rooms/${this.name}/playcard`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stack: this.stack,
              deck: this.deck,
              playerCards: [
                this.playerHand,
                this.playerUpCards,
                this.playerDownCards,
              ],
              playerExtraTurn: playerExtraTurn,
            }),
          });
        }
      }
    },
  },
};
</script>
<style scoped>
.list-group-item.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
</style>
