import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { NextPageWithLayout } from '@/pages/_app';
import HomeLayout from '@/layouts/HomeLayout';
import { Button } from '@/components/ui/Button';
import { Product } from '@/components/Product';
import { Heading } from '@/components/ui/Heading';

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <div className="relative flex h-screen items-center justify-center">
        <Image
          src="/images/content/hero.jpg"
          height={1151}
          width={1440}
          alt="Red logo shirt"
          className="absolute h-full w-full object-cover"
        />

        <div className="z-10 mt-80 px-4 xl:px-0">
          <Heading size="xl8" className="mb-11 text-center text-white">
            Crystal and shine with red
          </Heading>

          <Link href="/shop">
            <Button variant="dark" className="mx-auto" size="lg">
              Shop now
            </Button>
          </Link>
        </div>
      </div>

      <main className="px-4 py-14 lg:px-24 lg:pb-32 lg:pt-39">
        <div className="grid grid-cols-12">
          <Heading
            size="xl4"
            className="col-span-12 mb-14 leading-[1.1] text-primary lg:col-span-10 xl:col-span-8"
          >
            Embrace the laid-back allure of street fashion, radiating cool vibes
            and a dash of chill.
          </Heading>
        </div>

        <div className="md:flex-lg mb-14 flex flex-col gap-x-12 gap-y-10 lg:mb-41 lg:flex-row lg:gap-y-0">
          <div className="relative h-[40vh] w-full md:h-[70vh]">
            <Link href="/">
              <Image
                src="/images/content/red-bag.jpg"
                height={512}
                width={384}
                alt="Red bag"
                className="absolute h-full w-full object-cover"
              />
            </Link>

            <p className="pointer-events-none absolute left-8 top-8 text-lg text-white">
              Fresh new drops
            </p>
          </div>

          <div className="relative h-[40vh] w-full md:h-[70vh]">
            <Link href="/">
              <Image
                src="/images/content/red-t-shirt.jpg"
                height={512}
                width={384}
                alt="Red T-shirt"
                className="absolute h-full w-full object-cover"
              />
            </Link>

            <p className="pointer-events-none absolute left-8 top-8 text-lg text-white">
              Matz digs red
            </p>
          </div>

          <div className="relative h-[40vh] w-full md:h-[70vh]">
            <Link href="/">
              <Image
                src="/images/content/red-t-shirt-2.jpg"
                height={512}
                width={384}
                alt="Red T-shirt"
                className="absolute h-full w-full object-cover"
              />
            </Link>

            <p className="pointer-events-none absolute left-8 top-8 text-lg text-white">
              Collectors essentials
            </p>
          </div>
        </div>

        <div className="mb-11 flex flex-wrap items-start justify-between gap-x-4">
          <Heading className="mb-10 block text-primary lg:mb-0" size="xl">
            The beloved.
            <span className="ml-2 text-gray-400">
              Catch yours before they sell out.
            </span>
          </Heading>

          <Link href="/shop">
            <Button variant="secondary">Shop all</Button>
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-y-10 md:gap-x-12">
          <Product
            className="col-span-12 md:col-span-6 lg:col-span-3"
            title="Black Sweatshirt"
            price={30}
            collection="fresh"
            src="/images/content/item-fresh-bag-white.png"
            height={3200}
            width={2400}
            alt="Black sweatshirt"
            linkTo="/product/black-sweatshirt"
          />

          <Product
            className="col-span-12 md:col-span-6 lg:col-span-3"
            title="Black Sweatshirt"
            price={30}
            collection="fresh"
            src="/images/content/item-fresh-bag-white.png"
            height={3200}
            width={2400}
            alt="Black sweatshirt"
            linkTo="/product/black-sweatshirt"
          />

          <Product
            className="col-span-12 md:col-span-6 lg:col-span-3"
            title="Black Sweatshirt"
            price={30}
            collection="fresh"
            src="/images/content/item-fresh-bag-white.png"
            height={3200}
            width={2400}
            alt="Black sweatshirt"
            linkTo="/product/black-sweatshirt"
          />

          <Product
            className="col-span-12 md:col-span-6 lg:col-span-3"
            title="Black Sweatshirt"
            price={30}
            collection="fresh"
            src="/images/content/item-fresh-bag-white.png"
            height={3200}
            width={2400}
            alt="Black sweatshirt"
            linkTo="/product/black-sweatshirt"
          />
        </div>
      </main>
    </>
  );
};

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default HomePage;
