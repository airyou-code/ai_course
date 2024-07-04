import React, { ReactNode, useContext } from 'react'

interface ButtonProps {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const Button = ({ children, onClick, className="btn" }: ButtonProps) => {
  // const name = useContext(MyContext)
  return (
    <>
     <button type="button" className={className} onClick={onClick}>
        {children}
     </button>
    </>
  )
}

export default Button
