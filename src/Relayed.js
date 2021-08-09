import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import axios from "axios";
import { paths } from "./Constants.js";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    }
});

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.hash}
                </TableCell>
                <TableCell align="center">{row.height}</TableCell>
                <TableCell align="center">{new Date(row.time).toLocaleString()}</TableCell>
                <TableCell align="center">{row.packets.length}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Packets
                            </Typography>
                            <Table size="small" aria-label="packets">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sequence</TableCell>
                                        <TableCell>From Address</TableCell>
                                        <TableCell>To Address</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Source Channel</TableCell>
                                        <TableCell align="right">Destination Channel</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.packets.map((packet) => (
                                        <TableRow key={`${packet.sequence} ${row.hash}`}>
                                            <TableCell component="th" scope="row">
                                                {packet.sequence}
                                            </TableCell>
                                            <TableCell>{packet.fromAddr}</TableCell>
                                            <TableCell>{packet.toAddr}</TableCell>
                                            <TableCell align="right">{`${packet.amount} ${packet.denom}`}</TableCell>
                                            <TableCell align="right">
                                                {packet.srcChannel}
                                            </TableCell>
                                            <TableCell align="right">
                                                {packet.dstChannel}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

class Relayed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 0,
            limit: 10,
            totalCount: 0,
            loading: true,
            path: props.match.params.path,
            txType: "from",
            tabValue: 0,
            pathIndex: paths.findIndex(x => x.path === props.match.params.path)
        }
    }

    capitalizeString = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    callApi = () => {
        this.setState({ loading: true })
        try {
            axios({
                method: 'GET',
                url: `http://143.198.99.191:5555/relayed-packets/${this.state.path}?${this.state.txType}Limit=${this.state.limit}
&${this.state.txType}Offset=${this.state.page * this.state.limit}`
            }).then(
                (response) => {
                    let data = response.data;
                    this.setState({
                        data: (data.data && data.data[`${this.state.txType}_osmosis_packets`]) || [],
                        loading: false,
                        totalCount: (data.data && data.data.pagination &&
                            data.data.pagination[`total${this.capitalizeString(this.state.txType)}Packets`]) || 0,
                    });
                },
                (error) => {
                    console.log(error);
                    this.setState({ loading: false });
                }
            );
        } catch (error) {
            console.log(error);
            this.setState({ loading: false });
        }
    }

    componentDidMount = () => {
        this.callApi();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.match.params.path !== this.props.match.params.path || nextProps.txType !== this.props.txType) {
            this.setState({
                path: nextProps.match.params.path,
                txType: "from",
                tabValue: 0,
                data: [],
                page: 0,
                limit: 10,
                totalCount: 0,
                pathIndex: paths.findIndex(x => x.path === nextProps.match.params.path)
            }, () => {
                this.callApi();
            })
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage }, () => {
            this.callApi();
        })
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            limit: parseInt(event.target.value, 10),
            data: [],
            page: 0,
            totalCount: 0,
        }, () => {
            this.callApi();
        })
    };

    handleChange = (event, newValue) => {
        if (newValue !== this.state.tabValue) {
            this.setState({
                tabValue: newValue,
                txType: newValue === 0 ? "from" : "to",
                data: [],
                page: 0,
                totalCount: 0,
                limit: 10,
            }, () => {
                this.callApi();
            });
        }
    };

    render() {
        return (
            <>
                <Paper>
                    <Tabs
                        value={this.state.tabValue}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label={this.state.pathIndex !== -1 ?
                            `${paths[this.state.pathIndex].dst} to ${paths[this.state.pathIndex].src}` : ""} />
                        <Tab label={this.state.pathIndex !== -1 ?
                            `${paths[this.state.pathIndex].src} to ${paths[this.state.pathIndex].dst}` : ""} />
                    </Tabs>
                </Paper>
                <Paper>
                    <TableContainer style={{ paddingTop: 5 }}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Tx Hash</TableCell>
                                    <TableCell align="center">Height</TableCell>
                                    <TableCell align="center">Timestamp</TableCell>
                                    <TableCell align="center">Packets Count</TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                (this.state.data.length && !this.state.loading) ?
                                    <TableBody>
                                        {this.state.data.map((row) => (
                                            <Row key={row.name} row={row} />

                                        ))}
                                    </TableBody>
                                    :
                                    <TableRow key={"loading"}>
                                        <TableCell style={{ borderBottom: 0 }} colSpan={6}>
                                            <h5 style={{ textAlign: "center" }}>{this.state.loading ? "Loading..." : "No data found"}</h5>
                                        </TableCell>
                                    </TableRow>
                            }
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 30, 100]}
                        component="div"
                        count={parseInt(this.state.totalCount, 10)}
                        rowsPerPage={this.state.limit}
                        page={this.state.page}
                        onPageChange={this.handleChangePage}
                        onRowsPerPageChange={this.handleChangeRowsPerPage}
                    />
                </Paper>
            </>
        );
    }
}

export default Relayed;
