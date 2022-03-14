import axios from "axios";

export const AxiosReq = (url, data, callback, method='post', hasFile=true) => {
    let axiosOption = {
        method,
        url,
        data
    };

    if(hasFile){
        axiosOption['headers'] = {
            "Content-Type": "multipart/form-data"
        }
    }

    return axios(axiosOption).then((response) => {
        callback(response.data);
    }).catch((error) => {
        const data = {
            code: 500,
            message: "Something went wrong.",
        }
        callback(data);
    });
}
