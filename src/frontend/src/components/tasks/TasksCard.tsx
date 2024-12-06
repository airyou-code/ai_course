import React from 'react'
import DOMPurify from 'dompurify';

const TasksCard = ({task}: {task: {title: string, description: string, completed: boolean}}) => {
  
  const sanitizedContent = DOMPurify.sanitize(task.description);

  return (
    <>
    <div className='col'>
      {task.title}
    </div>
    <div className="col">
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </div>
    <div className="col">
      {task.completed}
    </div>
    </>
  )
}

export default TasksCard
