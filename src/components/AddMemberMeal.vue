<script setup>

import { useMemberStore } from '@/stores/mealstore'
import { ref, computed, onMounted } from 'vue'

import Button from "primevue/button"
import InputText from 'primevue/inputtext';

const memberStore = useMemberStore()
const id = ref('')
const name = ref('')
const likes = ref([])
const dislikes = ref([])
const like = ref('')
const dislike = ref('')
const showPref = ref(false)
const showMember = ref(true)


const addLike = ()=> {
    if (like.value) {
        likes.value.push(like.value)
        like.value = ''
    }    
}

const deleteLike = (deletedLike)=> {
    likes.value = likes.value.filter((lke) => lke !== deletedLike )
}

const addDislike = ()=> {
    if (dislike.value) {
        dislikes.value.push(dislike.value)
        dislike.value = ''
    }
}

const deleteDislike = (deletedDislike)=> {
    dislikes.value = dislikes.value.filter((dslke) => dslke !== deletedDislike)
}

const addMember = () => {
    memberStore.addMember(name.value)
    name.value = ''
}

const deleteMember = (id)=> {
    memberStore.removeMember(id)
}

const cancelPreferences = ()=> {
    name.value = ''
    likes.value = []
    dislikes.value = []
    showPref.value = false
    showMember.value = true

}

const updateMember = async (member)=> {
    showPref.value = true
    showMember.value = false
    const preferences = await memberStore.showPreferences(member.id)
    id.value = preferences.id   
    name.value = preferences.name
    likes.value = Object.values(preferences.likes)
    dislikes.value = Object.values(preferences.dislikes)
}

const savePreferences = ()=> {
    memberStore.updatePreferences(id.value, name.value, likes.value, dislikes.value)
    name.value = ''
    likes.value = []
    dislikes.value = []
    showPref.value = false
    showMember.value = true

}

</script>

<template>
    <h2>Members & Preferences</h2>    
   
    <div v-if="showMember">
        <h3>Add/Update Member</h3>
        <div v-for="member in memberStore.members" :key="member" class="meal">
            <h4>{{ member.name }}</h4>
            <div>
                <Button icon="pi pi-refresh" @click="updateMember(member)" />
                <Button icon="pi pi-times" @click="deleteMember(member.id)" />
                
            </div>
        </div>


        <InputText type="text" v-model="name" />
        <Button icon="pi pi-plus" @click="addMember" />
    </div>

    <div v-if="showPref">
        <h3>Add/Delete Preferences for {{ name }}</h3>
        <div class="likedislike">Likes</div>
        <div v-for="like in likes" :key="like" class="meal">
            <h4>
                {{ like }}
            </h4>
            <div>
                <Button icon="pi pi-times" @click="deleteLike(like)" />
            </div>            
        </div>        

        <InputText type="text" v-model="like" />
        <Button icon="pi pi-plus" @click="addLike" />
        
        <div class="likedislike">Dislikes</div>
        <div v-for="dislike in dislikes" :key="dislike" class="meal">
            <h4>
                {{ dislike }}
            </h4>
            <div>
                <Button icon="pi pi-times" @click="deleteDislike(dislike)" />
            </div>            
        </div>
        
        <InputText type="text" v-model="dislike" />
        <Button icon="pi pi-plus" @click="addDislike" />
        
        <div class="btn-group">
            <Button icon="pi pi-save" label="save" @click="savePreferences" />
            <Button icon="pi pi-times" label="cancel" @click="cancelPreferences" />
        </div>

    </div>

</template>

<style scoped>

h2 {
  font-size: 24px;
  /* color: papayawhip; */
  color: white;
  text-align: center;
  font-weight: normal;
  padding: 20px 0;
  background-color: black;
  border-radius: 20px;
  margin: 20px 0;
}

h3 {
    /* color: palevioletred; */
    font-size: 20px;
    /* text-decoration: underline; */
    margin-bottom: 20px;
}

h4 {
    font-size: 18px;
    font-weight: 500;
    
}

.likedislike {
    font-size: 18px;
    color: white;
    background-color: black;
    border-radius: 10px;
    width: 100px;
    text-align: center;
    padding: 5px;
    margin: 10px 0;
}

.meal {
    display: flex;
    justify-content: space-between;
}
Button {
    /* padding: 2px; */
    margin: 5px;
}

.btn-group {  
  display: flex;
  justify-content: space-between;
  margin: 10px auto; 
}

/* InputText {
    margin: 5px;
} */
</style>