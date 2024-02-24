import * as React from 'react';
import { Country } from '@medusajs/medusa';
import type { NextPageWithLayout } from '@/pages/_app';
import AccountLayout from '@/layouts/AccountLayout';
import { Button, ButtonIcon } from '@/components/ui/Button';
import * as Dialog from '@/components/ui/Dialog';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/Input';
import { SelectCountry } from '@/components/SelectCountry';
import { useAccount } from '@/lib/context/account-context';
import { medusaClient } from '@/lib/config';
import { useStore } from '@/lib/context/store-context';
import { sortBy } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useRegions } from 'medusa-react';

export interface AddressInfo {
  address: string;
  city: string;
  postalcode: string;
  apartment: string;
}
export interface ChangeInfo {
  address: string;
  city: string;
  postalcode: string;
  apartment: string;
  firstname: string | undefined;
  lastname: string | undefined;
  phone: string | undefined;
}

const MyAccountPage: NextPageWithLayout = () => {
  const { customer, refetchCustomer, handleCustomerChange } = useAccount();
  const [selectedCountry, setSelectedCountry] = React.useState<
    Country | undefined
  >();

  const { cart, countryCode } = useStore();
  const regions = useRegions();

  const addressRef = React.useRef<HTMLInputElement | null>(null);
  const apartmentRef = React.useRef<HTMLInputElement | null>(null);
  const postalcodeRef = React.useRef<HTMLInputElement | null>(null);
  const cityRef = React.useRef<HTMLInputElement | null>(null);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    console.log(country);
  };

  const handleDeleteAddress = async (id: string) => {
    if (customer) {
      await medusaClient.customers.addresses.deleteAddress(id).then(() => {
        refetchCustomer();
      });
    }
  };
  const handleChangeAddress = async (
    id: string,
    changedAddress: AddressInfo
  ) => {
    if (customer) {
      await medusaClient.customers.addresses
        .updateAddress(id, {
          address_1:
            changedAddress.address ||
            customer.shipping_addresses.find((address) => address.id === id)
              ?.address_1 ||
            '',
          address_2:
            changedAddress.apartment ||
            customer.shipping_addresses.find((address) => address.id === id)
              ?.address_2 ||
            '',
          postal_code:
            changedAddress.postalcode ||
            customer.shipping_addresses.find((address) => address.id === id)
              ?.postal_code ||
            '',
          city:
            changedAddress.city ||
            customer.shipping_addresses.find((address) => address.id === id)
              ?.city ||
            '',
          country_code: selectedCountry?.iso_2 || countryCode,
        })
        .then(() => {
          refetchCustomer();
        });
    }
    if (addressRef.current) {
      addressRef.current.value = '';
    }
    if (apartmentRef.current) {
      apartmentRef.current.value = '';
    }
    if (postalcodeRef.current) {
      postalcodeRef.current.value = '';
    }
    if (cityRef.current) {
      cityRef.current.value = '';
    }
    // setChangeAddressInfo({
    //   address: '',
    //   city: '',
    //   postalcode: '',
    //   apartment: '',
    // });
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangeInfo>({});

  const onSubmitAddAddress = async (data: ChangeInfo) => {
    if (customer) {
      medusaClient.customers.addresses
        .addAddress({
          address: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            address_1: data.address,
            city: data.city,
            country_code: selectedCountry?.iso_2 || '',
            postal_code: data.postalcode,
            phone: '',
            company: '',
            province: '',
            metadata: {},
            address_2: data.apartment,
          },
        })
        .then(() => {
          refetchCustomer();
        });
    }
  };
  const onSubmitChangeUser = async (data: ChangeInfo) => {
    handleCustomerChange({
      firstname: data.firstname,
      lastname: data.lastname,
      phone: data.phone,
      address: '',
      city: '',
      postalcode: '',
      apartment: '',
    });
  };

  console.log(customer);
  return customer ? (
    <div>
      <Heading size="xl" className="mb-8 text-primary lg:mb-15">
        Personal & security
      </Heading>

      <ul className="[&>li:last-child]:mb-0 [&>li]:mb-16">
        <li>
          <p className="mb-6 text-md">Personal information</p>

          <div className="flex flex-wrap justify-between gap-8 rounded-sm border border-gray-200 p-4">
            <Icon name="user" />

            <div className="flex flex-1 flex-wrap gap-8">
              <ul className="flex-1">
                <li className="mb-0.5 text-xs2 text-gray-400">Name</li>
                <li className="text-sm text-black">
                  {customer.first_name} {customer.last_name}
                </li>
              </ul>

              <ul className="flex-1">
                <li className="mb-0.5 text-xs2 text-gray-400">Number</li>
                <li className="break-all text-sm text-black">
                  {customer.phone !== null ? customer.phone : '-'}
                </li>
              </ul>
            </div>
            {/* updatecustomer */}
            <form onSubmit={handleSubmit(onSubmitChangeUser)}>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button
                    variant="secondary"
                    className="self-start"
                    onPress={() => reset()}
                  >
                    Change
                  </Button>
                </Dialog.Trigger>
                <Dialog.Overlay />
                <Dialog.Content>
                  <Dialog.Title>Personal information</Dialog.Title>
                  <div className="mb-4 flex w-full gap-x-4 lg:mb-8 lg:gap-x-6">
                    <Controller
                      name="firstname"
                      control={control}
                      rules={{
                        required: 'It is required',
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          label="First name"
                          defaultValue={customer.first_name}
                          wrapperClassName="flex-1"
                          errorMessage={errors.address?.message}
                          {...field}
                        />
                      )}
                    ></Controller>
                    <Controller
                      name="lastname"
                      control={control}
                      rules={{
                        required: 'It is required',
                      }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          label="Last name"
                          defaultValue={customer.last_name}
                          wrapperClassName="flex-1"
                          errorMessage={errors.address?.message}
                          {...field}
                        />
                      )}
                    ></Controller>
                  </div>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="phone"
                        label="Phone"
                        defaultValue={customer.phone ? customer.phone : '+385'}
                        wrapperClassName="flex-1"
                        {...field}
                      />
                    )}
                  ></Controller>
                  <div className="flex justify-between">
                    <Dialog.Close asChild>
                      <Button
                        variant="primary"
                        aria-label="Save changes"
                        type="submit"
                        isDisabled={!isValid}
                        //onPress={() => handleCustomerChange(changeInfo)}
                      >
                        Save changes
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <Button variant="secondary" aria-label="Cancel">
                        Cancel
                      </Button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Root>
            </form>
          </div>
        </li>

        <li>
          <p className="mb-6 text-md">Contact</p>

          <div className="mb-2 flex rounded-sm border border-gray-200 p-4">
            <Icon name="user" className="shrink-0" />

            <ul className="ml-8">
              <li className="mb-0.5 text-xs2 text-gray-400">Email</li>
              <li className="break-all text-sm text-black">{customer.email}</li>
            </ul>
          </div>

          <p className="text-xs2 text-gray-400">
            If you want to change your email please contact us via customer
            support.
          </p>
        </li>
        {/* Ispisjue adresu*/}
        <li>
          <p className="mb-6 text-md">Address</p>
          {customer.shipping_addresses.length > 0
            ? sortBy(
                customer?.shipping_addresses,
                (address) => address.created_at
              )?.map((address) => (
                <div
                  key={address.id}
                  className="mb-10 flex flex-wrap items-start justify-between gap-8 rounded-sm border border-gray-200 p-4"
                >
                  <Icon name="user" className="shrink-0" />

                  <div className="mr-auto flex-1 self-start">
                    <div className="mb-8 flex gap-8">
                      <ul className="flex-1">
                        <li className="mb-0.5 text-xs2 text-gray-400">
                          Country
                        </li>
                        <li className="text-sm text-black">
                          {
                            regions?.regions
                              ?.flatMap((region) => region.countries)
                              .find(
                                (country) =>
                                  country.iso_2 === address.country_code
                              )?.display_name
                          }
                        </li>
                      </ul>

                      <ul className="flex-1">
                        <li className="mb-0.5 text-xs2 text-gray-400">
                          Address
                        </li>
                        <li className="text-sm text-black">
                          {address.address_1}
                        </li>
                      </ul>
                    </div>
                    <ul className="mb-8 flex-1 gap-4">
                      <li className="mb-0.5 text-xs2 text-gray-400">
                        Apartment, suite, etc. (Optional)
                      </li>
                      <li className="text-sm text-black">
                        {address.address_2}
                      </li>
                    </ul>
                    <div className="flex gap-8">
                      <ul className="flex-1">
                        <li className="mb-0.5 text-xs2 text-gray-400">
                          Postal Code
                        </li>
                        <li className="text-sm text-black">
                          {address.postal_code}
                        </li>
                      </ul>

                      <ul className="flex-1">
                        <li className="mb-0.5 text-xs2 text-gray-400">City</li>
                        <li className="text-sm text-black">{address.city}</li>
                      </ul>
                    </div>
                  </div>

                  {/* update adress thingy */}
                  <div className="ml-auto flex gap-x-4">
                    <ButtonIcon
                      size="lg"
                      iconName="trash"
                      variant="secondary"
                      className="mt-2"
                      onPress={() => handleDeleteAddress(address.id)}
                    />
                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <Button
                          variant="secondary"
                          onPress={() => {
                            const country = (
                              cart?.region?.countries || []
                            ).find(
                              (country) =>
                                country.iso_2 === address.country_code
                            );
                            setSelectedCountry(country);
                          }}
                        >
                          Change
                        </Button>
                      </Dialog.Trigger>
                      <Dialog.Overlay />
                      <Dialog.Content>
                        <Dialog.Title>Change address</Dialog.Title>
                        <SelectCountry
                          selectedCountry={selectedCountry}
                          onCountryChange={handleCountryChange}
                        />
                        <Input
                          type="text"
                          label="Address"
                          defaultValue={
                            address.address_1 ? address.address_1 : ''
                          }
                          wrapperClassName="flex-1 mb-4 lg:mb-8 mt-8"
                          onChange={(val) => {
                            addressRef.current = val.target;
                          }}
                          // onChange={(val) =>
                          //   setChangeAddressInfo((prevVal) => ({
                          //     ...prevVal,
                          //     address: val.target.value,
                          //   }))
                          // }
                        />
                        <Input
                          type="text"
                          label="Apartment, suite, etc. (Optional)"
                          wrapperClassName="flex-1 mb-4 lg:mb-8"
                          defaultValue={
                            address.address_2 ? address.address_2 : ''
                          }
                          onChange={(val) => {
                            apartmentRef.current = val.target;
                          }}
                          // onChange={(val) =>
                          //   setChangeAddressInfo((prevVal) => ({
                          //     ...prevVal,
                          //     apartment: val.target.value,
                          //   }))
                          // }
                        />
                        <div className="mb-4 flex w-full gap-x-4 lg:mb-8 lg:gap-x-6">
                          <Input
                            type="string"
                            label="Postal Code"
                            wrapperClassName="flex-1"
                            defaultValue={
                              address.postal_code ? address.postal_code : ''
                            }
                            onChange={(val) => {
                              postalcodeRef.current = val.target;
                            }}
                            // onChange={(val) =>
                            //   setChangeAddressInfo((prevVal) => ({
                            //     ...prevVal,
                            //     postalcode: val.target.value,
                            //   }))
                            // }
                          />
                          <Input
                            type="text"
                            label="City"
                            wrapperClassName="flex-1"
                            defaultValue={address.city ? address.city : ''}
                            onChange={(val) => {
                              cityRef.current = val.target;
                            }}
                            // onChange={(val) =>
                            //   setChangeAddressInfo((prevVal) => ({
                            //     ...prevVal,
                            //     city: val.target.value,
                            //   }))
                            // }
                          />
                        </div>
                        <div className="flex justify-between">
                          <Dialog.Close asChild>
                            <Button
                              variant="primary"
                              aria-label="Save changes"
                              onPress={() => {
                                console.log(postalcodeRef.current?.value);
                                const updatedAddressInfo: AddressInfo = {
                                  address: addressRef.current?.value || '',
                                  apartment: apartmentRef.current?.value || '',
                                  postalcode:
                                    postalcodeRef.current?.value || '',
                                  city: cityRef.current?.value || '',
                                };

                                handleChangeAddress(
                                  address.id,
                                  updatedAddressInfo
                                );
                              }}
                            >
                              Save changes
                            </Button>
                          </Dialog.Close>
                          <Dialog.Close asChild>
                            <Button variant="secondary" aria-label="Cancel">
                              Cancel
                            </Button>
                          </Dialog.Close>
                        </div>
                      </Dialog.Content>
                    </Dialog.Root>
                  </div>
                </div>
              ))
            : ' '}
          {/* ovaj je za add address */}
          <form
            className="mb-4 xl:mb-16"
            onSubmit={handleSubmit(onSubmitAddAddress)}
          >
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={() => {
                    setSelectedCountry(undefined);
                    reset();
                  }}
                >
                  Add another address
                </Button>
              </Dialog.Trigger>
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Title>Add address</Dialog.Title>
                <SelectCountry
                  selectedCountry={selectedCountry}
                  onCountryChange={handleCountryChange}
                />
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: 'It is required',
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      label="Address"
                      wrapperClassName="flex-1 mb-4 lg:mb-8 mt-8"
                      errorMessage={errors.address?.message}
                      {...field}
                    />
                  )}
                ></Controller>
                <Controller
                  name="apartment"
                  control={control}
                  rules={{
                    required: 'It is required',
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      label="Apartment, suite, etc. (Optional)"
                      wrapperClassName="flex-1 mb-4 lg:mb-8"
                      errorMessage={errors.apartment?.message}
                      {...field}
                    />
                  )}
                ></Controller>

                <div className="mb-4 flex w-full gap-x-4 lg:mb-8 lg:gap-x-6">
                  <Controller
                    name="postalcode"
                    control={control}
                    rules={{
                      required: 'It is required',
                    }}
                    render={({ field }) => (
                      <Input
                        type="string"
                        label="Postal Code"
                        wrapperClassName="flex-1"
                        errorMessage={errors.postalcode?.message}
                        {...field}
                      />
                    )}
                  ></Controller>
                  <Controller
                    name="city"
                    control={control}
                    rules={{
                      required: 'It is required',
                    }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        label="City"
                        wrapperClassName="flex-1"
                        errorMessage={errors.city?.message}
                        {...field}
                      />
                    )}
                  ></Controller>
                </div>
                <div className="flex justify-between">
                  <Dialog.Close asChild>
                    <Button
                      variant="primary"
                      aria-label="Save changes"
                      type="submit"
                      isDisabled={!isValid}
                    >
                      Add address
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Button variant="secondary" aria-label="Cancel">
                      Cancel
                    </Button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          </form>
        </li>

        <li>
          <p className="mb-6 text-md">Change password</p>

          <p className="mb-12 text-gray-500">
            Perhaps you&apos;ve scribbled your password on a scrap of paper or
            you&apos;re the type who likes to change it every now and then to
            feel safer. Or maybe you had a rough weekend, and well, we know what
            can happen on weekends ( ͡° ͜ʖ ͡°). No worries, to change your
            password, we&apos;ll send you an email. Just click on the reset
            button below.
          </p>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button size="lg">Reset password</Button>
            </Dialog.Trigger>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Close asChild>
                <button className="absolute right-4 top-4 text-gray-900">
                  <Icon name="x" />
                </button>
              </Dialog.Close>
              <Dialog.Title>Personal information</Dialog.Title>
              <div className="text-xs text-gray-500">
                <p>
                  We have sent an email with instructions on how to <br />
                  change the password.
                </p>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </li>
      </ul>
    </div>
  ) : (
    <p>Not logged in</p>
  );
};

MyAccountPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default MyAccountPage;
