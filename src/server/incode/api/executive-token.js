import { doPost } from '../helpers/http-post.js';
import dotenv from 'dotenv';
dotenv.config();

export const getExecutiveToken = async (client) => {
  
    const endpoint = "executive/log-in";

    //Tweak Incode's URL removing the /0 specifically for the executive login endpoint
    let url = `${client.API_URL.substring(0, client.API_URL.length - 2)}/${endpoint}`;

    const params = {
        email: process.env.API_USER,
        password: process.env.API_PASSWORD
    }

    const header = {
        'Content-Type': "application/json",
        'x-api-key': client.API_KEY,
        'api-version': '1.0'
    }

    try {
        const resp = await doPost(url, header, params);
        return resp.body?.token;

    } catch (error) {
        throw Error(`error using ${endpoint}`);
    }

};