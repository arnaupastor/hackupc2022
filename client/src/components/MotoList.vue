<template>
  <div class="body d-flex pa-4 mb-2" style="flex-direction: column; max-width: 1320px">
    <span v-if="!loading" class="title " style="font-size: 26px !important; margin-left: 60px">{{title}}</span>
    <span v-if="!loading" class="title mb-1  font-weight-regular" style="font-size: 20px !important; margin-left: 60px">{{subtitle}}</span>
    <v-slide-group
        v-if="!loading"
        multiple
        show-arrows
    >
      <v-slide-item
          v-for="(moto, idx) in motos"
          :key="idx"
      >

          <item :moto="moto"
          ></item>

      </v-slide-item>
    </v-slide-group>

    <v-slide-group
        v-else
        multiple
        show-arrows
        style="padding-right: 56px; padding-left: 56px; padding-top: 56px"
    >
      <v-slide-item
          v-for="(moto, idx) in 4"
          :key="idx"
      >

        <v-skeleton-loader
            class="mx-auto px-2"
            width="100%"
            height="393"
            type="image, article"
        ></v-skeleton-loader>
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
    loading: Boolean
  },
  data: () => ({
    send: false,
  })
});
</script>

<style scoped>
</style>
