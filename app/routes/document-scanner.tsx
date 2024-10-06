import exp from 'constants';
import React, { useEffect, useRef, useState } from 'react'
import processImageWithOCR from '~/lib/scannerOcr';

const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  const startCamera = async (facingMode: "user" | "environment", videoRef: React.RefObject<HTMLVideoElement>) => {
    try {
      const stream = await window?.navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      if(videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err:any) {
      console.error("Error accessing the camera: ", err);
      alert('Error al acceder a la cámara: ' + err.message);
      throw err;
    }
  };
  const captureFrame =(video:HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if(context){
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png");
    }
    return '';
};



  const DocumentScanner: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [facingMode, setFacingMode] = useState<"user"|"environment">("environment");
    const [capturing, setCapturing] = useState(false);

    const scannerDocumentWithCamera = async (lang: string) => {
        const isMobileDevice = isMobile();
        if (isMobileDevice) {
            const camera = prompt("¿Quieres usar la cámara frontal o trasera? Escribe 'frontal' o 'trasera'");
      setFacingMode(camera === 'frontal' ? 'user' : 'environment');
        } else {
            console.log('Dispositivo de escritorio detectado. Usando cámara por defecto.');
            setFacingMode('environment');
        }
        try {
         await startCamera(facingMode,videoRef);
        } catch (error) {
          console.error("Error en el flujo de la cámara:", error);
        }
      };

      const handleManualCapture = async () => {
        setCapturing(true);
      };

      useEffect(() => {
        if(capturing){
            const timer = setTimeout(() => {
                if(videoRef.current){
                    const image = captureFrame(videoRef.current);
                    processImageWithOCR("eng", image);
                    setCapturing(false);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
      }, [capturing])

      useEffect(() => {
       scannerDocumentWithCamera("eng");
      }, [facingMode]);
      
      return (
       <div>
      <h1>Document Scanner</h1>
      <p>Haz clic en el botón para capturar una imagen del documento.</p>
      <video ref={videoRef} style={{ width: '100%', maxWidth: '600px' }} />
      <button onClick={handleManualCapture} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Capturar y Escanear
      </button>
    </div>
      );
      
  };
export default DocumentScanner;

