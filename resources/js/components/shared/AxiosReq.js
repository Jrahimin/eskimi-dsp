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
        console.log("success response data: ", response.data)
        callback(response.data);
    }).catch((error) => {
        console.log('axios error response:', error);

        const data = {
            code: 500,
            message: "Something went wrong.",
        }
        callback(data);
    });
}
