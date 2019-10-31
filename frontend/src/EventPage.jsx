import React from "react"

import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";

import AppContext from "./AppContext";
import RemainingTimeSpan from "./RemainingTimeSpan.jsx";
import moment from "moment";

export default class EventPage extends React.Component {

    static contextType = AppContext

    constructor(props, context) {
        super(props, context)
    }

    state = {
        inited: false,
        markets: null,
        marketExpanded: [],
        marketActionMap: {}
    }

    componentDidMount() {
        this.initEvent()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.initEvent()
    }

    betFunction = (marketId, isBuy) => {
        const sideText = isBuy ? "yes" : "no"
        const price = document.getElementById(sideText + "-price" + marketId).value
        const amount = document.getElementById(sideText + "-amount" + marketId).value

        const amountToPay = isBuy ? (price * amount) : ((100 - price) * amount)

        this.setState(state => ({marketActionMap: {...state.marketActionMap, [marketId]: true}}))

        this.context.w3a.contracts.PredictEvent._at(this.props.address).placeOrder.send(
            amountToPay * 100000000000000,
            price,
            amount,
            isBuy,
            marketId
        )
            .then(rest => {
                console.log("BETTING COMPLETE")
            })
            .catch(e => {
                debugger
            })
            .finally(() => {
                this.setState(state => ({marketActionMap: {...state.marketActionMap, [marketId]: false}}))
            })
    }

    initEvent(force) {
        if (force || (!this.state.inited && this.state.markets === null && this.context.w3a)) {
            this.setState({inited: true})

            this.context.w3a.addEventListener('newBlock', (e) => {
                console.log('Instance fired "something".', e);
                this.fetchMarkets()
            });

            this.context.w3a.contracts.PredictEvent._at(this.props.address).market.call()
                .then(eventInfo => {
                    const extra = eventInfo[2]
                    this.setState(state => ({
                        name: eventInfo[0],
                        endTimestamp: eventInfo[1],
                        apiPath: extra.apiPath,
                        getData: extra.getData,
                        postData: extra.postData,
                        httpPostOrGet: extra.jsonRegexString,
                        jsonRegexString: extra.jsonRegexString,
                    }))
                    this.fetchMarkets()
                })
        }
    }

    fetchMarkets() {
        function toOrderViewData(inputData, isBuy) {
            let amountSum = 0
            const orders = inputData
                .map((amountString, index) => {
                        return {
                            price: index,
                            amount: parseInt(amountString)
                        }
                    }
                )
                .filter(priceLevel => priceLevel.amount !== 0)

            if (isBuy) {
                orders.reverse()
            }

            orders.forEach(priceLevel => {
                    amountSum += priceLevel.amount
                    priceLevel.amountSum = amountSum
                }
            )
            return orders
        }

        this.context.w3a.contracts.PredictEvent._at(this.props.address).showBooks.call()
            .then(markets => {
                this.setState(state => ({
                    markets: markets.map(market => ({
                        buySide: toOrderViewData(market[0], true),
                        sellSide: toOrderViewData(market[1], false)
                    }))
                }))
            })
    }

    handleExpandClick = () => {
        this.setState(state => ({
            marketsExpand: state.marketsExpand
        }));
    }

    render() {
        const name = this.state.name || "Loading..."

        const endTimestamp = this.state.endTimestamp || null
        const endDateString = endTimestamp ? moment(endTimestamp).format("MMMM D YYYY   kk:mm") : "Loading..."

        const description = "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."
        //const description = this.state.description ? this.state.description : "Loading..."

        return (
            <div id="EventPage" className="container-content">
                <section className="container">
                    <Card>
                        <CardHeader className="event-head"
                                    title={
                                        <div>
                                            <h2>{name}</h2>
                                            <h5>Ends: {endDateString} in (<RemainingTimeSpan
                                                endTimestamp={endTimestamp}/>)</h5>
                                        </div>
                                    }
                                    subheader={<Typography variant="body2" color="textSecondary"
                                                           component="p">{description}</Typography>}
                        />
                        {this.state.markets ? (
                            this.state.markets.map((market, index) =>
                                this.renderMarket(market, index)
                            )
                        ) : (
                            <CardContent>No markets</CardContent>
                        )}
                    </Card>
                </section>
            </div>
        )
    }

    renderMarket(market, index) {

        //<Collapse in={this.state.marketExpanded[index]} timeout="auto" unmountOnExit>
        return (
            <div key={index}>
                <CardContent>
                    Solution {index}:
                </CardContent>
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent style={{display: "flex"}}>
                        {this.renderOrderSideControls(true, market, index)}
                        {this.renderOrderSideTable(true, market.buySide)}
                        <div key="separator" className="side-divider"/>
                        {this.renderOrderSideTable(false, market.sellSide)}
                        {this.renderOrderSideControls(false, market, index)}
                    </CardContent>
                </Collapse>
            </div>
        )
    }

    renderOrderSideControls(isBuy, market, marketId) {
        const sideText = isBuy ? "yes" : "no"
        const marketSide = isBuy ? market.buySide : market.sellSide

        const defaultPrice = isBuy ? (marketSide.length > 0 ? marketSide[0].price + 1 : 1) : (marketSide.length > 0 ? marketSide[0].price - 1 : 99)
        const defaultAmount = 1

        const sum = defaultPrice * defaultAmount
        const otherSum = (100 - defaultPrice) * defaultAmount

        const canWin = isBuy ? otherSum : sum
        const canLose = isBuy ? sum : otherSum

        function recalculate() {
            const price = document.getElementById(sideText + "-price" + marketId).value
            const amount = document.getElementById(sideText + "-amount" + marketId).value
            const canWin = (100 - price) * amount
            const canLose = price * amount
            document.getElementById(sideText + "-canwin" + marketId).value = (isBuy ? canWin : canLose)
            document.getElementById(sideText + "-canlose" + marketId).value = (isBuy ? canLose : canWin)
        }

        return (
            <div key={sideText + "Controls"} className={"order-book-control " + (isBuy ? "buy" : "sell")}>

                <div style={{flexDirection: (isBuy ? "row": "row-reverse")}}>
                    <div>
                        <TextField
                            id={sideText + "-canwin" + marketId}
                            label="You Can Win:"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={canWin}
                            margin="normal"
                            variant="outlined"
                            disabled
                        />
                        <TextField
                            id={sideText + "-canlose" + marketId}
                            label="You Can Lose:"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={canLose}
                            margin="normal"
                            variant="outlined"
                            disabled
                        />
                    </div>
                    <div style={{width: "40px"}}/>
                    <div>
                        <TextField
                            id={sideText + "-price" + marketId}
                            label={(isBuy ? "Bet YES" : "Bet NO") + " Price:"}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={defaultPrice}
                            margin="normal"
                            variant="outlined"
                            onChange={recalculate}
                        />
                        <TextField
                            id={sideText + "-amount" + marketId}
                            label="Amount:"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={1}
                            margin="normal"
                            variant="outlined"
                            onChange={recalculate}
                        />
                    </div>
                </div>
                <Fab
                    variant="extended"
                    size="large"
                    color="primary"
                    style={{backgroundColor: isBuy ? "green" : "red"}}
                    onClick={() => this.betFunction(marketId, isBuy)}
                >
                    <ShoppingCartIcon/>
                    {isBuy ? "Bet YES" : "Bet NO"}
                </Fab>
            </div>
        )
    }

    renderOrderSideTable(isBuy, rows) {
        const columns = [
            {id: 'amountSum', label: 'Sum', minWidth: 60, align: 'center'},
            {id: 'amount', label: 'Amount', minWidth: 70, align: 'center'},
            {id: 'price', label: isBuy ? "Bid" : "Ask", minWidth: 40, align: 'center'}
        ];

        columns.reverse()

        return (
            <div key={(isBuy ? "buy" : "sell") + "OrderBook"} style={{maxHeight: "200px", overflowY: "auto", direction: isBuy ? "rtl" : "ltr"}}>
                <Table stickyHeader size="small" aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{minWidth: column.minWidth}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map(column => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        )
    }
}