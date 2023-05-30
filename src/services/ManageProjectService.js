import axiosService from "./BaseService"

export const getListProjectsAPI = async (searchTerm) => {
    if (searchTerm && searchTerm.trim() !== '') {
        const { data } = await axiosService.get(`/Project/getAllProject?keyword=${searchTerm}`);

        return data;
    } else {
        const { data } = await axiosService.get("/Project/getAllProject");

        return data;
    }
}

export const deleteProjectAPI = async (id) => {
    const { data } = await axiosService.delete(`/Project/deleteProject?projectId=${id}`);

    return data;
}

export const createProjectAPI = async (values) => {
    const { data } = await axiosService.post("/Project/createProjectAuthorize", values);

    return data;
}

export const getProjectDetailAPI = async (id) => {
    const { data } = await axiosService.get(`/Project/getProjectDetail?id=${id}`);

    return data;
}

export const updateProjectAPI = async (id, values) => {
    const { data } = await axiosService.put(`/Project/updateProject?projectId=${id}`, values);

    return data;
}

export const assignUserProjectAPI = async (values) => {
    const { data } = await axiosService.post("/Project/assignUserProject", values);

    return data;
}

export const removeUserFromProjectAPI = async (values) => {
    const { data } = await axiosService.post("/Project/removeUserFromProject", values);

    return data;
}