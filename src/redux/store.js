import { configureStore } from "@reduxjs/toolkit";
import { ProjectManageReducer } from "./reducers/ProjectManageReducer/ProjectManageReducer";
import { HelperReducer } from "./reducers/HelperReducer/HelperReducer";
import { UsersManageReducer } from "./reducers/UsersManageReducer/UsersManageReducer";
import TaskManageSlice from "./slices/TaskManageSlice/TaskManageSlice";
import UserSlice from "./slices/UserSlice/UserSlice";

const store = configureStore({
    reducer: {
        ProjectManageReducer,
        HelperReducer,
        UsersManageReducer,
        TaskManageSlice,
        UserSlice
    }
});

export default store;