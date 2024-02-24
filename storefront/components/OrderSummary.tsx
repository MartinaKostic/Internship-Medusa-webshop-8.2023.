import * as React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { Heading } from '@/components/ui/Heading';
import { Tag } from '@/components/ui/Tag';
import { Input } from '@/components/Input';
import Image from 'next/image';
import { useStore } from '@/lib/context/store-context';
import { getCurrency } from '@/utils/prices';
import { Button } from '@/components/ui/Button';
import classNames from '@/utils/classNames';
import { QuantityInput } from '@/components/ui/QuantityInput';

interface OrderSummaryProps {
  setCardAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  setCardAdded,
}: OrderSummaryProps) => {
  const { cart, addDiscount, deleteDiscount, updateItem, deleteItem } =
    useStore();
  const [discountcode, setDiscountcode] = React.useState<string>('');
  const [checkoutVisible, setCheckoutVisible] = React.useState(false);
  const [editcart, setEditcart] = React.useState(false);

  const handleQuantityChange = (lineId: string, quantity: number) => {
    updateItem({ lineId, quantity });
  };
  console.log(cart?.discounts);
  return (
    <ul className="top-0 bg-gray-50 lg:sticky lg:w-1/2 xl:w-[45%]">
      <li className="flex items-center justify-between bg-white px-4 pb-5 pt-4 lg:hidden">
        <Link href="/" className="inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="95"
            height="36"
            viewBox="0 0 95 36"
            className="w-15.5 lg:w-auto"
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

        <div>
          <Heading size="md" className="text-primary">
            Checkout
          </Heading>
        </div>
      </li>
      <li
        className="flex cursor-pointer justify-between px-4 pb-7 pt-6 lg:hidden"
        onClick={() => setCheckoutVisible(!checkoutVisible)}
      >
        Order summary{' '}
        <span className="ml-auto mr-4 block">
          {cart?.total !== undefined ? (cart.total / 100).toFixed(2) : ''}{' '}
          {getCurrency(cart)}
        </span>{' '}
        <Icon
          name="chevron-down"
          className={classNames('transition-all', {
            'rotate-180': checkoutVisible,
          })}
        />
      </li>

      <li
        className={classNames(
          'hidden px-4 pb-8 lg:!block lg:px-12 lg:pt-31 xl:px-24',
          {
            '!block': checkoutVisible,
          }
        )}
      >
        <div className="mb-8 flex justify-between text-xs lg:mb-16 lg:text-sm">
          <span className="block">Order — {cart?.items?.length}</span>

          {editcart ? (
            <button
              className="relative transition-all before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-gray-900 before:content-[''] hover:font-black hover:before:border-b-2"
              onClick={() => {
                setCardAdded(false);
                setEditcart(false);
              }}
            >
              Done editing
            </button>
          ) : (
            <button
              className="relative transition-all before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-gray-900 before:content-[''] hover:font-black hover:before:border-b-2"
              onClick={() => {
                setCardAdded(false);
                setEditcart(true);
              }}
            >
              Edit cart
            </button>
          )}
        </div>

        {cart?.items.map((item) => (
          <div
            key={item.id}
            className="group mb-8 flex gap-x-2 gap-y-4 lg:gap-x-4"
          >
            <Link
              href={`/product/${item.variant.product.handle}`}
              className="relative block flex-shrink-0"
            >
              <Image
                src={item.thumbnail ? item.thumbnail : ''}
                height={144}
                width={108}
                className="min-w-[5.625rem] object-cover sm:w-auto"
                alt="Black sweatshirt"
              />

              {cart.discounts.length ? (
                <Tag variant="discount" className="absolute bottom-2 right-2">
                  -{cart.discounts[0]?.rule?.value}%
                </Tag>
              ) : null}
            </Link>

            <ul className="relative inline-flex h-full w-full flex-col">
              <li className="text-xs font-black italic lg:text-md">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs sm:text-md">{item.title}</p>
                  <ul className="relative items-center gap-2 text-xs sm:mt-0 sm:block sm:self-start">
                    <li className="font-bold text-red-700 sm:text-md">
                      {/* oduzet discount ako ga ima */}
                      {item.subtotal !== undefined &&
                      item.subtotal !== null &&
                      item.discount_total !== undefined &&
                      item.discount_total !== null
                        ? ((item.subtotal - item.discount_total) / 100).toFixed(
                            2
                          )
                        : ''}{' '}
                      {getCurrency(cart)}
                    </li>
                    {/* prikazat samo ako ima discounta */}
                    {item.discount_total !== 0 && (
                      <li className="absolute -bottom-6 right-0 font-light text-gray-400 line-through sm:text-sm">
                        {item.subtotal !== undefined && item.subtotal !== null
                          ? (item.subtotal / 100).toFixed(2)
                          : ''}{' '}
                        {getCurrency(cart)}
                      </li>
                    )}
                  </ul>
                </div>
              </li>
              <li className="text-xs2 text-gray-400 lg:text-sm">
                {item.description}
              </li>
              <li className="text-xs2 text-gray-400 lg:text-sm">
                {editcart ? (
                  <>
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
                        className="h-4 w-4 transition-all hover:text-primary"
                      />
                    </button>
                  </>
                ) : (
                  item.quantity
                )}
              </li>
            </ul>
          </div>
        ))}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:gap-8">
          <Input
            type="text"
            visualSize="sm"
            label="Discount code"
            wrapperClassName="flex-1"
            className="rounded-sm"
            value={discountcode}
            onChange={(e) => {
              setDiscountcode(e.target.value);
            }}
          />

          <Button
            size="lg"
            variant="tertiary"
            onPress={() => {
              addDiscount(discountcode || '');
            }}
          >
            Apply
          </Button>
        </div>

        <ul className="w-full [&>li:last-child]:mb-0 [&>li]:mb-2">
          <li>
            <ul className="flex justify-between pr-2 text-xs sm:text-sm">
              <li>Subtotal</li>
              <li>
                {cart?.subtotal !== undefined
                  ? (cart.subtotal / 100).toFixed(2)
                  : ''}{' '}
                {getCurrency(cart)}
              </li>
            </ul>
          </li>
          <li>
            <ul className="flex justify-between pr-2 text-xs sm:text-sm">
              <li>Shipping</li>
              <li>
                {cart?.shipping_total !== undefined && cart.shipping_total !== 0
                  ? (cart.shipping_total / 100).toFixed(2)
                  : 'FREE'}{' '}
                {getCurrency(cart)}
              </li>
            </ul>
          </li>
          {cart?.discounts.length ? (
            <li className="!mb-6">
              <ul className="flex justify-between pr-2 text-xs sm:text-sm">
                <li>
                  Discount{' '}
                  <button onClick={deleteDiscount}>
                    <Icon
                      name="x"
                      className="-my-1 h-5 w-5 transition-all hover:text-primary"
                    />
                  </button>
                </li>

                <li>
                  -{' '}
                  {cart?.discount_total !== undefined
                    ? (cart.discount_total / 100).toFixed(2)
                    : ''}{' '}
                  {getCurrency(cart)}
                </li>
              </ul>
            </li>
          ) : null}
          <li>
            <ul className="flex justify-between text-md lg:text-lg">
              <li>Total</li>
              <li>
                {cart?.total !== undefined ? (cart.total / 100).toFixed(2) : ''}{' '}
                {getCurrency(cart)}
              </li>
            </ul>
          </li>
          <li className="text-xs text-gray-400 sm:text-sm">
            Including 11.25 tax
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default OrderSummary;
