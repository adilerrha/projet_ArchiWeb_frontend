<template>
  <div class="container">
  <div class="row">
    <div class="col-sm">
       <div class="card" style="padding:2%">
         <div class="text-center">
          <img :src="image" class="rounded" alt="..." height="400" width="400">
        </div>
      </div>
       <i>Ajouté par l'utilisateur : {{owner.name}}</i>
    </div>
    <div class="col-sm">
      <div class="card" >
        <div class="card-body">
          <h5 class="card-title">{{movie.title}}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Réalisé par <b>{{movie.director}}</b></h6>
          <div class="card-body">
             <div class="row">
              <div class="col">Année de sortie : <b>{{movie.releaseYear}}</b></div>
              <div class="col">Durée : <b>{{timeConvert(movie.duration)}}</b></div>
            </div>
            <div class="row">
                  <div class="col">Status : <b>{{selectedState}}</b></div>
                  <div class="col">Catégorie : <b>{{selectedCategory}}</b></div>
            </div>
          </div>
          <h6 class="card-title mb-2 text-dark">Description</h6>
          <p class="card-text">
            {{movie.description}}
          </p>
          <div style="text-align:right;"> 
            <a href="#" class="card-link"><router-link :to="{ name: 'MovieEdit', params: { id: movie.id }}"><button class="btn btn-warning"><i class="fa fa-edit"></i></button></router-link></a>
            <a href="#" class="card-link"><button class="btn btn-danger" @click="deleteMovie"><i class="fa fa-trash"></i></button></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style>
 .buttons{
    text-align: right;
  }
</style>
<script>
// @ is an alias to /src
import axios from "axios";
import { environment } from "../config/environment";
import Constants from '../constants/index';
import { useToast } from "vue-toastification";

export default {
  name: 'MovieDetail',
  components: {
    
  }, data(){
     return {
       movie:{},
       user:{},
       owner:{},//C'est l'utilisateur qui a ajouté le film pour la première fois
       selectedCategory:"",
       selectedState:"",
       image:"",
       redirectName:"MovieList",
       toast: useToast()
     }  
  },
  mounted(){
     const id = this.$route.params.id;
     this.user = JSON.parse(sessionStorage.getItem(Constants.USER));
     axios.get(`${environment.URL}/api/movies/${id}`,{}).then((res) => {
      this.movie = res.data;
      this.image = `${environment.URL}/${this.movie.urlImage}`;
      axios.get(`${environment.URL}/api/users/${this.movie.userID}`,{}).then((res) => {
        this.owner = res.data;
      });
      axios.get(`${environment.URL}/api/states/${this.movie.stateID}`,{}).then((res) => {
        this.selectedState = res.data.name;
      });
      axios.get(`${environment.URL}/api/categories/${this.movie.categoryID}`,{}).then((res) => {
        this.selectedCategory = res.data.name;
      });
    });
  },
  methods:{
    deleteMovie(){
      if(this.movie.userID != this.user.id){
        alert("Vous n'êtes pas propriétaire du film. Vous ne pouvez pas le supprimer !")
      }else{
        if(confirm(`Voulez-vous vraiment supprimer le film ${this.movie.title} ?`)){
            axios.delete(`${environment.URL}/api/movies/${this.movie.id}`,{}).then((res) => {
              if(res.status===200){
                this.toast.success("Le film a été supprimé avec succès !");
                this.$router.replace({ name: this.redirectName });
              }
            }).catch(err => {console.log(err)});
        }
      }
    },
    timeConvert(min){ 
      let hr="";
      let mn=""; 
      let hours = Math.floor(min / 60);
      if(hours!=0){
        hr=hours+"h";
      }
      let minutes = min % 60;
      if(minutes!=0){
        mn = (minutes.toString().length==1)?"0":"";
        mn+=minutes+"min";
      }
      return hr+mn;         
    },
  }
}
</script>
