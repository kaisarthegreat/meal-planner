import { defineStore } from "pinia"
import { ref } from 'vue'
import { db } from '../db'

export const useMemberStore = defineStore('memberStore', () => {
    const members = ref([])
    const history = ref([])
    
    const loadData = async () => {
      members.value = await db.preferences.toArray()
      history.value = await db.mealHistory.toArray()  
   
    }    

    const addHistory = async (meal) => {
      if (meal && !history.value.some((m) => m === meal)) {
        
        await db.mealHistory.put(JSON.parse(JSON.stringify({meal})))
        // history.value.push(meal)

        await loadData()
      }
    }

    const clearHistory = async () => {
      history.value = []
      await db.mealHistory.clear()
      await loadData()
    }

    
    const addMember = async (name) => {
      if (name && !members.value.some((m) => m.name === name)) {
        await db.preferences.put(JSON.parse(JSON.stringify({ name, likes: [], dislikes: [] })))
        // members.value.push({ name, likes: [], dislikes: [] });
        await loadData()
      }
    };

    const removeMember = async (id) => {
      await db.preferences.delete(id)
      await loadData()
      // members.value = members.value.filter(m => m.id !== id)
    }; 
   
    const updateMember = (oldName, newName) => {
      const member = members.value.find((m) => m.name === oldName);
      if (member && newName) {
        member.name = newName;
      }
    };
    
    const updatePreferences = async (id, name, newLikes, newDislikes) => {
      await loadData()
      
      db.preferences.update(id, { likes: Object.values(newLikes), dislikes: Object.values(newDislikes) })
      const memberIndex = members.value.findIndex(m => m.id === id);
      if (memberIndex !== -1) {
        members.value[memberIndex].likes = Object.values(newLikes);
        members.value[memberIndex].dislikes = Object.values(newDislikes);
      }
      
    };

    const showPreferences = async (id) => {
      await loadData()
      const member = members.value.find((m) => m.id === id)
      if (member) {
          return { id: member.id, name: member.name, likes: member.likes, dislikes: member.dislikes } 
      }
    }    

    return {
      loadData,
      members,
      addMember,
      removeMember,
      updateMember,
      updatePreferences,
      showPreferences,
      addHistory,
      clearHistory,
      history,
    };
})
