import type { MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
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
  const navigate = useNavigate();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <img src="logo_audienceview.webp" alt="AudienceView" width="300" />
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
