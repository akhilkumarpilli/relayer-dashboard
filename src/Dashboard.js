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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import axios from "axios";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    }
});

function createData(name, calories, fat, carbs, protein, price) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        price,
        history: [
            { date: '2020-01-05', customerId: '11091700', amount: 3 },
            { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
        ],
    };
}

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
                <TableCell align="right">{row.height}</TableCell>
                <TableCell align="right">{row.time}</TableCell>
                <TableCell align="right">{row.packets.length}</TableCell>
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
                                        <TableRow key={packet.sequence}>
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

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
    createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
    createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromData: [],
            toData: [],
            fromPage: 0,
            toPage: 0,
            fromLimit: 10,
            toLimit: 10,
            totalFromCount: 0,
            totalToCount: 0,
            loading: true
        }
    }

    callApi = () => {
        this.setState({ loading: true })
        try {
            axios({
                method: 'GET',
                url: `http://143.198.99.191:5555/relayed-packets/${this.props.path}?fromLimit=${this.state.fromLimit}&toLimit=${this.state.toLimit}&
fromOffset=${this.state.fromPage * this.state.fromLimit}&toOffset=${this.state.toPage * this.state.toLimit}`
            }).then(
                (response) => {
                    let data = response.data;
                    this.setState({
                        fromData: (data.data && data.data.from_osmosis_packets) || [],
                        toData: (data.data && data.data.to_osmosis_packets) || [],
                        loading: false,
                        totalFromCount: (data.data && data.data.pagination && data.data.pagination.totalFromPackets) || 0,
                        totalToCount: (data.data && data.data.pagination && data.data.pagination.totalToPackets) || 0,
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

    handleChangePage = (event, newPage) => {
        console.log("Page..", newPage);
        this.setState({ fromPage: newPage }, () => {
            this.callApi();
        })
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            fromLimit: parseInt(event.target.value, 10),
            fromData: [],
            toData: [],
            fromPage: 0,
            toPage: 0,
            totalFromCount: 0,
            totalToCount: 0,
        }, () => {
            this.callApi();
        })
    };

    render() {
        return (
            <Paper>
                <TableContainer>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Tx Hash</TableCell>
                                <TableCell align="right">Height</TableCell>
                                <TableCell align="right">Timestamp</TableCell>
                                <TableCell align="right">Packets Count</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (this.state.fromData.length && !this.state.loading) ?

                                    this.state.fromData.map((row) => (
                                        <Row key={row.name} row={row} />
                                    )) :
                                    <div className="container-fluid">
                                        <div className="row">
                                            <h5 style={{ textAlign: "center" }}>{this.state.loading ? "Loading..." : "No data found"}</h5>
                                        </div>
                                    </div>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 30, 100]}
                    component="div"
                    count={this.state.totalFromCount}
                    rowsPerPage={this.state.fromLimit}
                    page={this.state.fromPage}
                    onPageChange={this.handleChangePage}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

export default Dashboard;
