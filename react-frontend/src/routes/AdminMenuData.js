

export const AdminMenuData = [
    { title: "Admin Dashboard", icon: "HomeIcon", path: "/admin" },
    { title: "Example Table", icon: "UserGroupIcon", path: "/admin/table" },
    { module_id:"custid01",permissionChecks:"listing",title: "Customers", icon: "UserGroupIcon", path: "/admin/customers" },
    { module_id:"usrid01",permissionChecks:"listing", title: "Users", icon: "UserIcon", path: "/admin/user/list" },
    {
      title: "Vendors",
      icon: "UserGroupIcon",
      subMenu: [
        { module_id:"vendid01",permissionChecks:"create",title: "Vendor Create", icon: "UserGroupIcon", path: "/admin/vendor/create"  },
        { module_id:"vendid01",permissionChecks:"listing",title: "Vendor Listing", icon: "UserGroupIcon", path: "/admin/vendor/list"  },
        
      ],
    },
    {
      title: "Purchase",
      icon: "ShoppingBagIcon",
      subMenu: [
        { module_id:"prchsid01",permissionChecks:"create",title: "Purchase Create", path: "/admin/purchase/create" },
        { module_id:"prchsid01",permissionChecks:"listing",title: "Purchase List", path: "/admin/purchase/list" },
      ],
    },
    {
      title: "Products",
      icon: "ShoppingCartIcon",
      subMenu: [
        { module_id:"ctgid01",permissionChecks:"create",title: "Category Create", path: "/admin/product/category/create" },
        { module_id:"ctgid01",permissionChecks:"listing",title: "Category List", path: "/admin/product/category/list" },
        { module_id:"pdid01",permissionChecks:"create",title: "Product Create", path: "/admin/product/create" },
        { module_id:"pdid01",permissionChecks:"listing",title: "Product List", path: "/admin/product/list" },
        { module_id:"pdid01",permissionChecks:"allow",title: "Manage", path: "/admin/products/manage" },
      ],
    },
    { title: "Sales", icon: "CreditCardIcon", path: "/admin/sales" },
    { title: "Purchase", icon: "ShoppingCartIcon", path: "/admin/purchase" },
    { title: "Debit/Credit", icon: "CreditCardIcon", path: "/admin/debit-credit" },
    {
      title: "Reports",
      icon: "CreditCardIcon",
      subMenu: [
        { title: "Utility Cost", path: "/admin/reports/utility-cost" },
        { title: "Salary Cost", path: "/admin/reports/salary-cost" },
        { title: "Material Cost", path: "/admin/reports/material-cost" },
        { title: "Other Expenditure", path: "/admin/reports/other-expenditure" },
        { title: "Profit/Loss Daily", path: "/admin/reports/profit-loss/daily" },
        { title: "Profit/Loss Monthly", path: "/admin/reports/profit-loss/monthly" },
        { title: "Profit/Loss Yearly", path: "/admin/reports/profit-loss/yearly" },
      ],
    },
    {
      title: "Configurations",
      icon: "CogIcon",
      subMenu: [
        { module_id:"rolid01",permissionChecks:"create",title: "Role Create", path: "/admin/role/create" },
        { module_id:"rolid01",permissionChecks:"listing",title: "Role List", path: "/admin/role/list" },
        { module_id:"permid01",permissionChecks:"create",title: "Create Permission", path: "/admin/permission/create" },
        { module_id:"permid01",permissionChecks:"listing",title: "Permission List", path: "/admin/permission/list" },
      ],
    },
    { title: "Settings", icon: "Cog6ToothIcon", path: "/settings" },
  ];

