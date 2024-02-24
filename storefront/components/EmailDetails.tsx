import { useStore } from '@/lib/context/store-context';
const EmailDetails = () => {
  const { cart } = useStore();
  return cart ? (
    <ul className="mt-8 flex">
      <li className="w-1/3 break-words pr-6 text-gray-400 md:w-1/5">Email</li>

      <li className="w-2/3 break-words text-gray-600 md:w-4/5">{cart.email}</li>
    </ul>
  ) : null;
};
export default EmailDetails;
