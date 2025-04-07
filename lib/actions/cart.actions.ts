'use server';

import { CartItem } from '@/types';
import { cookies } from 'next/headers';
import { convertToPlainObject, formatError, roundToTwo } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';

// calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundToTwo(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = roundToTwo(itemsPrice > 100 ? 0 : 10);

  // 15%
  const taxPrice = roundToTwo(0.15 * itemsPrice);

  const totalPrice = roundToTwo(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    // check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) throw new Error('cart session not found');

    // get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get cart
    const cart = await getMyCart();

    // parse and validate item
    const item = cartItemSchema.parse(data);

    // find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error('Product not found');

    if (!cart) {
      // create a new cart
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });

      // revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: product.name + ' added to cart',
      };
    } else {
      // check if item is already in the cart
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );

      if (existItem) {
        // check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error('not enough in stock');
        }

        // increase the qty
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existItem.qty + 1;
        // if item doesnt exist in cart
      } else {
        // check stock
        if (product.stock < 1) {
          throw new Error('not enough in stock');
        }
        // add item to cart.items
        cart.items.push(item);
      }

      // save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // check for the cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  if (!sessionCartId) throw new Error('cart session not found');

  // get session and user id
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for the cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('cart session not found');

    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    // get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );

    if (!exist) throw new Error('item not found');

    // check if only 1 in qty
    if (exist.qty === 1) {
      // remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId
      );
    } else {
      (cart.items as CartItem[]).find(
        (x) => x.productId === exist.productId
      )!.qty = exist.qty - 1;
    }

    // update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from the cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
