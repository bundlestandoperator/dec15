"use server";

import { doc, setDoc } from "firebase/firestore";
import { database } from "@/lib/firebase";
import { revalidatePath } from "next/cache";
import { AlertMessageType } from "@/lib/sharedTypes";

type CategoryType = {
  index: number;
  name: string;
  image: string;
  visibility: "VISIBLE" | "HIDDEN";
};

type StoreCategoriesType = {
  showOnPublicSite: boolean;
  categories: CategoryType[];
};

export async function UpdateCategoriesAction(data: StoreCategoriesType) {
  try {
    if (!data.categories || !Array.isArray(data.categories)) {
      return {
        type: AlertMessageType.ERROR,
        message: "Invalid categories data provided",
      };
    }

    for (const category of data.categories) {
      if (
        typeof category.index !== "number" ||
        typeof category.name !== "string" ||
        typeof category.image !== "string" ||
        !["VISIBLE", "HIDDEN"].includes(category.visibility)
      ) {
        return {
          type: AlertMessageType.ERROR,
          message: `Invalid category data for ${
            category.name || "unknown category"
          }`,
        };
      }
    }

    if (
      data.showOnPublicSite &&
      data.categories.every((category) => category.visibility === "HIDDEN")
    ) {
      return {
        type: AlertMessageType.ERROR,
        message:
          "Cannot show categories section when all categories are hidden",
      };
    }

    const sortedCategories = [...data.categories].sort(
      (a, b) => a.index - b.index
    );

    const updateData: StoreCategoriesType = {
      showOnPublicSite: data.showOnPublicSite,
      categories: sortedCategories,
    };

    const categoriesRef = doc(database, "categories", "storeCategories");
    await setDoc(categoriesRef, updateData);

    revalidatePath("/storefront");

    return {
      type: AlertMessageType.SUCCESS,
      message: "Categories updated successfully",
    };
  } catch (error) {
    console.error("Error updating categories:", error);

    return {
      type: AlertMessageType.ERROR,
      message: "Failed to update categories",
    };
  }
}
