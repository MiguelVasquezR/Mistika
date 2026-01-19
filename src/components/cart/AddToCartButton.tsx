"use client";

import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/useToast";

type Props = {
  name: string;
  price: number | string;
  image?: string | null;
  id?: number | string;
};

export function AddToCartButton({ name, price, image, id }: Props) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  return (
    <button
      type="button"
      onClick={() => {
        addToCart({ id, name, price, image });
        showToast({
          title: "Agregado al carrito",
          description: name,
        });
      }}
      className="mt-6 w-full rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90"
    >
      Agregar al carrito
    </button>
  );
}
