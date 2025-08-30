import React from "react";
import { Route } from "react-router-dom";
import { PublicMiddleware } from "../app/middleware/indexMiddleware";
import { Login, SignUp } from "../components/PublicComponents";

const PublicRoutes = [
  <Route
    key="login"
    path="/login"
    element={
      <PublicMiddleware>
        <Login />
      </PublicMiddleware>
    }
  />,
  <Route
    key="signup"
    path="/auth/sign-up"
    element={
      <PublicMiddleware>
        <SignUp />
      </PublicMiddleware>
    }
  />,
];

export default PublicRoutes;
