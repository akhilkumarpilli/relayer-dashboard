import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Relayed from "./Relayed.js";
import Unrelayed from "./Unrelayed.js";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import ResponsiveDrawer from "./Drawer.js";

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
});

const NotFound = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h3>Page Not Found</h3>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <Router>
          <Switch>
            <ResponsiveDrawer>
              <Route exact path="/">
                <Redirect to="/relayed/akash-osmosis" />
              </Route>
              <Route exact path="/relayed/:path" component={Relayed} />
              <Route exact path="/unrelayed/:path" component={Unrelayed} />
              <Route exact path="/404" component={NotFound} />
            </ResponsiveDrawer>
          </Switch>
        </Router>
      </React.StrictMode>
    </ThemeProvider>
  );
}

export default App;
