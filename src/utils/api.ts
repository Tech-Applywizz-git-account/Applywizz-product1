// src/utils/api.ts
const BACKEND = import.meta.env.VITE_BACKEND_URL;

export async function createOrder(amount: string, userEmail: string) {
  const res = await fetch(`${BACKEND}/paypal/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, userEmail })
  });
  if (!res.ok) {
    throw new Error(`Error creating order: ${res.statusText}`);
  }
  return res.json();
}

export async function captureOrder(orderId: string) {
  const res = await fetch(`${BACKEND}/paypal/capture-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
  });
   if (!res.ok) {
    throw new Error(`Error capturing order: ${res.statusText}`);
  }
  return res.json();
}
