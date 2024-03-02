"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ResultsTable from './ResultsTable';

interface DomainSuggestion {
  domain: string;
  justification: string;
}

import {
  Textarea
} from "@/app/components/ui/textarea";

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
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

function DomainGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [domainPrompt, setDomainPrompt] = useState("");
  const [domainSuggestions, setDomainsuggestions] = useState<DomainSuggestion[]>([]);

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

    const message = await genDomains(domainPrompt);
    const updatedDomains = await updateDomains(message.domains);

    setDomainsuggestions(updatedDomains);
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

  const resetForm = () => {
    setDomainPrompt("");
    setDomainsuggestions([]);
  };

  return (
    <div className='relative w-full grow'>
      <h1
        className="text-xl font-bold w-full"
        onClick={() => { if (!isLoading) resetForm(); }}>
        anditscalled<span className='text-xl'>.com</span>
      </h1>
      {(domainSuggestions.length === 0) ? (
        <>
          <Image
            src="/hero-art.png"
            alt="domainiac banner"
            className={`w-full h-auto rounded-lg mb-4`}
            width={0}
            height={0}
            sizes="100vw"
            unoptimized />
          <Card className='-translate-y-10'>
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
                  placeholder='a trumpet for cats...'
                  onChange={(e) => setDomainPrompt(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" className='bg-black py-2 px-4 rounded-md text-zinc-200'
                  disabled={domainPrompt.length === 0 || isLoading}>Generate</Button>
              </form>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <ResultsTable domainSuggestions={domainSuggestions} />
        </>)
      }
    </div >
  );
};

export default DomainGenerator;