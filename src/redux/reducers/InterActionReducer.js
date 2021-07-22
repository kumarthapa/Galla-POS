import { LOADING,CUSTOM_LOADING, ALERT,RESET_INTERACTION  } from '../action';


const initialState = {
    loading:false,
    customLoading:false,
    customLoadingMsg:"",
    alert:false,
    alertMessage:""
}

function InterActionReducer (state = initialState, action){

    switch(action.type){
        case LOADING:
            return {
                ...state,
                loading:action.payload
            }
        case CUSTOM_LOADING:
            return {
                ...state,
                customLoading:action.status,
                customLoadingMsg:action.message
            }
        case ALERT:
            return {
                ...state,
                alert:action.alert,
                alertMessage:action.message
            }
        case RESET_INTERACTION:
            return {
                ...initialState
            }
        default:
            return state
    }    

}


export default InterActionReducer;