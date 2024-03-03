"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface DomainSuggestion {
  domain: string;
  justification: string;
}

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

import { ExternalLink, Sparkles, Loader2 } from "lucide-react";

function DomainGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [domainPrompt, setDomainPrompt] = useState("");
  const [domainSuggestions, setDomainsuggestions] = useState<DomainSuggestion[]>([]);
  const [openItem, setOpenItem] = useState('generate');
  const [selectedDomain, setSelectedDomain] = useState<DomainSuggestion>(null);

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

  const updateDomains = async (domains: DomainSuggestion[]) => {
    const domainPromises = domains.map((domain: DomainSuggestion) =>
      getDomains(domain.domain)
    );

    const domainDetails = await Promise.all(domainPromises);

    return domains.map((domain: DomainSuggestion, index: number) => ({
      ...domain,
      available: domainDetails[index].available,
      price: domainDetails[index].available ? parsePrice(domainDetails[index].price) : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setOpenItem('suggestions');

    const message = await genDomains(domainPrompt);
    // const updatedDomains = await updateDomains(message.domains);
    setSelectedDomain(message.domains[0]);
    setDomainsuggestions(message.domains);
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
              <Card className='md:max-w-md'>
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
                    <Input
                      id='idea'
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
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedDomain.domain}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{selectedDomain.justification}</CardDescription>
                      </CardContent>
                      <CardFooter className=''>
                        <div className='flex justify-between w-full items-center'>
                          <div className='flex items-center p-1'>
                            <div className='rounded-sm h-4 w-4 mr-2 bg-green-500 p-1'></div>
                            <p>Available ($9.99)</p>
                          </div>
                          <a
                            href={`https://www.godaddy.com/en-uk/domainsearch/find?domainToCheck=${selectedDomain.domain}`}
                            target='_blank'
                            className='flex items-center text-teal-500 hover:text-teal-400 hover:underline hover:cursor-pointer'>
                            <ExternalLink className='p-1 ' />
                            See listing
                          </a>
                        </div>
                      </CardFooter>
                    </Card>
                    <div>
                      <h3 className='my-4 mx-1 text-zinc-600'>Click domain for details</h3>
                      {domainSuggestions.length > 0 && (
                        <div className="flex flex-wrap text-sm">
                          {domainSuggestions.map((item, index) => (
                            <div key={index}
                              className={`m-1 p-2 rounded whitespace-nowrap hover:cursor-pointer  ${(selectedDomain.domain === item.domain) ? 'bg-black   text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                              onClick={() => setSelectedDomain(item)}>
                              {item.domain}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </>
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