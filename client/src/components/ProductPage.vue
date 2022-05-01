<template>
  <div class="body d-flex pa-0" style="flex-direction: column">
    <div style="height: 500px; background-color: #d7d7d7; position:relative;"
         class="d-flex align-center justify-center"

    >
      <v-img v-if="image"
             :src="image"
             style="object-fit: fill; height: 500px; background-position: top center !important;"></v-img>

      <v-icon v-else color="grey" size="40">{{ random ? 'mdi-motorbike' : 'mdi-moped' }}</v-icon>
    </div>
    <div>

      <div v-if="moto" class="d-flex pa-5 mx-auto align-center" style="height: 80px; max-width: 1210px">
        <span style="flex: 1; font-size: 25px !important;" class="title px-0 two-text pr-2 text-uppercase">
          {{ moto.brand }} {{moto.model}} {{ moto.version }}
        </span>
        <span class="red--text text--darken-2 font-weight-bold" style="font-size: 20px">{{ formatNumber(moto.sell_price) }}€</span>
        <v-btn color="red darken-2" class="px-6 ml-4 text-none body-1" dark depressed>
          Comprar
        </v-btn>
      </div>

      <v-divider></v-divider>

      <moto-list title="Productos relacionados con este producto"
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
  async mounted() {
    await this.fetchMoto();
    await this.fetchMotosContent();
    await this.getImage()

  },
  data: () => ({
    loading: false,
    loadingCol: false,
    moto: null,
    image: null,
    motosCollaborative: []
  }),
  computed: {
    random() {
      return Math.random() < 0.5
    }
  },
  methods: {
    async getImage() {
      const input = `${this.moto.brand} ${this.moto.model} ${this.moto.version}`
      const {data} = await this.axios.get(`/image/${input}`)
      this.image = data
    },
    formatNumber(number) {
      const exp = /(\d)(?=(\d{3})+(?!\d))/g;
      const rep = '$1.';
      return number.toString().replace(exp, rep);
    },
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
  },
  watch: {
    async '$route.params'() {
      await this.fetchMoto();
      await this.fetchMotosContent();
      await this.getImage()
    }
  }
});
</script>

<style scoped>
</style>
