<template>
  <v-card v-if="moto" class="rounded-lg shadow-md">
    <div style="height: 200px; background-color: #d7d7d7">

      <v-img v-if="image" :src="image"
             style="object-fit: fill; height: 200px"></v-img>
    </div>
    <v-divider></v-divider>
    <div class="d-flex pa-5" style="height: 80px">
      <span style="flex: 1" class="title px-0 two-text pr-2">{{ moto.brand }} {{ moto.model }} {{ moto.version }}</span>
      <span class="red--text text--darken-2">{{ moto.sell_price }}€</span>
    </div>
    <span class="caption px-5" style="font-size: 13px !important;">{{ moto.year }}
      <span class="red--text text--darken-2 px-1">|</span>
      {{ formatNumber(moto.km) }} km</span>

    <v-card-actions class="pa-5 mt-3">
      <v-btn color="red darken-2" class="text-none body-1" dark block depressed>
        Comprar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Item",
  data() {
    return {
      image: null
    }
  },
  props: {
    moto: Object
  },
  async mounted() {
    // await this.getImage()
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
    }
  }
}
</script>

<style scoped>
.two-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  height: 70px;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
