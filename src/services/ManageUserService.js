import axiosService from "./BaseService"

export const SignUpAPI = async (values) => {
    const { data } = await axiosService.post("/Users/signup", values);

    return data;
}

export const SignInAPI = async (values) => {
    const { data } = await axiosService.post("/Users/signin", values);

    return data;
}

export const getUserAPI = async (searchTerm) => {
    if (searchTerm && searchTerm !== '') {
        const { data } = await axiosService.get(`/Users/getUser?keyword=${searchTerm}`);

        return data;
    } else {
        const { data } = await axiosService.get("/Users/getUser");

        return data;
    }
}

export const editUserAPI = async (values) => {
    const { data } = await axiosService.put("/Users/editUser", values);

    return data;
}

export const deleteUserAPI = async (id) => {
    const { data } = await axiosService.delete(`/Users/deleteUser?id=${id}`);

    return data;
}