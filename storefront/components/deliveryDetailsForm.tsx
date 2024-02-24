import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/Input';
import { SelectCountry } from '@/components/SelectCountry';
import { useStore } from '@/lib/context/store-context';
import { AddressPayload, Country } from '@medusajs/medusa';
import { useAccount } from '@/lib/context/account-context';

interface DeliveryDetailsFormProps {
  changedAddress: AddressPayload;
  changedBilling: AddressPayload;
  setChangedAddress: React.Dispatch<React.SetStateAction<AddressPayload>>;
  selectedCountry: Country | undefined;
  setSelectedCountry: React.Dispatch<React.SetStateAction<Country | undefined>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
const DeliveryDetailsForm: React.FC<DeliveryDetailsFormProps> = ({
  selectedCountry,
  changedAddress,
  setChangedAddress,
  changedBilling,
  setSelectedCountry,
  setStep,
}: DeliveryDetailsFormProps) => {
  const { changeCartAddress, cart, countryCode } = useStore();
  const { addCustomerBilling } = useAccount();
  const { customer } = useAccount();

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // console.log('2', country);
    changeCartAddress({
      country_code: country.iso_2,
    });
  };
  // console.log('1', selectedCountry);
  return (
    <>
      <fieldset className="relative flex flex-col flex-wrap gap-y-4 lg:gap-y-8">
        <SelectCountry
          selectedCountry={
            selectedCountry ||
            cart?.region.countries.find(
              (country) => country.iso_2 === countryCode
            )
          }
          onCountryChange={handleCountryChange}
          regionId={cart?.region_id}
        />

        <div className="flex gap-x-4 lg:gap-x-12">
          <Input
            type="text"
            label="First name"
            wrapperClassName="w-full"
            name="firstName"
            defaultValue={changedAddress.first_name || ''}
            onChange={(event) =>
              setChangedAddress((prevVal) => ({
                ...prevVal,
                first_name: event.target.value,
              }))
            }
          />

          <Input
            type="text"
            label="Last name"
            wrapperClassName="w-full"
            name="lastName"
            defaultValue={changedAddress.last_name || ''}
            onChange={(event) =>
              setChangedAddress((prevVal) => ({
                ...prevVal,
                last_name: event.target.value,
              }))
            }
          />
        </div>

        <Input
          type="text"
          label="Address"
          name="address"
          defaultValue={changedAddress.address_1 || ''}
          onChange={(event) =>
            setChangedAddress((prevVal) => ({
              ...prevVal,
              address_1: event.target.value,
            }))
          }
        />

        <Input
          type="text"
          label="Apartment, suite, etc. (Optional)"
          name="apartment"
          defaultValue={changedAddress.address_2 || ''}
          onChange={(event) =>
            setChangedAddress((prevVal) => ({
              ...prevVal,
              address_2: event.target.value,
            }))
          }
        />

        <div className="flex gap-x-4 lg:gap-x-12">
          <Input
            type="number"
            label="Postal Code"
            wrapperClassName="w-full"
            name="postalCode"
            defaultValue={changedAddress.postal_code || ''}
            onChange={(event) =>
              setChangedAddress((prevVal) => ({
                ...prevVal,
                postal_code: event.target.value,
              }))
            }
          />

          <Input
            type="text"
            label="City"
            wrapperClassName="w-full"
            name="city"
            defaultValue={changedAddress.city || ''}
            onChange={(event) =>
              setChangedAddress((prevVal) => ({
                ...prevVal,
                city: event.target.value,
              }))
            }
          />
        </div>

        <Input
          type="phone"
          label="Phone"
          name="phone"
          defaultValue={changedAddress.phone || '+385'}
          onChange={(event) =>
            setChangedAddress((prevVal) => ({
              ...prevVal,
              phone: event.target.value,
            }))
          }
        />
      </fieldset>

      <Button
        type="button"
        size="lg"
        className="mt-10"
        //spremi changedbilling adresu u customer.billing tako da uvik imamo u customeru
        onPress={() => {
          setStep(3);
          console.log('selectedcountry', selectedCountry);
          if (selectedCountry) {
            changeCartAddress({
              ...changedAddress,
              country_code: selectedCountry.iso_2,
            });
          } else {
            changeCartAddress({
              ...changedAddress,
              country_code: countryCode,
            });
          }
        }}
      >
        Next
      </Button>
    </>
  );
};
export default DeliveryDetailsForm;

// addCustomerBilling({
//   ...changedBilling,
// });
