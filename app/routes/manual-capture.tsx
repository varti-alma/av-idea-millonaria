import React, { useRef, useState } from "react";
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
import { useNavigate } from "@remix-run/react";

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

  const navigate = useNavigate();

  const captureData = () => {
    registrar ? alert("Guardando..") : alert("Validando...");
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
        <div>
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
