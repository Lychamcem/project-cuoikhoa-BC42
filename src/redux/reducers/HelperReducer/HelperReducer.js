import { SET_ALL_CATEGORY, SET_ALL_PRIORITY, SET_ALL_STATUS, SET_ALL_TASK_TYPE } from './HelperTypes';

const initialState = {
    allPriority: null,
    allCategory: null,
    allStatus: null,
    allTaskType: null
}

export const HelperReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_PRIORITY: {
            return { ...state, allPriority: action.payload };
        }
        case SET_ALL_CATEGORY: {
            return { ...state, allCategory: action.payload };
        }
        case SET_ALL_STATUS: {
            return { ...state, allStatus: action.payload };
        }
        case SET_ALL_TASK_TYPE: {
            return { ...state, allTaskType: action.payload };
        }
        default:
            return state;
    }
}