import React, { useEffect, useRef, useState } from "react";
import { Button } from "app/components/ui/button";
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
import { useNavigate } from "@remix-run/react";

function CameraComponent({ registrar }: { registrar: boolean }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [validation, setValidation] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      setIsCameraOn(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      setIsCameraOn(false);
      console.error("Error accessing the camera: ", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    setIsCameraOn(false);
    setPhotoTaken(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL("image/png");
    stopCamera();
    setPhotoTaken(photoData);
  };

  const [response, setResponse] = useState(null);

  const apiValidateImage = async (imgvalidacion) => {
    try {
        const res = await fetch("https://y3yoims0y3.execute-api.us-east-2.amazonaws.com/PruebaReconocimiento", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imgvalidacion }),
        });

        const data = await res.json();
        console.log("Solicitud enviada");
        console.log(data);

        // Verificar la respuesta
        if (data.body.codigo === 0) {
            //alert("Usted es: " + data.body.similutud);
            console.log("Respuesta Correcta");
            setValidation(true);
            alert(data.body.similutud + " Validado Correctamente");
            setDialogTitle(data.body.similutud + " Validado Correctamente");
            setDialogMessage(data.body.similutud + " Validado Correctamente");
        } else {
            //alert("Error: " + data.body.descripcion);
            console.log("Respuesta Erronea");
            setShowDialog(true);
            setDialogTitle("Persona NO Validada");
            setDialogMessage(
              "Persona NO Validada. ¿Desea registrarse manualmente?"
            );
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
    }
  };

  const [name, setName] = useState("");
  const [imagen, setImagen] = useState("");

  const apiUploadImage = async (imagen:any) => {
    const value = {
      name: 'uploadedImage',
      image: imagen
    }
    console.log("Value:" ,value);
    console.log("Json Value: ", JSON.stringify(value))
    try {
        const res = await fetch("http://localhost:3000/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            //mode: "no-cors",
            body: JSON.stringify(value)
            //body: value
        });
        console.log(res.body);
        const data = await res.json();
        console.log("Solicitud enviada");
        console.log(data);

        // Verificar la respuesta
        if (data.status === 200) {
          console.log("Respuesta Correcta");
          setValidation(true);
          alert("Registro Correcto");
          setDialogTitle("Registro Correcto");
          setDialogMessage("Registro Correcto");
      } else {
          console.log("Respuesta Erronea");
          setShowDialog(true);
          setDialogTitle("NO se pudo registrar persona");
          setDialogMessage(
            "NO se pudo registrar persona. ¿Desea registrarse manualmente?"
          );
      }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
    }
  };

  const validarFoto = () => {
    //registrar ? alert("Guardando..") : alert("Validando...");
    console.log("Foto1: ", photoTaken);
    registrar ? apiUploadImage(photoTaken) : apiValidateImage(photoTaken);
    //aca va a invocación de la api de guardado de imagen
    /*if (validation) {
      setValidation(true);
      alert("Registro guardado exitosamente");
      setDialogTitle("Registro guardado exitosamente");
      setDialogMessage("Registro guardado exitosamente");
    } else {
      setShowDialog(true);
      setDialogTitle("Error al guardar registro");
      setDialogMessage(
        "Error en almacenar registro. ¿Desea registrarse manualmente?"
      );
    }*/
  };

  const navigarManual = () => {
    navigate("/manual-capture");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!isCameraOn && (
        <h3 className="mb-5">
          <strong>Importante:</strong> Debe autorizar el uso de la cámara para
          continuar.
        </h3>
      )}

      {isCameraOn && !photoTaken ? (
        <div className="flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%" }}
          />
          <div className="flex justify-around my-2">
            <Button onClick={capturePhoto}>Tomar foto</Button>
            <Button onClick={stopCamera}>Cancelar</Button>
          </div>
        </div>
      ) : photoTaken ? (
        <div className="flex justify-around">
          <Button onClick={validarFoto} className="mx-auto">
            {registrar ? "Guardar" : "Validar"} registro
          </Button>
        </div>
      ) : (
        <Button onClick={startCamera} className="mx-auto">
          Iniciar captura
        </Button>
      )}

      <div>
        {photoTaken && (
          <div className="text-center my-4">
            <h2>Imagen capturada:</h2>
          </div>
        )}
        <canvas ref={canvasRef} style={{ width: "100%" }}></canvas>
      </div>
      <AlertDialog open={showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={validation ? "text-green-600" : "text-red-600"}
            >
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={navigarManual}>
              Ir a guardado manual
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CameraComponent;
