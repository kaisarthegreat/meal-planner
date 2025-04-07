// db.js - Dexie IndexedDB setup
import Dexie from 'dexie';

export const db = new Dexie('MealPreferences');
db.version(1).stores({
  preferences: '++id, name, likes, dislikes',
  mealHistory: '++id, meals'
});

// export default db;
