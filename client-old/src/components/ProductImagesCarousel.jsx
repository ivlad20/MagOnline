import React, { useState } from 'react'
import "./ProductImagesCarousel.css";

const ProductImagesCarousel = ({ images }) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextImage = () => {
    images.length - 1 === currentIndex ? setCurrentIndex(0) 
    : setCurrentIndex(currentIndex + 1)
  }

  const handlePreviousImage = () => {
    currentIndex === 0 ? setCurrentIndex(images.length - 1) 
    : setCurrentIndex(currentIndex - 1)
  }

  return (
    <div className="product-images-carousel-container">
      <div className='carousel-image-container'>
        <img src={images[currentIndex].image} alt="" className=''/>
        <button onClick={handlePreviousImage} className='carousel-arrow-product-images'>&#8592;</button>
        <button onClick={handleNextImage} className='carousel-arrow-product-images'>&#8594;</button>
      </div>
    </div>
  )
}

export default ProductImagesCarousel
