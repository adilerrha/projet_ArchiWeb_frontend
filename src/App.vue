<template>
 <!-- Navigation -->
      <div>
      <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row">
        <div class="container">
          <div class="navbar-brand float-left" style="cursor:pointer;">
            <router-link class="nav-link pr-3" to="/"><img src="@/assets/ecam-logo.jpg" alt="Logo ECAM" height="50" width="50">{{appName}}</router-link>
          </div>
          <ul class="nav navbar-nav flex-row float-left">
            <li class="nav-item" v-if="authenticated">
              <router-link class="nav-link pr-3" to="/movies">Les films</router-link>
            </li>
            <li class="nav-item" v-if="authenticated"> 
              <router-link class="nav-link pr-3" to="/categories">Les catégories</router-link>
            </li>
          </ul>
          <ul class="nav navbar-nav flex-row float-right">
            <li class="nav-item" v-if="!authenticated">
              <router-link class="nav-link pr-3" to="/login">Connexion</router-link>
            </li>
            <li class="nav-item" v-if="!authenticated"> 
              <router-link class="nav-link" to="/register">S'inscrire</router-link>
            </li>
            <li class="nav-item" v-if="authenticated"> 
              <span class="mr-3" style="cursor: pointer;"><b>{{user.name}}</b></span>
              <button class="btn btn-outline-primary" v-on:click="logout()">Se déconnecter</button>
            </li>
          </ul>
        </div>
      </nav>
     </div>
 
    <!-- Main -->
    <div class="container" style="margin-top:2%">
          <router-view @checkAuthentificationEvent="checkAuthentificationEvent"/>
    </div>
</template>

<style>
  .is-active{
    font-weight: bolder;
    color: #b60f4b;
  }


  .nav-link:hover{
    color: #b60f4b;
  }
</style>


<script>
import Constants from './constants/index'

export default {
  name: "App",
  watch: {
        $route: {
            immediate: true,
            handler(to) {
                document.title = to.meta.title || 'Mes films Apps';
            }
        }
  },
  components: {},
  data() {
    return {
      appName:Constants.APP_NAME,
      email: "",
      password: "",
      error: false,
      errorMessage: "",
      authenticated:false,
      user:{},
      
    };
  },
  mounted() {
    
    this.authenticated = JSON.parse(sessionStorage.getItem(Constants.AUTHENTICATED));
    if (this.authenticated == null || !this.authenticated) {
        this.$router.replace({ name: "Login" });
    }else{
      this.user = JSON.parse(sessionStorage.getItem(Constants.USER));
    }
  },
  methods: {
    logout(){
      sessionStorage.removeItem(Constants.AUTHENTICATED);
      sessionStorage.removeItem(Constants.USER);
      this.$router.replace({ name: "Login" });
      this.authenticated = false;
    },
    checkAuthentificationEvent(){
      this.authenticated = JSON.parse(sessionStorage.getItem(Constants.AUTHENTICATED));
      if (this.authenticated == null || !this.authenticated) {
          this.$router.replace({ name: "Login" });
      }else{
        this.user = JSON.parse(sessionStorage.getItem(Constants.USER));
      }
    }
  },
};
</script>
