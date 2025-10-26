// frontend/lib/api.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ✅ Generic API fetcher for all endpoints
export async function fetchFromAPI(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// ✅ Simple check if backend is running
export async function getServerStatus() {
  const res = await fetch(`${BASE_URL}/`);
  return res.json();
}

// Simple check if AI chatbot is functioning
export async function chatWithAI(message) {
  const res = await fetch(`${BASE_URL}/chat?message=${encodeURIComponent(message)}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
