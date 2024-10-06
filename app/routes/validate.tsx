import { CalendarIcon } from "@radix-ui/react-icons";
import React from "react";
import CameraComponent from "~/components/CameraComponent";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import { es } from "date-fns/locale";
import { useNavigate } from "@remix-run/react";
import ManualCapture from "./manual-capture";

const Validate = () => {
  const [event, setEvent] = React.useState<string>();
  const [idNumber, setIdNumber] = React.useState<string>();
  const [date, setDate] = React.useState<Date>();

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-3 mt-10">
          <a rel="stylesheet" href="/">
            <img src="logo_audienceview.webp" alt="AudienceView" width="300" />
          </a>
          <p>Hackaton Santiago 2024</p>
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Validación
          </h1>
        </header>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="event">Evento</Label>
          <Input
            type="text"
            id="event"
            placeholder="Ingresa el evento"
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          {/* <Label htmlFor="id-number">Identificación</Label>
          <Input
            type="text"
            id="id-number"
            placeholder="Ingresa tu RUT"
            onChange={(e) => setIdNumber(e.target.value)}
          /> */}
          <ManualCapture/>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
        <CameraComponent registrar={false} />
        <Button variant="outline" onClick={() => navigate("/")}>
          Volver
        </Button>
      </div>
    </div>
  );
};

export default Validate;
