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
The domain must be clever, catchy, and memorable - Ideally it should be a pun or play on words that is relevant to the user's business.
You MUST avoid generic names, or boring strings of words.
Your response must not include www. as this will be added automatically.
Your justification tone should be concise and professional, while still being engaging and persuasive.
Your responses must be in VALID json format and include the suggested domain name and justification for why this domain name was generated.
`

const domainStylePrompt = `
The user may also provide a list of domain styles that they are interested in.
This can include descriptive, abstract, compound, acronym, or keyword-rich domain styles.

###DOMAIN STYLES###
Descriptive: Domains that clearly describe the business or service, providing immediate insight into what the website offers (e.g., FastFoodDelivery.com).

Abstract: Names that don't necessarily relate directly to the business or service but are memorable and brandable (e.g., Zillow.com).

Compound: Combining two relevant words to create a unique and memorable domain name (e.g., SnapChat.com).

Acronym: Using initials or abbreviations to make the domain shorter and easier to remember (e.g., IBM.com for International Business Machines).

Keyword-rich: Domains that contain keywords relevant to the business, which can potentially help with SEO (e.g., BestCoffeeBeans.com).
`

const exampleOutputPrompt = `
###EXAMPLE OUTPUT###
{
  "domains": [
    "example.com1",
    "example.com2",
    "example.com3",
    ...other domain names
  ]
}
`

const systemPrompt = `
###SYSTEM###
You are 'DomainGen', a helpful assistant that specializes in generating domain names for businesses.
You will be assisting the user in generating a list of creative, well-considered domain names based on their business description, requirements, and suggestions.
${userPrompt}
${agentPrompt}
${domainStylePrompt}
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
