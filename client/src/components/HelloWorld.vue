<template>
  <v-container class="body d-flex pa-4" style="flex-direction: column">
    <v-row>
      <v-col
          v-for="(moto, idx) in motos"
          :key="idx"
          cols="4">
        <item
            :moto="moto"
        ></item>
      </v-col>
    </v-row>
  </v-container>

</template>

<script lang="ts">
import Vue from 'vue';
import Item from "./Item.vue"

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    Item
  },
  mounted() {
    this.fetchMotos();
  },
  data: () => ({
    send: false,
    motos: null
  }),
  methods: {
    async fetchMotos() {
      const {data} = await this.axios.get("/motos");
      this.motos = data.splice(0, 40);
    }
  }
});
</script>

<style scoped>
</style>
