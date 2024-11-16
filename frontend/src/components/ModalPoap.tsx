import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
};

function ModalPoap({ title, description, imageUrl, children }: Props) {
  const [status, setStatus] = useState<"init" | "generating" | "finished">(
    "init"
  );
  const [proof, setProof] = useState<string>("");
  const { toast } = useToast();
  const onClick = () => {
    try {
      console.log("clicked");
      setStatus("generating");
      toast({
        title: "Generating proof...",
        description: "Please wait while we generate your proof...",
      });
    } catch (error) {
      console.log("error", error);
      setStatus("init");
      toast({
        title: "Error generating proof",
        description: "Please try again later",
      });
    }
  };
  const getStatus = () => {
    switch (status) {
      case "init":
        return "Generate proof! ✍️";
      case "generating":
        return "Generating proof... 🔄";
      case "finished":
        return "Proof generated! 🎉";
    }
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate proof of POAP</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4">
          <p>{title}</p>
          <div
            key={imageUrl}
            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:scale-110"
          >
            <img
              src={`${imageUrl}?size=small`}
              alt={title}
              className="w-full h-full object-cover"
              title={title}
            />
          </div>{" "}
          <Button
            onClick={status === "init" ? onClick : () => copyToClipboard(proof)}
            disabled={status === "generating"}
            className="w-full"
          >
            {getStatus()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalPoap;
