import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import allReducer from './redux/reducers'



const middleware = [thunk];

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        if (typeof window !== 'undefined') {
            localStorage.setItem('state', serializedState);
        }
    } catch (e) {
        console.log(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = typeof window !== 'undefined' ? localStorage.getItem('state') : null;
        if (serializedState === null) return undefined
        return JSON.parse(serializedState);
    } catch (e) {
        console.log(e);
        return undefined
    }
}

const initialState = loadFromLocalStorage();

const store = createStore(
    allReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

store.subscribe(() => saveToLocalStorage(store.getState()))


export default store;