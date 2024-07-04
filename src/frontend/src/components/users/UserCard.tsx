import React from 'react'
import { useFetchUserData } from '../../hooks/user'
import { Person } from '../types'
import { useDeleteUser } from '../../hooks/user'


const UserCard = ({ person }: {person: Person}) => {
  const userDelete = useDeleteUser()
  
  return (
    <div key={person.id} className="row mb-2 align-items-center shadow-sm ">
      <div className="col-auto">
        <img 
          style={{ width: '100px', height: '100px' }} 
          className="rounded img-fluid my-2 " 
          src={person.foto} 
          alt="" 
        />
      </div>
      <div className="col">
        <h3>{person.note}</h3>
      </div>
      <div className="col-auto text-end">
        <p>{person.fullname}</p>
        <p>none@example.com</p>
      </div>
      <button 
        onClick={() =>
          userDelete.mutate(person.id)
        }
        type="button"
        className='btn btn-danger '>
        DELETE
      </button>
    </div>
  )
}

export default UserCard
