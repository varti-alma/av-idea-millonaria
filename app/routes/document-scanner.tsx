
import { log } from 'console';
import { set } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import processImageWithOCR from '~/lib/scannerOcr';


  

  const DocumentScanner: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isProccessing, setIsProccessing] = useState(false);
    const [stability, setStability] = useState(0);
    const [documentData, setDocumentData] = useState({});
    const [capturedImage, setCapturedImage] = useState('');
    const [previousFrame, setPreviousFrame] = useState<ImageData | null>(null);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [grayscaleImage, setGrayscaleImage] = useState<string | null>(null);


    const detectMobile = () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobileDevice(isMobile);
        console.log("Es un dispositivo móvil:", isMobile);
      };

    const startCamera = async () => {
        try {
          const stream = await window?.navigator.mediaDevices.getUserMedia({
            video: { facingMode:'enviroment' },
            audio: false,
          });

          if(videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current.onloadedmetadata  = () =>{
                 videoRef.current?.play();
                 console.log('Video reproduciendose.')
            }
          }
        } catch (err:any) {
          console.error("Error accessing the camera: ", err);
          alert('Error al acceder a la cámara: ' + err.message);
          throw err;
        }
      };

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
        setGrayscaleImage(grayscaleDataURL);

        return grayscaleDataURL;
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

      const compareFrames = (frame1: ImageData, frame2: ImageData) => {
        let totalDifference = 0;
        for (let i = 0; i < frame1.data.length; i += 4) {
            const r1 = frame1.data[i], g1 = frame1.data[i + 1], b1 = frame1.data[i + 2];
            const r2 = frame2.data[i], g2 = frame2.data[i + 1], b2 = frame2.data[i + 2];
            const difference = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
            totalDifference += difference;
            console.log('Diferencia de frames:', difference);
        }
        return totalDifference;
      }

      const detectStability = () => {
        if (!canvasRef.current || !videoRef.current) return;
    
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });
    
        if (context) {
          // Capturamos el frame actual
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);
    
          if (previousFrame) {
            // Comparamos el frame actual con el anterior
            const difference = compareFrames(previousFrame, currentFrame);
    
            // Si la diferencia es menor a un umbral, asumimos que está estable
            const threshold = 100000; // Ajusta este valor según la sensibilidad deseada
            if (difference < threshold) {
              setStability(stability + 20); 
              console.log('Estabilidad => ', stability);
              // Incrementa la estabilidad si el movimiento es mínimo
              if (stability >= 100) {
                captureImage(); // Capturamos la imagen cuando la estabilidad llega al 100%
              }
            } else {
              setStability(0); // Si hay mucho movimiento, reiniciamos la estabilidad
            }
          }
    
          // Guardamos el frame actual como el frame anterior para la próxima comparación
          setPreviousFrame(currentFrame);
        }
      };

      const captureImage =() => {
        if(!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        if(context){
            //capturamos el frame fina cuando la imagen se estabilice.
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL("image/png");
            console.log('Captura de imagen:', image);
            setCapturedImage(image);
            const blobImage = base64ToBlob(image);
            console.log('Blob imagen:', blobImage);
          processOCR(blobImage);
        }
    };

    const processOCR = async (image:Blob) => {
        setIsProccessing(true);
        console.log('Procesando OCR...');
        if(!(image instanceof Blob)) {
            console.error('EL objecto no es un Blob',image);
            return;
        }
        const imageURL = URL.createObjectURL(image);
         const {valuesDocument} = await processImageWithOCR("spa", imageURL);
         setDocumentData(valuesDocument);
        URL.revokeObjectURL(imageURL);


        setIsProccessing(false);
        console.log('Procesamiento finalizado.');
    }

    useEffect(() => {
        detectMobile();
        if (isMobileDevice) {
            startCamera();
            const stabilityInterval = setInterval(detectStability, 1000); //Detecta la estabilidad cada segundo
            return () => clearInterval(stabilityInterval);
        }
    }, [stability, previousFrame]);
    

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend =  () => {
                const image = new Image();
                image.src = reader.result as string;
                image.onload = () => {
                    console.log('Imagen cargada:', image);
                    const grayscaleImage = convertToGrayscale(image);
                    const blobImage = base64ToBlob(grayscaleImage);
                    processOCR(blobImage);
                }
                
                };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
          <h1>Document Scanner</h1>

          {isMobileDevice ? (
        <>
          {/* Video en tiempo real */}
          <video ref={videoRef} style={{ width: '100%', maxWidth: '600px', border: '2px solid black' }} />

          {/* Canvas oculto para capturar frames */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Borde animado que se llena conforme la imagen se estabiliza */}
          <div style={{
            border: '5px solid',
            borderColor: `rgba(0, 255, 0, ${stability / 100})`,
            width: '100%',
            maxWidth: '600px',
            height: '5px',
            marginTop: '10px',
            transition: 'border-color 0.5s ease-in-out'
          }} />

          {/* Mostrar spinner cuando el OCR está procesando */}
          {isProccessing && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite' }}></div>
              <p>Procesando documento...</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Input para cargar imagen manualmente */}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </>
      )}
    </div>
  );
    };
    
  
export default DocumentScanner;

