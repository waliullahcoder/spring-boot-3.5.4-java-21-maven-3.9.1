import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import Home from "../pages/dashboard/home"; 
import {
  AdminSidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "../widgets/layout/index";
import {AdminMenuData} from "../routes/AdminMenuData";
import { useMaterialTailwindController, setOpenConfigurator } from "../context/index";
import {useUser} from '../utils/helpers';
// import {usePermissions} from '../utils/common';
export function AdminDashboard() {
  const currentUser = useUser();
  // const usePermissionsData = usePermissions();
  // console.log("Wlai currentUser",usePermissionsData,currentUser);
  
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const handleRefresh = () => {
    window.location.reload();
  };
  
 
  

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      
      
      <AdminSidenav
        routes={AdminMenuData}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        {currentUser?.email}
        <button onClick={handleRefresh} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Refresh Browser
        </button>
        <Home/>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
