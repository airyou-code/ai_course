import React from 'react'
import { useFetchPersonsData } from '../hooks/persons'
import { useCreatePerson } from '../hooks/persons'
import UserCard from '../components/persons/UserCard'
import { Person } from '../components/types'
import { useQueryClient, QueryClient } from '@tanstack/react-query'

const PersonsPage = () => {

  const { data, isLoading, isError } = useFetchPersonsData()
  const mutation = useCreatePerson()
  const [formData, setFormData] = React.useState({
    fullname: '',
    gender: '',
    foto: 'https://loremflickr.com/640/480/people',
    note: '',
    create_date: ''
  });

  if (isLoading) {
    return "... Loading"
  }

  // Обработчик изменения значения полей
  const handleChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Обработчик отправки формы
  const handleSubmit = (event: any) => {
    event.preventDefault();
    mutation.mutate(formData)
    // console.log('Form Data:', formData);
    setFormData(
      {
        fullname: '',
        gender: '',
        foto: 'https://loremflickr.com/640/480/people',
        note: '',
        create_date: ''
      }
    )
  };

  return (
    <div className="m-5 ">
      <div className="container mt-5 px-5 ">
        {
          data.map(
            (person: Person) => 
              <div key={person.id}>
                <UserCard person={person}/>
              </div>
          )
        }
      </div>
      <form onSubmit={handleSubmit} className='container mt-5 px-5'>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">fullname</label>
        <input
          type="text"
          className="form-control"
          id="fullname"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="gender" className="form-label">gender</label>
        <input
          type="text"
          className="form-control"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="note" className="form-label">note</label>
        <input
          type="text"
          className="form-control"
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
    </div>
  )
}

export default PersonsPage
