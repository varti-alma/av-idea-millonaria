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

  const initializeCanva = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
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
      const res = await fetch(
        "https://y3yoims0y3.execute-api.us-east-2.amazonaws.com/PruebaReconocimiento",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imgvalidacion }),
        }
      );

      const data = await res.json();

      if (data.body.codigo === 0) {
        setDialogTitle("Asistente validado Correctamente");
        setDialogMessage(" Validado Correctamente");
        setValidation(true);
        setShowDialog(true);
      } else {
        setDialogTitle("Persona NO Validada");
        setDialogMessage(
          "Persona NO Validada. ¿Desea registrarse manualmente?"
        );
        setValidation(false);
        setShowDialog(true);
      }
    } catch (error) {
      setDialogTitle("Error al enviar la solicitud");
      setDialogMessage(error);
      setValidation(true);
      setShowDialog(true);
      console.error("Error al enviar la solicitud:", error);
    }
  };

  const apiUploadImage = async (imagen: any) => {
    const value = {
      name: "uploadedImage",
      image: imagen,
    };
    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });
      console.log(res.body);
      const data = await res.json();

      // Verificar la respuesta
      if (data.status === 200) {
        setValidation(true);
        setShowDialog(true);
        setDialogTitle("Registro Correcto");
        setDialogMessage("Asistente registrado correctamente");
      } else {
        setShowDialog(true);
        setValidation(false);
        setDialogTitle("No se pudo registrar asistente");
        setDialogMessage(
          "No se pudo registrar asistente. ¿Desea intentar registrarse manualmente?"
        );
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
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
          <Button
            onClick={
              registrar
                ? apiUploadImage(photoTaken)
                : apiValidateImage(photoTaken)
            }
            className="mx-auto"
          >
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
            <AlertDialogCancel
              onClick={() => {
                if (registrar) {
                  navigate("/");
                } else {
                  navigate("/validate");
                }
                setIsCameraOn(false);
                setPhotoTaken(false);
                setValidation(false);
                setShowDialog(false);
                setDialogMessage("");
                setDialogTitle("");
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
              }}
            >
              {validation ? "Cerrar" : "Cancelar"}
            </AlertDialogCancel>
            {!validation && registrar && (
              <AlertDialogAction onClick={navigarManual}>
                Ir a guardado manual
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CameraComponent;
