<template>
  <div class="row">
    <div class="col"></div>
    <form class="col" @submit.prevent="authenticate()">
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
      <button type="submit" class="btn btn-dark mt-4 float-end">Login</button>
    </form>
    <div class="col"></div>
    <div v-if="login_fail">{{ msg }}</div>
  </div>
</template>

<script>
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Visar login-sidan och hanterar login på frontend
 */
export default {
  name: "LoginView",
  components: {},
  data: () => ({
    username: "",
    password: "",
    msg: "Login failed",
    login_fail: false,
  }),
  methods: {
    authenticate() { //Kollar så den är authenticated
      const { commit } = this.$store;
      const { push } = this.$router;

      if (this.password.length > 3) {
        fetch(`/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        })
          .then((res) => res.json())
          .then(({ authenticated }) => {
            commit("setAuthenticated", authenticated);
            commit("setUsername", this.username);
            push(authenticated === true ? "/rooms" : "/login");
          });
      }
    },
  },
};
</script>
