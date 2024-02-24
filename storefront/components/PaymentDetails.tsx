import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import React from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { medusaClient } from '@/lib/config';

import { useRouter } from 'next/router';
import { useStore } from '@/lib/context/store-context';

interface PaymentDetailsProps {
  cardAdded: boolean;
  setCardAdded: React.Dispatch<React.SetStateAction<boolean>>;
  clientSecret: string;
  cartID: string;
  step: number;
  setOptions: React.Dispatch<React.SetStateAction<{}>>;
  setClientSecret: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  cardAdded,
  setCardAdded,
  clientSecret,
  setClientSecret,
  cartID,
  step,
  setOptions,
}: PaymentDetailsProps) => {
  const router = useRouter();
  const { resetCart, cart } = useStore();
  const [selectedPayment, setSelectedPayment] = React.useState<
    string | undefined
  >();
  const stripe = useStripe();
  const elements = useElements();

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('NO STRIPE NO ELEMENTS');
      return;
    }
    const { error: submitError } = await elements.submit();

    if (submitError) {
      console.log('submiterror', submitError);
      return;
    }

    const response = await stripe.confirmPayment({
      clientSecret,
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: 'http://localhost:3000',
        payment_method_data: {
          billing_details: {
            address: {
              city: cart?.billing_address.city || '',
              line1: cart?.billing_address.address_1 || '',
              country: cart?.billing_address.country_code || '',
              postal_code: cart?.billing_address.postal_code || '',
            },
            email: cart?.email,
            name:
              cart?.billing_address.first_name +
                '' +
                cart?.billing_address.last_name || '',
          },
        },
      },
    });
    console.log(response);
    if (response.paymentIntent) {
      console.log('uslo');
      const { data, type } = await medusaClient.carts.complete(cartID);

      if (type === 'order') {
        router
          .push({
            pathname: `/order-confirmation`,
            query: { id: data.id },
          })
          .then(() => resetCart());
      }
    }
  }
  async function handleCashPayment() {
    const { data, type } = await medusaClient.carts.complete(cartID);
    if (type === 'order') {
      router
        .push({
          pathname: `/order-confirmation`,
          query: { id: data.id },
        })
        .then(() => resetCart());
    }
  }

  const handleSession = async (value: string) => {
    setSelectedPayment(value);
    const res = await medusaClient.carts.setPaymentSession(cart!.id, {
      provider_id: value,
    });
    if (value === 'stripe') {
      const secret = res.cart?.payment_session?.data.client_secret as string;
      console.log(secret);
      setClientSecret(secret);
      setOptions({
        clientSecret: clientSecret,
        mode: 'payment',
        currency: cart?.region.currency_code,
        amount: cart?.total || 0,
        captureMethod: 'manual',
      });
    }
  };
  return (
    <ul className="[&>li:last-child]:mb-0 [&>li]:mb-2">
      <li>
        <input
          type="radio"
          name="paymentMethod"
          id="manual"
          className="peer hidden"
          value="manual"
          onChange={() => handleSession('manual')}
        />
        <label
          htmlFor="manual"
          className="group peer flex cursor-pointer justify-between rounded-sm rounded-b-none border px-4 py-4 transition-all peer-hover:border-primary"
        >
          <div className="flex items-center">
            {selectedPayment === 'manual' ? (
              <span className="relative block h-4 w-4 rounded-full border border-gray-900 bg-gray-900 transition-all before:absolute before:left-[0.3125rem] before:top-[0.3125rem] before:h-1 before:w-1 before:rounded-full before:bg-gray-10 before:content-[''] group-hover:border-primary group-hover:bg-primary" />
            ) : (
              <span className="relative block h-4 w-4 rounded-full border border-gray-900 transition-all group-hover:border-primary" />
            )}{' '}
            <p className="ml-3">Cash</p>
          </div>

          <Image
            src={'/images/content/cash.png'}
            height={20}
            width={28}
            alt="Cash"
          />
        </label>
      </li>
      <li>
        <input
          type="radio"
          name="paymentMethod"
          id="stripe"
          className="peer hidden"
          value="stripe"
          onChange={() => handleSession('stripe')}
        />
        <label
          htmlFor="stripe"
          className="group flex cursor-pointer justify-between rounded-sm border border px-4 py-4 transition-all hover:!border-primary"
        >
          <div className="flex items-center">
            {selectedPayment === 'stripe' ? (
              <span className="relative block h-4 w-4 rounded-full border border-gray-900 bg-gray-900 transition-all before:absolute before:left-[0.3125rem] before:top-[0.3125rem] before:h-1 before:w-1 before:rounded-full before:bg-gray-10 before:content-[''] group-hover:border-primary group-hover:bg-primary" />
            ) : (
              <span className="relative block h-4 w-4 rounded-full border border-gray-900 transition-all group-hover:border-primary" />
            )}

            <p className="ml-3">Card</p>
          </div>

          <Image
            src={'/images/content/mastercard.png'}
            height={20}
            width={28}
            alt="mastercard"
          />
        </label>

        {selectedPayment === 'stripe' && (
          <div className="border border-t-0 border-gray-200 p-4 peer-hover:border-primary">
            <form onSubmit={handlePayment}>
              <PaymentElement />
              <Button
                size="lg"
                className="mt-10 w-full"
                isDisabled={step !== 4}
                type="submit"
              >
                Place an order
              </Button>
            </form>
          </div>
        )}
      </li>
      {selectedPayment === 'manual' && (
        <Button
          size="lg"
          className="mt-10 w-full"
          isDisabled={step !== 4}
          onPress={handleCashPayment}
        >
          Place an order
        </Button>
      )}
    </ul>
  );
};

export default PaymentDetails;
