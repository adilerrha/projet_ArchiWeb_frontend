<template>
        <div class="category" v-if="isCategoryNavigation">
          {{category.name}}
        </div>
        <div class="card" style="width: 19rem;">
        <img class="card-img-top" :src="image" alt="Card image cap" >
        <div class="card-body">
          <h4 class="card-title">{{movie.title}}</h4>
          <p class="card-text">
            <b>Auteur</b> : {{movie.director}}<br/>
            <b>Année de sortie</b> : {{movie.releaseYear}}<br/>
            <b>Durée</b> : {{timeConvert(movie.duration)}}<br/>
            <b>Status</b> : <b><span :style="'text-align:right;color:'+clrStatus">{{state.name}}</span></b>
          </p>
          <div class="row">
              <div class="col"><router-link :to="{ name: 'MovieDetail', params: { id: movie.id }}"><button class="btn btn-info"><i class="fa fa-info"></i></button></router-link></div>
              <div class="col"><router-link :to="{ name: 'MovieEdit', params: { id: movie.id }}"><button class="btn btn-warning"><i class="fa fa-edit"></i></button></router-link></div>
              <div class="col"><button class="btn btn-danger" @click="deleteMovie"><i class="fa fa-trash"></i> </button></div>
          </div>
        </div>
       </div>
</template>

<style scoped>
  .category{
    background-color: #b60f4b;
    text-align: center;
    color: white;
    font-weight: bolder;
    font-size: 1.2em;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    padding: 2%;
  }
  .buttons{
    text-align: right;
  }
  button{
    width: 100%;
  }

  .card{
    padding: 2%;
  }
  
</style>


<script>
import axios from "axios";
import { environment } from "../config/environment";
import Constants from '../constants/index';
import { useToast } from "vue-toastification";

export default {
  name: 'MovieItem',
  emits:["deleteMovieItem"],
  props: {
    movie: {
      type: Object,
      required: true
    },
    isCategoryNavigation:{
      type: Boolean
    }
  }, data(){
    return{
      image:`${environment.URL}/${this.movie.urlImage}`,
      state:{},
      clrStatus:"",
      category:{},
      user:{},
      toast: useToast()
    }
  }, mounted(){
      this.user = JSON.parse(sessionStorage.getItem(Constants.USER));
      axios.get(`${environment.URL}/api/states/${this.movie.stateID}`,{}).then((res) => {
          this.state = res.data;
          this.clrStatus =this.state.color;
      });
      //Nous faisons une requêtes HTTP seulement au moment où nous sommes 
      //dans la page de catégorie de films
      if(this.isCategoryNavigation){
        axios.get(`${environment.URL}/api/categories/${this.movie.categoryID}`,{}).then((res) => {
            this.category = res.data;
        });
      }

  },
  methods:{
    deleteMovie(){
      if(this.movie.userID != this.user.id){
        this.toast.info("Vous n'êtes pas propriétaire du film. Vous ne pouvez pas le supprimer !");
      }else{
        if(confirm(`Voulez-vous vraiment supprimer le film ${this.movie.title} ?`)){
            this.$emit("deleteMovieItem",this.movie.id);
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

