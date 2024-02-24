import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NextPageWithLayout } from '@/pages/_app';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { QuantityInput } from '@/components/ui/QuantityInput';
import { Heading } from '@/components/ui/Heading';
import { useCart, useProducts } from 'medusa-react';
import { useStore } from '@/lib/context/store-context';
import { sortBy } from 'lodash';
import { getCurrency } from '@/utils/prices';
import { LineItem } from '@medusajs/medusa';
import { Product } from '@/components/Product';

const CartPage: NextPageWithLayout = () => {
  const { cart } = useCart();
  const { updateItem, deleteItem } = useStore();
  const { products } = useProducts();
  const handlePrice = () => {
    if (cart?.region?.currency_code === 'eur') {
      return 0;
    } else return 1;
  };
  const handleQuantityChange = (lineId: string, quantity: number) => {
    updateItem({ lineId, quantity });
  };
  return (
    <main className="px-4 py-12 lg:px-24 lg:pb-40 lg:pt-18">
      {cart?.items && cart.items.length > 0 ? (
        <div className="grid grid-cols-12 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <Heading className="mb-8 text-primary lg:mb-13.5" size="xl4">
              Your shopping bag ({cart?.items.length})
            </Heading>
            <ul className="[&>li:first-child]:border-t [&>li:last-child]:border-0 [&>li:last-child]:pb-0 [&>li]:border-b [&>li]:border-gray-200 [&>li]:py-8">
              {sortBy(cart?.items, (item) => item.created_at)?.map(
                (item: LineItem) => (
                  <li key={item.id}>
                    <div className="group relative flex items-center justify-between">
                      <Link
                        href={`/product/${item.variant.product.handle}`}
                        className="relative block flex-shrink-0"
                      >
                        <Image
                          src={item.thumbnail || ''}
                          height={144}
                          width={108}
                          alt={item.title}
                        />
                      </Link>

                      <ul className="relative ml-4 inline-flex h-full w-full flex-col">
                        <li className="text-xs font-black italic lg:text-md">
                          {item.title}
                        </li>
                        <li className="text-xs2 text-gray-400 lg:text-sm">
                          {item.description}
                        </li>
                        <li className="right-0 top-0 sm:absolute">
                          <ul className="relative mt-1 flex items-center gap-2 sm:mt-0 sm:block sm:self-start">
                            <li className="text-xs font-medium lg:text-md">
                              {item?.total ? (item.total / 100).toFixed(2) : ''}{' '}
                              {getCurrency(cart)}
                            </li>
                          </ul>
                        </li>
                        <li className="mt-10 flex items-center justify-between gap-2 gap-y-4 lg:gap-x-8">
                          <QuantityInput
                            defaultValue={item.quantity}
                            maxValue={item.variant.inventory_quantity}
                            onChange={(newQuantity) =>
                              handleQuantityChange(item.id, newQuantity)
                            }
                          />

                          <button onClick={() => deleteItem(item.id)}>
                            <Icon
                              name="trash"
                              className="transition-all hover:text-primary"
                            />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="col-span-12 mt-6 border-t border-gray-200 pt-8 lg:col-span-4 lg:mt-9.25 lg:border-t-0 lg:pt-0 xl:col-span-3">
            <ul className="mb-10">
              <li className="mb-3.5 text-gray-400">
                <ul className="flex justify-between">
                  <li>Subtotal:</li>
                  <li className="text-black">
                    {cart?.subtotal !== undefined
                      ? (cart.subtotal / 100).toFixed(2)
                      : ''}{' '}
                    {getCurrency(cart)}
                  </li>
                </ul>
              </li>
              <li className="mb-6 border-b border-gray-200 pb-5.5 text-gray-400">
                <ul className="flex justify-between">
                  <li>Shipping:</li>
                  <li className="text-black">
                    {cart?.shipping_total !== undefined &&
                    cart.shipping_total !== 0
                      ? (cart.shipping_total / 100).toFixed(2)
                      : 'FREE'}{' '}
                    {getCurrency(cart)}
                  </li>
                </ul>
              </li>
              <li className="text-lg font-semibold">
                <ul className="flex justify-between">
                  <li>Total:</li>
                  <li>
                    {' '}
                    {cart?.subtotal !== undefined &&
                    cart?.shipping_total !== undefined
                      ? ((cart.subtotal + cart.shipping_total) / 100).toFixed(2)
                      : ''}{' '}
                    {getCurrency(cart)}
                  </li>
                </ul>
              </li>
            </ul>

            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Proceed to checkout
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-12 lg:gap-x-12">
          <div className="col-span-12">
            <Heading className="mb-8 text-primary" size="xl4">
              There is nothing in your bag.
            </Heading>

            <p className="mb-20 text-md">
              We can change that by going back to shopping.
            </p>

            <Heading className="mb-8 text-primary" size="xl4">
              Shop
            </Heading>

            <div className="grid grid-cols-12 gap-y-10 md:gap-x-12">
              {products
                ?.slice(0, 4)
                .map((product) => (
                  <Product
                    className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                    key={product.id}
                    title={product.title || ''}
                    price={product.variants[0].prices[handlePrice()].amount}
                    discount={0}
                    discountedPrice={0}
                    collection={product.collection?.handle || ''}
                    src={product.thumbnail || ''}
                    height={3200}
                    width={2400}
                    alt={product.title || ''}
                    linkTo={`/product/${product.handle}`}
                    colors={Array.from(
                      new Set(
                        product.options
                          ?.find((option) => option.title === 'Color')
                          ?.values?.map((value) => value.value)
                      )
                    )}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

CartPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default CartPage;
