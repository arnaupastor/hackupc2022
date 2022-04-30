<template>
  <v-container class="body d-flex pa-4" style="flex-direction: column">

    <v-row>
      <v-col
          v-for="(moto, idx) in motos"
          :key="idx"
          cols="3">
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
    motos: []
  }),
  methods: {
    async fetchMotos() {
      const {data} = await this.axios.get("/motos");
      console.log(data)
      this.motos = data;
    }
  }
});
</script>

<style scoped>
</style>
