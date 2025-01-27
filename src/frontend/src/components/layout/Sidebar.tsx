import React from 'react';
import { Search } from 'lucide-react';

interface Lesson {
  title: string;
  duration: string;
  is_free: boolean;
  is_locked: boolean;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Group {
  title: string;
  modules: Module[];
}

type SidebarProps = {
  lessonGroups: Group[];
};

const Sidebar: React.FC<SidebarProps> = ({ lessonGroups }) => {
  return (
    <div className="w-20 lg:w-80 border-r border-slate-400 bg-zinc-800 p-4 fixed top-20 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-100 shadow-md overflow-y-auto">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search lessons..."
          className="w-full bg-black text-white placeholder-gray-500 rounded-lg py-2 pl-10 pr-4"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" />
      </div>
      <button className="w-full bg-gray-800 text-white font-bold py-2 rounded-lg mb-4">
        All Lessons
      </button>
      <div className="mb-4">
        <h3 className="text-gray-500 font-bold mb-2">Progress</h3>
        <div className="flex space-x-1">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="w-6 h-2 bg-gray-700 rounded-full" />
          ))}
        </div>
      </div>
      {lessonGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-7">
          <h3 className="text-white font-bold mb-2">{group.title}</h3>
          {group.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-4">
              <h4 className="text-gray-300 font-semibold mb-2">{module.title}</h4>
              {module.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 text-sm">{lesson.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 text-xs">{lesson.duration}</span>
                    {lesson.is_free && (
                      <span className="bg-purple-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                        Free
                      </span>
                    )}
                    {lesson.is_locked && (
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

