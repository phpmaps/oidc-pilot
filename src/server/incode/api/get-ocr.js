import dotenv from 'dotenv';
import moment from 'moment/moment.js';
import { doGet } from '../helpers/http-get.js';

dotenv.config();

const formatDate = (milliseconds)=> {
    let d = null;
    if(milliseconds) {
        const dt = new Date(parseInt(milliseconds));
        const month = dt.getUTCMonth() + 1; 
        const day = dt.getUTCDate();
        const year = dt.getUTCFullYear();
        d = `${month}-${day}-${year}`;
    }
    return d
}

export const getOcr = async (client, interviewId, header) => {

    const endpoint = `omni/get/ocr-data?id=${interviewId}`;
    const url = `${client.API_URL}/${endpoint}`;

    try {
        const ocrData = await doGet(url, header);
        const ocr = ocrData.body;

        let data = {...ocr?.name};
        data.address = ocr?.address;
        data.documentNumber = ocr?.documentNumber;
        data.typeOfId = ocr?.typeOfId;
        data.gender = ocr?.gender;
        data.fullNameMrz = ocr?.fullNameMrz;
        data.barcodeRawData = ocr?.barcodeRawData;

        data.issuedAt = formatDate(ocr?.issuedAt);
        data.expireAt = formatDate(ocr?.expireAt);
        data.birthDate = formatDate(ocr?.birthDate);

        return {
            data: data,
            ocr: ocrData.body
        }

    } catch (error) {
        let data = {};
        return data.ocrError = "Something went wrong.";
    }
};
