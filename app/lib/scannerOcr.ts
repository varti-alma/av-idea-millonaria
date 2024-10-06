import Tesseract from "tesseract.js";
import { createWorker } from "tesseract.js";

const processImageWithOCR = async (lang: string = "eng",image: string) => {
const worker = await createWorker(lang);
await worker.load();
await worker.setParameters({
    tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz./-',
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
  });
  
const { data: { text } } = await worker.recognize(image);
const clearOCRText = (text: string) => {
    const clearedText = text
      .replace(/[^a-zA-Z0-9\s\.\/-]/g, '') // Eliminamos caracteres extraños
      .replace(/\s+/g, ' ') // Convertimos múltiples espacios a un solo espacio
      .trim();
    console.log('Texto limpiado:', clearedText);
    return clearedText;
  };
  const extractName = (text: string) => {
    // Vamos a buscar "APELLIDOS" o algo cercano y luego nombres
    const namePattern = /(APELLIDOS?|APELIDOS?)\s*([A-Z]+)\s+([A-Z]+)\s*(NOMBRES?|NOMBRE? 3)?\s*([A-Z]+)/i;
    const match = text.match(namePattern);
    console.log('Nombre detectado:', match);
    if (match) {
      const [_, , lastName1, lastName2, , firstName] = match;
      return { firstName, lastName1, lastName2 };
    }
    return null;
  };
  const extractBirthDate = (text: string) => {
    // Buscar fecha en formato DDMMMYYYY
    const birthDatePattern = /FECHADENACIMIENTO?.*?(\d{2}[A-Z]{3}\d{4})/i;
    const match = text.match(birthDatePattern);
    if (match) {
      return match[1];
    }
    return null;
  };
  const extractDocumentNumber = (text: string) => {
    // Buscar el RUN con formato chileno (NN.NNN.NNN-D)
    const documentNumberPattern = /RUN\s*(\d{1,2}\.\d{3}\.\d{3}-\d{1})/;
    const match = text.match(documentNumberPattern);
    if (match) {
      return match[1];
    }
    return null;
  };
  const extractSerialNumber = (text: string) => {
    // Buscar un patrón numérico para el número de documento
    const serialNumberPattern = /(DOCUMENTO|NUMERODOCUMENTO)\s*([\d\.]+)/i;
    const match = text.match(serialNumberPattern);
    console.log('Serial number detectado:', match);
    if (match) {
      return match[2];
    }
    return null;
  };
  const extractNationalityAndSex = (text: string) => {
    // Flexibilidad para encontrar nacionalidad y sexo
    const pattern = /(NACIONALIDAD|NACIONA)\s*([A-Z]+)\s*(SEXO|EXO)\s*([A-Z]+)\s*(CHILENA|CHILEN)\s*/i;
    const match = text.match(pattern);
    console.log('Nacionalidad y sexo detectados:', match);
    if (match) {
      const [_, , nationality, , gender] = match;
      return { nationality, gender };
    }
    return null;
  };
const cleanedText = clearOCRText(text);
const valuesDocument = {
    name : extractName(cleanedText),
    birthDate : extractBirthDate(cleanedText),
    documentNumber : extractDocumentNumber(cleanedText),
    serialNumber : extractSerialNumber(cleanedText),
    nationalityAndSex : extractNationalityAndSex(cleanedText),
}
console.log('Información del documento: ', valuesDocument);
await worker.terminate();
return {valuesDocument};
};


export default processImageWithOCR;

