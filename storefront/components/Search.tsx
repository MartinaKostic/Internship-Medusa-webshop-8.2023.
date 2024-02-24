import { Input } from './Input';
import * as React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { RegionPicker } from './ui/RegionPicker';
import { useCart, useProducts } from 'medusa-react';
import { useAccount } from '@/lib/context/account-context';
import { useCustomerOrders } from 'medusa-react';
import { useRouter } from 'next/router';
import { medusaClient } from '@/lib/config';
import classNames from '@/utils/classNames';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Icon, BadgeIcon } from '@/components/ui/Icon';
import Link from 'next/link';
import { HeaderProps } from './Header';

const Search: React.FC<HeaderProps> = ({
  isAbsolute = false,
  colorScheme = 'primary',
}) => {
  const { customer } = useAccount();
  const { orders, isLoading } = useCustomerOrders();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const router = useRouter();
  const { cart } = useCart();
  const [searchInput, setSearchInput] = React.useState<string>('');
  const [products, setProducts] = React.useState<PricedProduct[]>([]);

  const handleSearch = () => {
    router.push({
      pathname: '/search',
      query: {
        searchInput,
      },
    });
    setSearchInput('');
    setIsSearchOpen(false);
  };
  const handleEnterSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push({
        pathname: '/search',
        query: {
          searchInput,
        },
      });
      setSearchInput('');
      setIsSearchOpen(false);
    }
  };
  React.useEffect(() => {
    if (searchInput.length > 0) {
      medusaClient.products
        .search({
          q: searchInput,
        })
        .then(({ hits }) => {
          const pricedProducts: PricedProduct[] = hits as PricedProduct[];
          console.log(pricedProducts);
          setProducts(pricedProducts);
        });
    } else {
      setProducts([]);
    }
  }, [searchInput]);

  return (
    <ul className="hidden md:flex md:items-center [&>li:last-child]:mr-0 [&>li]:mr-8 [&>li]:cursor-pointer">
      <li className="relative !mr-4 flex">
        <div className="dropdown-full-width">
          <Dropdown.Root open={isSearchOpen} modal={false}>
            <Dropdown.Trigger>
              <Input
                placeholder="Search"
                className={classNames(
                  'rounded-sm !pl-13 !pr-9 transition-all md:!py-4 md:placeholder-shown:!py-4 lg:!py-4 lg:placeholder-shown:!py-4',
                  colorScheme === 'inverted' && 'text-white'
                )}
                wrapperClassName={classNames(
                  'w-0 overflow-hidden transition-width',
                  isSearchOpen && 'xl:w-84 w-50'
                )}
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                onKeyDown={(e) => {
                  handleEnterSearch(e);
                }}
              />
            </Dropdown.Trigger>
            <Dropdown.Content
              className="dropdown-content w-56.5"
              sideOffset={10}
              align="end"
            >
              {products &&
                products.map((product) => (
                  <Dropdown.Item
                    className="dropdown-item font-black italic text-primary hover:bg-transparent"
                    id={product.id}
                    key={product.id}
                    onClick={() => router.push(`/product/${product.handle}`)}
                  >
                    {product.title}
                  </Dropdown.Item>
                ))}
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
        <button
          className={classNames(
            'absolute right-4 top-4 transition-opacity',
            isSearchOpen && 'opacity-0'
          )}
          onClick={() => setIsSearchOpen(true)}
        >
          <Icon name="search" />
        </button>
        <button
          className={classNames(
            'pointer-events-none absolute right-4 top-4 opacity-0 transition-opacity',
            isSearchOpen && 'pointer-events-auto opacity-100'
          )}
          onClick={() => {
            setIsSearchOpen(false);
            setSearchInput('');
          }}
        >
          <Icon name="x" />
        </button>
        <button
          className={classNames(
            'transtion-opacity pointer-events-none absolute left-4 top-4 z-10 opacity-0 delay-75 xl:delay-100',
            isSearchOpen && 'pointer-events-auto opacity-100'
          )}
          onClick={() => handleSearch()}
        >
          <Icon name="search" className="w-5" />
        </button>
      </li>
      <li>
        <RegionPicker colorScheme={colorScheme} />
      </li>
      <li>
        <Link
          href={customer?.has_account ? '/my-account' : '/my-account/login'}
        >
          <BadgeIcon icon="user" value={orders?.length ? orders.length : '0'} />
        </Link>
      </li>
      <li>
        <Link href="/cart">
          <BadgeIcon
            icon="bag"
            value={cart?.items.length ? cart.items.length : '0'}
          />
        </Link>
      </li>
    </ul>
  );
};
export default Search;
