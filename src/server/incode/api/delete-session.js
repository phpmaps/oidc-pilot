import { doDelete } from '../helpers/http-delete.js';
import { getExecutiveToken } from '../api/executive-token.js';


export const deleteSession = async (client, interviewId) => {

    const token = await getExecutiveToken(client);

    const header = {
        'x-api-key': client.API_KEY,
        'api-version': '1.0',
        'X-Incode-Hardware-Id': token
    }


    const endpoint = `omni/interview?interviewId=${interviewId}&keepCustomer=false`;
 
    let url = `${client.API_URL.substring(0, client.API_URL.length - 2)}/${endpoint}`;

    try {
        const resp = await doDelete(url, header);
        return resp.body;

    } catch (error) {
        throw Error(`error using ${endpoint}`);
    }
};