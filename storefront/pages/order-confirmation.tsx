import * as React from 'react';
import Link from 'next/link';
import type { NextPageWithLayout } from '@/pages/_app';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { useCart, useOrder } from 'medusa-react';
import { useRouter } from 'next/router';
import { useMedusa } from 'medusa-react';
import { Order } from '@medusajs/medusa';
import axios from 'axios';

const OrderConfirmationPage: NextPageWithLayout = () => {
  const [orderId, setOrderId] = React.useState('');
  const [order, setOrder] = React.useState<Order | undefined>();
  const medusa = useMedusa();
  const router = useRouter();
  const { cart } = useCart();

  const id = router.query.id
    ? Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id
    : undefined;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/store/retrieve-order/${orderId}`
      );
      console.log(response.data);
      setOrder(response.data.order);
    } catch (error) {
      console.log('fetchorder error', error);
    }
  };
  React.useEffect(() => {
    if (id) {
      setOrderId(id);
      console.log(id);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [orderId]);

  console.log('id', router.query.id);

  return order ? (
    <main className="grid-cols-12 px-4 py-10 md:px-24 lg:grid lg:px-0 lg:pb-50 lg:pt-19">
      <span className="col-span-3" />

      <div className="col-span-6">
        <Heading className="mb-14 text-primary" size="xl4">
          Thank you for your order!
        </Heading>

        <div className="mb-16 text-md">
          <p className="mb-6">
            Thank you for your purchase! We are pleased to confirm that your
            order has been successfully placed and will be processed shortly.
          </p>

          <p>
            We have sent you the receipt and order details via{' '}
            <span className="font-bold">e-mail.</span>
          </p>
        </div>

        <div className="mb-16 flex flex-col justify-between gap-20 sm:flex-row">
          <div>
            <p className="mb-2">Your order number is:</p>
            <p className="font-bold">{order.display_id}</p>

            <ul className="mt-8 text-gray-600 sm:mt-16">
              <li className="mb-2">Shipping address:</li>
              <li>
                {order.shipping_address?.first_name}{' '}
                {order.shipping_address?.last_name}
              </li>
              <li>
                {order.shipping_address?.address_1}{' '}
                {order.shipping_address?.postal_code}{' '}
                {order.shipping_address?.city}{' '}
                {
                  cart?.region?.countries.find(
                    (country) =>
                      country.iso_2 === order?.shipping_address?.country_code
                  )?.display_name
                }
              </li>
              <li>{order.shipping_address?.phone} </li>
            </ul>
          </div>

          <div>
            <p className="mb-2">Shipment expected:</p>
            <p className="font-bold">7 Aug - 8 Aug</p>
            {/* kako ode ispisat nacin placanja */}
            <ul className="mt-8 text-gray-600 sm:mt-16">
              <li className="mb-2">Payment:</li>
              <li>
                {order?.billing_address?.first_name}{' '}
                {order?.billing_address?.last_name}
              </li>
              <li>
                {order?.billing_address?.address_1},{' '}
                {order?.billing_address?.postal_code}{' '}
                {order?.billing_address?.city},{' '}
                {
                  cart?.region?.countries.find(
                    (country) =>
                      country.iso_2 === order?.billing_address?.country_code
                  )?.display_name
                }
              </li>
              <li>{order?.billing_address?.phone}</li>
            </ul>
          </div>
        </div>

        <Link href="/">
          <Button size="lg" className="w-full">
            Go back to home page
          </Button>
        </Link>
      </div>
    </main>
  ) : (
    <p>Loading...</p>
  );
};

OrderConfirmationPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default OrderConfirmationPage;
