import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignInAPI, SignUpAPI, editUserAPI } from "../../../services/ManageUserService";
import { TOKEN, USER_LOGIN } from "../../../util/settings/Config";

//async actions
export const SignUpAction = createAsyncThunk('SIGN_UP', async (values) => {
    try {
        await SignUpAPI(values);
    } catch (error) {
        throw error;
    }
});

export const SignInAction = createAsyncThunk('SIGN_IN', async (values) => {
    try {
        let { content } = await SignInAPI(values);

        content = {
            ...content,
            password: values.password
        }

        return content;
    } catch (error) {
        throw error;
    }
});

export const editUserAction = createAsyncThunk('EDIT_USER', async (values) => {
    try {
        let { content } = await editUserAPI(values);

        return values;
    } catch (error) {
        throw error;
    }
});

const initialState = {
    isLoading: null,
    signUpSuccess: null,
    error: null,
    user: JSON.parse(localStorage.getItem(USER_LOGIN)) || null,
    editUserSuccess: null
}
const UserSlice = createSlice({
    name: "USER",
    initialState,
    reducers: {
        resetSignUpSuccess: (state) => {
            return { ...state, success: null };
        },
        resetEditUserSuccess: (state) => {
            return { ...state, editUserSuccess: null };
        },
        resetError: (state) => {
            return { ...state, error: null };
        },
        logOut: (state) => {
            localStorage.removeItem(USER_LOGIN);
            localStorage.removeItem(TOKEN);

            return { ...state, user: null };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(SignUpAction.pending, state => {
            return { ...state, isLoading: true, signUpSuccess: false, error: null };
        });
        builder.addCase(SignUpAction.fulfilled, state => {
            return { ...state, isLoading: false, signUpSuccess: true, error: null };
        });
        builder.addCase(SignUpAction.rejected, (state, action) => {
            return { ...state, isLoading: false, signUpSuccess: false, error: action.error.message };
        });
        builder.addCase(SignInAction.pending, state => {
            return { ...state, isLoading: true, error: null };
        });
        builder.addCase(SignInAction.fulfilled, (state, action) => {
            localStorage.setItem(USER_LOGIN, JSON.stringify(action.payload));
            localStorage.setItem(TOKEN, JSON.stringify(action.payload.accessToken));

            return { ...state, isLoading: false, user: action.payload, error: null };
        });
        builder.addCase(SignInAction.rejected, (state, action) => {
            return { ...state, isLoading: false, error: action.error.message };
        });
        builder.addCase(editUserAction.pending, state => {
            return { ...state, isLoading: true, error: null, editUserSuccess: false };
        });
        builder.addCase(editUserAction.fulfilled, (state, action) => {
            const dataUpdate = {
                ...state.user,
                name: action.payload.name,
                email: action.payload.email,
                password: action.payload.password,
                phoneNumber: action.payload.phoneNumber
            }
            localStorage.setItem(USER_LOGIN, JSON.stringify(dataUpdate));

            return { ...state, isLoading: false, user: dataUpdate, error: null, editUserSuccess: true };
        });
        builder.addCase(editUserAction.rejected, (state, action) => {
            return { ...state, isLoading: false, error: action.error.message, editUserSuccess: false };
        });
    }
});

export const { 
    resetSignUpSuccess, 
    resetEditUserSuccess,
    resetError,
    logOut
} = UserSlice.actions;
export default UserSlice.reducer;