import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { NextPageWithLayout } from '@/pages/_app';
import AccountLayout from '@/layouts/AccountLayout';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Heading } from '@/components/ui/Heading';
import { useCustomerOrders } from 'medusa-react';
import { useRouter } from 'next/router';

export const handleDate = (orderdate: Date) => {
  const date = new Date(orderdate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

export const handleDeliveryDate = (
  orderdate: Date,
  shipping_option: string
) => {
  const date = new Date(orderdate);
  if (shipping_option?.includes('Express')) {
    date.setDate(date.getDate() + 3);
  } else if (shipping_option?.includes('Standard')) {
    date.setDate(date.getDate() + 7);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
};

const MyAccountOrdersPage: NextPageWithLayout = () => {
  const { orders, isLoading } = useCustomerOrders();
  const router = useRouter();
  console.log(orders);

  return (
    <div>
      <Heading className="mb-8 text-primary lg:mb-15">My orders</Heading>
      {isLoading && <span>Loading...</span>}
      {orders && !orders.length && <span>You haven't order anything yet.</span>}
      {orders &&
        orders.length > 0 &&
        orders.map((order) => (
          <ul key={order.id} className="[&>li:last-child]:mb-0 [&>li]:mb-4">
            <li className="rounded-sm border border-gray-200 p-4">
              <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
                <ul>
                  <li className="mb-2 text-md text-primary">
                    Order:{' '}
                    <span className="ml-1 text-black">{order.display_id}</span>
                  </li>

                  <li className="text-xs text-gray-400">
                    Order date:{' '}
                    <span className="ml-2 text-black">
                      {handleDate(order.created_at)}
                    </span>
                  </li>
                </ul>

                <ul className="flex [&>li:last-child]:mr-0 [&>li]:mr-4">
                  <li>
                    <Image
                      src={order.items[0].thumbnail || ''}
                      height={100}
                      width={75}
                      alt={order.items[0].title || ''}
                    />
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {order.fulfillment_status === 'fulfilled' && (
                    <Tag icon="check">Delivered</Tag>
                  )}
                  {order.fulfillment_status === 'shipped' && (
                    <Tag icon="truck">Delivering</Tag>
                  )}
                  {order.fulfillment_status === 'not_fulfilled' && (
                    <Tag icon="package">Packing</Tag>
                  )}
                  {order.fulfillment_status === 'returned' && (
                    <Tag variant="informative">Returned</Tag>
                  )}

                  <p className="text-xs2 text-gray-400">
                    Estimate delivery:{' '}
                    <span className="ml-1 text-black">
                      {' '}
                      {handleDeliveryDate(
                        order.created_at,
                        order.shipping_methods[0].shipping_option.name
                      )}
                    </span>
                  </p>
                </div>
                {/* izbrisan link dodan route - ide na orderid...*/}
                <Button
                  variant="secondary"
                  onPress={() =>
                    router.push(`/my-account/orders/${order.display_id}`)
                  }
                >
                  Check status
                </Button>
              </div>
            </li>
          </ul>
        ))}
    </div>
  );
};

MyAccountOrdersPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default MyAccountOrdersPage;
