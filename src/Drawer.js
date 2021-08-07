import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        backgroundColor: "teal",
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: `calc(100% - ${drawerWidth}px)`,
    },
    children: {
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

function ResponsiveDrawer(props) {
    const { window, selected, setSelected, menu, setValue, relayed, setRelayed } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [open, setOpen] = React.useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuItem = (event, value) => {
        if (relayed === value) {
            setOpen(!open);
        } else {
            setRelayed(!relayed);
            setSelected(0);
            setOpen(true);
        }
    }

    const handleSubMenuItem = (event, index) => {
        setSelected(index);
        setValue(0);
    }

    const returnList = () => {
        return (<List component="div" disablePadding>
            {menu.map((p, index) => (
                <>
                    <ListItem button
                        key={`${p.heading} ${relayed}`}
                        selected={index === selected}
                        // disabled={index === selected}
                        onClick={(event) => handleSubMenuItem(event, index)}
                        className={classes.nested}
                    >
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={p.heading} />
                    </ListItem>
                </>
            ))}
        </List>)
    }

    const drawer = (
        <div>
            <div className={classes.toolbar} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h4>Relayer Dashboard</h4>
            </div>
            <Divider />
            <List>
                <ListItem button
                    selected={relayed}
                    // disabled={relayed}
                    onClick={(event) => handleMenuItem(event, true)}
                >
                    <ListItemIcon>
                        <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary={"Relayed Txs"} />
                    {open && relayed ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open && relayed} timeout="auto" unmountOnExit>
                    {returnList()}
                </Collapse>
                <ListItem button
                    selected={!relayed}
                    // disabled={!relayed}
                    onClick={(event) => handleMenuItem(event, false)}
                >
                    <ListItemIcon>
                        <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary={"Pending Txs"} />
                    {open && !relayed ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open && !relayed} timeout="auto" unmountOnExit>
                    {returnList()}
                </Collapse>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {`${menu[selected].heading} ${relayed ? 'Relayed' : 'Pending'} IBC transactions`}
                    </Typography>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.children}>
                    {props.children}
                </div>
            </main>
        </div>
    );
}

export default ResponsiveDrawer;
