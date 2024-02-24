import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart, useProducts } from 'medusa-react';
import { ProductVariant } from '@medusajs/medusa';
import { getCurrency } from '@/utils/prices';
import type { NextPageWithLayout } from '@/pages/_app';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Button, ButtonProps } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Heading } from '@/components/ui/Heading';
import { QuantityInput } from '@/components/ui/QuantityInput';
import { useStore } from '@/lib/context/store-context';
import { PricedVariant } from '@medusajs/medusa/dist/types/pricing';
import RecommendedProducts from '@/components/RecommendedProducts';
import { useNotification } from '@/lib/context/notification-context';
import Notification from '@/components/ui/Notification';

export interface ColorMap {
  [key: string]: string;
}

interface ProductOptions {
  selectedVariant: ProductVariant | PricedVariant | undefined;
  selectedQuantity: number;
  selectedColor: string | undefined;
  selectedSize: string | undefined;
}

export const colorFillMapping: ColorMap = {
  White: '#FDFDFD',
  Black: '#050505',
  Blue: '#1E2DA0',
  Gray: '#D0D0D2',
};
const allSizes = ['XS', 'S', 'M', 'L', 'XL'];

const ProductSinglePage: NextPageWithLayout = () => {
  const router = useRouter();
  const store = useStore();
  const { cart } = useCart();
  const { addNotification, notification, setNotification } = useNotification();
  const handle = router.query.productSlug
    ? Array.isArray(router.query.productSlug)
      ? router.query.productSlug[0]
      : router.query.productSlug
    : undefined;

  const { products } = useProducts({
    handle,
    limit: 1,
    cart_id: cart?.id,
    region_id: cart?.region_id,
  });

  const product = React.useMemo(
    () => (products ? products[0] : undefined),
    [products]
  );

  const availableColors = product
    ? Array.from(
        new Set(
          product.options
            ?.find((option) => option.title === 'Color')
            ?.values?.map((value) => value.value)
        )
      )
    : undefined;

  const [options, setOptions] = React.useState<ProductOptions>({
    selectedColor: availableColors ? availableColors[0] : undefined,
    selectedSize: undefined,
    selectedQuantity: 1,
    selectedVariant: undefined,
  });

  const availableVariants = React.useMemo(
    () =>
      product?.variants.filter(
        (variant) =>
          variant.options?.some(
            (option) => option.value === options.selectedColor
          )
      ) ?? [],
    [product, options.selectedColor]
  );

  const ColorId = availableVariants
    .flatMap((variant) => variant.options)
    .find((option) => option?.value === options.selectedColor)?.option_id;

  const availableSizes = availableVariants
    .filter(
      (variant) =>
        typeof variant?.inventory_quantity !== 'undefined' &&
        (variant.inventory_quantity > 0 || variant.allow_backorder)
    )
    .flatMap((variant) => variant.options || [])
    .filter((option) => option.option_id !== ColorId)
    .map((filteredOption) => filteredOption.value);

  React.useEffect(() => {
    if (product) {
      setOptions((prevVal) => ({
        ...prevVal,
        selectedColor: availableColors ? availableColors[0] : undefined,
      }));
    }
    if (notification) {
      setNotification('');
    }
  }, [product]);

  const handleAddItem = React.useCallback(
    (productName: string) => {
      if (!options.selectedVariant || !options.selectedVariant.id) {
        return;
      }

      store.addItem({
        variantId: options.selectedVariant.id,
        quantity: options.selectedQuantity,
      });

      addNotification(`${productName} added to cart`);
    },
    [options]
  );

  const sizeToProductVariant = React.useCallback(
    (size: string | undefined) => {
      if (typeof size === 'undefined') {
        return undefined;
      }

      return availableVariants.find((variant) => {
        if (!variant.options || !variant.options.length) {
          return false;
        }

        return Boolean(variant.options.find((opt) => opt.value === size));
      });
    },
    [availableVariants]
  );
  return product ? (
    <main className="group flex grid-cols-12 flex-col-reverse px-4 py-8 sm:px-24 lg:grid lg:pb-36 lg:pl-0 lg:pt-15 xl:pl-24">
      <div className="col-span-6 mt-20 lg:mt-20">
        <ul className="[&>li:last-child]:mb-0 [&>li]:mb-8">
          {product.images?.map((image) => (
            <li className="relative" key={image.id}>
              <Image
                src={image.url}
                height={3200}
                width={2400}
                alt={image.id}
                key={image.id}
                className="peer relative z-10 aspect-[3/4] w-full"
              />

              <Image
                src={`/images/content/${product.collection?.handle}-bg.png`}
                height={3200}
                width={2400}
                alt="Background"
                className="absolute left-0 top-0 h-full w-full"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-6 lg:ml-27">
        <Heading size="xl3" className="mb-3 text-primary">
          {product.title}
        </Heading>
        {product.variants[0].original_price &&
          product.variants[0].calculated_price &&
          product.variants[0].original_price !==
            product.variants[0].calculated_price && (
            <Tag variant="discount" className="mb-4">
              -
              {Math.round(
                ((product.variants[0].original_price -
                  product.variants[0].calculated_price) /
                  product.variants[0].original_price) *
                  100
              )}
              %
            </Tag>
          )}

        <p className="text-xl text-red-900">
          {product.variants[0].calculated_price &&
            (product.variants[0].calculated_price / 100).toFixed(2)}
          {getCurrency(cart)}
        </p>
        {product.variants[0].original_price &&
          product.variants[0].calculated_price &&
          product.variants[0].original_price !==
            product.variants[0].calculated_price && (
            <p className="mt-2 text-lg text-gray-400 line-through">
              {product.variants[0].original_price &&
                (product.variants[0].original_price / 100).toFixed(2)}
              {getCurrency(cart)}
            </p>
          )}

        <ul className="my-12 [&>li:last-child]:mb-0 [&>li]:mb-3.5">
          {product.description}
        </ul>
        <p className="mb-4">Color</p>
        <ul className="mb-8 flex flex-wrap gap-3">
          {availableColors?.map((color) => (
            <li className="relative" key={color}>
              <input
                type="radio"
                id={`color${color}`}
                className="peer hidden"
                value={color}
                checked={options.selectedColor === color ? true : false}
                onChange={(val) =>
                  setOptions((prevVal) => ({
                    ...prevVal,
                    selectedColor: val.target.value,
                    selectedVariant: undefined,
                    selectedSize: undefined,
                  }))
                }
              />
              <label
                htmlFor={`color${color}`}
                className="group relative flex h-full w-full cursor-pointer items-center justify-center border border-transparent transition-all peer-checked:border-gray-900 peer-hover:border peer-hover:border-primary peer-disabled:pointer-events-none peer-disabled:border-0 peer-disabled:bg-gray-50 peer-disabled:[&>svg]:opacity-50"
              >
                <svg
                  width="62"
                  height="28"
                  viewBox="0 0 62 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.5709 4.8C23.0168 5.47692 23.7712 6.52308 23.9912 7.87692C24.117 8.58462 24.0855 9.41538 23.9598 10.3077C23.8026 11.2308 23.5197 12 23.174 12.6154C22.451 13.8462 21.3823 14.4615 19.9993 14.7692C22.1681 15.2308 22.5139 16.3692 22.0424 19.0154L21.9795 19.2923L21.3194 22.9231L21.1308 23.9385H13.5241H12.9583L13.1784 22.6154L13.7756 19.3538C13.7897 19.2707 13.7975 19.1938 13.8047 19.1231C13.8134 19.0369 13.8212 18.9599 13.8385 18.8923C13.9327 18.0615 13.7442 18 13.2412 18L12.1725 23.9385H4L7.5519 4H16.856C17.7047 4 18.5219 4.06154 19.2135 4.15385C20.1564 4.27692 20.9423 4.49231 21.5709 4.8ZM15.0329 12.2462C15.2529 12.0923 15.4101 11.7846 15.5044 11.3231C15.5987 10.9538 15.5358 10.6154 15.3472 10.4615C15.2529 10.3692 15.1272 10.3077 14.9386 10.3077H14.5928L14.2156 12.4H14.5928C14.75 12.4 14.9072 12.3385 15.0329 12.2462ZM37.099 23.9385H21.917L25.4689 4H40.6509L39.4565 10.6462H32.2584L32.1326 11.2308H39.3622L38.4192 16.4615H31.2211L31.0954 17.0769H38.2935L37.099 23.9385ZM41.4044 4H49.7341C55.612 4 58.1581 6.8 57.1837 12.2769L56.4922 16.1231C56.1778 17.8769 55.7063 19.2923 55.0148 20.4923C53.6946 22.8 51.3686 23.9385 47.1252 23.9385H37.8525L41.4044 4ZM48.4139 10.4L47.2195 17.2923H47.2509C47.8482 17.2923 48.0368 17.1385 48.2253 16.0308L49.0112 11.5692C49.1998 10.5846 49.1369 10.4 48.4768 10.4H48.4139Z"
                    fill={colorFillMapping[color] || 'transparent'}
                  />
                  {color === 'White' && (
                    <path
                      fill="#D0D0D2"
                      d="m23.991 7.877-.987.16.001.008.002.007.984-.175ZM21.571 4.8l-.44.898.008.004.008.004.424-.906Zm2.389 5.508.986.168.002-.015.002-.014-.99-.14Zm-.786 2.307.862.507.005-.008.005-.009-.872-.49Zm-3.175 2.154-.217-.976.01 1.954.207-.978Zm2.043 4.246.976.222.005-.023.004-.023-.985-.176Zm-.063.277-.975-.221-.005.021-.003.021.984.18Zm-.66 3.631.984.183v-.004l-.984-.179Zm-.188 1.016v1h.831l.152-.818-.983-.182Zm-8.173 0-.986-.165-.194 1.165h1.18v-1Zm.22-1.324-.983-.18-.002.008-.001.008.986.164Zm.598-3.261.983.18.002-.012-.985-.168Zm.029-.23-.995-.102.995.101Zm.034-.232.968.248.017-.067.008-.068-.994-.113ZM13.24 18v-1h-.836l-.148.823.984.177Zm-1.069 5.939v1h.837l.148-.823-.985-.177Zm-8.172 0-.985-.176-.209 1.175H4v-1ZM7.552 4V3h-.838l-.147.825.985.175Zm11.662.154-.133.991h.003l.13-.991Zm-3.71 7.17-.968-.248-.006.023-.005.024.98.2Zm-.471.922-.573-.82-.01.007-.009.007.592.806Zm.314-1.785-.7.715.033.032.035.028.632-.775Zm-.754-.153v-1h-.836l-.148.822.984.178Zm-.377 2.092-.984-.177-.213 1.177h1.197v-1Zm7.701 11.539-.985-.176-.209 1.175h1.194v-1Zm15.182 0v1h.841l.144-.829-.985-.171ZM25.469 4V3h-.838l-.147.825.985.175ZM40.65 4l.984.177L41.847 3H40.65v1Zm-1.195 6.646v1h.837l.148-.823-.985-.177Zm-7.198 0v-1h-.807l-.17.79.977.21Zm-.125.585-.978-.21-.26 1.21h1.238v-1Zm7.23 0 .983.177.213-1.177h-1.197v1Zm-.944 5.23v1h.836l.148-.822-.984-.177Zm-7.198 0v-1h-.816l-.164.8.98.2Zm-.126.616-.98-.2-.245 1.2h1.225v-1Zm7.199 0 .985.171.204-1.171h-1.19v1ZM41.404 4V3h-.837l-.147.825.984.175Zm15.78 8.277.984.177v-.002l-.984-.175Zm-.692 3.846-.984-.177.984.177Zm-1.477 4.37-.867-.5-.001.003.868.496Zm-17.163 3.446-.984-.176-.21 1.175h1.194v-1Zm9.367-6.647-.985-.17-.203 1.17h1.188v-1Zm1.195-6.892v-1h-.842l-.143.83.985.17Zm-.189 5.63-.985-.173v.006l.985.168Zm.786-4.46-.982-.189-.001.007-.002.008.985.173ZM24.978 7.716c-.275-1.694-1.25-3.012-2.983-3.823l-.848 1.812c1.16.542 1.692 1.317 1.857 2.331l1.974-.32Zm-.028 2.73c.133-.941.178-1.89.026-2.745l-1.97.35c.1.56.082 1.273-.036 2.116l1.98.28Zm-.904 2.658c.406-.722.725-1.601.9-2.63l-1.972-.335c-.14.818-.386 1.477-.672 1.986l1.744.98Zm-3.83 2.64c1.578-.35 2.921-1.093 3.82-2.623l-1.724-1.013c-.547.931-1.341 1.42-2.53 1.684l.434 1.952Zm2.81 3.446c.236-1.322.333-2.545-.101-3.523-.487-1.099-1.495-1.617-2.718-1.877l-.416 1.956c.946.202 1.196.484 1.306.732.163.367.197 1.037-.04 2.361l1.97.35Zm-.071.323.063-.277-1.95-.443-.064.277 1.95.443Zm-.652 3.588.66-3.63-1.967-.359-.66 3.631 1.967.358Zm-.189 1.02.189-1.016-1.967-.366-.188 1.016 1.966.365Zm-8.59.817h7.607v-2h-7.607v2Zm-.566 0h.566v-2h-.566v2Zm-.766-2.488-.22 1.323 1.973.328.22-1.323-1.973-.328Zm.6-3.277-.597 3.261 1.967.36.597-3.261-1.967-.36Zm.018-.152a2.461 2.461 0 0 1-.02.164l1.971.336c.021-.121.032-.23.039-.298l-1.99-.202Zm.06-.377c-.04.154-.054.312-.06.377l1.99.202.005-.055.004-.034c.003-.018.003-.013-.002.005l-1.938-.495Zm.371.355c.055 0 .09 0 .112.002.023.002.018.003-.004-.002a.666.666 0 0 1-.357-.23c-.126-.152-.133-.287-.131-.268a1.57 1.57 0 0 1-.016.277l1.987.226c.027-.234.041-.476.019-.702a1.475 1.475 0 0 0-.315-.804 1.339 1.339 0 0 0-.765-.454 2.524 2.524 0 0 0-.53-.045v2Zm-.084 5.116 1.068-5.939-1.968-.354-1.069 5.938 1.969.355ZM4 24.939h8.172v-2H4v2ZM6.567 3.825 3.015 23.763l1.97.35L8.535 4.176l-1.969-.35ZM16.856 3H7.552v2h9.304V3Zm2.49.163A19.155 19.155 0 0 0 16.856 3v2c.803 0 1.576.058 2.225.145l.265-1.982Zm2.665.739c-.755-.37-1.653-.607-2.668-.74l-.259 1.983c.871.114 1.544.307 2.047.553l.88-1.796Zm-7.486 7.22a1.315 1.315 0 0 1-.1.323c-.025.049-.022.021.035-.018l1.146 1.639c.54-.378.768-1.004.878-1.543l-1.96-.4Zm.19.114a.447.447 0 0 1-.167-.244c-.002-.014.005.016-.012.084l1.937.494c.077-.3.1-.625.043-.939a1.57 1.57 0 0 0-.537-.944l-1.264 1.55Zm.224.072a.379.379 0 0 1-.135-.03.487.487 0 0 1-.156-.102l1.399-1.43a1.547 1.547 0 0 0-1.108-.438v2Zm-.346 0h.346v-2h-.346v2Zm.607 1.27.377-2.093-1.968-.355-.377 2.093 1.968.354Zm-.607-1.178h-.377v2h.377v-2Zm-.152.04a.167.167 0 0 1 .044-.023.316.316 0 0 1 .108-.017v2c.41 0 .77-.155 1.032-.348L14.44 11.44Zm7.476 13.499h15.182v-2H21.917v2Zm2.567-21.114-3.552 19.938 1.97.35 3.551-19.938-1.969-.35ZM40.651 3H25.469v2H40.65V3Zm-.21 7.823 1.194-6.646-1.968-.354-1.195 6.646 1.969.354Zm-8.183.823h7.198v-2h-7.198v2Zm.852-.205.126-.585-1.955-.42-.126.585 1.955.42Zm6.252-1.21h-7.23v2h7.23v-2Zm.041 6.408.943-5.23-1.968-.356-.943 5.231 1.968.355Zm-8.182.823h7.198v-2h-7.198v2Zm.854-.185.126-.615-1.96-.4-.125.615 1.96.4Zm6.218-1.2h-7.198v2h7.199v-2Zm-.209 8.033 1.195-6.862-1.97-.343-1.195 6.862 1.97.343ZM49.734 3h-8.33v2h8.33V3Zm8.434 9.452c.515-2.892.143-5.33-1.397-7.037C55.247 3.725 52.797 3 49.734 3v2c2.815 0 4.578.675 5.552 1.755.959 1.062 1.373 2.762.913 5.347l1.97.35Zm-.692 3.848.692-3.846L56.2 12.1l-.692 3.846 1.968.354Zm-1.595 4.692c.765-1.328 1.267-2.86 1.596-4.693l-1.97-.352c-.3 1.676-.74 2.973-1.359 4.046l1.733.999Zm-8.756 3.947c2.2 0 3.998-.294 5.45-.946 1.478-.663 2.547-1.674 3.308-3.004l-1.736-.993c-.56.977-1.314 1.69-2.39 2.172-1.102.495-2.589.77-4.632.77v2Zm-9.273 0h9.273v-2h-9.273v2ZM40.42 3.825l-3.552 19.938 1.969.35 3.552-19.938-1.97-.35Zm7.785 13.638 1.194-6.892-1.97-.342-1.195 6.893 1.97.341Zm-.954-1.17h-.032v2h.032v-2Zm-.011-.43a4.28 4.28 0 0 1-.116.532c-.035.11-.047.098-.005.047a.474.474 0 0 1 .22-.148c.039-.012.034-.002-.088-.002v2c.348 0 .962-.031 1.413-.58.187-.227.295-.486.367-.717.074-.234.13-.503.18-.796l-1.971-.336Zm.786-4.467-.786 4.461 1.97.347.786-4.461-1.97-.347Zm.45.004c.063 0 .097.002.114.004s-.004.001-.048-.013a.71.71 0 0 1-.395-.372.514.514 0 0 1-.043-.15c-.001-.014.001-.006-.002.036-.006.09-.027.235-.073.476l1.964.376c.048-.25.09-.498.105-.72.013-.204.016-.516-.12-.825a1.305 1.305 0 0 0-.79-.714 2.21 2.21 0 0 0-.711-.098v2Zm-.062 0h.063v-2h-.063v2Z"
                      mask="url(#a)"
                    />
                  )}
                </svg>
              </label>

              <svg className="absolute left-0 top-0 z-10 hidden h-full w-full stroke-gray-400 peer-disabled:block">
                <line x1="0" y1="100%" x2="100%" y2="0" />
                <line x1="0" y1="0" x2="100%" y2="100%" />
              </svg>
            </li>
          ))}
        </ul>
        <p className="mb-4">Size</p>
        {availableSizes.length === 1 && availableSizes[0] === 'One Size' ? (
          <ul className="mb-8 flex flex-wrap gap-3 text-xs">
            <li className="relative">
              <input
                type="radio"
                id="sizeONESIZE"
                className="peer hidden"
                onClick={() => {
                  setOptions((prevVal) => ({
                    ...prevVal,
                    selectedSize: 'One Size',
                    selectedVariant: sizeToProductVariant('One Size'),
                  }));
                }}
              />
              <label
                htmlFor="sizeONESIZE"
                className="flex h-10 w-18 cursor-pointer items-center justify-center border border-gray-900 transition-all peer-checked:font-black peer-hover:border-primary peer-hover:font-black peer-hover:text-primary peer-disabled:border-0 peer-disabled:bg-gray-50 peer-disabled:text-gray-400"
              >
                ONESIZE
              </label>
            </li>
          </ul>
        ) : (
          <ul className="mb-8 flex flex-wrap gap-3 text-xs">
            {allSizes.map((size: string) => (
              <li className="relative" key={size}>
                <input
                  type="radio"
                  id={`size${size}`}
                  disabled={!availableSizes.includes(size)}
                  className="peer hidden"
                  value={size}
                  checked={options.selectedSize === size}
                  onChange={(event) => {
                    const target = event.target as HTMLInputElement;

                    if (options.selectedSize === size) {
                      setOptions((prevVal) => ({
                        ...prevVal,
                        selectedSize: undefined,
                        selectedVariant: undefined,
                      }));
                    } else {
                      setOptions((prevVal) => ({
                        ...prevVal,
                        selectedSize: target.value,
                        selectedVariant: sizeToProductVariant(target.value),
                      }));
                    }
                  }}
                />

                <label
                  htmlFor={`size${size}`}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center border border-gray-900 transition-all peer-checked:font-black peer-hover:border-primary peer-hover:font-black peer-hover:text-primary peer-disabled:border-0 peer-disabled:bg-gray-50 peer-disabled:text-gray-400"
                >
                  {size}
                </label>
                <svg className="absolute left-0 top-0 z-10 hidden h-full w-full stroke-gray-400 peer-disabled:block">
                  <line x1="0" y1="100%" x2="100%" y2="0" />
                  <line x1="0" y1="0" x2="100%" y2="100%" />
                </svg>
              </li>
            ))}
          </ul>
        )}
        <p className="mb-2">Quantity</p>
        <QuantityInput
          onChange={(value) =>
            setOptions((prevVal) => ({ ...prevVal, selectedQuantity: value }))
          }
          defaultValue={1}
          maxValue={
            options.selectedVariant?.inventory_quantity
              ? options.selectedVariant.inventory_quantity
              : 20
          }
          variant="secondary"
          className="mb-8"
        />
        <Button
          size="lg"
          className="mb-4 w-full"
          isDisabled={!options.selectedVariant}
          onPress={() => handleAddItem(product.title || '')}
        >
          Add to cart
        </Button>
        <p className="text-gray-300">Estimate delivery 2-3 days</p>
        <RecommendedProducts product={product} />
        {notification && <Notification notification={notification} />}
      </div>
    </main>
  ) : null;
};

ProductSinglePage.getLayout = function getLayout(page: React.ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export default ProductSinglePage;
