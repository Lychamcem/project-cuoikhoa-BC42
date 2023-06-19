import axiosService from "./BaseService";

export const createTaskAPI = async (values) => {
    const data = await axiosService.post("/Project/createTask", values);

    return data;
}

export const updateTaskAPI = async (values) => {
    const { data } = await axiosService.post("/Project/updateTask", values);

    return data;
}

export const deleteTaskAPI = async (id) => {
    const { data } = await axiosService.delete(`/Project/removeTask?taskId=${id}`);

    return data;
}

export const updateStatusTaskAPI = async (values) => {
    const { data } = await axiosService.put("/Project/updateStatus", values);

    return data;
}

export const getTaskDetailAPI = async (id) => {
    const { data } = await axiosService.get(`/Project/getTaskDetail?taskId=${id}`);

    return data;
}

export const getAllCommentAPI = async (id) => {
    const { data } = await axiosService.get(`/Comment/getAll?taskId=${id}`);

    return data;
}

export const insertCommentAPI = async (values) => {
    const { data } = await axiosService.post("/Comment/insertComment", values);

    return data;
}

export const updateCommentAPI = async (id, commentContent) => {
    const { data } = await axiosService.put(`/Comment/updateComment?id=${id}&contentComment=${commentContent}`);

    return data;
}

export const deleteCommentAPI = async (id) => {
    const { data } = await axiosService.delete(`/Comment/deleteComment?idComment=${id}`);

    return data;
}