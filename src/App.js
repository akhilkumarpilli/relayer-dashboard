import React from 'react';
import Dashboard from "./Dashboard.js";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import ResponsiveDrawer from "./Drawer.js";

let paths = [
  {
    path: "cosmos-osmosis",
    heading: "Cosmos-Osmosis",
  }, {
    path: "akash-osmosis",
    heading: "Akash-Osmosis"
  }, {
    path: "sentinel-osmosis",
    heading: "Sentinel-Osmosis"
  }, {
    path: "core-osmosis",
    heading: "Persistence-Osmosis"
  }, {
    path: "crypto-osmosis",
    heading: "Crypto.Org-Osmosis"
  }, {
    path: "iov-osmosis",
    heading: "Iris-Osmosis"
  },
  {
    path: "iov-osmosis",
    heading: "Iov-Osmosis"
  }
]

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
});

function App() {
  const [selected, setSelected] = React.useState(0);

  React.useEffect(()=>{

  },[selected])

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ResponsiveDrawer menu={paths} selected={selected} setSelected={setSelected}>
        <Dashboard path={paths[selected].path}/>
      </ResponsiveDrawer>
        {/* {
        paths.map((path) => {
          return (<>
            <h3 style={{ textAlign: "center" }}>{path.heading}</h3>
            <Dashboard path={path.path} />
            <br />
          </>)
        })
      } */}
      </div>
    </ThemeProvider>
  );
}

export default App;
