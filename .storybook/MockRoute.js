import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

export default ({ children }) =>
    <BrowserRouter>
        <Switch>
            <Route path="/" render={() => children} />
        </Switch>
    </BrowserRouter>;
