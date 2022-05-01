<template>
  <div class="body d-flex pa-0" style="flex-direction: column">
    <div style="height: 500px; background-color: #d7d7d7; position:relative;"
         class="d-flex align-center justify-center"

    >
      <v-img v-if="image" :src="image"
             style="object-fit: fill; height: 500px"></v-img>

      <v-icon v-else color="grey" size="40">{{ random ? 'mdi-motorbike' : 'mdi-moped' }}</v-icon>
    </div>

    <div v-if="moto" class="d-flex pa-5" style="height: 80px">
        <span style="flex: 1" class="title px-0 two-text pr-2 text-uppercase">
          {{ moto.brand }} {{moto.model}} {{ moto.version }}
        </span>
      <span class="red--text text--darken-2">{{ formatNumber(moto.sell_price) }}€</span>
    </div>


    <div>
      <moto-list title="Usuarios parecidos a ti también se interesaron"
                 subtitle=""
                 class="mx-auto mt-12"
                 :loading="loadingCol"
                 :motos="motosCollaborative"
      ></moto-list>
    </div>
  </div>

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
        const {data} = await this.axios.get("/moto/"+ this.$route.params.id);
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
