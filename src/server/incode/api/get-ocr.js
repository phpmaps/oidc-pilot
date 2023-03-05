import dotenv from 'dotenv';
import { doGet } from '../helpers/http-get.js';

dotenv.config();

const formatDate = (milliseconds)=> {
    let d = null;
    if(milliseconds) {
        d = new Date(milliseconds).toISOString().split('T')[0]
    }
    return d
}

export const getOcr = async (client, interviewId, header) => {

    const endpoint = `omni/get/ocr-data?id=${interviewId}`;
    const url = `${client.API_URL}/${endpoint}`;

    try {
        const ocrData = await doGet(url, header);
        const ocr = ocrData.body;
        console.log(ocr);

        let data = {
            ...ocr?.name, 
            ...ocr?.fullAddress, 
            ...ocr?.documentNumber, 
            ...ocr?.documentType, 
            ...ocr?.typeOfId,
            ...ocr?.gender
        };

        data.issuedAt = formatDate(ocr?.issuedAt);
        data.expireAt = formatDate(ocr?.expireAt);
        data.birthDate = formatDate(ocr?.birthDate);

        return {
            data: data,
            ocr: ocr.body
        }

    } catch (error) {
        throw Error(`error using ${endpoint}`);
    }
};
