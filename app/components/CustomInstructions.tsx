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

interface DomainStyle {
  id: string;
  label: string;
  description: string;
}

const CustomInstructions = ({ switchStates, setSwitchStates, domainStyles }: { switchStates: { [k: string]: boolean; }, setSwitchStates: any, domainStyles: DomainStyle[]; }) => {
  const [openItem, setOpenItem] = useState('styles');

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

    setSwitchStates((prev: any) => ({ ...prev, [id]: checked }));
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className=" text-start">Prompt Settings</DialogTitle>
        <DialogDescription className="text-start">
          Have something specific in mind? Tweak the settings to get the perfect domain name.
        </DialogDescription>
      </DialogHeader>
      <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
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