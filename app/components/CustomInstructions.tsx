"use client";

import { useState } from "react";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

import { Label } from "@/app/components/ui/label";

import { Switch } from "@/app/components/ui/switch";

import { useToast } from "@/app/components/ui/use-toast";

const domainStyles = [
  {
    id: "compound",
    label: "Compound (default)",
    description: "Combines two relevant words to create a unique domain name."
  },
  {
    id: "pun",
    label: "Pun",
    description: "Domains that play on words, offering a fun and catchy twist."
  },
  {
    id: "descriptive",
    label: "Descriptive",
    description: "Clearly describes the business, providing immediate insight."
  },
  {
    id: "abstract",
    label: "Abstract",
    description: "Memorable and brandable names that don’t necessarily relate directly to the business."
  },
] as const;

const CustomInstructions = () => {
  const [switchStates, setSwitchStates] = useState(
    Object.fromEntries(domainStyles.map(style => [style.id, style.id === 'compound']))
  );

  const { toast } = useToast();

  const handleSwitchChange = (id: string, checked: boolean) => {
    if (!checked && Object.values(switchStates).filter(value => value).length === 1 && switchStates[id]) {
      toast({
        description: "You must have at least one domain style selected.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setSwitchStates(prev => ({ ...prev, [id]: checked }));
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle className=" text-start">Prompt Settings</DialogTitle>
        <DialogDescription className="text-start">
          Have something specific in mind? Tweak the settings to get the perfect domain name.
        </DialogDescription>
      </DialogHeader>
      <Accordion type="single" collapsible>
        <AccordionItem value="styles">
          <AccordionTrigger>
            Domain Styles
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              {domainStyles.map((style) => (
                <div key={style.id} className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label>{style.label}</Label>
                    <p className="text-xs text-slate-500 pr-4">
                      {style.description}
                    </p>
                  </div>
                  <Switch
                    checked={switchStates[style.id]}
                    onCheckedChange={(checked) => handleSwitchChange(style.id, checked)}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="instructions">
          <AccordionTrigger>Custom Instructions</AccordionTrigger>
          <AccordionContent>
            <p>hello</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
export default CustomInstructions;