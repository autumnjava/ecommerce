import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import CartTable from './cart-table';

export const metadata: Metadata = {
  title: 'Shopping cart',
};

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
