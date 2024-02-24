import * as React from 'react';
import Image from 'next/image';
import type { NextPageWithLayout } from '@/pages/_app';
import AccountLayout from '@/layouts/AccountLayout';
import { Button, ButtonIcon } from '@/components/ui/Button';
import * as Dialog from '@/components/ui/Dialog';
import { Heading } from '@/components/ui/Heading';
import { Input } from '@/components/Input';
import { useAccount } from '@/lib/context/account-context';
import { medusaClient } from '@/lib/config';
import { Order } from '@medusajs/medusa';
import axios from 'axios';

interface PaymentMethod {
  last4: number;
  name: string;
  experation: string;
  brand: string;
}

const MyAccountPaymentMethodsPage: NextPageWithLayout = () => {
  const { customer } = useAccount();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [paymentMethodIds, setPaymentMethodIds] = React.useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod[]>([]);

  const handleListOrders = async () => {
    if (customer) {
      await medusaClient.customers
        .listOrders()
        .then(({ orders, limit, offset, count }) => {
          console.log(orders);
          setOrders(orders);
        });
    }
  };
  const sendPaymentMethods = async () => {
    if (customer) {
      console.log('inside');
      const response = await axios.post(
        `http://localhost:9000/store/customer-payment-methods/${customer?.metadata.stripe_id}`,
        {
          paymentmethod_ids: paymentMethodIds,
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        const paymentMethod = response.data.paymentMethod;
        // Log the response data
        console.log('Response Data:', paymentMethod);
        setPaymentMethod(paymentMethod);
      } else {
        // Log an error for unexpected status codes
        console.log('Unexpected Status Code:', response.status);
      }
    }
  };
  React.useEffect(() => {
    if (customer) {
      handleListOrders();
    }
  }, [customer]);

  React.useEffect(() => {
    if (orders.length > 0) {
      const methods: string[] = orders
        .filter(
          (order) =>
            order.payments[0]?.data?.payment_method &&
            typeof order.payments[0].data.payment_method === 'string'
        )
        .map((order) => order.payments[0].data.payment_method as string);
      setPaymentMethodIds(methods);
      console.log('IDS - SETTING', methods);
    }
  }, [orders]);

  //dodat axios funkciju koja salje taj paymentmethods i pozvat je

  React.useEffect(() => {
    if (paymentMethodIds && paymentMethodIds.length > 0) {
      sendPaymentMethods();
      console.log('paymentMethodIds', paymentMethodIds);
    }
  }, [paymentMethodIds]);

  //console.log(customer?.metadata.stripe_id, customer?.id);
  return customer ? (
    <div>
      <Heading className="mb-8 text-primary lg:mb-15" size="xl">
        Payment methods
      </Heading>

      <p className="text-md">Credit and debit cards</p>

      {paymentMethod.map((method, index) => (
        <div
          key={index}
          className="mt-6 flex flex-wrap items-start justify-between gap-6 rounded-sm border border-gray-200 p-4"
        >
          <div className="flex items-start">
            <Image
              src={`/images/content/${method.brand}.png`} // Replace with the actual path to card images
              height={24}
              width={34}
              alt={method.brand}
            />

            <ul className="ml-14">
              <li>{method.name}</li>
              <li>**** **** **** {method.last4}</li>
              <li>Exp: {method.experation}</li>
            </ul>
          </div>

          <div className="flex items-start">
            <ButtonIcon size="lg" iconName="trash" variant="secondary" />

            <Button size="lg" variant="secondary" className="ml-3">
              Change
            </Button>
          </div>
        </div>
      ))}

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button size="lg" className="mt-10">
            Add another card
          </Button>
        </Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Add credit or debit card</Dialog.Title>
          <Input
            type="text"
            label="Name on card"
            wrapperClassName="mb-4 lg:mb-8"
          />
          <Input
            type="number"
            label="Card number"
            wrapperClassName="mb-4 lg:mb-8"
          />
          <div className="mb-4 flex w-full gap-x-4 lg:mb-8 lg:gap-x-6">
            <Input type="number" label="MM/YY" wrapperClassName="flex-1" />
            <Input type="number" label="CVC" wrapperClassName="flex-1" />
          </div>
          <div className="flex justify-between">
            <Dialog.Close asChild>
              <Button variant="primary" aria-label="Save changes">
                Add card
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button variant="secondary" aria-label="Cancel">
                Cancel
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  ) : (
    ''
  );
};

MyAccountPaymentMethodsPage.getLayout = function getLayout(
  page: React.ReactElement
) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default MyAccountPaymentMethodsPage;
