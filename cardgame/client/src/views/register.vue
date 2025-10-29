<template>
  <div class="row">
    <div class="col"></div>
    <form class="col" @submit.prevent="createAccount()">
      <label for="username" class="form-label h4">Username</label>
      <input
        id="username"
        v-model="username"
        type="text"
        class="form-control"
        placeholder="username..."
        required
      />
      <label for="password" class="form-label h4">Password</label>
      <input
        id="password"
        v-model="password"
        type="text"
        class="form-control"
        placeholder="password..."
        required
      />
      <label for="confirmPassword" class="form-label h4"
        >Confirm your password</label
      >
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="text"
        class="form-control"
        placeholder="..."
        required
      />
      <button type="submit" class="btn btn-dark mt-4 float-end">
        Register
      </button>
    </form>
    <div class="col"></div>
    <div v-if="register_fail">{{ msg }}</div>
  </div>
</template>

<script>
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Visar registreringsidan och hanterar det på frontend
 */

export default {
  name: "registerView",
  components: {},
  data: () => ({
    username: "",
    password: "",
    confirmPassword: "",
    msg: "",
    register_fail: false,
  }),
  methods: {
    createAccount() {
      const { commit } = this.$store;
      const { push } = this.$router;

      //Kontrollera ifall dina två lösenord är de samma samt att lösenordet är längre än 3.
      if (this.password != this.confirmPassword || this.password.length <= 3) {
        this.msg = "Failed to register, Try again";
        this.register_fail = true;
        push("/register");
      } else {
        //Hämtar data via register.controller.js
        fetch(`/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        })
          .then((res) => res.json())
          .then(({ authenticated }) => {
            //authenticated retunerat true eller false som sedan uppdateras till sessionen och hur användaren pushas vidare.
            commit("setAuthenticated", authenticated);
            push(authenticated === true ? "/rooms" : "/register");
          });
      }
    },
  },
};
</script>
