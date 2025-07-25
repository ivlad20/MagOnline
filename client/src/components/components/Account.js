import ProductCard from "./ProductCard";
import AltProductCard from "./AltProductCard";

const Account = () => {
  return (
    <div>
      <ProductCard
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
      />

    </div>
  );
};

export default Account;
