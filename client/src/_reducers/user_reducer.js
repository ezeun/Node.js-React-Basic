// reducer의 역할은 (previousState, action) => nextState 을 리턴

import{
    LOGIN_USER
} from '../_actions/types';

export default function (state = {}, action){
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload}
            break;
    
        default:
            return state;
    }
}