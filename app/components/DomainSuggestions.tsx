"use client";

import {
  Skeleton
} from "@/app/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import { ExternalLink } from "lucide-react";

interface DomainSuggestion {
  domain: string;
  justification: string;
  available?: boolean;
  price?: number;
}

interface DomainSuggestionProps {
  domainSuggestions: DomainSuggestion[];
  isLoadingDomainDetails: boolean;
  selectedDomain: DomainSuggestion;
  handleSelectedDomainClick: (domain: DomainSuggestion) => void;
}

const DomainSuggestions = ({
  domainSuggestions,
  isLoadingDomainDetails,
  selectedDomain,
  handleSelectedDomainClick
}: DomainSuggestionProps) => {


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{selectedDomain.domain}</CardTitle>
        </CardHeader>
        <CardContent className='max-h-[7em] overflow-hidden'>
          <CardDescription
            className=' max-h-[7em] pr-[1em]'
          >{selectedDomain.justification}</CardDescription>
        </CardContent>
        <CardFooter className='mt-4'>
          <div className='flex justify-between w-full items-center'>
            <div className='flex items-center p-1 w-1/2'>
              {isLoadingDomainDetails ? (
                <div className='flex w-full'>
                  <Skeleton className='rounded-sm h-4 w-4 mr-2 p-1' />
                  <Skeleton className='w-3/4 h-4' />
                </div>
              ) : (
                <>
                  <div className={`rounded-sm h-4 w-4 mr-2 p-1 ${(selectedDomain.available) ? `bg-green-500` : `bg-slate-400`}`}></div>
                  <p>{selectedDomain.available ? `Available ($${selectedDomain.price})` : 'Unavailable'}</p>
                </>
              )}
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
                onClick={() => handleSelectedDomainClick(item)}>
                {item.domain}
              </div>
            ))}
          </div>
        )}
      </div>

    </>
  );
};

export default DomainSuggestions;