import CourseInfo from '../../components/course/CourseInfo'
import Curriculum from '../../components/course/Curriculum'
import Navbar from '../../components/layout/Navbar'
import Hero from '../../components/layout/Hero'
import { Any } from 'react-spring'


interface Lesson {
  title: string
  duration: string
  description: string
  is_free: boolean
  is_locked: boolean
  uuid: string
  is_completed?: boolean
}

interface Module {
  title: string
  description: string
  lessons: Lesson[]
}

interface Group {
  title: string
  description: string
  modules: Module[]
}

const lessonGroups: Group[] = [
  {
    "title": "Live",
    "description": "",
    "modules": [
      {
        "title": "Module #1",
        "description": "jnf kfsdlfn dsfobnsdfk kvb sb ksdbv jkbs bkjs bks bskh jhfbj;ab LK BA ABHGFV",
        "lessons": [
          {
            "title": "Lesson: #1",
            "duration": "15 min",
            "description": "Фабричный метод — это порождающий паттерн проектирования, который определяет",
            "is_locked": false,
            "is_free": false,
            "uuid": "2ee779c4-6bef-46da-a587-a2def1cb25c6"
          },
          {
            "title": "Lesson: #2",
            "duration": "15 min",
            "description": "Фабричный метод — это порождающий паттерн проектирования, который определяет",
            "is_locked": true,
            "is_free": false,
            "uuid": "4aee58a2-f0c8-4a8d-b9ca-f39965a8379d"
          },
          {
            "title": "Lesson: #3",
            "duration": "15 min",
            "description": "Фабричный метод — это порождающий паттерн проектирования, который определяет",
            "is_locked": true,
            "is_free": false,
            "uuid": "48f6b0e3-541e-47a4-b9da-d77ca8aa38e1"
          }
        ]
      },
      {
        "title": "Modules #2",
        "description": "sadas",
        "lessons": []
      },
      {
        "title": "Modules #3",
        "description": "sdofjnsd nksd fksdfn",
        "lessons": []
      }
    ]
  }
]

export default function MainPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <div className="p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <CourseInfo />
            </div>
            <div className="md:col-span-2">
              <Curriculum lessonGroups={lessonGroups}/>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
