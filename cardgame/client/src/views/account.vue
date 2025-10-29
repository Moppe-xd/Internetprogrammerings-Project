<template>
  <div class="row">
    <div class="col"></div>
    <h1>{{ username }}</h1>
    <h2>Winrate: {{ winrate }}</h2>
    <div
      v-for="(match, index) in speladeMatcher.slice().reverse()"
      id="test"
      :key="index"
    >
      <h5>
        Match: {{ match.gameID }} Winner: {{ match.winner }} Losers:{{
          match.loser1
        }}, {{ match.loser2 }}, {{ match.loser3 }}
      </h5>
    </div>

    <div class="col"></div>
  </div>
</template>

<script>
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Visar klienten account-sida med relevant information hämtad från backend
 */

export default {
  name: "accountView",
  components: {},
  data: () => ({
    username: "",
    winrate: 0,
    speladeMatcher: [],
  }),
  mounted() {
    //Gets the user winrate and matchhistory with this API request
    const { getters } = this.$store;
    this.username = getters.getUsername;
    fetch(`/api/account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: getters.getUsername }),
    })
      .then((res) => res.json())
      .then(({ winrate, matchlist }) => {
        this.winrate = winrate;
        console.log(matchlist);
        this.speladeMatcher = matchlist;
      });
  },
  methods: {},
};
</script>
