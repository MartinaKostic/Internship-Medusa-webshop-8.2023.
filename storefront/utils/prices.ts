import { Cart } from '@medusajs/medusa';

const currencies = [
  {
    currency_code: 'eur',
    symbol: '€',
  },
  {
    currency_code: 'usd',
    symbol: '$',
  },
];

export const getCurrency = (
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | undefined
) => {
  if (cart?.region?.currency_code) {
    const currency = currencies.find(
      (curr) => curr.currency_code === cart.region.currency_code
    );

    return currency?.symbol || '';
  }

  return '';
};
