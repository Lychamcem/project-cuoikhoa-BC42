import { GET_USER_SELECTED, SET_USER_LIST } from "./UsersManageTypes";

const initialState = {
    userList: null,
    userSelected: null
}

export const UsersManageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_LIST: {
            return { ...state, userList: action.payload };
        }
        default:
            return state;
    }
}