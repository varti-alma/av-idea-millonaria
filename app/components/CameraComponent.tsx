import React, { useRef, useState } from "react";
import { Button } from "app/components/ui/button";

function CameraComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);

  const startCamera = async () => {
    try {
      setIsCameraOn(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
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

  const takePhoto = () => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext("2d");
    const video = videoRef.current;
    debugger;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoTaken(true);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    debugger;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL("image/png");
    setPhoto(photoData);
  };

  return (
    <div>
      <h1>Cámara en React</h1>
      {isCameraOn ? (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%" }}
          />
          <Button onClick={capturePhoto}>Tomar foto</Button>
          <Button onClick={stopCamera}>Apagar cámara</Button>
        </div>
      ) : (
        <Button onClick={startCamera}>Encender cámara</Button>
      )}

      {photoTaken && (
        <div>
          <h2>Foto tomada:</h2>
          <canvas ref={canvasRef} style={{ width: "100%", border:1px; }}></canvas>
        </div>
      )}
    </div>
  );
}

export default CameraComponent;
