import React from 'react'

const TasksCard = ({task}: {task: {title: string, description: string, completed: boolean}}) => {
  return (
    <>
    <div className='col'>
      {task.title}
    </div>
    <div className="col">
      {task.description}
    </div>
    <div className="col">
      {task.completed}
    </div>
    </>
  )
}

export default TasksCard
