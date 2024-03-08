"use client";

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

const CustomInstructions = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Prompt Settings</DialogTitle>
        <DialogDescription>
          Have something specific in mind?
        </DialogDescription>
      </DialogHeader>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Domain Styles</AccordionTrigger>
          <AccordionContent>
            <p>
              You will lose access to all of your data and any other resources
              you have with your account.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Custom Instructions</AccordionTrigger>
          <AccordionContent>
            <p>
              Your account will be permanently deleted and you will lose access
              to your domain and all of your data.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
export default CustomInstructions;