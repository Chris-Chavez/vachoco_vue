<template>
  <section class="section-container">
    <v-row class="signin">
      <v-col cols="8" class="left" style="back">
        <v-img src="../assets/logo.png"> </v-img>
      </v-col>
      <v-col cols="4" class="right">
        <h2>LOGIN</h2>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="email"
            :rules="[rules.required, rules.email]"
            label="Email"
            required
            outlined
            dark
            filled
            dense
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            :rules="[rules.required]"
            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPass = !showPass"
            required
            outlined
            dense
            dark
            filled
            :type="showPass ? 'text' : 'password'"
          ></v-text-field>
          <div class="text-center">
            <v-btn class="signin-btn" type="submit" rounded color="white" dark>
              Iniciar Sesion
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapActions } from "vuex";
export default {
  components: {},
  data: () => ({
    valid: true,
    email: "",
    password: null,
    showPass: false,
    rules: {
      required: (value) => !!value || "Requerido.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Favor de ingresar un correo valido";
      },
    },
  }),
  computed: {
    params() {
      return {
        email: this.email,
        password: this.password,
      };
    },
  },
  methods: {
    ...mapActions(["LoginEmpleados"]),
    async submit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        this.Login({
          params: { user: this.email, pass: this.password },
          onComplete: (response) => {
            if (response.data.length == 0) {
              alert('Usuario o contraseña incorrecta')
              return;
            }
            if (
              response.data[0][0].PASSWORD == this.password &&
              response.data[0][0].USERNAME == this.email
            ) {
              localStorage.setItem("ID_USUARIO", response.data[0][0].ID_USUARIO);
              this.$router.replace("/AppLayout"); // action to login
            }
          },
          onError: (error) => {
            console.log(error);
          },
        });
      }
    },
  },
};
</script>