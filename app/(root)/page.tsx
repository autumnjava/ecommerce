import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';
import { Product } from '@/types';

const Homepage = async () => {
  const latestProducts = (await getLatestProducts()) as unknown as Product[];
  return <ProductList data={latestProducts} title="Newest arrivals" />;
};

export default Homepage;
