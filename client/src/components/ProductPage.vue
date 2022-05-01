<template>
  <v-container class="body d-flex pa-0" style="flex-direction: column; max-width: 1320px">

    <div>
      <moto-list title="Usuarios parecidos a ti también se interesaron"
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
  name: 'ProductPage',
  components: {
    MotoList
  },
  mounted() {
    this.fetchMoto();
    this.fetchMotosCollaborative();
  },
  data: () => ({
    loading: false,
    loadingCol: false,
    moto: null,
    motosCollaborative: []
  }),
  methods: {
    async fetchMoto() {
      try {
        this.loading = true;
        const {data} = await this.axios.get("/motos");
        this.motos = data;
      } finally {
        this.loading = false;
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
