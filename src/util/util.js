exports.createURL = (baseurl, params) => {
    let result = baseurl + "?";
    for (const key of Object.keys(params)) {
        if (Array.isArray(params[key])) {
            for (const item of params[key]) {
                result += key + "=" + item + "&"
            }
        } else {
            result += key + "=" + params[key] + "&";
        }
    }

    return encodeURI(result.slice(0, -1)); // remove '&' from the end
}