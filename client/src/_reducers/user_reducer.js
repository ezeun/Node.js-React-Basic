// reducer의 역할은 (previousState, action) => nextState 을 리턴

import{
    LOGIN_USER,
    REGISTER_USER
} from '../_actions/types';

export default function (state = {}, action){
    switch (action.type) {
        case LOGIN_USER:
            return {...state, loginSuccess: action.payload} // ...state : 원본 state(아무것도 없는 것 {})을 가져옴
            break;
        case REGISTER_USER:
            return {...state, register: action.payload}
            break;
        default:
            return state;
    }
}