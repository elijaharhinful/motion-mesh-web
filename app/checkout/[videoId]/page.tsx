'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useVideo } from '@/hooks/use-videos';
import { formatPrice } from '@/lib/utils';
import { useToastStore } from '@/stores/toast.store';
import { ShieldCheck, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '');

interface Props {
  params: Promise<{ videoId: string }>;
}

function CheckoutInner({ params }: Props) {
  const [videoId, setVideoId] = React.useState<string | null>(null);
  React.useEffect(() => { params.then((p) => setVideoId(p.videoId)); }, [params]);
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('clientSecret');

  const { data: video } = useVideo(videoId ?? '');

  if (!clientSecret || !videoId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">Invalid checkout session.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-white mb-2">Complete Purchase</h1>
      <p className="text-white/50 text-sm mb-8">Secure checkout powered by Stripe</p>

      {video && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white font-medium text-sm">{video.title}</p>
            <p className="text-white/40 text-xs capitalize">{video.category} · {video.difficulty}</p>
          </div>
          <span className="text-violet-400 font-bold">{formatPrice(video.priceCents)}</span>
        </div>
      )}

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#7c3aed',
              colorBackground: '#0d0d18',
              colorText: '#ffffff',
              borderRadius: '12px',
            },
          },
        }}
      >
        <CheckoutForm purchaseId={videoId} />
      </Elements>
    </div>
  );
}

export default function CheckoutPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-violet-400" size={36} /></div>}>
      <CheckoutInner params={params} />
    </Suspense>
  );
}


function CheckoutForm({ purchaseId }: { purchaseId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { addToast } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/generate/${purchaseId}`,
      },
      redirect: 'if_required',
    });

    if (error) {
      addToast({ type: 'error', title: 'Payment failed', message: error.message });
      setIsSubmitting(false);
    } else {
      router.push(`/generate/${purchaseId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 rounded-xl bg-white/3 border border-white/10">
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all"
      >
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
        {isSubmitting ? 'Processing…' : 'Pay Now'}
      </button>

      <p className="text-center text-white/30 text-xs flex items-center justify-center gap-1">
        <ShieldCheck size={12} />
        256-bit SSL · No card data touches our servers
      </p>
    </form>
  );
}
