import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { NextPageWithLayout } from '@/pages/_app';
import AuthLayout from '@/layouts/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/Input';
import { Heading } from '@/components/ui/Heading';
import { useAccount } from '@/lib/context/account-context';

const MyAccountLoginPage: NextPageWithLayout = () => {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const account = useAccount();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [customError, setCustomError] = React.useState('');

  // za error:  setIsLoading(false);
  // setCustomError('Something went wrong, try again!');
  //console.log(account);
  React.useEffect(() => {
    if (account.customer) {
      router.push('/my-account');
    }
  }, [account]);

  const tryLogin = async (email: string, pass: string) => {
    const { error } = await account.handleLogin(email, pass);
    if (error) {
      setIsLoading(false);
      setCustomError('Something went wrong, try again!');
    } else {
      setIsLoading(true);
      setCustomError('');
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Heading className="mb-8 !leading-[1.1] text-primary lg:mb-16" size="xl3">
        Hey gorgeous,
        <br /> welcome back
      </Heading>

      <form className="mb-4 xl:mb-16">
        <Input
          type="email"
          label="Email"
          wrapperClassName="mb-4 lg:mb-8"
          onChange={(value) => setEmail(value.target.value)}
        />

        <Input
          type="password"
          label="Password"
          wrapperClassName="mb-8"
          onChange={(value) => setPass(value.target.value)}
        />
        {/* ovo nije dobar nacin nista se ne ispise: */}
        <Button
          isLoading={isLoading}
          onPress={() => {
            tryLogin(email, pass);
          }}
          size="lg"
          className="w-full"
        >
          Log in
        </Button>
      </form>
      {customError && <p className="text-red-700">{customError}</p>}
      <p className="text-gray-400">
        Not red yet? Bro just{' '}
        <Link
          href="/my-account/register"
          className="relative ml-1 cursor-pointer text-primary before:absolute before:-bottom-1 before:h-[0.0625rem] before:w-full before:bg-primary hover:text-primary-900 hover:before:bg-primary-900"
        >
          sign up
        </Link>
      </p>
    </div>
  );
};

MyAccountLoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default MyAccountLoginPage;
