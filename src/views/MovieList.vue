<template>
  <div class="container">
    <div class="row">
        <div class="col-md-4 mx-auto">
            <div class="input-group">
                <input autofocus class="form-control border-end-0 border rounded-pill" @input="onSearch($event)" type="text" placeholder="Recherche de films..." >
                <span class="input-group-append">
                    <div class="btn border-start-0 border-top-0  rounded-pill ms-n5" >
                        <i class="fa fa-search"></i>
                    </div>
                </span>
            </div>
        </div>
    </div>
    <br/>
     <div class="row">
      <div class="col-sm">
        <h1>La liste des films</h1>
        <h5 style="color:gray;">Il y a {{filtredMovies.length}} film{{(filtredMovies.length > 1 ? 's':'')}}</h5>
      </div>
      
      <div class="col-sm-3">
        <select class="form-control" @change="onChangeState($event)">
          <option v-for="option in options" :key="option.id" :value="option.id"> {{ option.name }}</option>
        </select>
      </div>
      <div class="col-sm-2">
        <router-link class="btn btn-primary" to="/movies/addMovie">Ajouter un film</router-link>
      </div>
    </div>


    <div class="container mt-4">
      <div class="row">
          <div v-if="filtredMovies.length==0">
              Pour l'instant, il n'y a aucun film à afficher...
          </div>
          <div class="col-auto" v-for="movie in filtredMovies"  :key="movie.id">
            <MovieItem :movie="movie"  @deleteMovieItem="deleteMovieItem($event)"/>
            
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .ms-n5 {
    margin-left: -40px;
}
</style>

<script>
// @ is an alias to /src
import MovieItem from '../components/MovieItem.vue'
import axios from "axios";
import { environment } from "../config/environment";
import { useToast } from "vue-toastification";

export default {
  name: 'MovieList',
  components: {
   MovieItem 
  }, data(){
     return {
       movies:[],
       filtredMovies:[],
       options: [],
       toast: useToast()
     }  
  },mounted(){
    this.loadMovies();
  }, methods:{
    deleteMovieItem(id){
      
      axios.delete(`${environment.URL}/api/movies/${id}`,{}).then((res) => {
        if(res.status===200){
          this.toast.success("Le film a été supprimé avec succès !");
          this.loadMovies();
        }
      });
    },
    loadMovies(){
        axios.get(`${environment.URL}/api/movies`,{}).then((res) => {
          this.filtredMovies = this.movies = res.data;  
        });
        axios.get(`${environment.URL}/api/states`,{}).then((res) => {
          this.options = [{id:0, name:"Afficher les statuts"},...res.data]; 
        });
    },
    onChangeState(event){
      const stateID = event.target.value;
      if(stateID==0){
        //Tout afficher
        this.filtredMovies = this.movies;
      }else{
        this.filtredMovies = this.movies.filter(x=>x.stateID == stateID);
      }
    },
    //Permet de rechercher un film selon son titre ou son réalisateur
    onSearch(event){
      let searchValue = event.target.value;
      this.filtredMovies = this.movies.filter(x=> {
        return this.isFound(x.title,searchValue) || this.isFound(x.director,searchValue) /*|| this.isFound(x.title,searchValue)*/
      });
    },
    isFound(item, val) {
      return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
    } 

  }
}
</script>
