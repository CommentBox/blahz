import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  // Send the file to the Python backend for processing
  const backendEndpoint = "http://0.0.0.0:5000/search"; // Backend endpoint

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  try {
    await delay(2000); // Wait for 2 seconds
    const response = await fetch(backendEndpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Search failed" }, { status: response.status });
    }

    const searchResults = await response.json();
    return NextResponse.json(searchResults);

  } catch (error) {
    console.error("Error communicating with backend:", error);
    return NextResponse.json({ error: "Failed to communicate with backend" }, { status: 500 });
  }
}
