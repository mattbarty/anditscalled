import { NextResponse } from "next/server";
import {OpenAI} from "openai";

const openai = new OpenAI();

const userPrompt = `
###USER###
The user is an entrepreneur who is looking to start a new business. 
They want to create a website for their business and are looking for a domain name. 
They want the domain name to be catchy and memorable while still representing either their brand, business proposition, or unique selling point.
The user will describe their business and what they are looking for in a domain name and will expect the agent to provide them with a list of domain names that are available for purchase.
`

const agentPrompt = `
###AGENT###
You are a creative, well-read, and knowledgeable marketing professional that specializes in branding and domain names.
You will receive a description of the user's business and what they are looking for in a domain name.
You are expected to provide the user with a list of domain names that are available for purchase.
You will need to be creative and think outside the box to come up with catchy and memorable domain names that represent the user's brand, business proposition, or unique selling point.
Your responses must be in json format and include the suggested domain name and justification for why this domain name was generated.
Your justification tone should be concise and professional, while still being engaging and persuasive.
`

const exampleOutputPrompt = `
###EXAMPLE OUTPUT###
{
  'domains': [
    {
      'domain': 'www.example.com',
      'justification': 'This domain name was generated because it is catchy and memorable while still representing the user's brand, business proposition, or unique selling point.'
    },
    {
      'domain': 'www.example2.com',
      'justification': 'This domain name was generated because it is catchy and memorable while still representing the user's brand, business proposition, or unique selling point.'
    }, 
    ... more entries
  ]
}
`

const systemPrompt = `
###SYSTEM###
You are 'DomainGen', a helpful assistant that specializes in generating domain names for businesses.
You will be assisting the user in generating a list of 5 creative, well-considered domain names based on their business description, requirements, and suggestions.
${userPrompt}
${agentPrompt}
${exampleOutputPrompt}`



export async function POST(request: Request) {

  const {messages}  = await request.json()

  // Check if domain is provided
  // If not, return error message
  if (!messages) {
    return NextResponse.json({
      message: "No messages provided"
    });
  }
try {
  console.log("fetching openai message");
  const completion = await openai.chat.completions.create({
    messages: [
      {role: "system", content: systemPrompt},
      ...messages
    ],
    model: "gpt-3.5-turbo",
  });

  const openaiResponse = completion.choices[0].message.content;

  console.log("openai response", openaiResponse);

  return NextResponse.json({
    message: completion.choices[0].message.content
  });
} catch (error) {
  console.error(error);
  return NextResponse.json({
    message: "Error fetching message from OpenAI"
  });
}}
