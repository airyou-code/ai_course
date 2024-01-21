import React from 'react'
import Card from './Card';

const CardGroup = () => {
  return (
    <>
      <div className="row g-5 g-xl-10 mb-5 mb-xl-10">
        <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
          <Card />
        </div>
        <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10"></div>
        <div className="col-xxl-6"></div>
      </div>
    </>
  );
}

export default CardGroup
