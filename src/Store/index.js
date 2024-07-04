import { configureStore, combineReducers } from '@reduxjs/toolkit'
// import projectsReducer from '../Views/Projects/projectsSlice'
// import branchesReducer from '../Views/Branches/branchesSlice'
// import commitsReducer from '../Views/Commits/commitsSlice'

// Importez les réducteurs de l'application enfant
import projectsReducer from 'ID5899e0aca600741755433912/Views/Projects/projectsSlice';
import branchesReducer from 'ID5899e0aca600741755433912/Views/Branches/branchesSlice';
import commitsReducer from 'ID5899e0aca600741755433912/Views/Commits/commitsSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    branches: branchesReducer,
    commits: commitsReducer
  },
})

// export const store = combineReducers({
//   projects: projectsReducer,
//   branches: branchesReducer,
//   commits: commitsReducer,
// });