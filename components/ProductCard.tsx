"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const priceLabel = product.price?.toString() ?? "—";
  const imageUrl = product.imageUrl || ""

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-transform duration-500 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-black/10 bg-black/5">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-black/60">${priceLabel} MXN</p>
        </div>

        <Link
          href={`/${product.id}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:translate-y-[-1px]"
          aria-label={`Comprar ${product.name}`}
        >
          Comprar
        </Link>
      </div>
    </article>
  );
}
