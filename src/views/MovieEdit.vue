<template>
  <div>
     <form @submit.prevent="onSubmit">
            <h3>Edition du film <b>{{movie.title}}</b></h3>
            <div class="form-group">
                <label for="title">Titre</label>
                <input type="text" id="title" v-model="movie.title" class="form-control form-control-lg"/>
            </div>
              <div class="form-group">
              <label for="description">Description</label>
              <textarea class="form-control" required v-model="movie.description" id="description" rows="4"></textarea>
            </div>
             <div class="form-group">
                <label for="director">Réalisateur</label>
                <input type="text" id="director" v-model="movie.director" class="form-control form-control-lg"/>
            </div>
             <div class="form-group">
                <label for="releaseYear">Date de sortie</label>
                <input type="number" min="1900" max="2100"  step="1" id="releaseYear" v-model="movie.releaseYear" class="form-control form-control-lg"/>
            </div>
             <div class="form-group">
                <label for="duration">Durée du film</label>
                <input type="number" placeholder="Temps en minutes" id="duration" v-model="movie.duration" class="form-control form-control-lg"/>
            </div>

           

             <div class="form-group">
              <label for="state">Status</label>
                <select id="state"  @change="onChangeState($event)" v-model="selectedState" class="form-control form-control-lg">
                  <option v-for="option in optionsStates" v-bind:key="option.id" v-bind:value="option.name">
                    {{ option.name }}
                  </option>
                </select>
            </div>
            <div class="form-group">
              <label for="category">Catégorie</label>
                <select id="category" @change="onChangeCategory($event)" v-model="selectedCategory" class="form-control form-control-lg">
                  <option v-for="option in optionsCategories" v-bind:key="option.id" v-bind:value="option.name">
                    {{ option.name }}
                  </option>
                </select>
            </div>
            
             <div class="form-group">
                <label for="userID">Ajouté par</label>
                <input type="text" id="userID" v-model="user.name" class="form-control form-control-lg" disabled/>
            </div>
               <div class="buttons">
              <button class="btn btn-lighr btn-lg mr-2"><router-link class="nav-link" to="/movies">Annuler</router-link></button>
              <button type="submit" class="btn btn-primary btn-lg ">Editer</button>

            </div>
            
        </form>
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
import { useToast } from "vue-toastification";

export default {
  name: 'MovieEdit',
  components: {
    
  }, data(){
     return {
       movie:{},
       user:{},
       selectedCategoryObject: {},
       selectedCategory:1,
       optionsCategories: [],
       selectedStateObject: {},
       selectedState:1,
       optionsStates: [],
       toast: useToast()
     }  
  },
  mounted(){
     const id = this.$route.params.id;
     axios.get(`${environment.URL}/api/movies/${id}`,{}).then((res) => {
      this.movie = res.data;
      axios.get(`${environment.URL}/api/users/${this.movie.userID}`,{}).then((res) => {
        this.user = res.data;
      });
       axios.get(`${environment.URL}/api/states`,{}).then((res) => {
       this.optionsStates = res.data;
       this.optionsStates.forEach(val => {
         if(val.id === this.movie.stateID){
           this.selectedStateObject = val;
           this.selectedState=val.name;
         }
       })
      });

      axios.get(`${environment.URL}/api/categories`,{}).then((res) => {
       this.optionsCategories = res.data;
       this.optionsCategories.forEach(val => {
         if(val.id === this.movie.categoryID){
           this.selectedCategoryObject = val;
           this.selectedCategory = val.name;
         }
       })
      });
    }, (err) => {
      if(err.response.status == 404){
        this.toast.error("Le film n'existe pas !");
        this.$router.replace({ name: "MovieList" });
      }
    });
  },
  methods: {
    onSubmit(){
      this.movie.stateID = this.selectedStateObject.id;
      this.movie.categoryID = this.selectedCategoryObject.id;
      axios.put(`${environment.URL}/api/movies/${this.movie.id}`, this.movie)
          .then(res=>{
              this.toast.success("Le film a été édité avec succès !");
              this.$router.replace({ name: "MovieList" });
          }).catch(err=>{
             this.toast.warning("Veuillez compléter tous les champs...");

          })
    },
    onChangeCategory(event) {
      this.selectedCategoryObject = this.optionsCategories.find(x=>x.name == event.target.value);
    },
    onChangeState(event) {
      this.selectedStateObject = this.optionsStates.find(x=>x.name == event.target.value);
    }
  }
}
</script>
