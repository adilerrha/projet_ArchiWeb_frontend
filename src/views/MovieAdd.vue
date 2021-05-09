<template>
  <div>
     <form @submit.prevent="onSubmit">
            <h3>Ajouter un film</h3>
            <div class="form-group">
                <label for="title">Titre</label>
                <input type="text" required id="title" v-model="movie.title" class="form-control form-control-lg"/>
            </div>
             <div class="form-group">
              <label for="description">Description</label>
              <textarea class="form-control" required v-model="movie.description" id="description" rows="4"></textarea>
            </div>
             <div class="form-group">
                <label for="director">Réalisateur</label>
                <input type="text" required id="director" v-model="movie.director" class="form-control form-control-lg"/>
            </div>
             <div class="form-group">
                <label for="releaseYear">Année de sortie</label>
                <input type="number" min="1900" max="2100"  step="1" required id="releaseYear" v-model="movie.releaseYear" class="form-control form-control-lg"/>
            </div>

             <div class="form-group">
                <label for="duration">Durée du film</label>
                <input type="number" required placeholder="Temps en minutes" id="duration" v-model="movie.duration" class="form-control form-control-lg"/>
            </div>
             <div class="form-group">
                <label for="file">Importer une image : </label><br/>
                <input type="file" required id="file" v-on:change="handleFileUpload"/>
            </div>

            
            
             <div class="form-group">
              <label for="state">Status</label>
                <select id="state"  @change="onChangeState($event)" class="form-control form-control-lg">
                  <option v-for="option in optionsStates" v-bind:key="option.id" v-bind:value="option.name">
                    {{ option.name }}
                  </option>
                </select>
            </div>
            
            <div class="form-group">
              <div v-if="optionsCategories.length>0">
                <label for="category">Catégorie</label>
                <select id="category" @change="onChangeCategory($event)" class="form-control form-control-lg">
                  <option v-for="option in optionsCategories" v-bind:key="option.id" v-bind:value="option.name">
                    {{ option.name }}
                  </option>
                </select>
              </div>
              <div v-if="optionsCategories.length==0">
                <label for="category">*Indiquer le nom d'une catégorie</label>
                <input type="text" required id="category" v-model="movie.category" class="form-control form-control-lg"/>
              </div>
              
            </div>
            <div class="buttons">
              <button class="btn btn-lighr btn-lg mr-2"><router-link class="nav-link" to="/movies">Annuler</router-link></button>
              <button type="submit" class="btn btn-primary btn-lg ">Ajouter</button>
            </div>
            
            <div v-if="optionsCategories.length==0">
              *Cette catégorie sera ajoutée automatiquement.
            </div>
        </form>
  </div>
</template>

<style  scoped>
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
  name: 'MovieAdd',
  components: {
    
  }, data(){
     return {
       movie:{
         title:'',
         director:'',
         releaseYear:'',
         duration:'',
         category:''
       },
       user:{},
       selectedCategory: {},
       optionsCategories: [],
       selectedState: {},
       optionsStates: [],
       file:null,
       toast: useToast()
     }  
  },
  mounted(){
    
    axios.get(`${environment.URL}/api/states`,{}).then((res) => {
      this.optionsStates = res.data;
      this.selectedState = this.optionsStates[0];
    });

    axios.get(`${environment.URL}/api/categories`,{}).then((res) => {
      this.optionsCategories = res.data;
      this.selectedCategory = this.optionsCategories[0];

    });
  },
  methods: {
    onSubmit(){
      if(this.file){
        const formData = new FormData()
        const currentUser = JSON.parse(sessionStorage.getItem(Constants.USER));
        formData.append('image', this.file);
        formData.append('title',this.movie.title);
        formData.append('description',this.movie.description);
        formData.append('director',this.movie.director);
        formData.append('releaseYear',this.movie.releaseYear);
        formData.append('duration',this.movie.duration);
        formData.append('stateID',this.selectedState.id);
        formData.append('userID',currentUser.id);
        if(this.optionsCategories.length>0){
          formData.append('categoryID',this.selectedCategory.id);
          this.addMovie(formData);
        }else{
          axios.post(`${environment.URL}/api/categories`, {name:this.movie.category}).then( res=>{
            formData.append('categoryID',res.data.id);
            this.addMovie(formData);
          }).catch(err=>{
              console.error(err);
          });
        }
        

      
      }else{
        this.toast.warning("Veuillez ajouter une image...");
      }
      
    },
    addMovie(formData){
        axios.post(`${environment.URL}/api/movies`, formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        }).then(res=>{
              if(res.status == 201){
                this.toast.success("Le film a été ajouté avec succès !");
                this.$router.replace({ name: "MovieList" });
              }
          }).catch(err=>{
              this.toast.warning("Veuillez compléter tous les champs...");
          })
    },
    onChangeCategory(event) {
      this.selectedCategory = this.optionsCategories.find(x=>x.name == event.target.value);
    },
    onChangeState(event) {
      this.selectedState = this.optionsStates.find(x=>x.name == event.target.value);
    },
    handleFileUpload(e){
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        this.file = files[0]
    }
  }
}
</script>
