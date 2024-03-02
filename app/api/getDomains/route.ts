import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  const {domain} = await request.json()

  // Check if domain is provided
  // If not, return error message
  if (!domain) {
    return NextResponse.json({
      message: "No domain provided"
    });
  }

  // Try to fetch domain
  // If error, return error message
  // If success, return domain data
  try {
    const res = await fetch(`https://api.godaddy.com/v1/domains/available?domain=${domain}`, {
      headers: {
        'authorization': `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`
      }});
    const data = await res.json();

    return NextResponse.json(data);
  }
  catch (error) {
    return NextResponse.json({
      message: "Error fetching domain"
    });
  }
}