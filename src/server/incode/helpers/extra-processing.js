import { fetchImages } from '../api/fetch-images.js';
import { deleteSession } from '../api/delete-session.js';

dotenv.config();

export const extraProcessing = async (client, interviewId, header) => {
    try {
        fetchImages(client, interviewId, header)
        .then((images)=>{
            //TODO: Save Images to S3
            //Images is a JSON ojbect with croppedFrontID, croppedBackID and croppedFace.
            //Each property value is a base64 encoded image
            //console.log(images);
        })
        .catch(console.log("Extra processing error."))
        .finally(
            async ()=>{
                await deleteSession(client, interviewId);
            }
        )
    } catch (error) {
        console.log("Attention: Extra processing error.")
    }
};