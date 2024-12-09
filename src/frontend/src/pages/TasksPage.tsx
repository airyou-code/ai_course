import React from 'react'
import { useFetchTasksData } from '../hooks/tasks'
import TasksCard from '../components/tasks/TasksCard'

const TasksPage = () => {
  const { data, isLoading, isError } = useFetchTasksData(
    { page: 1,
      page_size: 4
    }
  )

  if (isLoading) {
    return "... Loading"
  }

  if (isError) {
    return "... Error 500"
  }

  return (
    <div className='container'>
      <div>
      {data.results.map(
        (task: {title: string, description: string, completed: boolean}) =>
          <div className="col mt-4 mb-4">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://via.placeholder.com/50"
                alt="Responder"
                style={{
                  borderRadius: '50%',
                  marginRight: '10px',
                  width: '40px',
                  height: '40px',
                }}
              />
            </div>
            <div className="col-8 mx-4 my-2 p-2 rounded align-items-center shadow">
              <TasksCard task={task} />
            </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default TasksPage
