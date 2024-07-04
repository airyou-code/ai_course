import React from 'react'
import { Fragment } from 'react';
import Card from './Card';
import { CardProps } from '../types';

interface CardGroupProps {
  posts: CardProps[]
}

const CardGroup = ({posts}: CardGroupProps) => {

  return (
    <>
      {
        posts.map(
          (post) =>
            <div className="pb-3"  key={post.id}>
              <Card title={post.title} body={post.body} id={post.id}/>
            </div>
        )
      }
    </>
  );
}

export default CardGroup
