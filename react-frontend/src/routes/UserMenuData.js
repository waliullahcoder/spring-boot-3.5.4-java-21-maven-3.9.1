export const UserMenuData = [
    { title: "User Dashboard", icon: "HomeIcon", path: "/dashboard" },
    { title: "Eample Table", icon: "PresentationChartBarIcon", path: "/dashboard/table" },
      
      {
        title: "Customer",
        icon: "PresentationChartBarIcon",
        subMenu: [
          { title: "Create", path: "/customer/create" },
          { title: "Manage", path: "/customer/list" },
          { title: "History", path: "/customer/history" },
        ],
      },
      {
        title: "Invoice",
        icon: "ShoppingBagIcon",
        subMenu: [
          { title: "Create", path: "/invoice/create" },
          { title: "Invoice List", path: "/invoice/list" },
          { title: "History", path: "/invoice/history" },
        ],
      },
      {
        title: "Settings",
        icon: "Cog6ToothIcon",
        subMenu: [
          { title: "Profile", path: "/settings/profile" },
          { title: "Password", path: "/settings/password" },
        ],
      },
    ];
    