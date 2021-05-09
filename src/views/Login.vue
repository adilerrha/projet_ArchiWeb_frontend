<template>
  <div>
    <form @submit.prevent="onSubmit">
      <h3>Connexion</h3>

      <div class="form-group">
        <label for="email">Adresse Email</label>
        <input
          type="email"
          v-model="loginForm.email"
          id="email"
          required
          autocomplete="on"
          class="form-control form-control-lg"
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="loginForm.password"
          required
          autocomplete="on"
          class="form-control form-control-lg"
        />
      </div>

      <button type="submit" class="btn btn-dark btn-lg btn-block">
        Se connecter
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { environment } from "../config/environment";
import Constants from '../constants/index';
import { useToast } from "vue-toastification";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm:{
        email: "",
        password: ""
      },      
      errorMessage: "",
      redirectName:"MovieList",
      toast: useToast()
    };
  },
  mounted() {
    let authenticated = sessionStorage.getItem(Constants.AUTHENTICATED);
    if (authenticated != null && authenticated === "true") {
      this.toast.info(`Vous êtes déjà connecté !`);
      this.$router.replace({ name: this.redirectName });
    }
  },
  methods: {
    onSubmit() {
      axios
        .post(`${environment.URL}/api/login`, this.loginForm)
        .then((res) => {
          sessionStorage.setItem(Constants.AUTHENTICATED, true);
          sessionStorage.setItem(Constants.USER, JSON.stringify(res.data));
          this.toast.success(`Vous êtes connecté !`);
          this.$router.replace({ name: this.redirectName });
          this.$emit("checkAuthentificationEvent",true);
        })
        .catch((err) => {
              this.errorMessage = err.response.data.error;
              this.toast.error(this.errorMessage);
        });
    },
  },
};
</script>
