import React, { useRef, useState } from "react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
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
import { redirect, useNavigate } from "@remix-run/react";
import { createUserLoader } from "~/db/request";
import { json } from "stream/consumers";
import { db } from "~/db/config.server";
import { users } from "~/db/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log(formData[0]);
  try {
    const newUser = {
      id: "user-" + new Date(),
      document_number: formData[0]?.value ?? "No data",
      name: "string",
      lastName: "string",
      surName: "string",
      birthDate: new Date(),
      gender: "string",
      phone: "string",
      register_date: new Date(),
      country: "string",
      email: "string",
      password: "string",
      serial_number: formData[1]?.value ?? "No data",
    };
    await db.insert(users).values(newUser);

    return JSON.stringify({ message: "User created successfully" });
  } catch (error) {
    console.error("error", error);
  }
};

export default function Index() {
  const [validation, setValidation] = useState(true);
  const [registrar, setRegistrar] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <img src="logo_audienceview.webp" alt="AudienceView" width="300" />
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Ingreso del formulario para meter info del carnet
          </h1>
        </header>
        <form method="post" action="/manual-capture">
          <div>
            <Label> RUT / Pasaporte</Label>
            <Input
              value={documentId}
              name="documentId"
              placeholder="Ingrese su rut sin puntos ni guión"
              onChange={(e) => {
                setDocumentId(e.target.value);
              }}
            />
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
          <Button onClick={captureData} className="ml-5" type="submit">
            Guardar
          </Button>
        </form>
        <div>
          <Button
            variant="secondary"
            className="mt-5"
            onClick={() => navigate(-1)}
          >
            Volver
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
