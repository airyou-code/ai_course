import React from 'react'
import { useFetchTasksData } from '../hooks/tasks'
import TasksCard from '../components/tasks/TasksCard'

const TasksPage = () => {
  const { data, isLoading, isError } = useFetchTasksData(
    { page: 1,
      page_size: 2
    }
  )

  if (isLoading) {
    return "... Loading"
  }

  return (
    <div className='container'>
      <div className="row">
      {data.results.map(
        (task: {title: string, description: string, completed: boolean}) =>
            <div className="col-3 m-3 align-items-center shadow ">
              <TasksCard task={task} />
            </div>
      )}
      </div>
    </div>
  )
}

export default TasksPage
