<script setup>
import { ref, onMounted } from 'vue'

import AddMemberMeal from './components/AddMemberMeal.vue'
import SuggestMeal from './components/SuggestMeal.vue'

import Button from "primevue/button"
import Divider from 'primevue/divider';

const screenToggle = ref(true)

</script>

<template>
  <header>

    <img alt="Vue logo" class="logo" src="./assets/logo.svg" />

    <!-- width="125" height="125"  -->

    <div>
      <h1>Meal Planner</h1>
      <p class="lead">Plan your everyday meal!</p>
      <Divider />
    </div>

  </header>

  <main>

    <div class="btn-group">  
      <Button class="" @click="screenToggle=false">
        Add Meal
      </Button>
      <Button class="" @click="screenToggle=true">
        Suggest Meal
      </Button>
    </div>
    
    <SuggestMeal v-if="screenToggle" />
    <AddMemberMeal v-else="screenToggle" />
    <!-- <div style="margin-bottom: 60px;"></div> -->
   
    
    
  </main>
</template>

<style scoped>

h1 {
  color: palevioletred;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
}

.lead {
  text-align: center;
  color: grey;
  font-size: 20px;
}

.logo {
  display: block;
  margin: 0 auto 0;
  width: 75px;
  height: 75px;
}

.btn-group {
  display: flex;
  justify-content: space-between;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
    width: 125px;
    height: 125px;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

/* .right-fixed {
  position: fixed;
  bottom: 1rem;
  right: 1rem;  
}

.left-fixed {
  position: fixed;
  bottom: 1rem;
  left: 1rem; 
} */

/* .top-fixed {
  position: fixed;
  bottom: 4rem;
} */

</style>
