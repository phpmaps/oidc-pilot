import fetch from 'node-fetch';

export const doDelete = async (url, headers, params) => {
    let response;
    let json;
    if (params) {
        const p = new URLSearchParams(params);
        url = `${url}?${p.toString()}`
    }
    
    try {
        response = await fetch(url, {method: 'DELETE', headers });
        json = await response.json();
        return {
            status: response.status,
            headers: response.headers,
            error: null,
            body: json
        }
    } catch (e) {
        const payload = {};
        payload.status = response ? response.status : null;
        payload.headers = response ? response.headers : null;
        payload.error = e;
        payload.body = json;
        payload.index = url;
        console.log(`Attention:  HTTPDELETE error.`);
        console.log(payload);
        return payload;
    }
}