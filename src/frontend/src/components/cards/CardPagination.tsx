import React from 'react'
import { useState } from 'react';
import CardGroup from './CardGroup';

interface CardPaginationProps {
  data: any[];
  obj_in_page?: number;
}

const CardPagination = ({obj_in_page=2, data}: CardPaginationProps) => {

  const [dataPage, setDataPage] = useState(data.slice(0, obj_in_page))
  const [lastObj, setLastObj] = useState(obj_in_page)
  const [numberPage, setNumberPage] = useState(1)

  console.log("render...");


  const next_page = () => {
    if (lastObj < data.length) {
      const firstObj = lastObj;
      const newLastObj = (lastObj + obj_in_page > data.length) ? data.length : lastObj + obj_in_page;
      setDataPage(data.slice(firstObj, newLastObj));
      setLastObj(newLastObj);
      setNumberPage(numberPage+1);
    }
  }

  const back_page = () => {
    if (lastObj > obj_in_page) {
      const newLastObj = (lastObj - obj_in_page < obj_in_page) ? obj_in_page : lastObj - obj_in_page;
      const firstObj = (newLastObj - obj_in_page < 0) ? 0 : newLastObj - obj_in_page;
      setDataPage(data.slice(firstObj, newLastObj));
      setLastObj(newLastObj);
      setNumberPage(numberPage-1);
    }
  }

  return (
    <div>
      <CardGroup posts={dataPage}/>
      <button type="button" className="btn btn-primary" onClick={() => back_page()}>
        back
     </button>
     <button aria-disabled="true" className="btn btn-primary mx-2">
      {numberPage}
      </button>
      <button type="button" className="btn btn-primary" onClick={() => next_page()}>
        next
     </button>
    </div>
  )
}

export default CardPagination
