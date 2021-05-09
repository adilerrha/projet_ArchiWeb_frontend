<template>
    <div>
        <form @submit.prevent="onSubmit">
            <h3>Inscription</h3>
            <div class="form-group">
                <label for="name">Nom complet</label>
                <input type="text" autocomplete="on" required id="name" v-model="registerForm.name" class="form-control form-control-lg"/>
            </div>
            <div class="form-group">
                <label for="email">Adresse Email</label>
                <input type="email" autocomplete="on" required id="email" v-model="registerForm.email"  class="form-control form-control-lg" />
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" autocomplete="on" required id="password" v-model="registerForm.password" class="form-control form-control-lg" />
            </div>
            <button type="submit" class="btn btn-dark btn-lg btn-block">S'inscrire</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import  {environment} from '../config/environment';
import Constants from '../constants/index';
import { useToast } from "vue-toastification";

export default {
  name: 'Register',
  components: {
    
  },data(){
      return {
        registerForm:{
            name:"",
            email:"",
            password:""
        },
        redirectName:"Login",
        errorMessage: "",
        toast: useToast()
      }
  },
  mounted() {
    let authenticated = sessionStorage.getItem(Constants.AUTHENTICATED);
    if (authenticated != null && authenticated === "true") {
        this.$router.replace({ name: "Home" });
    }
  },
   methods: {
      onSubmit(){          
          axios.post(`${environment.URL}/api/register`, this.registerForm)
          .then(res=>{
               this.toast.success(`L'inscription a réussie !`);
               this.$router.replace({ name: this.redirectName });
          }).catch(err=>{
              this.errorMessage = err.response.data.error;
              this.toast.error(this.errorMessage);
          });
      }
  }, 
}
</script>
