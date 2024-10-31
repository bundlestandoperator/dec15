import { getProducts } from "../products/service";

type CartType = {
  id: string;
  device_identifier: any;
  items: (CartProductItemType | CartUpsellItemType)[];
};

export async function getCart(
  deviceIdentifier: string | undefined
): Promise<CartType | null> {
  try {
    if (!deviceIdentifier) {
      return null;
    }

    const collectionRef = collection(database, "carts");
    const snapshot = await getDocs(
      query(collectionRef, where("device_identifier", "==", deviceIdentifier))
    );

    if (snapshot.empty) {
      return null;
    }

    const cartDoc = snapshot.docs[0];
    const cartData = cartDoc.data();

    // Validate and filter cart items
    const validatedItems = await validateCartItems(cartData.items);

    // Update the cart if items were removed
    if (validatedItems.length !== cartData.items.length) {
      const reindexedItems = validatedItems.map((item, index) => ({
        ...item,
        index: index + 1,
      }));

      await runTransaction(database, async (transaction) => {
        return transaction.update(cartDoc.ref, {
          items: reindexedItems,
          updatedAt: serverTimestamp(),
        });
      });

      revalidatePath("/cart");
    }

    const cart = {
      id: cartDoc.id,
      device_identifier: cartData.device_identifier,
      items: validatedItems,
    };

    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

async function validateCartItems(items: any[]): Promise<any[]> {
  const validatedItems = await Promise.all(
    items.map(async (item) => {
      if (item.type === "product") {
        const product = await getProducts({
          ids: [item.baseProductId],
          fields: ["name"],
        });
        return product ? item : null;
      } else if (item.type === "upsell") {
        const upsell = await getUpsell({ id: item.baseUpsellId });
        return upsell ? item : null;
      }
      return null;
    })
  );

  return validatedItems.filter((item) => item !== null);
}
