import React from 'react'

let renderCount: any = {
  counter1: 0,
  counter2: 0,
};

const Count = ({value, id}: {value: number, id: number}) => {
  console.log(`Count${id}: ${++renderCount[`counter${id}`]}`);
  return (
    <h2 className='d-inline-block '>{value}</h2>
  )
}

export default React.memo(Count);
