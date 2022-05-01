<template>
  <v-container class="body d-flex pa-0" style="flex-direction: column; max-width: 1320px">

    <div>
      <moto-list title="Mis favoritos"
                 subtitle="Los que más te han gustado"
                 :motos="motos"
                 :loading="loading"
                 class="mt-6"
      ></moto-list>

      <moto-list title="Seleccionados para ti"
                 subtitle="Según tus gustos"
                 :loading="loadingCont"
                 :motos="motosContent"
      ></moto-list>

      <moto-list
          title="Usuarios parecidos a ti también se interesaron"
                 subtitle=""
                 :loading="loadingCol"
                 :motos="motosCollaborative"
      ></moto-list>
    </div>
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
    loading: false,
    loadingCol: false,
    loadingCont: false,
    motos: [],
    motosContent: [],
    motosCollaborative: []
  }),
  methods: {
    async fetchMotos() {
      try {
        this.loading = true;
        const {data} = await this.axios.get("/motos");
        this.motos = data;
      } finally {
        this.loading = false;
      }
    },
    async fetchMotosContent() {
      try {
        this.loadingCont = true;
        const {data} = await this.axios.get("/content");
        this.motosContent = data;
        console.log("motosContent", this.motosContent)
      } finally {
        this.loadingCont = false;
      }
    },
    async fetchMotosCollaborative() {
      try {
        this.loadingCol = true;
        const {data} = await this.axios.get("/collaborative");
        this.motosCollaborative = data;
      } finally {
        this.loadingCol = false;
      }
    }
  }
});
</script>

<style scoped>
</style>
