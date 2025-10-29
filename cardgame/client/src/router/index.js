import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import login from "../views/Login.vue";
import register from "../views/register.vue";
import account from "../views/account.vue";
import logout from "../views/logout.vue";
import room from "../views/Room.vue";
import rooms from "../views/Rooms.vue";

const routes = [
  //Add paths when sites are created
  {
    path: "/",
    redirect: "/rooms",
  },
  {
    path: "/login",
    component: login,
  },
  {
    path: "/register",
    component: register,
  },
  {
    path: "/account",
    component: account,
  },
  {
    path: "/logout",
    component: logout,
  },
  {
    path: "/rooms",
    component: rooms,
  },
  {
    path: "/rooms/:name",
    component: room,
  },
];

//This need to get updated
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Setup authentication guard.
router.beforeEach(async (to, from, next) => {
  //Denna måste undersökas. Den redirectas innan
  console.log("Does API requst for user");
  const res = await fetch(`/api/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const { authenticated } = await res.json();
  console.log("Done with API request");
  store.commit("setAuthenticated", authenticated);

  console.log("Authenticated:", store.state.authenticated);
  console.log("Navigating to:", to.path);
  if (
    store.state.authenticated ||
    to.path === "/login" ||
    to.path === "/register"
  ) {
    next();
  } else {
    console.info("Unauthenticated user. Redirecting to login page.");
    next("/login");
  }
});

export default router;
