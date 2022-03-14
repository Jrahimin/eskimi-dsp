export const FormAppend = (data = {}) => {
    let dataArray = new FormData();
    if (typeof data == 'object') {
        Object.keys(data).forEach(key => {
            dataArray.append(key, data[key]);
        })

        return dataArray;
    }

    return null;
}
