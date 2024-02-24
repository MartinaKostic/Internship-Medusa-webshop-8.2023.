import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import type { NextPageWithLayout } from '@/pages/_app';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/Input';
import { Heading } from '@/components/ui/Heading';
import { useAccount } from '@/lib/context/account-context';

export interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: number;
}

const MyAccountRegisterPage: NextPageWithLayout = () => {
  const { customer } = useAccount();
  const account = useAccount();
  const router = useRouter();
  const [customError, setCustomError] = React.useState('');

  const passwordValidationRules = {
    minLength: 5,
    maxLength: 20,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialCharacter: true,
  };

  const passwordErrorMessage = {
    minLength: 'Password must be at least 5 characters long',
    maxLength: 'Password must not exceed 20 characters',
    requireUppercase: 'Password must contain at least one uppercase letter',
    requireLowercase: 'Password must contain at least one lowercase letter',
    requireNumber: 'Password must contain at least one number',
    requireSpecialCharacter:
      'Password must contain at least one special character',
  };

  const validatePassword = (value: string) => {
    const {
      minLength,
      maxLength,
      requireUppercase,
      requireLowercase,
      requireNumber,
      requireSpecialCharacter,
    } = passwordValidationRules;

    if (value.length < minLength) {
      return passwordErrorMessage.minLength;
    }
    if (value.length > maxLength) {
      return passwordErrorMessage.maxLength;
    }
    if (requireUppercase && !/[A-Z]/.test(value)) {
      return passwordErrorMessage.requireUppercase;
    }
    if (requireLowercase && !/[a-z]/.test(value)) {
      return passwordErrorMessage.requireLowercase;
    }
    if (requireNumber && !/\d/.test(value)) {
      return passwordErrorMessage.requireNumber;
    }
    if (
      requireSpecialCharacter &&
      !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\\-/]/.test(value)
    ) {
      return passwordErrorMessage.requireSpecialCharacter;
    }

    return true; // No validation error
  };

  React.useEffect(() => {
    if (customer) {
      router.push('/my-account');
    }
  }, [customer]);

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({});

  const onSubmit = async (data: FormData) => {
    const { error } = await account.handleRegister(data);

    if (error) {
      setCustomError(error);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Heading className="mb-8 !leading-[1.1] text-primary lg:mb-14" size="xl3">
        Hey gorgeous,
        <br /> welcome to red
      </Heading>

      <form className="mb-4 xl:mb-16" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col gap-x-6 gap-y-4 sm:flex-row lg:mb-8 lg:gap-y-8">
          <Controller
            name="firstname"
            control={control}
            rules={{
              required: 'First name is required',
              minLength: { value: 2, message: 'Too short' },
              maxLength: { value: 15, message: 'Too long' },
              pattern: { value: /^[a-zA-Z]+$/, message: 'Use only letters' },
            }}
            render={({ field }) => (
              <Input
                type="text"
                label="First name"
                wrapperClassName="flex-1"
                errorMessage={errors.firstname?.message}
                {...field}
              />
            )}
          ></Controller>

          <Controller
            name="lastname"
            control={control}
            rules={{
              required: 'Last name is required',
              minLength: { value: 2, message: 'Too short' },
              maxLength: { value: 15, message: 'Too long' },
              pattern: { value: /^[a-zA-Z]+$/, message: 'Use only letters' },
            }}
            render={({ field }) => (
              <Input
                type="text"
                label="Last name"
                wrapperClassName="flex-1"
                errorMessage={errors.lastname?.message}
                {...field}
              />
            )}
          ></Controller>
        </div>

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            maxLength: { value: 35, message: 'Too long' },
            pattern: { value: /\S+@\S+\.\S+/, message: 'Incorrect format' },
          }}
          render={({ field, fieldState }) => (
            <Input
              type="email"
              label="Email"
              wrapperClassName="mb-4 lg:mb-8"
              errorMessage={errors.email?.message}
              {...field}
            />
          )}
        ></Controller>

        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            validate: validatePassword,
          }}
          render={({ field }) => (
            <Input
              type="password"
              label="Password"
              errorMessage={errors.password?.message}
              wrapperClassName="mb-4 lg:mb-8"
              {...field}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: ' Password is required',
            validate: (value) =>
              value === watch('password') || 'Passwords do not match',
          }}
          render={({ field }) => (
            <Input
              type="password"
              label="Confirm Password"
              wrapperClassName="mb-8"
              errorMessage={errors.confirmPassword?.message}
              {...field}
            />
          )}
        />

        <Button
          size="lg"
          className="w-full"
          type="submit"
          isLoading={isSubmitting}
        >
          Register
        </Button>
      </form>

      {customError && <p className="text-red-700">{customError}</p>}

      <p className="text-gray-400">
        Already red? No worrier, just{' '}
        <Link
          href="/my-account/login"
          className="relative ml-1 cursor-pointer text-primary before:absolute before:-bottom-1 before:h-[0.0625rem] before:w-full before:bg-primary hover:text-primary-900 hover:before:bg-primary-900"
        >
          log in
        </Link>
      </p>
    </div>
  );
};

MyAccountRegisterPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default MyAccountRegisterPage;
