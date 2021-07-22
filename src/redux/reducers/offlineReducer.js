import { SAVE_OFFLINE_ORDER,REMOVE_OFFLINE_ORDER } from '../action';

const initialState = {
    orders:[]
}

function Offline (state=initialState , action){


    switch(action.type){
        case SAVE_OFFLINE_ORDER:
            var order = action.payload;
            return {
                ...state,
                orders:[
                    ...state.orders,
                    order
                ]
            }
        case REMOVE_OFFLINE_ORDER:
            let newArray = state.orders.slice()
            newArray.splice(action.index, 1)
            return {
                ...state,
                orders:[
                    ...newArray
                ]
            }
        
    default:
        return state
    }
    
    
}


export default Offline;