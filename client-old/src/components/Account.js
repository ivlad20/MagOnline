import ProductCard from "./ProductCard";
import AltProductCard from "./AltProductCard";
import TestCarousel from "./TestCarousel";
import ProductImagesCarousel from "./ProductImagesCarousel";
import { items } from "./Data";

const Account = () => {
  return (
    <div>
      <ProductImagesCarousel images={items}/>
    </div>
  );
};

export default Account;
