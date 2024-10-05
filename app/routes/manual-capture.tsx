import type { MetaFunction } from "@remix-run/node";
import { Button } from "app/components/ui/button";
import { Input } from "app/components/ui/input";
import { Label } from "app/components/ui/label";
import { AlertDialog } from "app/components/ui/alert-dialog";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
const captureFace = () => {
  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    alert("Let's get this party started");
  }
  alert("capture face");
};

const captureCI = () => {
  alert("capture CI");
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <img src="logo_audienceview.webp" alt="AudienceView" width="300" />
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Start validation
          </h1>
        </header>
        <Label> hola </Label>
        <Input />
        <AlertDialog />
        <Button onClick={captureFace}>Capture</Button>
      </div>
    </div>
  );
}
