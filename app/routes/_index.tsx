import type { MetaFunction } from "@remix-run/node";
import { Button } from "app/components/ui/button";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";
import { useEffect, useRef, useState } from "react";
import CameraComponent from "~/components/CameraComponent";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [registrar, setRegistrar] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <img src="logo_audienceview.webp" alt="AudienceView" width="300" />
          {!optionSelected && (
            <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
              ¿Qué deseas hacer?
            </h1>
          )}
        </header>
        {optionSelected ? (
          registrar ? (
            <>
              <CameraComponent registrar={registrar} />
              <Button
                onClick={() => {
                  setOptionSelected(false);
                }}
              >
                Volver
              </Button>
            </>
          ) : (
            <>
              <p>validación de persona</p>
              <Button
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
