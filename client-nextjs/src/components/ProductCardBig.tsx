'use client';

import { useState } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

interface ProductCardBigProps {
  image: string;
  title: string;
  category: string;
  price: number | string;
  initialFavorite?: boolean;
  onAddToCart?: () => void;
  onToggleFavorite?: (next: boolean) => void;
}

export default function ProductCardBig({
  image,
  title,
  category,
  price,
  initialFavorite = false,
  onAddToCart,
  onToggleFavorite,
}: ProductCardBigProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleToggleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    onToggleFavorite?.(next);
  };

  return (
    <div className="group relative h-[600px] w-[500px] overflow-hidden rounded-[10px] border border-[#bbbbbb] bg-white">

      {/* product-card-top-big */}
      <div className="box-border flex h-[50px] w-full items-center justify-between">
        <div>
          <p>{category}</p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label="Adaugă la favorite"
          >
            <FaHeart
              className={isFavorite ? 'text-red-500' : 'text-ink-soft'}
            />
          </button>
        </div>
      </div>

      {/* product-card-image-big */}
      <div
        className="
          relative
          flex
          h-[400px]
          w-full
          justify-center
          transition-[height]
          duration-300
          ease-in-out
          group-hover:h-[330px]
        "
      >
        <img
          src={image}
          alt={title}
          className="absolute bottom-0 h-[350px] w-[350px]"
        />
      </div>

      {/* product-card-bottom-big */}
      <div
        className="
          relative
          h-[100px]
          w-full
          transition-[height]
          duration-300
          ease-in-out
          group-hover:h-[110px]
        "
      >
        {/* product-card-bottom-1-big */}
        <div className="absolute top-[20px] h-1/2 w-full">
          <p className="product-title">{title}</p>
        </div>

        {/* product-card-bottom-2-big */}
        <div className="absolute bottom-[-30px] h-1/2 w-full p-[10px]">
          <h3>${price}</h3>
        </div>
      </div>

      {/* product-card-popup */}
      <div
        className="
          absolute
          bottom-[-60px]
          left-0
          flex
          h-[60px]
          w-full
          items-center
          justify-center
          gap-2
          bg-voltaic
          text-paper
          transition-transform
          duration-300
          ease-in-out
          group-hover:translate-y-[-60px]
        "
      >
        <h4>Add to cart</h4>

        <button
          type="button"
          onClick={onAddToCart}
          aria-label="Adaugă în coș"
        >
          <FaShoppingCart />
        </button>
      </div>
    </div>
  );
}