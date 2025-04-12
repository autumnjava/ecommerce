import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import AddToCart from './add-to-cart';
import ProductPrice from './product-price';

const ProductCard = async ({ product }: { product: Product }) => {
  const cart = await getMyCart();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
          ></Image>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
        {product.stock > 0 && (
          <div className="flex-center">
            <AddToCart
              item={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                qty: 1,
                image: product.images[0],
              }}
              cart={cart}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
