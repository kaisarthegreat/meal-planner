<script setup>

import { useMemberStore } from '@/stores/mealstore';
import { ref, computed, onMounted, watch } from 'vue'

import Button from "primevue/button"
import Carousel from 'primevue/carousel'

const memberStore = useMemberStore()

// The following goes on indefinite loop
// watch(() => memberStore.members, (newVal) => {
//   if (newVal.length > 0) {
//     console.log("Data is ready: ", newVal)
//     console.log("watch membersote members: ", memberStore.members)
//     members.value = memberStore.members
//     history.value = memberStore.history
//     suggestMeals()
//   }
// })

onMounted(async () => {
  await memberStore.loadData()
  if (!memberStore.isLoading) {
    members.value = memberStore.members
    history.value = memberStore.history
    suggestMeals()
  }  
})


const members = ref([])
members.value = memberStore.members

const activeCarouselIndex = ref(0)
const updateActiveCarouselIndex = (newIndex) => {
  activeCarouselIndex.value = newIndex
}

const selectedCarouselMeal = computed(() => suggestedMeals.value[activeCarouselIndex.value] || null)

const suggestedMeals = ref([]);

const allMeals = computed(() => {
  return [...new Set(members.value.flatMap(member => member.likes))];
});

const suggestMeals = async () => {
  const likesMap = new Map();
  const dislikesMap = new Map();

  await memberStore.loadData()

  allMeals.value.forEach(meal => {
    likesMap.set(meal, members.value.filter(member => member.likes.includes(meal)).length);
    dislikesMap.set(meal, members.value.filter(member => member.dislikes.includes(meal)).length);
  });

  const universallyLiked = [];
  const neutralLikes = [];
  const conflictingMeals = [];

  allMeals.value.forEach(meal => {
    const likedCount = likesMap.get(meal);
    const dislikedCount = dislikesMap.get(meal);

    if (likedCount === members.value.length) {
      universallyLiked.push(meal);    
    } else if (dislikedCount === 0) {
      neutralLikes.push(meal);
    } else if (likedCount > 0) {
      conflictingMeals.push(meal);
    }
  });

  
  const altMeals = findAlternativeMeals(conflictingMeals, universallyLiked, neutralLikes);
  suggestedMeals.value = [...universallyLiked, ...neutralLikes, ...altMeals.map(m => m.join(", "))]
  
  suggestedMeals.value = suggestedMeals.value
  .filter(m => !memberStore.history.map(his => his.meal).includes(m))

};


const findAlternativeMeals = (conflictingMeals, universallyLiked, neutralLikes) => {
  let alternativeSuggestions = [];

  conflictingMeals.forEach(meal => {
    let mealAlternatives = new Map();
    
    // Find members who dislike the meal and their alternative choices
    members.value.forEach(member => {
      if (member.dislikes.includes(meal)) {
        // const alternatives = member.likes.filter(m => 
        //   !members.value.some(mem => mem.dislikes.includes(m))
        // );
        const alternatives = member.likes

        if (alternatives.length > 0) {
          mealAlternatives.set(member.name, alternatives);
        }
      }
    });

    // Generate all possible meal combinations
    let possibleCombinations = generateMealCombinations(meal, mealAlternatives);

    // Filter out meal combos containing a universally liked meal
    let filteredCombinations = possibleCombinations.filter(combo => 
      !combo.some(meal => universallyLiked.includes(meal) || neutralLikes.includes(meal))
    );

    alternativeSuggestions.push(...filteredCombinations);
  });

  return alternativeSuggestions;
};

// Function to generate all possible valid meal combinations
const generateMealCombinations = (conflictingMeal, mealAlternatives) => {
  let result = [];
  let keys = Array.from(mealAlternatives.keys());

  const backtrack = (index, currentCombo) => {
    if (index === keys.length) {
      result.push([conflictingMeal, ...new Set(currentCombo)]);
      return;
    }

    let member = keys[index];
    for (let alternative of mealAlternatives.get(member)) {
      backtrack(index + 1, [...currentCombo, alternative]);
    }
  };

  backtrack(0, []);
  return result;
};

const updateSuggestedMeals = (meal) => {
  memberStore.addHistory(meal)
  suggestMeals()
}

const clearHistory = () => {
  memberStore.clearHistory()
  suggestMeals()
}

</script>




<template>
    <div>
      <h2>Meal Suggestions</h2>
      <p>Select the available menu to cook today. 
        <!-- Click 'Cook' to cook the food today and add it to the history. 
        The food will not be available until the history is reset.
        Click 'Reset' to remove food items from history and set it to null. -->
      </p>

      <div v-if="suggestedMeals.length" class="carousel-suggestions">
        <Carousel :value="suggestedMeals" :numVisible="1" :numScroll="1" 
        :show-indicators="false" @update:page="updateActiveCarouselIndex">
          <template #item="slotProps">
            <div style="font-size:30px;">
              {{ slotProps.data }}
            </div>
          </template>
        </Carousel>
      </div>
      <div v-else style="font-size: 36px; background-color: pink; padding: 5px; 
      border-radius: 10px; text-align: center; margin-top: 10px;">
        No data
      </div>

      <div class="btn-group">      
        <Button label="Cook" @click="updateSuggestedMeals(selectedCarouselMeal)" />
        <Button label="Reset" @click="clearHistory" />
      </div>

    
  </div>  
    
</template>

<style scoped>
/* div {
  font-size: 24px;
} */

h2 {
  font-size: 24px;
  color: white;
  text-align: center;
  font-weight: normal;
  padding: 20px 0;
  background-color: black;
  border-radius: 20px;
  margin: 20px 0;
}

p {
  font-size: 18px;
}

Button {
  margin: 5px;
}

.carousel-suggestions {
  /* display: flex; */

  color: green;
  text-align: center;
  /* font-size: 20px; */
  background-color: pink;
  
  border-radius: 20px;
  padding: 40px 0;
  margin-top: 20px;
  margin-bottom: 20px;
}

.btn-group {  
  display: flex;
  justify-content: space-between;
  margin: 10px auto; 
}

</style>