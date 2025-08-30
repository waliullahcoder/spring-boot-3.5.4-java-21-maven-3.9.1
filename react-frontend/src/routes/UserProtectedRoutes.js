import React from "react";
import { Route } from "react-router-dom";
import { PrivateMiddleware } from "../app/middleware/indexMiddleware";
import { 
  Dashboard, 
  UserTable, 
  CreateInvoicePage,
  InvoiceListPage, 
  InvoiceShowPage, 
  CreateCustomerPage, 
  CustomerListPage
} from "../components/UserComponents";

const UserProtectedRoutes = [


  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <PrivateMiddleware>
        <Dashboard />
      </PrivateMiddleware>
    }
  />,
  <Route
    key="user-table"
    path="/dashboard/table"
    element={
      <PrivateMiddleware>
        <UserTable />
      </PrivateMiddleware>
    }
  />,



  //Customer Section
  <Route
    key="Customer"
    path="/customer/create"
    element={
      <PrivateMiddleware>
        <CreateCustomerPage />
      </PrivateMiddleware>
    }
  />,
  <Route
    key="Customer"
    path="/customer/create"
    element={
      <PrivateMiddleware>
        <CreateCustomerPage />
      </PrivateMiddleware>
    }
  />,
  <Route
    key="Customer"
    path="/customer/list"
    element={
      <PrivateMiddleware>
        <CustomerListPage />
      </PrivateMiddleware>
    }
  />,
  <Route
  key="Customer"
  path="/customer/edit/:id"
  element={
    <PrivateMiddleware>
      <CreateCustomerPage />
    </PrivateMiddleware>
   }
  />,





  //Invoice Section
  <Route
    key="Invoice"
    path="/invoice/create"
    element={
      <PrivateMiddleware>
        <CreateInvoicePage />
      </PrivateMiddleware>
    }
  />,
    <Route
      key="Invoice-List"
      path="/invoice/list"
      element={
        <PrivateMiddleware>
          <InvoiceListPage />
        </PrivateMiddleware>
      }
    />,
    <Route
      key="Invoice-Show"
      path="/invoice/show/:id"
      element={
        <PrivateMiddleware>
          <InvoiceShowPage />
        </PrivateMiddleware>
      }
    />,
];

export default UserProtectedRoutes;
