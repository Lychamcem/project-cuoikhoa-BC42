import Swal from "sweetalert2";
import { deleteUserAPI, editUserAPI, getUserAPI } from "../../../services/ManageUserService";
import { SET_USER_LIST } from "./UsersManageTypes";

export const getUserAction = (searchTerm) => {
    return async (dispatch) => {
        try {
            const { content } = await getUserAPI(searchTerm);

            dispatch({
                type: SET_USER_LIST,
                payload: content
            })
        } catch (error) {
            throw error;
        }
    }
}

export const deleteUserAction = (id, searchTerm) => {
    return async (dispatch) => {
        try {
            const { content } = await deleteUserAPI(id);

            // update user list
            dispatch(getUserAction(searchTerm));

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Delete user successfully !',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Can not delete user who already created a project.',
                confirmButtonColor: "#1677ff"
            });
        }
    }
}

export const adminEditUserAction = (values, searchTerm, resetFormFunc) => {
    return async (dispatch) => {
        try {
            const { content } = await editUserAPI(values);

            //reset edit-user form
            resetFormFunc();
            
            // update user list
            dispatch(getUserAction(searchTerm));

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Edit user successfully !',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Edit user failed.',
                confirmButtonColor: "#1677ff"
            });
        }
    }
}