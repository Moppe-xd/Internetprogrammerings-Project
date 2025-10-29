import { createStore } from "vuex";

export default createStore({
  state: {
    authenticated: false,
    username: "",
    playing: false,
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },
    getUsername(state) {
      return state.username;
    },
    getPlaying(state) {
      return state.playing;
    },
  },
  mutations: {
    setAuthenticated(state, authenticated) {
      state.authenticated = authenticated;
    },
    setUsername(state, username) {
      state.username = username;
    },
    setPlaying(state, playing) {
      state.playing = playing;
    },
  },
  actions: {},
  modules: {},
});
