import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getMyCart } from '@/lib/actions/cart.actions';
import { cn } from '@/lib/utils';
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
        <Link href={`/product/${product.slug}`} className="group relative">
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
            className={cn(
              product.images.length > 1 &&
                'transition-opacity duration-200 ease-in-out group-hover:opacity-0'
            )}
          />
          {product.images.length > 1 && (
            <Image
              src={product.images[1]}
              alt={product.name}
              height={300}
              width={300}
              priority={true}
              className="absolute top-0 left-0 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100"
            />
          )}
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} stars</p>
          <ProductPrice
            value={Number(product.price)}
            className={cn(product.stock === 0 && 'text-gray-100')}
          />
        </div>
        {product.stock > 0 ? (
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
        ) : (
          <div className="text-destructive flex-center text-md h-9">
            Out of Stock
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
