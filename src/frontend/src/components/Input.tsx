import React, {useState} from 'react'

const Input = () => {

  const [text, setText] = useState("")

  return (
    <input
      name='dfdf'
      value={text}
      onChange={({target}) => setText(target.value)}
    >
    </input> 
  )
}

export default Input
