"use client";

import React, { useState } from 'react';

function DomainGenerator() {
  const [domain, setDomain] = useState("");
  const [response, setResponse] = useState(null);

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
    setResponse(response.price);
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
          { role: "user", content: "I want to buy a domain" },
        ]
      })
    }).then(response => response.json());

    setResponse(response.message);
  };


  return (
    <div>
      <form onSubmit={(e) => getDomains(e)} className='flex flex-col'>
        <label>
          prompt:
          <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </label>
        <button type="submit">Check</button>
      </form>

      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DomainGenerator;