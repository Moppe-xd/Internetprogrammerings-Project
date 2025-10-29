<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <button
      class="navbar-toggler mx-2 mb-2"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarNav" class="collapse navbar-collapse mx-2">
      <ul class="navbar-nav">
        <li v-if="!isAuth" class="nav-item">
          <a class="nav-link" href="#" @click.prevent="redirect('/login')"
            >Login</a
          >
        </li>
        <li v-if="!isAuth" class="nav-item">
          <a class="nav-link" href="#" @click.prevent="redirect('/register')"
            >register</a
          >
        </li>
        <li v-if="isAuth" class="nav-item">
          <a class="nav-link" href="#" @click.prevent="redirect('/account')"
            >Konto</a
          >
        </li>
        <li v-if="isAuth" class="nav-item">
          <a class="nav-link" href="#" @click.prevent="redirect('/logout')"
            >Logout</a
          >
        </li>
        <li v-if="isAuth" class="nav-item">
          <a class="nav-link" href="#" @click.prevent="redirect('/rooms')"
            >rooms</a
          >
        </li>
      </ul>
    </div>
  </nav>
  <section class="container-fluid py-4">
    <router-view />
  </section>
</template>

<script>
// @ is an alias to /src
import "bootstrap";

export default {
  name: "App",
  components: {},
  data: () => ({}),
  computed: {
    isAuth() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>

<style>
@import url("bootstrap/dist/css/bootstrap.css");

html,
body {
  /* https://designs.ai/colors */
  background-color: #42854a;
}
</style>
