import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from '@/utils/classNames';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Heading } from '@/components/ui/Heading';
import { useAccount } from '@/lib/context/account-context';
import { Button } from '@/components/ui/Button';

const AboutSidebar = () => {
  const account = useAccount();
  const pathname = useRouter().asPath;
  const activeItemClasses = 'font-black text-primary italic';

  return account.customer ? (
    <div className="block w-full whitespace-nowrap bg-gray-50 lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:px-10 lg:pb-16 lg:pt-23 xl:px-23">
      <Heading className="mb-8 hidden text-primary lg:block xl:mb-12" size="xl">
        My account
      </Heading>

      <ul className="flex justify-between gap-x-8 gap-y-6 overflow-auto px-4 py-6 lg:flex-col lg:px-0">
        <li
          className={classNames({
            [activeItemClasses]: pathname === '/my-account',
          })}
        >
          <Link href="/my-account/">Personal & security</Link>
        </li>
        <li
          className={classNames({
            [activeItemClasses]: pathname === '/my-account/payment-method',
          })}
        >
          <Link href="/my-account/payment-method/">Payment method</Link>
        </li>
        <li
          className={classNames({
            [activeItemClasses]: pathname.startsWith('/my-account/orders'),
          })}
        >
          <Link href="/my-account/orders">My orders</Link>
        </li>
        <li className="bottom-37 cursor-pointer lg:absolute">
          <Button className="mt-10" onPress={() => account.handleLogout()}>
            Log out
          </Button>
        </li>
      </ul>
    </div>
  ) : null;
};

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DefaultLayout>
      <main className="lg:flex lg:pr-20 xl:pr-39">
        <AboutSidebar />

        <div className="w-full max-w-7xl px-4 py-10 lg:pb-16 lg:pl-20 lg:pr-0 lg:pt-23 xl:pl-39">
          {children}
        </div>
      </main>
    </DefaultLayout>
  );
};

export default AccountLayout;
