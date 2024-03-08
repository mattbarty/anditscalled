"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface DomainSuggestion {
  domain: string;
  justification: string;
  available?: boolean;
  price?: number;
}

import {
  Label
} from "@/app/components/ui/label";

import {
  Skeleton
} from "@/app/components/ui/skeleton";

import {
  Input
} from "@/app/components/ui/input";

import {
  Button
} from "@/app/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";



import { Sparkles, Loader2, Settings2 } from "lucide-react";
import CustomInstructions from './CustomInstructions';
import DomainSuggestions from './DomainSuggestions';

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

interface DomainStyle {
  id: string;
  label: string;
  description: string;
}

function DomainGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [domainPrompt, setDomainPrompt] = useState("");
  const [domainSuggestions, setDomainSuggestions] = useState<DomainSuggestion[]>([]);
  const [openItem, setOpenItem] = useState('generate');
  const [selectedDomain, setSelectedDomain] = useState<DomainSuggestion>({} as DomainSuggestion);
  const [isLoadingDomainDetails, setIsLoadingDomainDetails] = useState(true);
  const [switchStates, setSwitchStates] = useState(Object.fromEntries(domainStyles.map(style => [style.id, style.id === 'compound'])));

  const getDomains = async (domain: string) => {
    const response = await fetch("http://localhost:3000/api/getDomains", {
      method: "POST",
      headers: {
        "domain": domain,
      },
      body: JSON.stringify({ domain })
    }).then(response => response.json());

    return response;
  };

  const transformPrompt = (domainPrompt: string, switchStates: Record<string, boolean>) => {
    const styles = Object.entries(switchStates)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(", ");

    return `Please generate 10 domain names in the following styles: ${styles}. The domain name must be related to the following business description: ${domainPrompt}.`;
  };

  const genDomains = async (domainPrompt: string) => {

    const response = await fetch("http://localhost:3000/api/genDomains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: domainPrompt },
        ]
      })
    }).then(response => response.json());

    return JSON.parse(response.message);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setDomainPrompt("");
    setOpenItem('suggestions');

    const completePrompt = transformPrompt(domainPrompt, switchStates);
    console.log('completePrompt', completePrompt);
    const message = await genDomains(completePrompt);

    setSelectedDomain(message.domains[0]);
    await fetchDomainDetails(message.domains[0]);
    setDomainSuggestions(message.domains);
    setIsLoading(false);
  };

  const parsePrice = (price: number): number => {
    let priceStr = price.toString();
    priceStr = priceStr.replace(/0+$/, '');
    if (priceStr.length <= 2) {
      // Ensure there's padding for cases like `99` which should become `0.99`
      priceStr = priceStr.padStart(3, '0');
    }
    const position = priceStr.length - 2;
    priceStr = priceStr.substring(0, position) + '.' + priceStr.substring(position);
    return parseFloat(priceStr);
  };

  const fetchDomainDetails = async (domain: DomainSuggestion) => {
    console.log('fetching domain details');
    setIsLoadingDomainDetails(true);
    const domainDetails = await getDomains(domain.domain);
    const updatedDomain = {
      ...domain,
      available: domainDetails.available,
      price: domainDetails.available ? parsePrice(domainDetails.price) : undefined
    };

    const updatedDomains = domainSuggestions.map(d => d.domain === domain.domain ? updatedDomain : d);
    setDomainSuggestions(updatedDomains);
    setSelectedDomain(updatedDomain);
    setIsLoadingDomainDetails(false);
  };

  const handleSelectedDomainClick = async (domain: DomainSuggestion) => {
    setSelectedDomain(domain);
    if (domain && domain.available === undefined && domain.price === undefined) {
      await fetchDomainDetails(domain);
    };
  };

  const SkeletonCard = () => {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='w-3/4 h-8' />
        </CardHeader>
        <CardContent>
          <div className='grid gap-2'>
            <Skeleton className='w-full h-6' />
            <div className='flex gap-2'>
              <Skeleton className='w-3/4 h-6' />
              <Skeleton className='w-1/4 h-6' />
            </div>
            <div className='flex gap-2'>
              <Skeleton className='w-2/4 h-6' />
            </div>
          </div>
        </CardContent>
        <CardFooter className=''>
          <div className='flex justify-between w-full items-center'>
            <div className='flex items-center p-1 w-full'>
              <Skeleton className='rounded-sm h-4 w-4 mr-2 p-1' />
              <Skeleton className='w-1/2 h-4' />
            </div>
            <Skeleton className='w-1/2 h-4'></Skeleton>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const SkeletonDomainTags = () => {
    return (
      <div>
        <Skeleton className='w-1/4 h-4 my-4 mx-1'></Skeleton>
        <div className="flex flex-wrap text-sm">
          <Skeleton className='w-2/4 h-6 m-1 rounded whitespace-nowrap'></Skeleton>
          <Skeleton className='w-1/4 h-6 m-1 rounded whitespace-nowrap'></Skeleton>
          <Skeleton className='w-3/4 h-6 m-1 rounded whitespace-nowrap'></Skeleton>
          <Skeleton className='w-1/4 h-6 m-1 rounded whitespace-nowrap'></Skeleton>
          <Skeleton className='w-2/4 h-6 m-1 rounded whitespace-nowrap'></Skeleton>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col w-full justify-center'>
      <div className='flex flex-col w-full justify-center'>
        <Accordion type="single" value={openItem} onValueChange={setOpenItem}>
          <AccordionItem value="generate">
            <AccordionTrigger>Generate Domains</AccordionTrigger>
            <AccordionContent>
              <div className='flex justify-center relative w-full'>
                <Image src='/sproutlingdomains-hero.png' alt='domain generator' width={400} height={500} />
                <div className='absolute left-1/3 bottom-1/3 bg-teal-600 px-2 py-1 rounded-md opacity-85 animate-bounce font-semibold text-slate-200 duration-1000'>.com</div>
                <div className='absolute right-20 bottom-2/3 bg-teal-600 px-2 py-1 rounded-md opacity-85 animate-bounce font-semibold text-slate-200 duration-700'>.xyz</div>
                <div className='absolute left-20 top-1/3 bg-teal-600 px-2 py-1 rounded-md opacity-85 animate-bounce font-semibold text-slate-200 duration-800'>.io</div>
              </div>
              <Card className='md:max-w-md -translate-y-5'>
                <CardHeader>
                  <CardTitle>What's your idea?</CardTitle>
                  <CardDescription>Describe your idea, product, or service and we'll generate some domain ideas</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleSubmit(e)} className='grid gap-2'>
                    <div>
                      <h3 className='font-semibold text-base'></h3>
                      <p className='text-sm text-slate-600'></p>
                    </div>
                    <div className='flex gap-6 items-center'>
                      <div className='flex w-full justify-between'>
                        <Label htmlFor='prompt' className='p-1'>Prompt</Label>
                        <Dialog>
                          <DialogTrigger className='text-slate-500' disabled>
                            {/* DISABLED FOR NOW*/}
                            {/* <div className='flex'>
                              <Settings2 className='p-1 mr-1' />
                              settings
                            </div> */}
                          </DialogTrigger>
                          <DialogContent>
                            <CustomInstructions switchStates={switchStates} setSwitchStates={setSwitchStates} domainStyles={domainStyles as unknown as DomainStyle[]} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <Input
                      id='prompt'
                      onChange={(e) => setDomainPrompt(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" className='bg-black py-2 px-4 rounded-md text-zinc-200'
                      disabled={domainPrompt.length === 0 || isLoading}>Generate <Sparkles className='p-1 ml-1' /></Button>
                  </form>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
          {(domainSuggestions.length > 0 || isLoading) && (
            <AccordionItem value="suggestions">
              <AccordionTrigger>
                {
                  (isLoading) ?
                    <div className='flex'><Loader2 className=' animate-spin mr-2' />Generating Domains...</div>
                    : `Suggested Domains (${domainSuggestions.length})`
                }
              </AccordionTrigger>
              <AccordionContent>
                {isLoading ? (
                  <>
                    <SkeletonCard />
                    <SkeletonDomainTags />
                  </>
                ) : (
                  <DomainSuggestions domainSuggestions={domainSuggestions} isLoadingDomainDetails={isLoadingDomainDetails} selectedDomain={selectedDomain} handleSelectedDomainClick={handleSelectedDomainClick} />
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div >
  );
};

export default DomainGenerator;