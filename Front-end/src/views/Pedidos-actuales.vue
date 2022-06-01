<template>
  <section class="section-container">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="allPedidos"
      @click:row="DetallesPedido"
      item-key="ID_PEDIDO"
      :show-select="showselect"
      :item-class="itemRowBackground"
      sort-by="ID_PEDIDO"
      class="elevation-1"
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>PEDIDOS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <div class="text-center">
            <v-dialog
              v-model="dialog"
              max-width="60%"
              transition="dialog-bottom-transition"
              persistent
            >
              <template v-if="dialog">
                <Pedidos
                  :name="SelectedItem.ID_PEDIDO"
                  :items="Detalles.Productos"
                  :cliente="Cliente"
                  @toggle="dialog = $event"
                  v-on:res="RespuestaPedido"
                  :edit="showedit"
                />
              </template>
            </v-dialog>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-btn color="primary" v-show="showselect" @click="ConfirmaPedidos">
        Confirmar Pedidos
      </v-btn>
    </div>
  </section>
</template>
<script>
import Pedidos from "../components/info-pedidos.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Pedidos,
  },
  data: () => ({
    singleSelect: false,
    showselect: true,
    showedit: true,
    selected: [],
    Detalles: {
      ID_PEDIDO: 0,
      ID_CLIENTE: 0,
      Productos: [
        {
          ID_PEDIDO: 0,
          ID_ESTADO: 0,
          ID_PRODUCTO: 0,
          CANTIDAD: 0,
          TIPO_MEDIDA: "",
        },
      ],
    },
    Cliente: [
      {
        ID_CLIENTE: 0,
        ID_USUARIO: 0,
        NOMBRE_EMPRESA: "",
        RFC: "",
        EMAIL: "",
        TELEFONO: "",
        DOMICILIO: "",
        CIUDAD: "",
      },
    ],
    dialog: false,
    modificados: [],
    headers: [
      {
        text: "ID PEDIDO",
        align: "start",
        sortable: false,
        value: "ID_PEDIDO",
      },
      { text: "FECHA PEDIDO", value: "FECHA_PEDIDO" },
      { text: "FECHA ENTREGA", value: "FECHA_ENTREGA" },
    ],
    Pedidos: [],
    lastIndex: -1,
    PedidosConfirmados: [{}],
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
    ...mapGetters(["allPedidos", "getLoading"]),
  },

  watch: {},

  created() {
    this.$watch(
      () => this.$route.params,
      () => {
        this.initialize();
        if (this.$route.params.id == 1) {
          this.showselect = true;
          this.showedit = true;
        } else {
          console.log(this.$route.params.id);
          this.showselect = false;
          this.showedit = false;
        }
      }
    );
  },

  methods: {
    ...mapActions([
      "setPedidos",
      "setDetallePedido",
      "setCliente",
      "setproductoCat",
      "productInfo",
      "confirmaPedido",
    ]),
    initialize() {
      this.setPedidos({ id: this.$route.params.id });
    },
      itemRowBackground: function (item) {
     return item.STATUS > 1 ? 'style-1' : 'style-2'
  },
    DetallesPedido(item, row) {
      row.select(true);
      this.SelectedIndex = this.allPedidos.indexOf(item);
      this.SelectedItem = Object.assign({}, item);
      var bool;
      this.modificados.forEach((element) => {
        if (element.id == this.SelectedIndex) {
          bool = true;
          return;
        }
      });
      if (bool) {
        this.dialog = true;
        return;
      }
      this.setDetallePedido({
        id: this.SelectedItem.ID_PEDIDO,
        onComplete: (response) => {
          this.Detalles.ID_PEDIDO = this.SelectedItem.ID_PEDIDO;
          this.Detalles.ID_CLIENTE = response.data[0].ID_CLIENTE;
          this.Detalles.Productos = new Array();
          response.data.forEach((el) => {
            this.productInfo({
              id: el.ID_PRODUCTO,
              onComplete: (response) => {
                var aux = {
                  ID_SOLICITUD: el.ID_SOLICITUD,
                  ID_PRODUCTO: parseInt(el.ID_PRODUCTO),
                  NOMBRE: response.data[0].NOMBRE,
                  CANTIDAD: parseInt(el.CANTIDAD),
                  TIPO_MEDIDA: el.TIPO_MEDIDA,
                  EXISTENCIA: parseInt(response.data[0].EXISTENCIA),
                  ID_ESTADO: parseInt(el.ID_ESTADO),
                  ID_CATEGORIA: parseInt(response.data[0].ID_CATEGORIA),
                };
                this.Detalles.Productos.push(aux);
              },
            });
          });
          this.setCliente({
            id: 1,
            onComplete: (response) => {
              this.Cliente = response.data;
            },
          }).then((this.dialog = true));
        },
        onError: (error) => {
          console.log(error);
        },
      });
    },
    RespuestaPedido(items) {
      if (this.SelectedIndex > -1) {
        this.modificados.push({ id: this.SelectedIndex, bool: true });
        this.PedidosConfirmados.splice(
          this.SelectedIndex,
          1,
          Object.assign(items)
        );
      }
    },
    ConfirmaPedidos() {
      if (this.selected.length != 0) {
        for (let i = 0; i < this.selected.length; i++) {
          if (
            this.selected[i].ID_PEDIDO == this.PedidosConfirmados[i].ID_PEDIDO
          ) {
            this.PedidosConfirmados[i].Productos.forEach((element) => {
              this.confirmaPedido({
                id: element.ID_PRODUCTO,
                params: {
                  CANTIDAD: parseInt(element.CANTIDAD),
                  ESTADO: 2,
                  ID_SOLICITUD: element.ID_SOLICITUD,
                },
              });
            });
          }
        }
      }
      this.initialize();
    },
  },
};
</script>