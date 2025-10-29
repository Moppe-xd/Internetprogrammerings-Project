

<script>
/**
 * Lea Martinelle & Mikael Lundkvist
 * 2025-06-06
 * KTH DD1386 VT25
 * 
 * Hanterar utloggning på klientsidan
 */
export default {
  name: "logoutView",
  components: {},
  data: () => ({}),
  mounted() {
    const { commit, getters } = this.$store;

    if (getters.isAuthenticated) { //Kollar så authenticated vid utlogg
      fetch(`/api/logout`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      commit("setAuthenticated", false);
      commit("setUsername", null);
    }
    this.redirect("/login"); //Diregerar tillbaka till login
  },
  methods: {
    redirect(target) {
      this.$router.push(target);
    },
  },
};
</script>
