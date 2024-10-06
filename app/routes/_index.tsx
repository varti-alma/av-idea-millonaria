import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { Button } from "app/components/ui/button";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";
import { useEffect, useRef, useState } from "react";
import CameraComponent from "~/components/CameraComponent";
import ManualCapture from "./manual-capture";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [registrar, setRegistrar] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [validation, setValidation] = useState(true);

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-3 mt-10">
          <a rel="stylesheet" href="/">
            <img src="logo_audienceview.webp" alt="AudienceView" width="300" />
          </a>
          <p>Hackaton Santiago 2024</p>
          {!optionSelected && (
            <>
            <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
              ¿Qué deseas hacer?
            </h1>
            </>
          )}
        </header>
        {optionSelected ? (
          registrar ? (
            <>
              <ManualCapture/>

              <CameraComponent registrar={registrar} />
              <Button
                variant="secondary"
                onClick={() => {
                  setOptionSelected(false);
                }}
              >
                Volver
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setOptionSelected(false);
                }}
              >
                Volver
              </Button>
            </>
          )
        ) : (
          <>
            <Button
              onClick={() => {
                setRegistrar(false);
                setOptionSelected(true);
                navigate("/validate");
              }}
            >
              Validar ticket
            </Button>
            <Button
              onClick={() => {
                setRegistrar(true);
                setOptionSelected(true);
              }}
            >
              Registrar ticket
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
