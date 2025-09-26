// src/components/PayPalButton.tsx
import React, { useEffect, useRef } from 'react';
import { createOrder, captureOrder } from '../utils/api';

declare global { interface Window { paypal: any; } }

type Props = {
  amount: string;
  userEmail: string;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
};

export default function PayPalButton({ amount, userEmail, onSuccess, onError }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if ((window as any).paypal) return render();
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX}&currency=USD`;
      script.async = true;
      script.onload = () => render();
      document.body.appendChild(script);
    };

    const render = () => {
      if (!ref.current) return;
      (window as any).paypal.Buttons({
        createOrder: async () => {
          const order = await createOrder(amount, userEmail);
          return order.id;
        },
        onApprove: async (data: any, actions: any) => {
          try {
            // Option: capture server-side (recommended)
            const capture = await captureOrder(data.orderID);
            onSuccess && onSuccess(capture);
          } catch (err) {
            onError && onError(err);
          }
        },
        onError: (err: any) => {
          onError && onError(err);
        }
      }).render(ref.current);
    };

    load();
  }, [amount, userEmail]);

  return <div ref={ref} />;
}
