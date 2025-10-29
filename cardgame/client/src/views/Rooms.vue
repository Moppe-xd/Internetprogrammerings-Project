<template>
  <div class="row">
    <div class="col"></div>
    <div class="col list-group">
      <!-- Kanske är värt att visa hur många som är i lobbyn på knappen typ (1/2)? -->
      <button
        v-for="room in rooms"
        :key="room.name"
        type="button"
        class="list-group-item list-group-item-action my-2 py-2"
        @click="redirect(room.name)"
      >
        {{ room.name }}
      </button>
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
 * Visar valen av rum som finns att gå med i för klienten och hanterar deras val av rum.
 */

export default {
  name: "RoomsView",
  components: {},
  data: () => ({
    rooms: [],
  }),
  mounted() {
    //Visar alla rooms
    fetch("/api/rooms")
      .then((res) => res.json())
      .then(({ rooms }) => {
        this.rooms = rooms;
      })
      .catch(console.error);
  },
  methods: {
    redirect(name) {
      //Redirectar till valt rum
      this.$router.push(`/rooms/${name}`);
    },
  },
};
</script>
