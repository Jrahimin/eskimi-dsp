export const FormAppend = (data = {}) => {
    let dataArray = new FormData();
    if (typeof data == 'object') {
        Object.keys(data).forEach(key => {
            dataArray.append(key, data[key]);
        })

        console.log('append dd', dataArray)

        return dataArray;
    }

    return null;
}
