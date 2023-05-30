import Swal from "sweetalert2";
import { assignUserProjectAPI, createProjectAPI, deleteProjectAPI, getListProjectsAPI, getProjectDetailAPI, removeUserFromProjectAPI, updateProjectAPI } from "../../../services/ManageProjectService";
import { GET_PROJECT_DETAIL, SET_LIST_PROJECTS } from "./ProjectManageTypes";

export const setListProjectsAction = (searchTerm) => {
    return async (dispatch) => {
        try {
            const { content } = await getListProjectsAPI(searchTerm);

            dispatch({
                type: SET_LIST_PROJECTS,
                payload: content
            })
        } catch (error) {
            throw error;
        }
    }
}

export const deleteProjectAction = (id) => {
    return async () => {
        try {
            const { content } = await deleteProjectAPI(id);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Delete project successfully !',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Delete project failed.',
                text: 'You are not allowed to delete this project',
                confirmButtonColor: "#1677ff"
            });
        }
    }
}

export const createProjectAction = (values, resetFormFunc) => {
    return async (dispatch) => {
        try {
            const { content } = await createProjectAPI(values);

            await Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Create project successfully !',
                showConfirmButton: false,
                timer: 1500
            });

            //reset create-project form
            resetFormFunc();
            //update new list of projects
            dispatch(setListProjectsAction());
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Create project failed.',
                text: 'Try changing another name and alias',
                confirmButtonColor: "#1677ff"
            });
        }
    }
}

export const getProjectDetailAction = (id) => {
    return async (dispatch) => {
        try {
            const { content } = await getProjectDetailAPI(id);

            dispatch({
                type: GET_PROJECT_DETAIL,
                payload: content
            });
        } catch (error) {
            throw error;
        }
    }
}

export const updateProjectAction = (id, values, resetFormFunc) => {
    return async (dispatch) => {
        try {
            const { content } = await updateProjectAPI(id, values);

            // update successfully
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Update project successfully !',
                showConfirmButton: false,
                timer: 1500
            });
            resetFormFunc();
            // reset list of projects
            dispatch(setListProjectsAction());
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update project failed.',
                text: 'Please try again !',
                confirmButtonColor: "#1677ff"
            });
        }
    }
}

export const assignUserProjectAction = (values) => {
    return async (dispatch) => {
        try {
            const { content } = await assignUserProjectAPI(values);

            // assign successfully
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Add member successfully !',
                showConfirmButton: false,
                timer: 1500
            });
            // reset list of projects
            dispatch(setListProjectsAction());
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Add member failed.',
                text: 'This user was already added to the project.',
                confirmButtonColor: "#1677ff"
            });
        }
    }
}

export const removeUserProjectAction = (values) => {
    return async (dispatch) => {
        try {
            const { content } = await removeUserFromProjectAPI(values);

            // remove successfully
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Remove member successfully !',
                showConfirmButton: false,
                timer: 1500
            });
            // reset list of projects
            dispatch(setListProjectsAction());
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Remove members failed.',
                text: 'You are not allowed to remove members in this project',
                confirmButtonColor: "#1677ff"
            });
        }
    }
}