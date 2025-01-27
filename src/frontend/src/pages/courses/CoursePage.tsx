import Navbar from '../../components/layout/Navbar'
import Sidebar from '../../components/layout/Sidebar'
import LessonList from '../../components/course/LessonList'
import { useFetchModuleData, useFetchLessonData } from '../../hooks/courses'
import CourseContent from '../../components/course/CourseContent'
import { Search } from 'lucide-react'
// import LoadingPage from '../LoadingPage'


interface Lesson {
  title: string
  duration: string
  description: string
  is_free: boolean
  is_locked: boolean
}

interface LessonGroup {
  title: string
  description: string
  lessons: Lesson[]
}


const mockCourseData = {
  blocks: [
    {
      type: 'text',
      content: '<div class="el-h4"><h4 dir="auto" style="text-align: center;" data-heading="**Models**"><span style="font-family: courier new, courier, monospace;"><strong>Models</strong></span></h4></div><div class="el-ol"><ol><li dir="auto" style="font-family: courier new, courier, monospace;" data-line="0"><span style="font-family: courier new, courier, monospace;"><strong>Player (User)</strong>&nbsp;<em>(models)</em>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;" data-line="1"><span style="font-family: courier new, courier, monospace;">Represents a user.</span></li><li dir="auto" style="font-family: courier new, courier, monospace;" data-line="2"><span style="font-family: courier new, courier, monospace;"><strong>Logic</strong>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;" data-line="3"><span style="font-family: courier new, courier, monospace;">Stores basic user information (e.g., email, name, etc.).</span></li><li dir="auto" style="font-family: courier new, courier, monospace;">Links to one or multiple game sessions.</span></li></ul></li></ul></li></ol></div><div class="el-hr"><hr></div><div class="el-ol"><ol start="2"><li dir="auto" style="font-family: courier new, courier, monospace;"><span style="font-family: courier new, courier, monospace;"><strong>GameSession</strong>&nbsp;<em>(models)</em>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;">The main object that holds all the information about a single game session.</span></li><li dir="auto" style="font-family: courier new, courier, monospace;"><strong>Relationships</strong>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;">Linked to a user (<code>User</code>).</span></li><li dir="auto" style="font-family: courier new, courier, monospace;">Contains a list of years (<code>Year</code>).</span></li></ul></li><li dir="auto" style="font-family: courier new, courier, monospace;"><strong>Creation Logic</strong>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;">When a session is created, initial parameters are set (e.g., balance, family status, initial coefficients for events).</span></li><li dir="auto" style="font-family: courier new, courier, monospace;">Automatically creates empty&nbsp;<code>Year</code>&nbsp;objects associated with this session.</span></li></ul></li></ul></li></ol></div><div class="el-hr"><hr></div><div class="el-ol"><ol start="3"><li dir="auto" style="font-family: courier new, courier, monospace;"><span style="font-family: courier new, courier, monospace;"><strong>Year</strong>&nbsp;<em>(models)</em>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;">Represents a single game year within a session.</span></li><li dir="auto" style="font-family: courier new, courier, monospace;"><strong>Relationships</strong>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;">Belongs to a game session (<code>GameSession</code>).</span></li><li dir="auto" style="font-family: courier new, courier, monospace;"><strong>Input</strong>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;">Stores user actions (<code>PlayerActions</code>&nbsp;through a ManyToMany relationship with&nbsp;<code>Action</code>).</span></li></ul></li><li dir="auto" style="font-family: courier new, courier, monospace;"><strong>Output</strong></span></li></ul></li><li dir="auto" style="font-family: courier new, courier, monospace;"><strong>Logic</strong>:</span><ul class="has-list-bullet"><li dir="auto" style="font-family: courier new, courier, monospace;">At the end of the year, the server calculates the&nbsp;<code>Output</code>&nbsp;based on the&nbsp;<code>Input</code>, player actions, and event scenarios.</span></li></ul></li></ul></li></ol></div>'
    },
    {
      type: 'output-dialog',
      content: '<p><em>Вы &mdash; автор <strong>SEO-контента</strong> мирового уровня, специализирующийся на создании текстов, которые невозможно отличить от написанных человеком. Ваш опыт заключается в улавливании эмоциональных нюансов, культурной адаптации и контекстуальной <span style="background-color: rgb(18, 234, 249);">аутентичности</span>, что позволяет создавать контент, естественно резонирующий с любой аудиторией.</em></p>',
      avatar: '/teacher-avatar.png'
    },
    {
      type: 'continue-button',
    },
    {
      type: 'text',
      content: 'In this lesson, we will learn about fundamental concepts.'
    },
    {
      type: 'test',
      content: {
        question: "What is the main purpose of this course?",
        options: [
          "To learn about web development",
          "To practice coding skills",
          "To understand basic concepts",
          "To have fun"
        ],
        correctAnswer: 2,
        right_feedback: "The main purpose is to understand basic concepts!",
        wrong_feedback: "wrong_feedback: The main purpose is to understand basic concepts!"
      }
    },
    {
      type: 'continue-button',
    },
    {
      type: 'input-dialog',
      content: 'I understand. Please tell me more!',
      avatar: '/user-avatar.png'
    },
    {
      type: 'output-dialog',
      content: 'Welcome to the course! Let me guide you through the basics.',
      avatar: '/teacher-avatar.png'
    },
    {
      type: 'continue-button',
    },
    {
      type: 'text',
      content: 'In this lesson, we will learn about fundamental concepts.'
    },
    {
      type: 'test',
      content: {
        question: "What is the main purpose of this course?",
        options: [
          "To learn about web development",
          "To practice coding skills",
          "To understand basic concepts",
          "To have fun"
        ],
        correctAnswer: 2,
        right_feedback: "The main purpose is to understand basic concepts!",
        wrong_feedback: "wrong_feedback: The main purpose is to understand basic concepts!"
      }
    },
    {
      type: 'next-lesson-button',
      content: '',
      nextLessonUrl: '/course/lesson-2'
    }
  ]
}


export default function AllLessonsPage() {
  const { data, isLoading, isError } = useFetchModuleData();
  if (isLoading) {
    return null;
  }
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <div className="flex flex-1 mt-20">
        <Sidebar lessonGroups={data} />
        <CourseContent />
      </div>
    </div>
  )
}



