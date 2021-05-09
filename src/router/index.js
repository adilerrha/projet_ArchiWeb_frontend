import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ('../views/Home.vue'),
        meta: {
            title: "Accueil"
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import ('../views/Register.vue'),
        meta: {
            title: "Inscription"
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue'),
        meta: {
            title: "Connexion"
        }
    },
    {
        path: '/movies',
        name: "MovieList",
        component: () =>
            import ('../views/MovieList.vue'),
        meta: {
            title: "Les films"
        }
    },
    {
        path: '/movies/edit/:id',
        name: "MovieEdit",
        component: () =>
            import ('../views/MovieEdit.vue'),
        meta: {
            title: "Edition de film"
        }
    },
    {
        path: '/movies/detail/:id',
        name: "MovieDetail",
        component: () =>
            import ('../views/MovieDetail.vue'),
        meta: {
            title: "Detail du film"
        }
    },
    {
        path: '/movies/addMovie',
        name: "MovieAdd",
        component: () =>
            import ('../views/MovieAdd.vue'),
        meta: {
            title: "Ajout de film"
        }
    },
    {
        path: '/categories',
        name: "CategoryList",
        component: () =>
            import ('../views/CategoryList.vue'),
        meta: {
            title: "Les catégories"
        }

    },
    {
        path: '/categories/addCategory',
        name: "CategoryAdd",
        component: () =>
            import ('../views/CategoryAdd.vue'),
        meta: {
            title: "Ajout de catégorie"
        }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    linkExactActiveClass: 'is-active',
    routes
})


export default router