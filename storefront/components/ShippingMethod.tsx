import { useStore } from '@/lib/context/store-context';

const ShippingMethod = () => {
  const { cart } = useStore();
  return cart ? (
    <ul className="mt-8 flex">
      <li className="w-1/3 break-words pr-6 text-gray-400 md:w-1/5">
        Shipping
      </li>

      <li className="w-2/3 text-gray-600 md:w-4/5">
        {cart.shipping_methods?.map((method) => method.shipping_option.name)}
      </li>
    </ul>
  ) : null;
};
export default ShippingMethod;
