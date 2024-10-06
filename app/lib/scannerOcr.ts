import Tesseract from "tesseract.js";
import { createWorker } from "tesseract.js";

const processImageWithOCR = async (lang: string = "eng",image: string) => {
const worker = await createWorker(lang);
Tesseract.setLogging(true);
const { data: { text } } = await worker.recognize(image);
console.log('Información del documento: ', text);
await worker.terminate();
};


export default processImageWithOCR;

