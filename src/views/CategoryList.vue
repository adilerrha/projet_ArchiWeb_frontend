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
        <h1>La liste des films par catégories</h1>
        <h5 style="color:gray;">Il y a {{filtredMovies.length}} film{{(filtredMovies.length > 1 ? 's':'')}}</h5>

      </div>
      <div class="col-sm-3">
        <select class="form-control" @change="onChangeCategory($event)">
          <option v-for="option in optionsCategories" v-bind:key="option.id" v-bind:value="option.id"> {{ option.name }}</option>
        </select>
      </div>
      <div class="col-sm-2">
        <router-link class="btn btn-primary" to="/categories/addCategory">Ajouter une catégorie</router-link>
      </div>
    </div>
    <br />

    <div class="row">
        <div v-if="filtredMovies.length==0">
            Pour l'instant, il n'y a aucun film par catégorie à afficher...
        </div>
        <div class="col-auto mb-3" v-for="movie in filtredMovies"  :key="movie.id">
          <MovieItem :movie="movie" :isCategoryNavigation="true" @deleteMovieItem="deleteMovieItem($event)"/>
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
import axios from "axios";
import { environment } from "../config/environment";
import MovieItem from '../components/MovieItem.vue'

export default {
  name: 'CategoryList',
  components: {
    MovieItem
  }, data(){
   return {
     optionsCategories: [],
     filtredMovies:[],
     movies:[],
   }
  }, mounted(){
     
     this.loadMoviesCategories();
        
  }, methods:{
    deleteMovieItem(id){
      axios.delete(`${environment.URL}/api/movies/${id}`,{}).then((res) => {
        if(res.status===200){
          this.loadMoviesCategories();
        }
      });
    },
    loadMoviesCategories(){
      axios.get(`${environment.URL}/api/categories`,{}).then((res) => {
        this.optionsCategories = [ {id:0, name:"Afficher les catégories"}, ...res.data];
      });
      axios.get(`${environment.URL}/api/movies`,{}).then((res) => {
        this.filtredMovies=this.movies = res.data;  
      });
    },
    onChangeCategory(event){
      const categoryID = event.target.value
      if(categoryID==0){
          //Tout afficher
          this.filtredMovies = this.movies;
        }else{
          this.filtredMovies = this.movies.filter(x=>x.categoryID == categoryID);
        }
    },
    //Permet de recherche un film selon son titre ou son réalisateur
    onSearch(event){
      let searchValue = event.target.value;
      this.filtredMovies = this.movies.filter(x=> {
        return this.isFound(x.title,searchValue) || this.isFound(x.director,searchValue)
      });
    },
    isFound(item, val) {
      return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
    } 
  }
}
</script>
