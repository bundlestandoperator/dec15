import { create } from "zustand";

type Overlay = {
  name: string;
  isVisible: boolean;
};

type OverlayType = {
  pageName: string;
  overlayName: string;
};

type PageOverlays = {
  [key: string]: Overlay;
};

type Pages = {
  [key: string]: {
    name: string;
    overlays: PageOverlays;
  };
};

type OverlayStoreProps = {
  pages: Pages;
  showOverlay: ({ pageName, overlayName }: OverlayType) => void;
  hideOverlay: ({ pageName, overlayName }: OverlayType) => void;
};

export const useOverlayStore = create<OverlayStoreProps>((set) => ({
  pages: {
    home: {
      name: "home",
      overlays: {
        articleImageSlideshow: {
          name: "articleImageSlideshow",
          isVisible: false,
        },
      },
    },
    editProduct: {
      name: "editProduct",
      overlays: {
        basicDetails: {
          name: "basicDetails",
          isVisible: false,
        },
        mainImage: {
          name: "mainImage",
          isVisible: false,
        },
        imageGallery: {
          name: "imageGallery",
          isVisible: false,
        },
        sizes: {
          name: "sizes",
          isVisible: false,
        },
        colors: {
          name: "colors",
          isVisible: false,
        },
        description: {
          name: "description",
          isVisible: false,
        },
        highlights: {
          name: "highlights",
          isVisible: false,
        },
        onPageSeo: {
          name: "onPageSeo",
          isVisible: false,
        },
        productSource: {
          name: "productSource",
          isVisible: false,
        },
        upsell: {
          name: "upsell",
          isVisible: false,
        },
        visibility: {
          name: "visibility",
          isVisible: false,
        },
      },
    },
    products: {
      name: "products",
      overlays: {
        newProduct: {
          name: "newProduct",
          isVisible: false,
        },
      },
    },
    upsells: {
      name: "upsells",
      overlays: {
        newUpsell: {
          name: "newUpsell",
          isVisible: false,
        },
      },
    },
    editUpsell: {
      name: "editUpsell",
      overlays: {
        basicDetails: {
          name: "basicDetails",
          isVisible: false,
        },
        visibility: {
          name: "visibility",
          isVisible: false,
        },
      },
    },
    storefront: {
      name: "storefront",
      overlays: {
        newCollection: {
          name: "newCollection",
          isVisible: false,
        },
        categories: {
          name: "categories",
          isVisible: false,
        },
        editPageHero: {
          name: "editPageHero",
          isVisible: false,
        },
        removeProduct: {
          name: "removeProduct",
          isVisible: false,
        },
        changeProductIndex: {
          name: "changeProductIndex",
          isVisible: false,
        },
        changeCollectionIndex: {
          name: "changeCollectionIndex",
          isVisible: false,
        },
      },
    },
    editCollection: {
      name: "editCollection",
      overlays: {
        basicDetails: {
          name: "basicDetails",
          isVisible: false,
        },
        bannerImages: {
          name: "bannerImages",
          isVisible: false,
        },
        campaignDuration: {
          name: "campaignDuration",
          isVisible: false,
        },
        productList: {
          name: "productList",
          isVisible: false,
        },
        visibility: {
          name: "visibility",
          isVisible: false,
        },
        addProduct: {
          name: "addProduct",
          isVisible: false,
        },
        removeProduct: {
          name: "removeProduct",
          isVisible: false,
        },
        changeProductIndex: {
          name: "changeProductIndex",
          isVisible: false,
        },
      },
    },
    orderDetails: {
      name: "orderDetails",
      overlays: {
        orderConfirmedEmailPreview: {
          name: "orderConfirmedEmailPreview",
          isVisible: false,
        },
        orderShippedEmailPreview: {
          name: "orderShippedEmailPreview",
          isVisible: false,
        },
        orderDeliveredEmailPreview: {
          name: "orderDeliveredEmailPreview",
          isVisible: false,
        },
      },
    },
  },
  showOverlay: ({ pageName, overlayName }: OverlayType) => {
    set((state) => {
      const updatedState: Pages = { ...state.pages };
      const overlay = updatedState[pageName]?.overlays[overlayName];
      if (overlay) {
        overlay.isVisible = true;
      }
      return { pages: updatedState };
    });
  },
  hideOverlay: ({ pageName, overlayName }: OverlayType) => {
    set((state) => {
      const updatedState: Pages = { ...state.pages };
      const overlay = updatedState[pageName]?.overlays[overlayName];
      if (overlay) {
        overlay.isVisible = false;
      }
      return { pages: updatedState };
    });
  },
}));
