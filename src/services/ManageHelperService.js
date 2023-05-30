import axiosService from "./BaseService"

export const getPriorityAPI = async (id) => {
    if (id) {
        const { data } = await axiosService.get(`/Priority/getAll?id=${id}`);

        return data;
    } else {
        const { data } = await axiosService.get("/Priority/getAll");

        return data;
    }
}

export const getCategoryAPI = async () => {
    const { data } = await axiosService.get("/ProjectCategory");

    return data;
}

export const getStatusAPI = async () => {
    const { data } = await axiosService.get("/Status/getAll");

    return data;
}

export const getTaskTypeAPI = async () => {
    const { data } = await axiosService.get("/TaskType/getAll");

    return data;
}

