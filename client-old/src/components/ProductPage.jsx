import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductPage.css";

function ProductPage() {
  const { id } = useParams(); //
  const [product, setProduct] = useState(null);

  //   useEffect(() => {
  //     fetch(`http://localhost:8080/products/${id}`)
  //       .then((res) => res.json())
  //       .then((data) => setProduct(data))
  //       .catch((err) => console.error("Failed to fetch product:", err));
  //   }, [id]);

  //   if (!product) return <p>Loading...</p>;

  return (
    <div>
      <div className="product-page-main-container">
        <div className="product-page-product-display">
          <div className="product-page-product-title">
            <p className="product-page-title-text-style">
              Telefon mobil Apple iPhone 16 Pro, 128GB, 5G, Desert Titanium 
            </p>
          </div>
          <div className="product-page-under-title-display">
            <div className="product-page-product-image-container">
              <img src="../product_images/85/1.png" alt="product" className="product-page-main-product-image"/>
            </div>
            <div className="product-page-product-information">
              <p className="product-page-info-text">Livrare in 7 zile</p>
            </div>
            <div className="product-page-product-price-add-to-cart">
              <div className="product-page-product-price-add-to-cart-widget">
                <div className="product-page-product-widget-price-container">
                  <h1 className="product-page-product-widget-price-text">30.526 Lei</h1>
                  <p>Economisesti 700 Lei</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
