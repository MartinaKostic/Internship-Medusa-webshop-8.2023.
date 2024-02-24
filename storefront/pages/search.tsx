import * as React from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Heading } from '@/components/ui/Heading';
import { Product } from '@/components/Product';
import { ShopFilter } from './shop';
import { useRouter } from 'next/router';

import { useCart } from 'medusa-react';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { medusaClient } from '@/lib/config';

const SearchPage: NextPageWithLayout = () => {
  const { cart } = useCart();
  const [selectedSortOption, setSelectedSortOption] =
    React.useState('Whatever');
  const [products, setProducts] = React.useState<PricedProduct[]>([]);
  const [sortedProducts, setSortedProducts] = React.useState<PricedProduct[]>(
    []
  );
  const [search, setSearch] = React.useState<string>('');
  const router = useRouter();

  React.useEffect(() => {
    if (products !== undefined) {
      const sortedProducts = [...products];
      if (selectedSortOption === 'Newest') {
        sortedProducts.sort((a, b) => {
          if (a.created_at !== undefined && b.created_at !== undefined) {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          } else return 0;
        });
      } else if (selectedSortOption === 'Highest price') {
        sortedProducts.sort((a, b) => {
          if (
            a.variants[0].prices[handlePrice()].amount !== null &&
            b.variants[0].prices[handlePrice()].amount !== null
          ) {
            return (
              b.variants[0].prices[handlePrice()].amount -
              a.variants[0].prices[handlePrice()].amount
            );
          } else return 0;
        });
      } else if (selectedSortOption === 'Lowest price') {
        sortedProducts.sort((a, b) => {
          if (
            a.variants[0].prices[handlePrice()].amount !== null &&
            b.variants[0].prices[handlePrice()].amount !== null
          ) {
            return (
              a.variants[0].prices[handlePrice()].amount -
              b.variants[0].prices[handlePrice()].amount
            );
          } else return 0;
        });
      }
      setSortedProducts(sortedProducts); // Update the state with sorted products}
    }
  }, [selectedSortOption, products]);

  React.useEffect(() => {
    if (router.query.searchInput) {
      setSearch(router.query.searchInput as string);
    }

    medusaClient.products
      .search({
        q: router.query.searchInput as string,
      })
      .then(({ hits }) => {
        const pricedProducts: PricedProduct[] = hits as PricedProduct[];
        // console.log(hits);
        setProducts(pricedProducts);
      });
  }, [router.query.searchInput]);

  const handlePrice = () => {
    if (cart?.region?.currency_code === 'eur') {
      return 0;
    } else return 1;
  };
  return (
    <>
      {sortedProducts && !sortedProducts.length && (
        <span>No products with that search input!</span>
      )}
      {sortedProducts && sortedProducts.length > 0 && (
        <main className="px-4 py-10 lg:px-24 lg:pb-39.5 lg:pt-17">
          <div className="relative mb-10 flex items-center justify-between lg:mb-19">
            <Heading size="xl6" className="text-primary">
              "{search}"
              <div className="text-sm text-gray-300">
                <p>{sortedProducts.length} items found</p>
              </div>
            </Heading>

            <ShopFilter
              setSelectedSortOption={setSelectedSortOption}
              selectedSortOption={selectedSortOption}
            />
          </div>

          <div className="grid grid-cols-12 gap-y-8 md:gap-x-12">
            {sortedProducts?.map((product: PricedProduct) => (
              <Product
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                key={product.id}
                title={product.title || ''}
                price={product.variants[0].prices[handlePrice()].amount}
                discount={0}
                discountedPrice={0}
                collection={product.collection?.handle || ''}
                src={product.thumbnail || ''}
                height={3200}
                width={2400}
                alt={product.title || ''}
                linkTo={`/product/${product.handle}`}
              />
            ))}
          </div>
        </main>
      )}
    </>
  );
};

SearchPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default SearchPage;
