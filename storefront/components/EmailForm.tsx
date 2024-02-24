import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/Input';
import { useAccount } from '@/lib/context/account-context';
import { useStore } from '@/lib/context/store-context';
import { AddressPayload } from '@medusajs/medusa';

interface EmailFormProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  changedBilling: AddressPayload;
}

const EmailForm: React.FC<EmailFormProps> = ({
  setStep,
  changedBilling,
}: EmailFormProps) => {
  const { customer } = useAccount();
  const { cart, changeCartEmail } = useStore();
  const [newEmail, setNewEmail] = React.useState<string>('');
  const { changeCartAddress } = useStore();

  return cart ? (
    <form>
      {!customer?.has_account ? (
        <>
          <Input
            type="email"
            label="Email"
            name="email"
            defaultValue={cart.email || ''}
            errorMessage="You forgot your email"
            wrapperClassName="[&>span]:static"
            onChange={(e) => {
              setNewEmail(e.target.value);
            }}
          />

          <div className="mt-3.5 flex items-start gap-1">
            <input
              type="checkbox"
              name="email"
              id="email"
              className="relative h-4 w-4 shrink-0 cursor-pointer appearance-none border border-gray-400 transition-all checked:border-gray-900 checked:bg-gray-900 checked:before:absolute checked:before:left-[0.1875rem] checked:before:top-[0.1875rem] checked:before:h-[0.3125rem] checked:before:w-2 checked:before:-rotate-45 checked:before:border-b-2 checked:before:border-l-2 checked:before:border-gray-10 checked:before:content-[''] hover:border-primary hover:checked:bg-primary focus-visible:outline-0"
            />
            <label
              htmlFor="email"
              className="cursor-pointer text-xs2 text-gray-400 lg:text-xs"
            >
              Want to get news and offers? Ok, yes and some discounts. But only
              if you subscribe.
            </label>
          </div>
        </>
      ) : (
        <ul className="mt-8 flex">
          <li className="w-1/3 break-words pr-6 text-gray-400 md:w-1/5">
            Email
          </li>

          <li className="w-2/3 break-words text-gray-600 md:w-4/5">
            {cart.email}
          </li>
        </ul>
      )}
      <Button
        type="submit"
        size="lg"
        className="mt-10.5"
        onPress={() => {
          setStep(2);
          changeCartEmail(newEmail);
          changeCartAddress(
            {
              ...changedBilling,
            },
            true
          );
        }}
      >
        Next
      </Button>
    </form>
  ) : null;
};

export default EmailForm;
