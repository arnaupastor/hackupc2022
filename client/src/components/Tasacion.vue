<template>
  <div class="body d-flex pa-0 mt-6" style="flex-direction: column">
    <v-card style="height: 100%; max-width: 500px; width: 100%" class="shadow-md pa-6 mx-auto">
      <span class="title" style="font-size: 26px !important">Tasación</span>

      <v-autocomplete
          v-model="marca"
          :items="marcas"
          outlined
          dense
          color="red darken-2"
          background-color="grey lighten-4"
          class="mt-4"
          item-value="name"
          item-text="name"
          label="Marca"
      ></v-autocomplete>

      <v-autocomplete
          v-model="modelo"
          :items="modelos"
          outlined
          dense
          color="red darken-2"
          background-color="grey lighten-4"
          label="Modelo"
      ></v-autocomplete>

      <v-autocomplete
          v-model="version"
          :items="versiones"
          outlined
          dense
          color="red darken-2"
          background-color="grey lighten-4"
          label="Version"
      ></v-autocomplete>

      <v-text-field
          v-model="year"
          outlined
          dense
          color="red darken-2"
          background-color="grey lighten-4"
          label="Año"
          :rules="[v => !!v || v > 1900 ||  v  < 2023]"
          type="number"
      ></v-text-field>

      <v-text-field
          v-model="km"
          outlined
          dense
          type="number"
          :rules="[v => !!v || v > 0 ||  v  < 1000000]"
          color="red darken-2"
          background-color="grey lighten-4"
          label="Kilometros"
      ></v-text-field>

      <v-card-actions class="py-0">
        <v-btn
            @click="tasar"
            color="red darken-2" block class="text-none body-1 px-6" dark depressed>
          Tasar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-overlay absolute v-if="loading" opacity="0.5" color="white">
      <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="model" style="max-width: 400px" width="400">
      <v-card v-if="precio" class="pa-10 text-center" max-width="400px">
        <span class="title" style="font-size: 26px !important">El precio calculado es:</span>
        <br>
        <span class="title mt-12">{{ precio }}€</span>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import motos from '../assets/motos.json'


export default Vue.extend({
  name: 'Tasacion',
  components: {},
  mounted() {
    this.fetchBranch();
  },
  data: () => ({
    motos: motos,
    model: false,
    loading: false,
    precio: null,
    marca: null,
    modelo: null,
    version: null,
    year: null,
    km: null,
    marcas: [],
    years: [],
  }),
  computed: {
    random() {
      return Math.random() < 0.5
    },
    modelos() {
      if (this.marca)
        return this.motos.filter(m => m.brand === this.marca).map(m => m.model)
      return []
    },
    versiones() {
      if (this.marca && this.modelo)
        return this.motos.filter(m => m.brand === this.marca && m.model === this.modelo).map(m => m.version)
      return []
    }
  },
  methods: {
    async tasar() {
      try {
        this.loading = true;
        const {data} = await this.axios.get(`/prediction/${this.marca}/${this.modelo}/${this.version}/${this.year}/${this.km}`);
        this.precio = data;
        this.model = true;
      } finally {
        this.loading = false;
      }
    },
    async fetchBranch() {
      try {
        this.loading = true;
        const {data} = await this.axios.get("/brands");
        this.marcas = data;
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>

<style scoped>
</style>
