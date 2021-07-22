import { LOAD_SALES_RECORD  } from '../action';


const initialState = {
    
}

function salesRecordReducer (state = initialState, action){

    switch(action.type){
        case LOAD_SALES_RECORD:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }    

}


export default salesRecordReducer;