import React from 'react'

interface Product {
  name: string,
  description: string,
  price: string,
  img_url: string,
}

const ProductCard = ({product}: {product: Product}) => {
  return (
    <>
    <div className='col'>
      <img 
          style={{ width: '100px', height: '100px' }} 
          className="rounded img-fluid my-2 " 
          src={product.img_url}
          alt="" 
        />
    </div>
    <div className="col">
      {product.name}
    </div>
    <div className="col">
      {product.price}
    </div>
    </>
  )
}

export default ProductCard
