import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/navbar";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
                <Navbar/>
            </div>
              {/* //up untill medium it will be hidden but after that it will be flex on the medium device */}
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-[80px] h-full">{children}</main>
        </div>
    );
};

export default DashboardLayout;


