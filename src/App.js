import React from 'react';
import Relayed from "./Relayed.js";
import Unrelayed from "./Unrelayed.js";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import ResponsiveDrawer from "./Drawer.js";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

let paths = [
  {
    path: "akash-osmosis",
    heading: "Akash-Osmosis",
    src: "Akash",
    dst: "Osmosis"
  }, {
    path: "cosmos-osmosis",
    heading: "Cosmos-Osmosis",
    src: "Cosmos",
    dst: "Osmosis"
  }, {
    path: "sentinel-osmosis",
    heading: "Sentinel-Osmosis",
    src: "Sentinel",
    dst: "Osmosis"
  }, {
    path: "core-osmosis",
    heading: "Persistence-Osmosis",
    src: "Persistence",
    dst: "Osmosis"
  }, {
    path: "crypto-osmosis",
    heading: "Crypto.Org-Osmosis",
    src: "Crypto.Org",
    dst: "Osmosis"
  }, {
    path: "iris-osmosis",
    heading: "Iris-Osmosis",
    src: "Iris",
    dst: "Osmosis"
  },
  {
    path: "iov-osmosis",
    heading: "Starname-Osmosis",
    src: "Starname",
    dst: "Osmosis"
  }
]

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
});

function App() {
  const [selected, setSelected] = React.useState(0);
  const [tabValue, setValue] = React.useState(0);
  const [relayed, setRelayed] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ResponsiveDrawer
          menu={paths}
          selected={selected}
          setSelected={setSelected}
          setValue={setValue}
          relayed={relayed}
          setRelayed={setRelayed}
        >
          {
            relayed ?
              <>
                <Paper>
                  <Tabs
                    value={tabValue}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                  >
                    <Tab label={`${paths[selected].dst} to ${paths[selected].src}`} />
                    <Tab label={`${paths[selected].src} to ${paths[selected].dst}`} />
                  </Tabs>
                </Paper>
                <Relayed path={paths[selected].path} txType={tabValue === 1 ? "to" : "from"} />
              </>
              : <Unrelayed path={paths[selected].path} />
          }

        </ResponsiveDrawer>
      </div>
    </ThemeProvider>
  );
}

export default App;
