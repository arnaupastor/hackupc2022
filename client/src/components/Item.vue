<template>
  <v-card v-if="moto" class="rounded-lg pa-5 shadow-md">
    <div class="d-flex" style="height: 80px">
      <span style="flex: 1" class="title px-0">{{ moto.brand }} {{ moto.model }} {{ moto.version }}</span>
      <span class="red--text text--darken-2">{{ moto.sell_price }}€</span>
    </div>
    <span class="caption" style="font-size: 13px !important;">{{ moto.year }}
      <span class="red--text text--darken-2 px-1">|</span>
      {{ formatNumber(moto.km) }} km</span>

    <v-card-actions class="pa-0 mt-3">
      <v-btn color="red darken-2" class="text-none body-1" dark block depressed>
        Comprar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Item",
  props: {
    moto: Object
  },
  methods: {
    formatNumber(number) {
      const exp = /(\d)(?=(\d{3})+(?!\d))/g;
      const rep = '$1.';
      return number.toString().replace(exp, rep);
    }
  }
}
</script>

<style scoped>

</style>
