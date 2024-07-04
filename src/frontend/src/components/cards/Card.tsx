import React, { createContext, useState } from 'react';
import Button from '../ui/Button';
import {CardProps} from '../types';

const MyContext = createContext("Hi")

const Card = (props: CardProps) => {

  return (
    <div className="card" key={props.id}>
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <p className="card-text">{props.body}</p>
      </div>
    </div>
  );
}

export default Card
