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
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

function CameraComponent({ registrar }: { registrar: boolean }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [validation, setValidation] = useState(false);

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
    setPhotoTaken(photoData);
  };

  const validarFoto = () => {
    registrar ? alert("Guardando..") : alert("Validando...");
    setValidation(true);
    if (validation) {
      alert("Registro guardado exitosamente");
    } else {
      alert("Error en almacenar registro. ¿Desea registrarse manualmente?");
    }
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
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CameraComponent;
