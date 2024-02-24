import * as React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

import type { NextPageWithLayout } from '@/pages/_app';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Heading } from '@/components/ui/Heading';
import { Product } from '@/components/Product';
import { Icon } from '@/components/ui/Icon';
import { useCart, useProducts } from 'medusa-react';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

interface ShopFilterProps {
  setSelectedSortOption: (option: string) => void;
  selectedSortOption: string;
}

export const ShopFilter: React.FC<ShopFilterProps> = ({
  selectedSortOption,
  setSelectedSortOption,
}) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button className="dropdown-trigger text-gray-300 transition-all hover:text-black">
          <div className="flex text-sm">
            <p>Sort by:</p>

            <Icon
              name="chevron-down"
              className="ml-2 transition-all [&>path]:stroke-gray-300"
            />
          </div>

          <p className="text-sm font-black italic">{selectedSortOption}</p>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content
        className="dropdown-content w-56.5"
        sideOffset={24}
        align="end"
      >
        <Dropdown.Item
          className="dropdown-item font-black italic text-primary"
          onClick={() => setSelectedSortOption('Whatever')}
        >
          Whatever
        </Dropdown.Item>
        <Dropdown.Item
          className="dropdown-item"
          onClick={() => setSelectedSortOption('Newest')}
        >
          Newest
        </Dropdown.Item>
        <Dropdown.Item
          className="dropdown-item"
          onClick={() => setSelectedSortOption('Lowest price')}
        >
          Lowest price
        </Dropdown.Item>
        <Dropdown.Item
          className="dropdown-item"
          onClick={() => setSelectedSortOption('Highest price')}
        >
          Highest price
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
const imagePerRow = 4;

const ShopPage: NextPageWithLayout = () => {
  const { cart } = useCart();
  const { products, isLoading } = useProducts({
    cart_id: cart?.id,
    region_id: cart?.region_id,
  });
  const [selectedSortOption, setSelectedSortOption] =
    React.useState('Whatever');
  const [sortedProducts, setSortedProducts] = React.useState<PricedProduct[]>(
    []
  );
  const [next, setNext] = React.useState(imagePerRow);
  const handleMoreImage = () => {
    setNext(next + imagePerRow);
  };
  React.useEffect(() => {
    if (products !== undefined) {
      const sortedProducts = [...products]; //kopija proizvoda
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
            a.variants[0].calculated_price !== null &&
            b.variants[0].calculated_price !== null
          ) {
            return (
              b.variants[0].calculated_price - a.variants[0].calculated_price
            );
          } else return 0;
        });
      } else if (selectedSortOption === 'Lowest price') {
        sortedProducts.sort((a, b) => {
          if (
            a.variants[0].calculated_price !== null &&
            b.variants[0].calculated_price !== null
          ) {
            return (
              a.variants[0].calculated_price - b.variants[0].calculated_price
            );
          } else return 0;
        });
      }
      setSortedProducts(sortedProducts); // Update the state with sorted products}
    }
  }, [selectedSortOption, products]);

  return (
    <>
      {isLoading && <span>Loading...</span>}
      {sortedProducts && !sortedProducts.length && (
        <span>Nothing in the store.</span>
      )}
      {sortedProducts && sortedProducts.length > 0 && (
        <main className="px-4 py-10 lg:px-24 lg:pb-39.5 lg:pt-17">
          <div className="relative mb-10 flex items-center justify-between lg:mb-19">
            <Heading size="xl6" className="text-primary">
              Shop
            </Heading>

            <ShopFilter
              setSelectedSortOption={setSelectedSortOption}
              selectedSortOption={selectedSortOption}
            />
          </div>

          <div className="grid grid-cols-12 gap-y-8 md:gap-x-12">
            {sortedProducts
              ?.slice(0, next)
              ?.map((product: PricedProduct) => (
                <Product
                  className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
                  key={product.id}
                  title={product.title || ''}
                  price={product.variants[0].calculated_price || 0}
                  discount={Math.floor(
                    ((product.variants[0].original_price! -
                      product.variants[0].calculated_price!) /
                      product.variants[0].original_price!) *
                      100
                  )}
                  discountedPrice={product.variants[0].original_price || 0}
                  collection={product.collection?.handle || ''}
                  src={product.thumbnail || ''}
                  height={3200}
                  width={2400}
                  alt={product.title || ''}
                  linkTo={`/product/${product.handle}`}
                  colors={Array.from(
                    new Set(
                      product.options
                        ?.find((option) => option.title === 'Color')
                        ?.values?.map((value) => value.value)
                    )
                  )}
                />
              ))}
          </div>
          {next < sortedProducts.length && (
            <button
              onClick={() => handleMoreImage()}
              className="relative mx-auto mt-9 block transition-all before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-gray-900 before:content-[''] hover:font-black hover:before:border-b-2"
            >
              There is more
            </button>
          )}
        </main>
      )}
    </>
  );
};

ShopPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default ShopPage;
