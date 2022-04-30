<template>
  <v-app>
    <v-main>
      <v-toolbar height="70"
                 elevation="0"
                 class="d-flex"
                 style="border-bottom: thin solid #cccccc;"
      >
        <v-img width="200" contain src="./assets/logo.png"></v-img>

        <v-spacer></v-spacer>
      </v-toolbar>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>


<style lang="scss" src="./App.scss"></style>
