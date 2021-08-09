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
                    {row.sequence}
                </TableCell>
                <TableCell align="center">{row.hash}</TableCell>
                <TableCell align="center">{new Date(row.time).toLocaleString()}</TableCell>
                <TableCell align="center">{row.from}</TableCell>
                <TableCell align="center">{row.to}</TableCell>
                <TableCell align="center">{row.height}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Packet Details
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
                                    <TableRow key={`${row.sequence} ${row.hash}`}>
                                        <TableCell component="th" scope="row">
                                            {row.sequence}
                                        </TableCell>
                                        <TableCell>{row.fromAddr}</TableCell>
                                        <TableCell>{row.toAddr}</TableCell>
                                        <TableCell align="right">{`${row.amount} ${row.denom}`}</TableCell>
                                        <TableCell align="right">
                                            {row.srcChannel}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.dstChannel}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

class Unrelayed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            path: props.match.params.path,
        }
    }

    callApi = () => {
        this.setState({ loading: true })
        try {
            axios({
                method: 'GET',
                url: `http://143.198.99.191:5555/unrelayed/${this.state.path}`,
                timeout: 10000
            }).then(
                (response) => {
                    let data = response.data;
                    this.setState({
                        data: data.data || [],
                        loading: false,
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
        if (nextProps.match.params.path !== this.props.match.params.path) {
            this.setState({
                data: [],
                path: nextProps.match.params.path
            }, () => {
                this.callApi();
            })
        }
    }

    render() {
        return (
            <Paper>
                <TableContainer>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Sequence</TableCell>
                                <TableCell align="center">Txhash</TableCell>
                                <TableCell align="center">Timestamp</TableCell>
                                <TableCell align="center">From</TableCell>
                                <TableCell align="center">To</TableCell>
                                <TableCell align="center">Height</TableCell>
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
                                <TableRow>
                                    <TableCell style={{ borderBottom: 0 }} colSpan={7}>
                                        <h5 style={{ textAlign: "center" }}>{this.state.loading ? "Loading..." : "No data found"}</h5>
                                    </TableCell>
                                </TableRow>
                        }
                    </Table>
                </TableContainer>
            </Paper>
        );
    }
}

export default Unrelayed;
