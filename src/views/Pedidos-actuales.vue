<template>
  <section class="section-container">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="Pedidos"
      @click:row="DetallesPedido"
      :single-select="singleSelect"
      item-key="name"
      show-select
      sort-by="name"
      class="elevation-1"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>PEDIDOS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="90%">
            <Pedidos :name="SelectedItem.name" @toggle="dialog = $event" />
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        :color="item.actions.color">
          {{item.actions.src}}
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-btn color="primary" @click="PedidosConfirmados">
        Confirmar Pedidos
      </v-btn>
    </div>
  </section>
</template>
<script>
import Pedidos from "../components/info-pedidos.vue";

export default {
  components: {
    Pedidos,
  },
  data: () => ({
    singleSelect: false,
    selected: [],
    dialog: false,
    headers: [
      {
        text: "Cliente",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Fecha", value: "date" },
      { text: "Columna 2", value: "fat" },
      { text: "Columna 3", value: "carbs" },
      { text: "Columna 4", value: "protein" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    Pedidos: [],
    SelectedIndex: 0,
    SelectedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
  },

  watch: {},

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.Pedidos = [
        {
          id: 1,
          check: false,
          name: "Cliente 1",
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          actions: {src: 'mdi-checkbox-marked-circle', color:'green'}
        },
        {
          id: 2,
          check: false,
          name: "Cliente 2",
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          actions: {src: 'mdi-cancel', color: 'red'}
        },
        {
          id: 3,
          check: false,
          name: "Cliente 3",
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          actions: {src: 'mdi-cancel', color: 'red'}
        },
        {
          id: 4,
          check: false,
          name: "Cliente 4",
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
           actions: {src: 'mdi-checkbox-marked-circle', color:'green'}
        },
        {
          id: 5,
          check: false,
          name: "Cliente 5",
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          actions: {src: 'mdi-cancel', color: 'red'}
        },
      ];
    },
    DetallesPedido(item) {
      this.SelectedIndex = this.Pedidos.indexOf(item);
      this.SelectedItem = Object.assign({}, item);
      this.dialog = true;
    },
    PedidosConfirmados() {
      console.log(this.selected);
    },

  },
};
</script>