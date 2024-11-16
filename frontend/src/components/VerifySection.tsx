import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

type Props = {};

function VerifySection({}: Props) {
  const { toast } = useToast();

  const [proof, setProof] = useState<string>("");
  const [status, setStatus] = useState<"init" | "verifying" | "verified">(
    "init"
  );
  const verify = async () => {
    try {
      console.log(proof);
      setStatus("verifying");
      toast({
        title: "Verifying proof...",
        description: "Please wait while we verify your proof...",
      });
      // TODO: verify proof
    } catch (error) {
      console.log(error);
      setStatus("init");
      toast({
        title: "Error verifying proof",
        description: "Please try again later",
      });
    }
  };

  const getStatus = () => {
    switch (status) {
      case "init":
        return "Verify your proof! 🔏";
      case "verifying":
        return "Verifying your proof... 🔄";
      case "verified":
        return "Proof verified! 🎉";
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Input
        value={proof}
        onChange={(e) => setProof(e.target.value)}
        type="text"
        placeholder="Enter your proof 👀"
      />
      <Button disabled={status === "verifying"} onClick={verify}>
        {getStatus()}
      </Button>
    </div>
  );
}

export default VerifySection;
