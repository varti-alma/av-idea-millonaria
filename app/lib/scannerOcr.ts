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
    // Buscamos cualquier cosa que comience con "APELLIDOS" y "NOMBRES"
    const namePattern = /APELLIDOS?\s*([A-Z\s]+)\s*NOMBRES?\s*[A-Z0-9]*\s*([A-Z]+)/i;
    const match = text.match(namePattern);
    console.log('Nombre detectado:', match);
  
    if (match) {
      const fullLastName = match[1].trim(); // Capturamos los apellidos completos
      const firstName = match[2].trim(); // Capturamos el nombre
  
      // Procesamos los apellidos para dividirlos si es necesario
      const lastNames = fullLastName.split(' ');
      const firstNames = firstName.split(' ');
      const lastName1 = lastNames[1] || '';
      const lastName2 = lastNames[2] || '';
  
      return { firstName, lastName1, lastName2 };
    }
    return null;
  };
  
  
  
  const extractBirthDate = (text: string) => {
    const birthDatePattern = /FECHADENACIMIENTO?.*?(\d{2}[A-Z]{3}\d{4})/i;
    const match = text.match(birthDatePattern);
    if (match) {
      return match[1];
    }
    return null;
  };

 const extractDocumentNumber = (text: string) => {
    const documentNumberPattern = /RUN\s*(\d{1,2}\.\d{3}\.\d{3}-\d{1})/;
    const match = text.match(documentNumberPattern);
    if (match) {
      return match[1];
    }
    return null;
  };

  const extractSerialNumber = (text: string) => {
    const serialNumberPattern = /(\d{3}\.\d{3}\.\d{3})/;
    const match = text.match(serialNumberPattern);
    console.log('Serial number detectado:', match);
    if (match) {
      return match[1];
    }
    return null;
  };

  const extractNationalityAndSex = (text: string) => {
    // Buscamos primero "CHILENA" para encontrar la nacionalidad y luego buscamos el sexo
    const nationalityMatch = text.match(/CHILENA/i);
    const sexMatch = text.match(/SEXO\s*[^\w]*(M|F)/);

    const nationality = nationalityMatch ? "CHILENA" : null; // Predeterminado "CHILENA"
    const gender = sexMatch ? sexMatch[1] : null; // "M" o "F"
  
    console.log('Nacionalidad y sexo detectados:', { nationality, gender });
    return { nationality, gender };
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

