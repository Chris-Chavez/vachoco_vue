<template>
  <v-app>
    <v-app-bar app color="#cc6809" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo2.png"
          transition="scale-transition"
          width="60"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="250"
          src="./assets/logo-name.png"
          width="150"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn text @click="CerrarSesion">
        <span class="mr-2">Cerrar Sesión</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main style="padding: 3px 0px 0px;">
      <v-tabs fixed-tabs v-model="tab" color="white" background-color="#de4f04">
        <v-tab :to="{ name: 'Pedidos', params: { id: 1 } }">PENDIENTES</v-tab>
        <v-tab :to="{ name: 'Pedidos', params: { id: 2 } }">CONFIRMADOS</v-tab>
        <v-tab :to="{ name: 'Pedidos', params: { id: 3 } }">HISTORIAL</v-tab>
      </v-tabs>

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    tab: null,
  }),
  created() {
    this.$router.replace({ name: 'Pedidos', params: { id: 1 } })
  },
  methods: {
    CerrarSesion() {
      this.$router.replace("/");
    },
  },
};
</script>
