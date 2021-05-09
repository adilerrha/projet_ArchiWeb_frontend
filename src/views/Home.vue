<template>
  <div class="container">
    <div class="jumbotron">
      <h1 class="display-4">{{appName}}</h1>
      <p class="lead">Cette application <b>{{appName}}</b> permet à un utilisateur d’ajouter, de modifier, de supprimer des films ainsi que des
        catégories de films afin d’avoir une vue sur ses visionnages.</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Constants from '../constants/index';

export default {
  name: 'Home',
  components: {
    
  },  data() {
    return {
      appName:Constants.APP_NAME
    };
  }
}
</script>
