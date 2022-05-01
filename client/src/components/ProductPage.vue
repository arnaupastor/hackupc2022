<template>
  <v-container class="body d-flex pa-0" style="flex-direction: column; max-width: 1320px">
    <div style="height: 200px; background-color: #d7d7d7; position:relative;"
         class="d-flex align-center justify-center"

    >
      <v-img v-if="image" :src="image"
             style="object-fit: fill; height: 200px"></v-img>

      <v-icon v-else color="grey" size="40">{{ random ? 'mdi-motorbike' : 'mdi-moped' }}</v-icon>
    </div>


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
    this.fetchMotosContent();
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
        this.moto = data;
      } finally {
        this.loading = false;
      }
    },
    async fetchMotosContent() {
      try {
        this.loadingCol = true;
        const {data} = await this.axios.get("/content/" + this.$route.params.id);
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
