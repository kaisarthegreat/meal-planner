<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="greetings">
    <h1 class="pink">{{ msg }}</h1>
    <h3>
      Plan your everyday meal!
      
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  
}

h3 {
  font-size: 1.2rem;
 
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.pink {
  text-decoration: none;
  color: rgb(224, 23, 207);
  transition: 0.4s;
  padding: 3px;
}



</style>
