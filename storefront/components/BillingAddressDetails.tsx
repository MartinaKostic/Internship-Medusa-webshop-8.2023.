import { useStore } from '@/lib/context/store-context';

const BillingAddressDetails = () => {
  const { cart } = useStore();

  return cart ? (
    <ul className="mb-7 text-gray-600 [&>li:first-child]:mb-2 [&>li:first-child]:text-primary">
      <li>
        <ul className="flex justify-between">
          <li>Billing address</li>
        </ul>
      </li>

      <li>
        {cart.billing_address?.first_name} {cart.billing_address?.last_name}
      </li>
      <li>
        {cart.billing_address?.address_1},{cart.billing_address?.postal_code}
        {cart.billing_address?.city},
        {
          cart.region?.countries.find(
            (country) => country.iso_2 === cart.billing_address?.country_code
          )?.display_name
        }
      </li>
      <li>{cart.billing_address?.phone}</li>
    </ul>
  ) : null;
};
export default BillingAddressDetails;
