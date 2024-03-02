"use client";

import React, { useEffect, useState } from 'react';

interface domainSuggestions {
  domain: string;
  justification: string;
}

function DomainGenerator() {
  const [domain, setDomain] = useState("");
  const [domainPrompt, setDomainPrompt] = useState("I want to buy a domain");
  const [domainSuggestions, setDomainsuggestions] = useState<domainSuggestions[]>([]);

  const getDomains = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/getDomains", {
      method: "POST",
      headers: {
        "domain": domain,
      },
      body: JSON.stringify({ domain })
    }).then(response => response.json());

    console.log(response);
    setDomainsuggestions(response.price);
  };

  const genDomains = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    const message = JSON.parse(response.message);

    const domainPromises = message.domains.map((domain: domainSuggestions) =>
      fetch("http://localhost:3000/api/getDomains", {
        method: "POST",
        headers: {
          "domain": domain.domain,
        },
        body: JSON.stringify({ domain: domain.domain })
      }).then(response => response.json())
    );

    const domainDetails = await Promise.all(domainPromises);

    const updatedDomains = message.domains.map((domain: domainSuggestions, index: number) => ({
      ...domain,
      available: domainDetails[index].available,
      price: parsePrice(domainDetails[index].price)
    }));

    setDomainsuggestions(updatedDomains);
  };

  function parsePrice(price: number): number {
    let priceStr = price.toString();
    priceStr = priceStr.replace(/0+$/, '');
    if (priceStr.length <= 2) {
      // Ensure there's padding for cases like `99` which should become `0.99`
      priceStr = priceStr.padStart(3, '0');
    }
    const position = priceStr.length - 2;
    priceStr = priceStr.substring(0, position) + '.' + priceStr.substring(position);
    return parseFloat(priceStr);
  }

  return (
    <div>
      <form onSubmit={(e) => genDomains(e)} className='flex flex-col'>
        <label>
          prompt:
          <input type="text" onChange={(e) => setDomainPrompt(e.target.value)} />
        </label>
        <button type="submit">Check</button>
      </form>


      {(domainSuggestions.length > 0) && (
        <div>
          <h2>Response:</h2>
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                {/* <th>Justification</th> */}
                <th>Available</th>
                <th>Price ($USD)</th>
              </tr>
            </thead>
            <tbody>
              {domainSuggestions.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{item.domain}</td>
                  {/* <td>{item.justification}</td> */}
                  <td>{item.available ? 'Yes' : 'No'}</td>
                  <td>${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DomainGenerator;