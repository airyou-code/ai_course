import React from 'react'
import Count from '../components/test/Count'

const TestPage = () => {

  const [count1, setCount1] = React.useState(0)
  const [count2, setCount2] = React.useState(0)

  return (
    <div className='container mt-5'>
      <div className="mb-5">
        <h3>Counter 1:</h3>
        <button type="button" className='btn btn-primary ms-2 "' onClick={
          () => setCount1(count1+1)
        }>+</button>
        <Count value={count1} id={1}/>
      </div>

      <h3>Counter 2:</h3>
      <div className="">
        <button type="button" className='btn btn-primary d-inline-block ms-2 "' onClick={
          () => setCount2(count2+1)
        }>+</button>
        <Count value={count2} id={2}/>
      </div>
    </div>
  )
}

export default TestPage
