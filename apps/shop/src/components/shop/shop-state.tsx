import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ShopCartLine = {
  brand: string;
  compareAt?: string;
  id: string;
  image: string;
  merchantName: string;
  merchantSlug: string;
  price: string;
  productId: string;
  purchaseModeLabel?: string;
  quantity: number;
  slug: string;
  title: string;
  variantLabel?: string;
};

type AddToCartInput = Omit<ShopCartLine, "id" | "quantity"> & {
  quantity?: number;
};

type ShopStateValue = {
  addToCart: (input: AddToCartInput) => void;
  cart: ShopCartLine[];
  cartCount: number;
  removeFromCart: (lineId: string) => void;
  savedCount: number;
  savedProductIds: string[];
  toggleSaved: (productId: string) => void;
  updateCartQuantity: (lineId: string, quantity: number) => void;
};

type StoredState = {
  cart: ShopCartLine[];
  savedProductIds: string[];
};

const STORAGE_KEY = "maple-shop-state";

const ShopStateContext = createContext<ShopStateValue | null>(null);

function createLineId(input: AddToCartInput) {
  return [
    input.productId,
    input.variantLabel ?? "default",
    input.purchaseModeLabel ?? "one-time",
  ].join("::");
}

function readStoredState(): StoredState {
  if (typeof window === "undefined") {
    return { cart: [], savedProductIds: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { cart: [], savedProductIds: [] };
    }

    const parsed = JSON.parse(raw) as Partial<StoredState>;

    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      savedProductIds: Array.isArray(parsed.savedProductIds)
        ? parsed.savedProductIds.filter((item): item is string => typeof item === "string")
        : [],
    };
  } catch {
    return { cart: [], savedProductIds: [] };
  }
}

export function ShopStateProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopCartLine[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredState();
    setCart(stored.cart);
    setSavedProductIds(stored.savedProductIds);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cart, savedProductIds } satisfies StoredState),
    );
  }, [cart, hydrated, savedProductIds]);

  return (
    <ShopStateContext.Provider
      value={{
        cart,
        cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        savedProductIds,
        savedCount: savedProductIds.length,
        addToCart: (input) => {
          const lineId = createLineId(input);

          setCart((current) => {
            const existing = current.find((item) => item.id === lineId);

            if (existing) {
              return current.map((item) =>
                item.id === lineId
                  ? {
                      ...item,
                      quantity: item.quantity + (input.quantity ?? 1),
                    }
                  : item,
              );
            }

            return [
              ...current,
              {
                ...input,
                id: lineId,
                quantity: input.quantity ?? 1,
              },
            ];
          });
        },
        removeFromCart: (lineId) => {
          setCart((current) => current.filter((item) => item.id !== lineId));
        },
        toggleSaved: (productId) => {
          setSavedProductIds((current) =>
            current.includes(productId)
              ? current.filter((item) => item !== productId)
              : [...current, productId],
          );
        },
        updateCartQuantity: (lineId, quantity) => {
          if (quantity <= 0) {
            setCart((current) => current.filter((item) => item.id !== lineId));
            return;
          }

          setCart((current) =>
            current.map((item) =>
              item.id === lineId ? { ...item, quantity } : item,
            ),
          );
        },
      }}
    >
      {children}
    </ShopStateContext.Provider>
  );
}

export function useShopState() {
  const value = useContext(ShopStateContext);

  if (!value) {
    throw new Error("useShopState must be used within ShopStateProvider");
  }

  return value;
}
