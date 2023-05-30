import { GET_PROJECT_DETAIL, HIDE_SIDER, SET_LIST_PROJECTS, SHOW_SIDER } from './ProjectManageTypes';

const initialState = {
    openSider: false,
    listProjects: [],
    projectDetail: null
}

export const ProjectManageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_SIDER: {
            return { ...state, openSider: true };
        }
        case HIDE_SIDER: {
            return { ...state, openSider: false };
        }
        case SET_LIST_PROJECTS: {
            return { ...state, listProjects: action.payload };
        }
        case GET_PROJECT_DETAIL: {
            return { ...state, projectDetail: action.payload };
        }
        default:
            return state;
    }
}