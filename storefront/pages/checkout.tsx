import * as React from 'react';
import Link from 'next/link';
import type { NextPageWithLayout } from '@/pages/_app';
import classNames from '@/utils/classNames';
import { useStore } from '@/lib/context/store-context';
import { useAccount } from '@/lib/context/account-context';
import { medusaClient } from '@/lib/config';
import { AddressPayload, Cart, Country, Customer } from '@medusajs/medusa';
import { useCart } from 'medusa-react';
import OrderSummary from '@/components/OrderSummary';
import EmailForm from '@/components/EmailForm';
import DeliveryDetails from '@/components/DeliveryDetails';
import EmailDetails from '@/components/EmailDetails';
import ShippingMethodForm from '@/components/ShippingMethodForm';
import ShippingMethod from '@/components/ShippingMethod';
import DeliveryDetailsForm from '@/components/deliveryDetailsForm';
import BillingAddressDetails from '@/components/BillingAddressDetails';
import BillingAddressForm from '@/components/BillingAddressForm';
import PaymentDetails from '@/components/PaymentDetails';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY || '';
const stripePromise = loadStripe(STRIPE_KEY);

const CheckoutPage: NextPageWithLayout = () => {
  const { customer } = useAccount();
  const { cart, changeCartAddress, countryCode } = useStore();
  const { startCheckout } = useCart();
  const [step, setStep] = React.useState(1);
  const [cardAdded, setCardAdded] = React.useState(false);
  const [showBillingForm, setShowBillingForm] = React.useState(true);
  const [clientSecret, setClientSecret] = React.useState<string | undefined>();
  const [options, setOptions] = React.useState({});
  const [selectedCountry, setSelectedCountry] = React.useState<
    Country | undefined
  >();
  const [selectedBillingCountry, setSelectedBillingCountry] = React.useState<
    Country | undefined
  >();

  const [changedAddress, setChangedAddress] = React.useState<AddressPayload>({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    country_code: '',
    postal_code: '',
  });
  const [changedBilling, setChangedBilling] = React.useState<AddressPayload>({
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    country_code: '',
    postal_code: '',
  });

  //ovo je da iman changedaddress ako slucajno covik napise promjenu sao u jednom polju
  const generateAddressFromCartOrCustomer = (
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | undefined,
    customer: Omit<Customer, 'password_hash'> | undefined
  ) => {
    if (cart?.shipping_address?.address_1) {
      return {
        first_name: cart.shipping_address.first_name || '',
        last_name: cart.shipping_address.last_name || '',
        phone: cart.shipping_address.phone || '',
        address_1: cart.shipping_address.address_1 || '',
        address_2: cart.shipping_address.address_2 || '',
        city: cart.shipping_address.city || '',
        country_code: cart.shipping_address.country_code || '',
        postal_code: cart.shipping_address.postal_code || '',
      };
    } else if (customer) {
      const shippingAddress = customer.shipping_addresses.filter(
        (shipping_address) => shipping_address.country_code === countryCode
      )[0];

      if (shippingAddress) {
        changeCartAddress({
          first_name: shippingAddress.first_name || '',
          last_name: shippingAddress.last_name || '',
          address_1: shippingAddress.address_1 || '',
          address_2: shippingAddress.address_2 || '',
          city: shippingAddress.city || '',
          country_code: shippingAddress.country_code || '',
          postal_code: shippingAddress.postal_code || '',
          phone: shippingAddress.phone || '',
        });
      }
    }
    return;
  };

  React.useEffect(() => {
    if (cart?.id && !changedAddress?.address_1 && !changedBilling?.address_1) {
      const address = generateAddressFromCartOrCustomer(cart, customer);
      if (address) {
        setChangedAddress(address);
        setChangedBilling(address);
      }
    }
  }, [cart]);

  React.useEffect(() => {
    if (cart?.id && !cart.payment_sessions?.length) {
      //JEL OVO TRIA IZBRISAT jer on radi usecreatepayment session ?
      startCheckout.mutate();
    }
  }, [cart]);

  React.useEffect(() => {
    if (cart?.payment_sessions?.length) {
      medusaClient.carts.createPaymentSessions(cart.id).then(({ cart }) => {
        // check if stripe is selected
        const isStripeAvailable = cart.payment_sessions?.some(
          (session) => session.provider_id === 'stripe'
        );
        if (!isStripeAvailable) {
          return;
        }

        // select stripe payment session
        medusaClient.carts
          .setPaymentSession(cart.id, {
            provider_id: 'stripe',
          })
          .then(({ cart }) => {
            const secret = cart.payment_session?.data.client_secret as string;

            setClientSecret(secret);
          })
          .then(() => {
            setOptions({
              clientSecret: clientSecret,
              mode: 'payment',
              currency: cart.region.currency_code,
              amount: cart?.total || 0,
              captureMethod: 'manual',
            });
          });
      });
    }
  }, [cart?.payment_sessions]);
  console.log(cart?.billing_address);
  return cart && clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <div className="flex h-full flex-col-reverse lg:flex-row">
        <div className="px-4 pb-10 pt-6 lg:w-1/2 lg:px-12 xl:w-[55%] xl:px-24">
          <Link href="/" className="mb-14 hidden lg:inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="95"
              height="36"
              fill="none"
            >
              <g fill="#1E2DA0" clipPath="url(#a)">
                <path d="M58.596 36h-26.75L38.104.11h26.75L62.75 12.073H50.067l-.221 1.053h12.738l-1.661 9.415H48.24l-.222 1.108h12.683l-2.105 12.35ZM66.184.11h14.677c10.357 0 14.843 5.04 13.126 14.899l-1.218 6.923c-.554 3.157-1.385 5.705-2.603 7.865C87.84 33.95 83.74 36 76.264 36H59.926L66.184.11Zm12.351 11.52L76.43 24.036h.056c1.052 0 1.384-.276 1.717-2.27l1.384-8.031c.333-1.772.222-2.105-.941-2.105h-.111ZM35.502 7.089c-.388-2.437-1.717-4.32-4.265-5.539C30.13.997 28.745.61 27.084.387A31.326 31.326 0 0 0 22.93.11H6.536L.277 36h14.4l1.883-10.69c.887 0 1.219.111 1.053 1.607-.056.221-.056.498-.111.83l-1.052 5.871L16.062 36h14.4l.332-1.828 1.163-6.535.111-.499c.83-4.763.222-6.812-3.6-7.643 2.437-.554 4.32-1.662 5.594-3.877.61-1.108 1.108-2.492 1.385-4.154.221-1.606.276-3.101.055-4.375Zm-14.954 6.203c-.166.83-.443 1.385-.83 1.661a1.323 1.323 0 0 1-.776.277h-.665l.665-3.766h.61c.332 0 .553.111.72.277.332.277.442.886.276 1.55Z" />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h94.708v36H0z" />
                </clipPath>
              </defs>
            </svg>
          </Link>
          <ul className="[&>li:first-child]:pt-0 [&>li:last-child]:border-0 [&>li:last-child]:pb-0 [&>li]:border-b [&>li]:py-8">
            <li>
              <ul className="flex items-start justify-between">
                <li
                  className={classNames({
                    'mb-7 font-black italic text-primary': step === 1,
                  })}
                >
                  1. Email
                </li>
                {step !== 1 && (
                  <li>
                    {!customer?.has_account && (
                      <button
                        className="relative transition-all before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-gray-900 before:content-[''] hover:font-black hover:before:border-b-2"
                        onClick={() => setStep(1)}
                      >
                        Change
                      </button>
                    )}
                  </li>
                )}
              </ul>

              {step === 1 ? (
                <EmailForm setStep={setStep} changedBilling={changedBilling} />
              ) : (
                <EmailDetails />
              )}
            </li>

            <li>
              <ul className="flex items-start justify-between">
                <li
                  className={classNames({
                    'mb-7 font-black italic text-primary': step === 2,
                  })}
                >
                  2. Delivery details
                </li>
                {step !== 2 && (
                  <li>
                    <button
                      className="relative transition-all before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-gray-900 before:content-[''] hover:font-black hover:before:border-b-2"
                      onClick={() => {
                        setStep(2);
                      }}
                    >
                      Change
                    </button>
                  </li>
                )}
              </ul>

              {step === 2 ? (
                <DeliveryDetailsForm
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  changedAddress={changedAddress}
                  setChangedAddress={setChangedAddress}
                  changedBilling={changedBilling}
                  setStep={setStep}
                />
              ) : (
                <DeliveryDetails />
              )}
            </li>

            <li>
              <ul className="flex items-start justify-between">
                <li
                  className={classNames({
                    'mb-7 font-black italic text-primary': step === 3,
                  })}
                >
                  3. Shipping method
                </li>
                {step !== 3 && (
                  <li>
                    <button
                      className="relative transition-all before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-gray-900 before:content-[''] hover:font-black hover:before:border-b-2"
                      onClick={() => {
                        setStep(3);
                      }}
                    >
                      Change
                    </button>
                  </li>
                )}
              </ul>

              {step === 3 ? (
                <ShippingMethodForm setStep={setStep} />
              ) : (
                <ShippingMethod />
              )}
            </li>

            <li>
              <p
                className={classNames({
                  'mb-6 font-black italic text-primary': step === 4,
                })}
              >
                4. Payment
              </p>

              {step === 4 && (
                <div>
                  {!showBillingForm && (
                    <button
                      className="relative text-black transition-all before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-gray-900 before:content-[''] hover:font-black hover:before:border-b-2"
                      onClick={() => setShowBillingForm(true)}
                    >
                      Change
                    </button>
                  )}
                  {showBillingForm ? (
                    <>
                      <p className="mb-7 font-black italic text-primary">
                        Billing details
                      </p>
                      <BillingAddressForm
                        setShowBillingForm={setShowBillingForm}
                        changedBilling={changedBilling}
                        setChangedBilling={setChangedBilling}
                        selectedBillingCountry={selectedBillingCountry}
                        setSelectedBillingCountry={setSelectedBillingCountry}
                      />
                    </>
                  ) : (
                    <BillingAddressDetails />
                  )}

                  {clientSecret && (
                    <PaymentDetails
                      cardAdded={cardAdded}
                      setCardAdded={setCardAdded}
                      clientSecret={clientSecret}
                      setClientSecret={setClientSecret}
                      cartID={cart.id}
                      step={step}
                      setOptions={setOptions}
                    />
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>

        <OrderSummary setCardAdded={setCardAdded} />
      </div>
    </Elements>
  ) : (
    <p>Loading...</p>
  );
};

export default CheckoutPage;
