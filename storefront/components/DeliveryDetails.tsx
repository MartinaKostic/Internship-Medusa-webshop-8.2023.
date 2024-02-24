import { useStore } from '@/lib/context/store-context';

const deliveryDetails = () => {
  const { cart } = useStore();

  return cart ? (
    <ul className="mt-8 [&>ul:last-child]:mb-0 [&>ul]:mb-8">
      <ul className="flex [&>li:first-child]:break-words">
        <li className="w-1/3 pr-6 text-gray-400 md:w-1/5">Name</li>

        <li className="w-2/3 text-gray-600 md:w-4/5">
          {cart.shipping_address?.first_name} {cart.shipping_address?.last_name}
        </li>
      </ul>

      <ul className="flex [&>li:first-child]:break-words">
        <li className="w-1/3 pr-6 text-gray-400 md:w-1/5">Ship to</li>

        <li className="w-2/3 text-gray-600 md:w-4/5">
          {cart.shipping_address?.address_1}{' '}
          {cart.shipping_address?.postal_code} {cart.shipping_address?.city}{' '}
          {
            cart.region?.countries.find(
              (country) => country.iso_2 === cart.shipping_address?.country_code
            )?.display_name
          }
        </li>
      </ul>

      <ul className="flex [&>li:first-child]:break-words">
        <li className="w-1/3 pr-6 text-gray-400 md:w-1/5">Phone</li>

        <li className="w-2/3 text-gray-600 md:w-4/5">
          {cart.shipping_address?.phone || ''}
        </li>
      </ul>
    </ul>
  ) : null;
};

export default deliveryDetails;
