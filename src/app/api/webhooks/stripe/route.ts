import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const listingId = session.metadata?.listing_id;
        const userId = session.metadata?.user_id;

        if (listingId && userId) {
          // Record transaction
          await supabase.from('transactions').insert({
            listing_id: listingId,
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent as string,
            amount: session.amount_total || 49900,
            currency: session.currency || 'usd',
            status: 'succeeded',
            transaction_type: 'listing_fee',
            description: 'AIREA listing fee',
            metadata: {
              checkout_session_id: session.id,
            },
          });

          // Activate the listing
          await supabase
            .from('listings')
            .update({
              status: 'active',
              listed_at: new Date().toISOString(),
            })
            .eq('id', listingId);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        // Could send notification to user here
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        // Handle refund - possibly withdraw listing
        console.log('Charge refunded:', charge.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
