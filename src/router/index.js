import Vue from 'vue'
import Router from 'vue-router'
import loginPage from '../views/loginPage.vue'
import registerPage from '../views/registerPage.vue'
import accountRecoveryPage from "../views/accountRecoveryPage.vue";
import homePage from '../views/homePage.vue'
import userProfilePage from "../views/userProfilePage.vue";
import manageUsersPage from "../views/manageUsersPage.vue";
import fileUploadPage from "../views/fileUploadPage.vue";
import mapPage from "../views/mapPage.vue";
import comparePage from "../views/comparePage.vue";
import { TokenService } from '../services/tokenService/tokenService.js'



Vue.use(Router)

const router =  new Router({
  mode: 'history',
  hash: false,
  base:process.env.NODE_ENV === 'production'? '/asset_app': '/',
  routes: [
    {
      path: '/', redirect:'/home'
    },
    {
      path: '/home',
      name: 'home',
      component: homePage
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: userProfilePage
    },
    {
      path: '/manage-users',
      name: 'manage-users',
      component: manageUsersPage
    },
    {
      path: '/file-upload/:projectId',
      name: 'file-upload',
      component: fileUploadPage
    },
    {
      path: '/projects/map/:projectId',
      name: 'map',
      component: mapPage
    },
    {
      path: '/projects/compare/:projectId',
      name: 'compare',
      component: comparePage
    },
    {
      path: '/login',
      name: 'login',
      component: loginPage,
      meta: {
        public: true,  // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: registerPage,
      meta: {
        public: true,  // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    {
      path: '/account-recovery',
      name: 'account-recovery',
      component: accountRecoveryPage,
      meta: {
        public: true,  // Allow access to even if not logged in
        onlyWhenLoggedOut: true
      }
    },
    { path: '*', component: homePage } //TODO replace homepage with a notFoundPage
  ]
})

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public)
  const onlyWhenLoggedOut = to.matched.some(record => record.meta.onlyWhenLoggedOut)
  const loggedIn = !!TokenService.getToken();

  if (!isPublic && !loggedIn) {
    return next({
      path:'/login',
      query: {redirect: to.fullPath}  // Store the full path to redirect the user to after login
    });
  }

  // Do not allow user to visit login page or register page if they are logged in
  if (loggedIn && onlyWhenLoggedOut) {
    return next('/')
  }
  next();
})


export default router;
