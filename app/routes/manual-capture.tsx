import React, { useEffect, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { Button } from "app/components/ui/button";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Link, useNavigate } from "@remix-run/react";
import { CameraIcon, FileIcon, UpdateIcon } from "@radix-ui/react-icons";
import processImageWithOCR from "~/lib/scannerOcr";

type DataScanner = { 
  name?: {
    firstName: string;
    lastName: string;
    lastNam2: string;
  };
  birthDate: string;
  documentNumber: string;
  serialNumber: string;
  nationalityAndSex: {
    gender: string;
    nationality: string;
  };

}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export default function Index() {
  const [validation, setValidation] = useState(true);
  const [registrar, setRegistrar] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [proccessing, setIsProccessing] = useState(false);
  const [fileLoaded, setFileLoaded] = useState('');
  const [documentData, setDocumentData] = useState<DataScanner>();

  const navigate = useNavigate();

  const captureData = () => {
    registrar ? alert("Guardando..") : alert("Validando...");
    //aca va a invocación de la api de guardado a la base de datos
    if (validation) {
      setValidation(true);
      setDialogTitle("Registro guardado exitosamente");
      setDialogMessage("Registro guardado exitosamente");
    } else {
      setDialogTitle("Error al guardar registro");
      setDialogMessage(
        "Error en almacenar registro. ¿Desea registrarse manualmente?"
      );
    }
    setShowDialog(true);
  };

  const base64ToBlob = (base64: string, mimeType: string = 'image/png') => {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mimeType });
  };

  const processOCR = async (image:Blob) => {
    console.log('Procesando OCR...');
    setIsProccessing(true);
    if(!(image instanceof Blob)) {
        console.error('EL objecto no es un Blob',image);
        return;
    }
    const imageURL = URL.createObjectURL(image);
     const {valuesDocument} = await processImageWithOCR("spa", imageURL);
     //@ts-ignore
     setDocumentData(valuesDocument);
     URL.revokeObjectURL(imageURL);
     setIsProccessing(false);
     setFileLoaded('Imagen cargada exitosamente');
}

const convertToGrayscale = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const context= canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  context?.drawImage(image, 0, 0, image.width, image.height);
  const imageData = context?.getImageData(0, 0, image.width, image.height);
  const data = imageData?.data;
  if(data){
      for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const grayscale = (r+g+b)/3;
          data[i] = data[i+1] = data[i+2] = grayscale;
      }
      context?.putImageData(imageData, 0, 0);
  }
  const grayscaleDataURL = canvas.toDataURL('image/png');

  return grayscaleDataURL;
}


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend =  () => {
            const image = new Image();
            image.src = reader.result as string;
            image.onload = () => {
                const grayscaleImage = convertToGrayscale(image);
                const blobImage = base64ToBlob(grayscaleImage);
                processOCR(blobImage);
            }
            
            };
        reader.readAsDataURL(file);
    }
};

useEffect(() => {
  if(documentData){
    const documentNumber = documentData?.documentNumber.replace(/[.]/g, '');
    const documentNumberFormat= documentNumber.replace(/[-]/g,'');
    setDocumentId(documentNumberFormat);
    const serialNumnberUnformatted = documentData?.serialNumber.replace(/[.]/g, '');
    setSerialNumber(serialNumnberUnformatted);
  }
}, [documentData])


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <img src="logo_audienceview.webp" alt="AudienceView" width="300" />
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Ingreso del formulario para meter info del carnet
          </h1>
        </header>
        <div>
          <div>
            <Label> RUT / Pasaporte</Label>
            <div className="flex flex-row justify-center items-center">
              <div className="mr-5">
                <Input
                  value={documentId}
                  name="documentId"
                  placeholder="Ingrese su rut sin puntos ni guión"
                  onChange={(e) => {
                    setDocumentId(e.target.value);
                  }}
                />
              </div>
              <div className={`flex justify-center items-center rounded-sm shadow-sm ${proccessing ? 'bg-gray-300' : 'bg-purple-800'}`}>
                <Label children={ proccessing ? <UpdateIcon className="animate-spin text-white w-4 h-4"/>  : <CameraIcon className=" text-white w-4 h-4"/>} className={` ${proccessing ?'hover:cursor-not-allowed':'hover:cursor-pointer'} p-4 ` }htmlFor="scannerDocument"  />
                <Input
                className="sr-only"
                disabled={proccessing}
                id="scannerDocument"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
              </div>
            </div>
            {fileLoaded && <p className="text-green-600">{fileLoaded}</p>}
          </div>
          <div className="mt-5">
            <Label> Número de seguridad </Label>
            <Input
              value={serialNumber}
              name="securityNumber"
              onChange={(e) => {
                setSerialNumber(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <Button onClick={captureData} className="ml-5">
            Guardar
          </Button>
        </div>
      </div>
      <AlertDialog open={showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={validation ? "text-green-600" : "text-red-600"}
            >
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogMessage} {serialNumber} {documentId}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>
              Cerrar
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
