import React from 'react'
import { useFetchProductData } from '../hooks/products'
import { useQuery } from '@tanstack/react-query'
import ProductCard from '../components/products/ProductCard'

interface Product {
  name: string,
  description: string,
  price: string,
  img_url: string,
}

const ProductsPage = () => {
  const { data, isLoading, isError } = useFetchProductData()


  if (isLoading) {
    return "... Loading"
  }
  
  return (

    <div className='container'>
      <div className="row">
      {data.map(
        (product: Product) =>
            <div className="col-3 m-3 align-items-center shadow ">
              <ProductCard product={product} />
            </div>
      )}
      </div>
    </div>
  )
}

export default ProductsPage
