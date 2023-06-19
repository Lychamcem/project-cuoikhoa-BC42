import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTaskAPI,
  deleteCommentAPI,
  deleteTaskAPI,
  getAllCommentAPI,
  getTaskDetailAPI,
  insertCommentAPI,
  updateCommentAPI,
  updateStatusTaskAPI,
  updateTaskAPI,
} from "../../../services/ManageTaskService";
import Swal from "sweetalert2";

//async actions
export const createTaskAction = createAsyncThunk(
  "CREATE_TASK",
  async (values) => {
    try {
      const data = await createTaskAPI(values);

      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Create task failed.",
        text: "Please try again !",
        confirmButtonColor: "#1677ff",
      });
    }
  }
);

export const updateTaskAction = createAsyncThunk(
  "UPDATE_TASK",
  async (values) => {
    try {
      const { content } = await updateTaskAPI(values);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update task failed.",
        text: "Please try again !",
        confirmButtonColor: "#1677ff",
      });
    }
  }
);

export const deleteTaskAction = createAsyncThunk("DELETE_TASK", async (id) => {
  try {
    const { content } = await deleteTaskAPI(id);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Delete task successfully !",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Delete task failed.",
      text: "Please try again !",
      confirmButtonColor: "#1677ff",
    });
  }
});

export const updateStatusTaskAction = createAsyncThunk(
  "UPDATE_STATUS_TASK",
  async (values) => {
    try {
      const { content } = await updateStatusTaskAPI(values);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update task status failed.",
        text: "Please try again !",
        confirmButtonColor: "#1677ff",
      });
    }
  }
);

export const getTaskDetailAction = createAsyncThunk(
  "GET_TASK_DETAIL",
  async (id) => {
    try {
      const { content } = await getTaskDetailAPI(id);

      return content;
    } catch (error) {
      throw error;
    }
  }
);

export const getAllCommentAction = createAsyncThunk(
  "GET_ALL_COMMENT",
  async (id) => {
    try {
      const { content } = await getAllCommentAPI(id);

      return content;
    } catch (error) {
      throw error;
    }
  }
);

export const insertCommentAction = createAsyncThunk(
  "INSERT_COMMENT",
  async (values) => {
    try {
      const { content } = await insertCommentAPI(values);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Comment failed.",
        text: "Please try again !",
        confirmButtonColor: "#1677ff",
      });
    }
  }
);

export const updateCommentAction = createAsyncThunk(
  "UPDATE_COMMENT",
  async ({ id, commentContent }) => {
    try {
      const { content } = await updateCommentAPI(id, commentContent);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update comment failed.",
        text: "Please try again !",
        confirmButtonColor: "#1677ff",
      });
    }
  }
);

export const deleteCommentAction = createAsyncThunk(
  "DELETE_COMMENT",
  async (id) => {
    try {
      const { content } = await deleteCommentAPI(id);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete comment failed.",
        text: "Please try again !",
        confirmButtonColor: "#1677ff",
      });
    }
  }
);

const initialState = {
  openCreateTaskModal: false,
  openEditTaskModal: false,
  createTaskSuccess: null,
  editTaskSuccess: null,
  taskDetail: null,
  listComment: null,
};
const TaskManageSlice = createSlice({
  name: "TASK",
  initialState,
  reducers: {
    ShowCreateTaskModal: (state) => {
      return { ...state, openCreateTaskModal: true };
    },
    HideCreateTaskModal: (state) => {
      return { ...state, openCreateTaskModal: false };
    },
    ShowEditTaskModal: (state) => {
      return { ...state, openEditTaskModal: true };
    },
    HideEditTaskModal: (state) => {
      return { ...state, openEditTaskModal: false };
    },
    resetCreateTaskSuccess: (state) => {
      return { ...state, createTaskSuccess: null };
    },
    resetEditTaskSuccess: (state) => {
      return { ...state, editTaskSuccess: null };
    },
    resetListComment: (state) => {
      return { ...state, listComment: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTaskAction.pending, (state) => {
      return { ...state, createTaskSuccess: false };
    });
    builder.addCase(createTaskAction.fulfilled, (state, action) => {
      if (action.payload) {
        return { ...state, createTaskSuccess: true };
      } else {
        Swal.fire({
          icon: "error",
          title: "Create task failed.",
          text: "Task name already existed !",
          confirmButtonColor: "#1677ff",
        });

        return { ...state, createTaskSuccess: null };
      }
    });
    builder.addCase(createTaskAction.rejected, (state) => {
      return { ...state, createTaskSuccess: false };
    });
    builder.addCase(updateTaskAction.pending, (state) => {
      return { ...state, editTaskSuccess: false };
    });
    builder.addCase(updateTaskAction.fulfilled, (state) => {
      return { ...state, editTaskSuccess: true };
    });
    builder.addCase(updateTaskAction.rejected, (state) => {
      return { ...state, editTaskSuccess: false };
    });
    builder.addCase(getTaskDetailAction.pending, (state) => {
      return { ...state, taskDetail: null };
    });
    builder.addCase(getTaskDetailAction.fulfilled, (state, action) => {
      return { ...state, taskDetail: action.payload };
    });
    builder.addCase(getTaskDetailAction.rejected, (state) => {
      return { ...state, taskDetail: null };
    });
    builder.addCase(getAllCommentAction.pending, (state) => {
      return { ...state, listComment: null };
    });
    builder.addCase(getAllCommentAction.fulfilled, (state, action) => {
      return { ...state, listComment: action.payload };
    });
    builder.addCase(getAllCommentAction.rejected, (state) => {
      return { ...state, listComment: null };
    });
  },
});

export const {
  ShowCreateTaskModal,
  HideCreateTaskModal,
  ShowEditTaskModal,
  HideEditTaskModal,
  resetCreateTaskSuccess,
  resetEditTaskSuccess,
  resetListComment,
} = TaskManageSlice.actions;
export default TaskManageSlice.reducer;
