import * as React from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header isAbsolute />

      <main className="flex px-4 lg:px-0">
        <div className="relative hidden min-h-full w-1/2 lg:block">
          <Image
            src="/images/content/white-tote-bag.jpg"
            height={816}
            width={720}
            alt="White Tote bag"
            className="absolute left-0 top-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex min-h-screen w-full items-center justify-center pb-10 pt-31 lg:w-1/2">
          {children}
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
