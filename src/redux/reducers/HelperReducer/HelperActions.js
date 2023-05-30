import { getCategoryAPI, getPriorityAPI, getStatusAPI, getTaskTypeAPI } from "../../../services/ManageHelperService"
import { SET_ALL_CATEGORY, SET_ALL_PRIORITY, SET_ALL_STATUS, SET_ALL_TASK_TYPE } from "./HelperTypes";

export const getAllPriorityAction = () => {
    return async (dispatch) => {
        try {
            const { content } = await getPriorityAPI();

            dispatch({
                type: SET_ALL_PRIORITY,
                payload: content
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const getAllCategoryAction = () => {
    return async (dispatch) => {
        try {
            const { content } = await getCategoryAPI();

            dispatch({
                type: SET_ALL_CATEGORY,
                payload: content
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const getAllStatusAction = () => {
    return async (dispatch) => {
        try {
            const { content } = await getStatusAPI();

            dispatch({
                type: SET_ALL_STATUS,
                payload: content
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export const getAllTaskTypeAction = () => {
    return async (dispatch) => {
        try {
            const { content } = await getTaskTypeAPI();

            dispatch({
                type: SET_ALL_TASK_TYPE,
                payload: content
            })
        } catch (error) {
            console.log(error);
        }
    }
}