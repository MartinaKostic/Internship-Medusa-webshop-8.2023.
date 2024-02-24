import { useStore } from '@/lib/context/store-context';
import { getCurrency } from '@/utils/prices';
import { useCartShippingOptions } from 'medusa-react';
import React from 'react';
import { Button } from './ui/Button';

interface ShippingMethodProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const ShippingMethodForm: React.FC<ShippingMethodProps> = ({
  setStep,
}: ShippingMethodProps) => {
  const { cart, addShipping } = useStore();
  const { shipping_options } = useCartShippingOptions(cart?.id || '');
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >();
  return (
    <form>
      <ul className="[&>li:last-child]:mb-0 [&>li]:mb-2">
        {shipping_options?.map((option) => (
          <li className="relative" key={option.id}>
            <input
              type="radio"
              name="shippingMethod"
              id={option.id}
              className="peer hidden"
              value={option.id}
              onChange={() => setSelectedOption(option.id)}
            />
            <label
              htmlFor={option.id}
              className="group flex cursor-pointer justify-between rounded-sm border px-4 py-3 leading-none transition-all peer-hover:border-primary lg:py-5"
            >
              <div className="flex items-center">
                {selectedOption === option.id ? (
                  <span className="relative block h-4 w-4 rounded-full border border-gray-900 bg-gray-900 transition-all before:absolute before:left-[0.3125rem] before:top-[0.3125rem] before:h-1 before:w-1 before:rounded-full before:bg-gray-10 before:content-[''] group-hover:border-primary group-hover:bg-primary" />
                ) : (
                  <span className="relative block h-4 w-4 rounded-full border border-gray-900 transition-all group-hover:border-primary" />
                )}
                <p className="ml-3">
                  {option.name?.includes('Express') &&
                    `${option.name} (1-3 days delivery)`}
                  {option.name?.includes('Standard') &&
                    `${option.name} (5-7   days delivery)`}
                </p>
              </div>
              <p>
                {option.price_incl_tax !== null
                  ? (option.price_incl_tax / 100).toFixed(2)
                  : ''}{' '}
                {getCurrency(cart)}
              </p>
            </label>
          </li>
        ))}
      </ul>

      <Button
        type="submit"
        size="lg"
        className="mt-10"
        onPress={() => {
          if (selectedOption) {
            setStep(4);
            addShipping(selectedOption);
          }
        }}
      >
        Next
      </Button>
    </form>
  );
};

export default ShippingMethodForm;
