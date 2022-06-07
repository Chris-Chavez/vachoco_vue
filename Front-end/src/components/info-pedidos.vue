<template>
  <section class="section-container">
    <v-data-table
      :headers="headers"
      :items="items"
      :item-class="itemRowBackground"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-card class="mx-auto" max-width="40%" tile>
          <v-img
            height="50%"
            src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
          >
            <v-row align="center" class="fill-height">
              <v-col align-self="end" class="pa-5" cols="12">
                <v-avatar class="profile" color="white" size="40%" tile>
                  <v-img src="../assets/Cliente.png" width="100%"></v-img>
                </v-avatar>
              </v-col>
              <v-col class="py-0">
                <v-list-item color="rgba(0, 0, 0, .4)" dark>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      {{ cliente[0].NOMBRE_EMPRESA }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ cliente[0].DOMICILIO }}, {{ cliente[0].CIUDAD }}.<br />
                      {{ cliente[0].RFC }} <br />
                      {{ cliente[0].TELEFONO }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-img>
        </v-card>
        <v-toolbar flat>
          <v-toolbar-title>Pedido N° {{ name }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="700px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                      style="margin: 18px 0px 0px 0px"
                    >
                      <v-select
                        v-model="select"
                        :items="Products"
                        label="Productos"
                        item-text="NOMBRE"
                        item-value="ID_PRODUCTO"
                        return-object
                        @change="ActValor(select)"
                        dense
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.CANTIDAD"
                        onkeypress="return (event.charCode >= 48 && event.charCode <= 57)"
                        type="number"
                        label="CANTIDAD"
                        min="1"
                        max="5"
                        :counter="5"
                        @paste="onPaste"
                        :rules="[
                          rules.required,
                          rules.numeros,
                          (v) =>
                            v <= editedItem.EXISTENCIA || 'Cantidad Errónea',
                          (v) => v >= 0 || 'Cantidad Errónea',
                          (v) => v != 0 || 'Ingrese una Cantidad válida',
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.EXISTENCIA"
                        readonly
                        label="EXISTENCIA"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon v-show="edit" small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary"> Reset </v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-btn color="warning" class="mr-2" @click="cerrardialog">
        Cancelar
      </v-btn>
      <v-btn color="primary" :disabled="!edit" @click="ConfirmarPedido">
        Confirmar
      </v-btn>
    </div>
  </section>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["name", "items", "cliente", "toggle", "edit"],
  data: () => ({
    valid: false,
    dialog: false,
    rules: {
      required: (v) => !!v || "Informacion requerida",
      numeros: (v) => {
        const pattern = /^[0-9]+$/;
        return pattern.test(v) || "Cantidad Errónea";
      },
    },
    headers: [
      {
        text: "Producto",
        align: "start",
        sortable: false,
        value: "ID_PRODUCTO",
      },
      { text: "Nombre", value: "NOMBRE" },
      { text: "CANTIDAD", value: "CANTIDAD" },
      { text: "EXISTENCIA", value: "EXISTENCIA", disabled: true },
      { text: "TIPO_MEDIDA", value: "TIPO_MEDIDA" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {},
    select: { ID_PRODUCTO: 0, NOMBRE: "", CANTIDAD: 0 },
    Products: [],

    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Editar Pedido";
    },
    Cantidad() {
      const pattern = /^[0-9]+$/;
      return (
        this.editedItem.CANTIDAD < this.editedItem.EXISTENCIA &&
        this.editedItem.CANTIDAD > 0 &&
        pattern.test(this.editedItem.CANTIDAD)
      );
    },
    Vacio() {
      return this.editedItem.CANTIDAD <= 0;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {},

  methods: {
    ...mapActions(["setproductoCat"]),
    ActValor(item) {
      this.editedItem.ID_PRODUCTO = item.ID_PRODUCTO;
      this.editedItem.NOMBRE = item.NOMBRE;
      this.editedItem.EXISTENCIA = item.CANTIDAD;
    },
    itemRowBackground: function (item) {
      return item.CANTIDAD <= item.EXISTENCIA ? "style2-1" : "style2-2";
    },
    onPaste(evt) {
      evt.preventDefault();
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.select = {
        ID_PRODUCTO: item.ID_PRODUCTO,
        NOMBRE: item.NOMBRE,
        EXISTENCIA: item.EXISTENCIA,
      };
      this.setproductoCat({
        id: item.ID_CATEGORIA,
        onComplete: (response) => {
          this.Products = response.data[0];
        },
      });
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.Cantidad && !this.Vacio) {
        if (this.editedIndex > -1) {
          Object.assign(this.items[this.editedIndex], this.editedItem);
          this.$alert(
            "Producto modificado correctamente",
            "Modificacion Exitosa",
            "success"
          );
        }
        this.close();
      }
    },
    cerrardialog() {
      this.$emit("toggle", false);
    },
    ConfirmarPedido() {
      var exis;
      this.items.forEach((el) => {
        if (el.CANTIDAD > el.EXISTENCIA) {
          exis = true;
          return;
        }
      });
      if (exis) {
        this.$alert(
          "Un producto excede la existencia",
          "Error Al Confirmar",
          "error"
        );
        return;
      }
      this.$emit("res", {
        ID_PEDIDO: this.name,
        ID_CLIENTE: this.cliente[0].ID_CLIENTE,
        Productos: this.items,
      });
      this.cerrardialog();
    },
  },
};
</script>



