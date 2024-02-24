import React from 'react';
import { SelectCountry } from '@/components/SelectCountry';
import { AddressPayload, Country } from '@medusajs/medusa';
import { Input } from '@/components/Input';
import { useStore } from '@/lib/context/store-context';
import { Button } from '@/components/ui/Button';
import { useAccount } from '@/lib/context/account-context';

interface BillingAddressFormProps {
  changedBilling: AddressPayload;
  setChangedBilling: React.Dispatch<React.SetStateAction<AddressPayload>>;
  setSelectedBillingCountry: React.Dispatch<
    React.SetStateAction<Country | undefined>
  >;
  selectedBillingCountry: Country | undefined;
  setShowBillingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  changedBilling,
  setChangedBilling,
  setSelectedBillingCountry,
  selectedBillingCountry,
  setShowBillingForm,
}: BillingAddressFormProps) => {
  const { cart, countryCode, changeCartAddress } = useStore();
  const { addCustomerBilling, customer } = useAccount();

  const handleBillingCountryChange = (country: Country) => {
    setSelectedBillingCountry(country);
    changeCartAddress(
      {
        country_code: country.iso_2,
      },
      true
    );
  };

  return (
    <fieldset className="relative flex flex-col flex-wrap gap-y-4 lg:gap-y-8">
      <SelectCountry
        selectedCountry={
          selectedBillingCountry ||
          cart?.region.countries.find(
            (country) => country.iso_2 === countryCode
          )
        }
        onCountryChange={handleBillingCountryChange}
        regionId={cart?.region_id}
      />

      <div className="flex gap-x-4 lg:gap-x-12">
        <Input
          type="text"
          label="First name"
          wrapperClassName="w-full"
          name="firstName"
          defaultValue={changedBilling.first_name || ''}
          onChange={(event) =>
            setChangedBilling((prevVal) => ({
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
          defaultValue={changedBilling.last_name || ''}
          onChange={(event) =>
            setChangedBilling((prevVal) => ({
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
        defaultValue={changedBilling.address_1 || ''}
        onChange={(event) =>
          setChangedBilling((prevVal) => ({
            ...prevVal,
            address_1: event.target.value,
          }))
        }
      />

      <Input
        type="text"
        label="Apartment, suite, etc. (Optional)"
        name="apartment"
        defaultValue={changedBilling.address_2 || ''}
        onChange={(event) =>
          setChangedBilling((prevVal) => ({
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
          defaultValue={changedBilling.postal_code || ''}
          onChange={(event) =>
            setChangedBilling((prevVal) => ({
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
          defaultValue={changedBilling.city || ''}
          onChange={(event) =>
            setChangedBilling((prevVal) => ({
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
        defaultValue={changedBilling.phone || '+385'}
        onChange={(event) =>
          setChangedBilling((prevVal) => ({
            ...prevVal,
            phone: event.target.value,
          }))
        }
      />
      <Button
        size="lg"
        className="mb-10"
        //dodaj i u customera i u cart billing
        onPress={() => {
          setShowBillingForm(false);
          if (selectedBillingCountry) {
            changeCartAddress(
              {
                ...changedBilling,
                country_code: selectedBillingCountry.iso_2,
              },
              true
            );
            if (customer) {
              addCustomerBilling({
                ...changedBilling,
                country_code: selectedBillingCountry.iso_2,
              });
            }
          } else {
            changeCartAddress(
              {
                ...changedBilling,
                country_code: countryCode,
              },
              true
            );
            if (customer) {
              addCustomerBilling({
                ...changedBilling,
                country_code: countryCode,
              });
            }
          }
        }}
      >
        Save
      </Button>
    </fieldset>
  );
};

export default BillingAddressForm;
