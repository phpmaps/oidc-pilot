
import { doPost } from '../helpers/http-post.js';


export const fetchImages = async (client, interviewId, header) => {
    const endpoint = `omni/get/images?id=${interviewId}`;
    const url = `${client.API_URL}/${endpoint}`;

    const params = {
        "images": [ 
            "croppedFace", "croppedFrontID", "croppedBackID"
        ]
    }

    try {
        const resp = await doPost(url, header, params);
        return resp.body;

    } catch (error) {
        throw Error(`error using ${endpoint}`);
    }
};