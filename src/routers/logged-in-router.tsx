import React from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';
import { Header } from '../components/header';
import { LOCALSTORAGE_TOKEN } from '../constant';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Restaurants } from '../pages/client/restaurants';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { UserRole } from '../__generated__/globalTypes';

const ClientRoutes = [
    <Route key={1} path="/" exact>
        <Restaurants />
    </Route>,
    <Route key={2} path="/confirm" exact>
        <ConfirmEmail />
    </Route>,
    <Route key={3} path="/edit-profile" exact>
        <EditProfile />
    </Route>,
];

export const LoggedInRouter: React.FC = () => {
    const onClick = () => {
        localStorage.removeItem(LOCALSTORAGE_TOKEN);
        isLoggedInVar(Boolean(localStorage.getItem(LOCALSTORAGE_TOKEN)));
    };

    const { data, loading, error } = useMe();

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
                {data.me.role === UserRole.Client && ClientRoutes}
                <Redirect to="/" />
                <Route>
                    <NotFound />
                </Route>
            </Switch>
        </Router>
    );
};
