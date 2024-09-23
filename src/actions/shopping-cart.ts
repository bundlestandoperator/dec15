"use server";

import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import {
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  doc,
  runTransaction,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { database } from "@/lib/firebase";
import { generateId } from "@/lib/utils";
import { AlertMessageType } from "@/lib/sharedTypes";

export async function AddToCartAction(data: {
  type: "product" | "upsell";
  baseProductId?: string;
  size?: string;
  color?: string;
  baseUpsellId?: string;
  products?: Array<{ id: string; size: string; color: string }>;
}) {
  const setNewDeviceIdentifier = () => {
    const newDeviceIdentifier = nanoid();
    cookies().set({
      name: "device_identifier",
      value: newDeviceIdentifier,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // expires in 30 days
    });
    return newDeviceIdentifier;
  };

  const createCartItem = (index: number) => {
    if (data.type === "product") {
      return {
        type: "product",
        baseProductId: data.baseProductId,
        size: data.size,
        color: data.color,
        variantId: generateId(),
        index,
      };
    } else {
      return {
        type: "upsell",
        baseUpsellId: data.baseUpsellId,
        variantId: generateId(),
        index,
        products: data.products,
      };
    }
  };

  const generateNewCart = async () => {
    try {
      const newDeviceIdentifier = setNewDeviceIdentifier();
      const newCartData = {
        device_identifier: newDeviceIdentifier,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        items: [createCartItem(1)],
      };

      const newCartDocRef = doc(collection(database, "carts"), generateId());
      await runTransaction(database, async (transaction) => {
        return transaction.set(newCartDocRef, newCartData);
      });

      revalidatePath("/");
      revalidatePath("/[slug]", "page");

      return {
        type: AlertMessageType.SUCCESS,
        message: "Item added to cart",
      };
    } catch (error) {
      console.error("Error generating new cart:", error);
      return {
        type: AlertMessageType.ERROR,
        message: "Please reload the page and try again",
      };
    }
  };

  const updateExistingCart = async (cartDoc: any, existingCartItems: any[]) => {
    const nextIndex = existingCartItems.length + 1;

    if (data.type === "product") {
      const productExists = existingCartItems.some(
        (product: { baseProductId: string; size: string; color: string }) =>
          product.baseProductId === data.baseProductId &&
          product.size === data.size &&
          product.color === data.color
      );

      if (productExists) {
        return {
          type: AlertMessageType.ERROR,
          message: "Item already in cart",
        };
      } else {
        existingCartItems.push({
          type: data.type,
          baseProductId: data.baseProductId,
          size: data.size,
          color: data.color,
          variantId: generateId(),
          index: nextIndex,
        });
      }
    } else if (data.type === "upsell" && data.products) {
      const upsellExists = existingCartItems.some((item) => {
        if (item.type === "upsell" && item.baseUpsellId === data.baseUpsellId) {
          return item.products.every(
            (
              existingProduct: { color: string; size: string },
              index: number
            ) => {
              const newProduct = data.products?.[index];
              if (!newProduct) return false;
              return (
                existingProduct.color === newProduct.color &&
                existingProduct.size === newProduct.size
              );
            }
          );
        }
        return false;
      });

      if (upsellExists) {
        return {
          type: AlertMessageType.ERROR,
          message: "Item already in cart",
        };
      } else {
        existingCartItems.push({
          type: "upsell",
          baseUpsellId: data.baseUpsellId,
          variantId: generateId(),
          index: nextIndex,
          products: data.products,
        });
      }
    }

    // Update cart with new items
    await runTransaction(database, async (transaction) => {
      return transaction.update(cartDoc, {
        items: existingCartItems,
        updatedAt: serverTimestamp(),
      });
    });

    revalidatePath("/");
    revalidatePath("/[slug]", "page");

    return {
      type: AlertMessageType.SUCCESS,
      message: "Item added to cart",
    };
  };

  try {
    const deviceIdentifier = cookies().get("device_identifier")?.value;
    if (!deviceIdentifier) return await generateNewCart();

    const collectionRef = collection(database, "carts");
    const snapshot = await getDocs(
      query(collectionRef, where("device_identifier", "==", deviceIdentifier))
    );

    if (snapshot.empty) {
      return await generateNewCart();
    } else {
      const cartDoc = snapshot.docs[0].ref;
      const existingCartItems = snapshot.docs[0].data().items || [];
      return await updateExistingCart(cartDoc, existingCartItems);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return {
      type: AlertMessageType.ERROR,
      message: "Please reload the page and try again",
    };
  }
}

export async function RemoveFromCartAction({
  type,
  id,
}: {
  type: "product" | "upsell";
  id: string;
}) {
  const deviceIdentifier = cookies().get("device_identifier")?.value;

  if (!deviceIdentifier) {
    return {
      type: AlertMessageType.ERROR,
      message: "Cart not found",
    };
  }

  try {
    const collectionRef = collection(database, "carts");
    const snapshot = await getDocs(
      query(collectionRef, where("device_identifier", "==", deviceIdentifier))
    );

    if (snapshot.empty) {
      return {
        type: AlertMessageType.ERROR,
        message: "Cart not found",
      };
    }

    const cartDoc = snapshot.docs[0].ref;
    const existingCartItems = snapshot.docs[0].data().items;

    const updatedItems = existingCartItems.filter(
      (item: CartProductItemType | CartUpsellItemType) => {
        if (type === "product" && item.type === "product") {
          return item.variantId !== id;
        } else if (type === "upsell" && item.type === "upsell") {
          return item.baseUpsellId !== id;
        }
        return true;
      }
    );

    await runTransaction(database, async (transaction) => {
      return transaction.update(cartDoc, {
        items: updatedItems,
        updatedAt: serverTimestamp(),
      });
    });

    revalidatePath("/cart");

    return {
      type: AlertMessageType.SUCCESS,
      message: "Item removed from cart",
    };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return {
      type: AlertMessageType.ERROR,
      message: "Please reload the page and try again",
    };
  }
}
