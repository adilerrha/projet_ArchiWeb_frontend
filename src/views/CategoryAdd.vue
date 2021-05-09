<template>
  <div>
     <form @submit.prevent="onSubmit">
            <h3>Ajouter une catégorie</h3>
            <div class="alert alert-success" role="alert" v-if="success">
                    La catégorie a été ajoutée avec succès !
            </div>
            <div class="form-group">
                <label for="name">Nom</label>
                <input type="text" required id="name" v-model="category.name" class="form-control form-control-lg"/>
            </div>
             <div class="buttons">
              <button class="btn btn-light btn-lg mr-2"><router-link class="nav-link" to="/categories">Annuler</router-link></button>
              <button type="submit" class="btn btn-primary btn-lg ">Ajouter</button>
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
  name: 'CategoryAdd',
  components: {
    
  }, data(){
     return {
       category:{
         name:''
       },
       toast: useToast()
     }  
  },
  methods: {
    onSubmit(){
      axios.post(`${environment.URL}/api/categories`, this.category).then(res=>{
          if(res.status == 201){
             this.toast.success("La catégorie a été ajoutée avec succès !");
             this.$router.replace({ name: "CategoryList" });
          }
      }).catch(err=>{
          console.error(err);
      })
    },
  }
}
</script>
