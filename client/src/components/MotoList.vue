<template>
  <div class="body d-flex pa-4 mb-2" style="flex-direction: column; max-width: 1320px">
    <span class="title " style="font-size: 26px !important; margin-left: 60px">{{title}}</span>
    <span class="title mb-1  font-weight-regular" style="font-size: 20px !important; margin-left: 60px">{{subtitle}}</span>
    <v-slide-group
        multiple
        show-arrows
    >
      <v-slide-item
          v-for="(moto, idx) in motos"
          :key="idx"
      >
          <item
              :moto="moto"
          ></item>
      </v-slide-item>
    </v-slide-group>

  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import Item from "./Item.vue"

export default Vue.extend({
  name: 'HelloWorld',
  components: {
    Item
  },
  props: {
    motos: Array,
    title: String,
    subtitle: String,
  },
  data: () => ({
    send: false,
  })
});
</script>

<style scoped>
</style>
