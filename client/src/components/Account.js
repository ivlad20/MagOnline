import ProductCard from "./ProductCard";
import AltProductCard from "./AltProductCard";
import TestCarousel from "./TestCarousel";

const Account = () => {
  return (
    <div>
      {/* <ProductCard
        image={"./images/laptop.png"}
        title={"Xbox controller"}
        category={"ACCESSORIES"}
        price={"300"}
      />
      <AltProductCard
        image={"./images/laptop.png"}
        title={"Xbox controller"}
        category={"ACCESSORIES"}
        price={"300"}
        rating={4.7}
      /> */}

      <TestCarousel />
      {/* <img src="./product_images/84/1.png" alt="" width={200} height={200}/> */}

    </div>
  );
};

export default Account;
