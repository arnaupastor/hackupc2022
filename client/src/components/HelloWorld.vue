<template>
  <v-container class="body d-flex pa-0" style="flex-direction: column; max-width: 1320px">

    <moto-list title="Mis favoritos"
               subtitle="Los que más te han gustado"
               :motos="motos"
               class="mt-6"
    ></moto-list>

    <moto-list title="Seleccionados para ti"
               subtitle="Según tus gustos"
               :motos="motosContent"
    ></moto-list>

    <moto-list title="Usuarios parecidos a ti también se interesaron"
               subtitle=""
               :motos="motosCollaborative"
    ></moto-list>

  </v-container>

</template>

<script lang="ts">
import Vue from 'vue';
import MotoList from "./MotoList.vue"

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    MotoList
  },
  mounted() {
    this.fetchMotos();
    this.fetchMotosContent();
    this.fetchMotosCollaborative();
  },
  data: () => ({
    send: false,
    motos: [],
    motosContent: [],
    motosCollaborative: []
  }),
  methods: {
    async fetchMotos() {
      const {data} = await this.axios.get("/motos");
      this.motos = data;
    },
    async fetchMotosContent() {
      const {data} = await this.axios.get("/content");
      this.motosContent = data;
      console.log("motosContent", this.motosContent)
    },
    async fetchMotosCollaborative() {
      const {data} = await this.axios.get("/collaborative");
      this.motosCollaborative = data;
    }
  }
});
</script>

<style scoped>
</style>
