import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { isLoggedInVar } from "../apollo";
import { Header } from "../components/header";
import { LOCALSTORAGE_TOKEN } from "../constant";
import { Restaurants } from "../pages/client/restaurants";
import { UserRole } from "../__generated__/globalTypes";

const ClientRoutes = [
  <Route key="0" path="/" exact>
    <Restaurants />
  </Route>,
];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter: React.FC = () => {
  const onClick = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    isLoggedInVar(Boolean(localStorage.getItem(LOCALSTORAGE_TOKEN)));
  };

  const { data, loading, error } = useQuery(ME_QUERY);
  console.log(data);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === UserRole.client && ClientRoutes}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
