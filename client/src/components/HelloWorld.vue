<template>
  <div class="body d-flex" style="flex-direction: column">
    {{ brands }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HelloWorld',
  mounted() {
    this.fetchBrands();
  },
  data: () => ({
    send: false,
    brands: null
  }),
  methods: {
    async fetchBrands() {
      const {data} = await this.axios.get("/brands");
      this.brands = data;
    }
  }
});
</script>

<style scoped>
</style>
