//npm install express dotenv multer @aws-sdk/client-s3 @aws-sdk/client-rekognition body-parser cors
//require('dotenv').config();
import 'dotenv/config';
//const express = require('express');
import express from 'express';
//const multer = require('multer');
import multer from 'multer';
//const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
//const { RekognitionClient, IndexFacesCommand } = require('@aws-sdk/client-rekognition');
import { RekognitionClient, IndexFacesCommand } from '@aws-sdk/client-rekognition';
//const cors = require('cors');
import cors from 'cors';
//const fs = require('fs');
import fs from 'fs';
//const path = require('path');
import path from 'path';

const app = express();
// Middleware para analizar cuerpos JSON
app.use(express.json({ limit: '10mb' })); // Asegúrate de ajustar el límite según sea necesario
app.use(cors());

const upload = multer({ dest: 'uploads/' }); // Carpeta temporal para subir los archivos

// Configura el cliente de S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Función para convertir Base64 a Buffer
const base64ToBuffer = (base64String) => {
  // Remover el prefijo de tipo MIME si está presente (ej. "data:image/png;base64,")
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64Data, "base64");
};

// Ruta para subir una imagen en formato Base64 a S3
app.post('/upload', async (req, res) => {
  try {
    //console.log('Body:', req.body);
    const { image, name } = req.body;
    // Validar que el key fue enviado
    if (!name) {
      return res.status(400).json({ error: 'El parámetro "nombre" es requerido' });
    }
    console.log('Nombre:', name);
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    // Convertir Base64 a Buffer
    const fileStream = Buffer.from(base64Data, 'base64');

      const fechaNow=Date.now();
    // Configura los parámetros para subir a S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_S3, // Reemplaza con el nombre de tu bucket
      Key: `${name}_${fechaNow}_${name}`, // Nombre del archivo en S3
      Body: fileStream,
      ContentEncoding: 'base64',
      ContentType: 'image/png' // Establece el tipo de contenido
    };

    // Subir el archivo a S3
    const putCommand  = new PutObjectCommand(uploadParams);
    const data = await s3Client.send(putCommand);

    // Elimina el archivo temporal después de subirlo a S3
    //fs.unlinkSync(file.path);

    // Después de subir el archivo a S3, lo indexamos en Rekognition
    const paramsRekognition = {
      CollectionId: process.env.AWS_COLLECTION_ID,
      Image: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET_S3,  // Cambia esto por tu bucket de S3
          Name: `${name}_${fechaNow}_${name}`,
        },
      },
      DetectionAttributes: ['ALL'],  // Puedes agregar atributos faciales como edad, emociones, etc.
      ExternalImageId: name,  // Identificador único para la imagen (usamos el key de S3)
    };

    const indexFacesCommand = new IndexFacesCommand(paramsRekognition);
    const rekognitionResponse = await rekognitionClient.send(indexFacesCommand);

    // Responder con la información de la imagen indexada
    res.status(200).json({
      status: 200,
      message: 'Archivo subido y agregado a la colección de Rekognition exitosamente',
      rekognitionResponse: rekognitionResponse,
    });
  } catch (error) {
    console.error('Error al subir la imagen: ', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Ruta para subir una imagen tipo file a S3
app.post('/uploadFile', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const { name } = req.body;

    // Validar que el key fue enviado
    if (!name) {
      return res.status(400).json({ error: 'El parámetro "nombre" es requerido' });
    }
    console.log('Nombre:', name);

    // Lee el archivo desde el sistema de archivos
    const fileStream = fs.createReadStream(file.path);
    // Obtener la extensión del archivo
    //const fileExtension = path.extname(file.originalname);

      const fechaNow=Date.now();
    // Configura los parámetros para subir a S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_S3, // Reemplaza con el nombre de tu bucket
      Key: `${name}_${fechaNow}_${file.originalname}`, // Nombre del archivo en S3
      Body: fileStream,
      ContentType: file.mimetype, // Establece el tipo de contenido
    };

    // Subir el archivo a S3
    const putCommand  = new PutObjectCommand(uploadParams);
    const data = await s3Client.send(putCommand);

    // Elimina el archivo temporal después de subirlo a S3
    fs.unlinkSync(file.path);

    // Después de subir el archivo a S3, lo indexamos en Rekognition
    const paramsRekognition = {
      CollectionId: process.env.AWS_COLLECTION_ID,
      Image: {
        S3Object: {
          Bucket: process.env.AWS_BUCKET_S3,  // Cambia esto por tu bucket de S3
          Name: `${name}_${fechaNow}_${file.originalname}`,
        },
      },
      DetectionAttributes: ['ALL'],  // Puedes agregar atributos faciales como edad, emociones, etc.
      ExternalImageId: name,  // Identificador único para la imagen (usamos el key de S3)
    };

    const indexFacesCommand = new IndexFacesCommand(paramsRekognition);
    const rekognitionResponse = await rekognitionClient.send(indexFacesCommand);

    // Responder con la información de la imagen indexada
    res.status(200).json({
      message: 'Archivo subido y agregado a la colección de Rekognition exitosamente',
      rekognitionResponse: rekognitionResponse,
    });
  } catch (error) {
    console.error('Error al subir la imagen: ', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Iniciar el servidor
app.listen(process.env.PORT_BACKEND, () => {
  console.log('Servidor escuchando en el puerto ', process.env.PORT_BACKEND);
});