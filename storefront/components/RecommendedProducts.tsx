import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import * as React from 'react';
import algoliarecommend from '@algolia/recommend';
import { Product } from '@/components/Product';
import { Heading } from '@/components/ui/Heading';
import { useCart } from 'medusa-react';

interface RecommendedProductsProps {
  product: PricedProduct | undefined;
}
const client = algoliarecommend(
  'KQBMKZ02T5',
  '82c99b101da5f9a3c43f6a170e1ece1c'
);
const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  product,
}: RecommendedProductsProps) => {
  const [recommended, setRecommended] = React.useState<PricedProduct[]>([]);
  const { cart } = useCart();
  const handlePrice = () => {
    if (cart?.region?.currency_code === 'eur') {
      return 0;
    } else return 1;
  };
  React.useEffect(() => {
    if (product) {
      client
        .getRelatedProducts([
          {
            indexName: 'products',
            objectID: product.id || '',
            maxRecommendations: 3,
          },
        ])
        .then(({ results }) => {
          setRecommended(results[0].hits as unknown[] as PricedProduct[]);
          //console.log('RESLUTS', results);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('failed recommended products');
    }
  }, [product]);

  return (
    <>
      {recommended.length > 0 && (
        <>
          <Heading size="lg" className="mb-3 text-primary">
            Recommended:
          </Heading>
          <div className="grid grid-cols-9 gap-y-8 md:gap-x-12">
            {recommended.map((product: PricedProduct) => (
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
        </>
      )}
    </>
  );
};
export default RecommendedProducts;
