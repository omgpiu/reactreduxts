import {combineReducers, createStore} from 'redux';
import userEventsReducer from './user-events';

const rootReducer = combineReducers({
    userEventsReducer
})
export type RootState = ReturnType<typeof rootReducer>
const store = createStore(rootReducer)
export default store