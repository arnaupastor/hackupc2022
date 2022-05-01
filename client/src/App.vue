<template>
  <v-app>
    <v-app-bar height="70"
               elevation="0"
               app
               style="border-bottom: thin solid #cccccc; width: 100% !important;"
    >
      <img
          class="cursor-pointer"
          @click="$router.push({path: '/'})"

          width="200" contain src="./assets/logo.png">

      <v-spacer></v-spacer>
      <router-link style="color: #333333; text-decoration: none !important;"
                   class="font-weight-medium mr-6"

                   to="/tasacion">Tasación</router-link>
    </v-app-bar>
    <v-main>
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
