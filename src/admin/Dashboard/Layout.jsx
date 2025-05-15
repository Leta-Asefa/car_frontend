import Sidebar from "../../pages/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="h-screen sticky top-0 left-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-5 bg-gray-100 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
