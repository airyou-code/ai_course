import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  lessonGroups?: any; // Замените на правильный тип данных
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true, lessonGroups }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar lessonGroups={lessonGroups} />}
        <main className={`flex-1 ${showSidebar ? 'ml-64' : ''} p-8 overflow-y-auto`}>
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;