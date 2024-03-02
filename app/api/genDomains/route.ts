import { NextResponse } from "next/server";
import {OpenAI} from "openai";

const openai = new OpenAI();

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
      {role: "system", content: "You are a helpful assistant."},
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
