"use client";

import { useEffect, useState } from "react";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";

import {
  Textarea
} from "@/app/components/ui/textarea";

import { Label } from "@/app/components/ui/label";

import { Switch } from "@/app/components/ui/switch";

import { useToast } from "@/app/components/ui/use-toast";

import { Input } from "@/app/components/ui/input";

import { Button } from "@/app/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface DomainStyleDescription {
  readonly [key: string]: string;
}

const domainStyleDescriptionDict: DomainStyleDescription = {
  'compound': 'Compound: Combines two relevant words to create a unique domain name.',
  'pun': 'Pun: Domains that play on words, offering a fun and catchy twist.',
  'descriptive': 'Descriptive: Clearly describes the business, providing immediate insight.',
  'abstract': 'Abstract: Memorable and brandable names that don’t necessarily relate directly to the business.'
};




interface CustomPromptSettingsProps {
  customInstructions: string;
  setCustomInstructions: (customInstructions: string) => void;
  domainStyle: string;
  setDomainStyle: (domainStyle: string) => void;
}

const CustomPromptSettings = ({ customInstructions, setCustomInstructions, domainStyle, setDomainStyle }: CustomPromptSettingsProps) => {
  const [tempDomainStyle, setTempDomainStyle] = useState(domainStyle);
  const [tempCustomInstructions, setTempCustomInstructions] = useState(customInstructions);

  const { toast } = useToast();

  const handleUpdate = () => {
    setDomainStyle(tempDomainStyle);
    setCustomInstructions(tempCustomInstructions);

    toast({
      title: "Settings Updated",
      description: "Your prompt settings have been updated.",
      duration: 2000,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className=" text-start">Prompt Settings</DialogTitle>
        <DialogDescription className="text-start">
          Have something specific in mind? Tweak the settings to get the perfect domain name.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2 mt-4">
        <Label>Domain Style</Label>
        <Select defaultValue="compound" onValueChange={setTempDomainStyle} value={tempDomainStyle}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel>Domain Style</SelectLabel>
              <SelectItem value="compound" onSelect={() => setTempDomainStyle('compound')}>Compound</SelectItem>
              <SelectItem value="pun" onSelect={() => setTempDomainStyle('pun')}>Pun</SelectItem>
              <SelectItem value="descriptive" onSelect={() => setTempDomainStyle('descriptive')}>Descriptive</SelectItem>
              <SelectItem value="abstract" onSelect={() => setTempDomainStyle('abstract')}>Abstract</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select >

        <p className="text-xs text-slate-500">
          {domainStyleDescriptionDict[tempDomainStyle]}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <Label>Custom Instructions</Label>
        <Textarea
          value={tempCustomInstructions}
          onChange={(e) => setTempCustomInstructions(e.target.value)}
          placeholder="e.g. domain must contain the word 'apple'"
          className="resize-none"
        />
        <p className="text-xs text-slate-500 pr-4">
          Specific instructions for the AI to follow when generating domain names
        </p>
      </div>

      <Button
        onClick={handleUpdate}
        disabled={tempDomainStyle === domainStyle && tempCustomInstructions === customInstructions}>
        Update
      </Button>
    </>
  );
};
export default CustomPromptSettings;