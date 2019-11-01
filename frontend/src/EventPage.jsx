import React from "react"

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Fab from "@material-ui/core/Fab";
import FastForwardIcon from '@material-ui/icons/FastForward';

import AppContext from "./AppContext";
import RemainingTimeSpan from "./RemainingTimeSpan.jsx";
import moment from "moment";
import {Button} from "@material-ui/core";

export default class EventPage extends React.Component {

    static contextType = AppContext

    constructor(props, context) {
        super(props, context)
    }

    blockTimeMapping = {}

    state = {
        inited: false,

        name: undefined,
        endTimestamp: undefined,
        apiPath: undefined,
        getData: undefined,
        postData: undefined,
        httpPostOrGet: undefined,
        jsonRegexString: undefined,

        markets: null,
        marketExpanded: {},
        marketActionMap: {},

        finalizing: false,
        finalized: false
    }

    componentDidMount() {
        this.initPage()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.initPage()
    }

    finalize = () => {
        this.setState(state => ({finalizing: true}))

        const authToken = document.getElementById("authKey").value
        debugger
        this.context.w3a.contracts.PredictEvent._at(this.props.address).finalize.send(
            null,
            authToken
        )
            .then(receipt1 => {
                console.log("FINALIZED SUCCESS")
                this.fetchMarkets()
                /*this.context.w3a.contracts.PredictEvent._at(this.props.address).finalize2.send(null)
                    .catch(e => {
                        debugger
                        this.setState(state => ({finalizing: false}))
                    })
                    .then(receipt2 => {

                    })*/
            })
            .catch(e => {
                debugger
                this.setState(state => ({finalizing: false}))
            })
            .finally(() => {

            })
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

    initPage() {
        if (!this.state.inited && this.state.markets === null && this.context.w3a) {
            this.setState({inited: true})

            this.context.w3a.addEventListener('newBlock', (e) => {
                console.log('Instance fired "something".', e);
                this.fetchMarkets()
            });

            this.context.w3a.contracts.PredictEvent._at(this.props.address).Event.call()
                .then(eventInfo => {
                    const extra = eventInfo[3]
                    this.setState(state => ({
                        name: eventInfo[0],
                        description: eventInfo[1],
                        endTimestamp: parseInt(eventInfo[2]) * 1000,
                        apiPath: extra.apiPath,
                        getData: extra.getData,
                        postData: extra.postData,
                        httpPostOrGet: extra.httpPostOrGet,
                        jsonRegexString: extra.jsonRegexString,
                    }))
                    this.fetchMarkets()
                })
        }
    }

    fetchMarkets() {

        const PredictEventIntance = this.context.w3a.contracts.PredictEvent._at(this.props.address)

        PredictEventIntance.finalized.call()
            .then(finalized => this.setState(state => ({finalized})))

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


        PredictEventIntance.getOutcomes.call()
            .then(outcomes => {
                PredictEventIntance.showBooks.call()
                    .then(markets => {
                        this.setState(state => ({
                            markets: markets.slice(0, outcomes.length).map((market, index) => ({
                                name: outcomes[index].name,
                                buySide: toOrderViewData(market[0], true),
                                sellSide: toOrderViewData(market[1], false)
                            }))
                        }))
                    })
            })

        PredictEventIntance._contract.getPastEvents("lord", {
            fromBlock: 1,
            toBlock: 'latest',
            //topics:
            filter: {owner: this.context.w3a.userAcc}
        }).then(userOrderEvents => {
            const ordersByMarket = {}
            userOrderEvents.forEach(event => {
                if (!ordersByMarket[event.returnValues.marketID]) ordersByMarket[event.returnValues.marketID] = []

                const orderView = {
                    type: event.returnValues.isBuy ? "YES" : "NO",
                    amount: parseInt(event.returnValues.amount),
                    filled: parseInt(event.returnValues.filled),
                    isBuy: event.returnValues.isBuy,
                    price: parseInt(event.returnValues.price)
                }
                const resolvedTime = this.blockTimeMapping[event.blockNumber]
                if (resolvedTime) {
                    orderView.time = resolvedTime
                }
                ordersByMarket[event.returnValues.marketID].push(orderView)
                this.context.w3a.eth.getBlock(event.blockNumber).then(block => {
                    const downloadedTime = moment(block.timestamp * 1000).format("MM/DD/YYYY  kk:mm")
                    this.blockTimeMapping[event.blockNumber] = downloadedTime
                    orderView.time = downloadedTime
                    this.forceUpdate()
                })
            })

            this.setState({ordersByMarket})
        })
    }


    renderFinalizeBlock() {
        return (moment().isBefore(this.state.endTimestamp)
                ? null
                : this.state.finalized
                    ? <Typography>Winning were paid out!</Typography>
                    : <div>
                        <Button
                            size="large"
                            color="primary"
                            style={{
                                padding: "3px",
                                backgroundColor: this.state.finalizing ? "#EEEEEE" : "#649de2",
                                fontSize: "20px",
                                color: "white",
                                marginBottom: "20px",
                                boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
                                marginTop: "17px",
                                marginRight: "20px"
                            }}
                            onClick={() => this.finalize()}
                            disabled={this.state.finalizing}
                        >
                            {this.state.finalizing
                                ? (
                                    <div className="spinner-border text-warning"
                                         style={{
                                             margin: "10px 20px",
                                             fontSize: "25px",
                                             width: "30px",
                                             height: "30px"
                                         }}
                                         role="status">
                                        <span className="sr-only">Finalizing...</span>
                                    </div>
                                )
                                : (
                                    <div className="font-weight-bold text-white"
                                         style={{fontSize: "20px", margin: "7px"}}>
                                        Finalize
                                        <FastForwardIcon style={{margin: "-3px 10px 0"}}/>
                                    </div>
                                )}
                        </Button>
                        <TextField
                            id="authKey"
                            label="Finalize Auth Key"
                            type="text"
                            defaultValue=""
                            helperText=""
                            margin="normal"
                            variant="outlined"
                            style={{width: "550px"}}
                            disabled={this.state.finalizing}
                        />
                    </div>
        )
    }

    render() {
        const name = this.state.name || "Loading..."

        const endTimestamp = this.state.endTimestamp || null
        const endDateString = endTimestamp ? moment(endTimestamp).format("MMMM D YYYY   kk:mm") : "Loading..."

        const description = this.state.description
            ? this.state.description.split("\n").map((i, key) => {
                return <div key={key}>{i}</div>;
            })
            : "Loading description..."

        return (
            <div id="EventPage" className="container-content">
                <section className="container">
                    <Card>
                        <CardHeader className="event-head"
                                    title={
                                        <div>
                                            <h1>{name}</h1>
                                            <h5>Ends: {endDateString} (<RemainingTimeSpan
                                                endTimestamp={endTimestamp}/>)</h5>
                                        </div>
                                    }
                                    subheader={<div>
                                        {this.renderFinalizeBlock()}
                                        <Typography variant="body1" color="textSecondary"
                                                    component="div">{description}</Typography>
                                        <hr/>
                                        {this.state.apiPath && <Typography>API Path: {this.state.apiPath}</Typography>}
                                        {this.state.httpPostOrGet &&
                                        <Typography>Http GET or POST: {this.state.httpPostOrGet}</Typography>}
                                        {this.state.getData && <Typography>GET Data: {this.state.getData}</Typography>}
                                        {this.state.postData &&
                                        <Typography>POST Data: {this.state.postData}</Typography>}
                                        {this.state.jsonRegexString &&
                                        <Typography>JSON Regex String: {this.state.jsonRegexString}</Typography>}
                                        <hr/>
                                    </div>}
                        />
                        <CardContent>
                            <h1>Markets:</h1>
                        </CardContent>
                        {this.state.markets ? (
                            this.state.markets.map((market, index) =>
                                this.renderMarket(market, index)
                            )
                        ) : (
                            <CardContent>
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border text-warning"
                                         style={{fontSize: "25px", width: "70px", height: "70px"}} role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </section>
            </div>
        )
    }

    renderMarket(market, index) {

        const columns = [
            {id: 'type', label: 'Bet', minWidth: 60, align: 'left'},
            {id: 'time', label: 'Time', minWidth: 60, align: 'left'},
            {id: 'price', label: 'Price', minWidth: 70, align: 'right'},
            {id: 'amount', label: "Amount", minWidth: 40, align: 'right'},
            {id: 'filled', label: "Filled", minWidth: 40, align: 'right'}
        ];


        //<Collapse in={this.state.marketExpanded[index]} timeout="auto" unmountOnExit>
        return (
            <div key={index}>
                <CardContent style={{fontSize: "30px"}}>
                    Result {market.name}:
                </CardContent>
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <CardContent style={{display: "flex"}}>
                        {this.renderOrderSideControls(true, market, index)}
                        {this.renderOrderSideTable(true, market.buySide)}
                        <div key="separator" className="side-divider"/>
                        {this.renderOrderSideTable(false, market.sellSide)}
                        {this.renderOrderSideControls(false, market, index)}
                    </CardContent>

                    {this.state.ordersByMarket[index] &&
                    <CardContent>
                        <h4>My orders:</h4>
                        <Table stickyHeader size="small" aria-label="sticky table" style={{width: "500px"}}>
                            <TableHead>
                                <TableRow>
                                    {columns.map(column => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                                //backgroundColor: column.id === "price" ? bgColorDark : bgColorLight,
                                                fontSize: "15px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.ordersByMarket[index].map((row, index) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {columns.map(column => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}
                                                               style={{
                                                                   backgroundColor: row.isBuy ? "#b4ffb4" : "#ffb4b4",
                                                                   fontSize: "19px",
                                                                   //fontWeight: "bold"
                                                               }}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>}
                </Collapse>
                <hr/>
            </div>
        )
    }

    renderOrderSideControls(isBuy, market, marketId) {
        const sideText = isBuy ? "yes" : "no"
        const marketSide = isBuy ? market.buySide : market.sellSide

        const shouldBeDisabled = moment().isAfter(this.state.endTimestamp) || this.state.marketActionMap[marketId]

        const defaultPrice = isBuy ? (marketSide.length > 0 ? marketSide[0].price + 1 : 50) : (marketSide.length > 0 ? marketSide[0].price - 1 : 50)
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

        const yesColor = "#00cb00"
        const noColor = "#cb0000"

        return (
            <div key={sideText + "Controls"} className={"order-book-control " + (isBuy ? "buy" : "sell")}>

                <div style={{flexDirection: (isBuy ? "row" : "row-reverse")}}>
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
                            label="You will pay (can lose):"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{width: "200px"}}
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
                            style={{borderColor: isBuy ? yesColor : noColor, color: isBuy ? yesColor : noColor}}
                            variant="outlined"
                            onChange={recalculate}
                            disabled={shouldBeDisabled}
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
                            disabled={shouldBeDisabled}
                        />
                    </div>
                </div>
                <Button
                    //variant="extended"
                    size="large"
                    color="primary"
                    style={{
                        padding: "5px",
                        backgroundColor: moment().isAfter(this.state.endTimestamp) ? "#EEEEEE" : (shouldBeDisabled ? "#EEEEEE" : (isBuy ? yesColor : noColor)),
                        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
                    }}
                    onClick={() => this.betFunction(marketId, isBuy)}
                    disabled={shouldBeDisabled}
                >
                    {moment().isAfter(this.state.endTimestamp)
                        ? <div className="font-weight-bold text-black-50" style={{fontSize: "20px", margin: "7px"}}>
                            NO MORE BETS
                        </div>
                        : [
                            !isBuy && <ShoppingCartIcon style={{margin: "0 10px 0 10px"}}/>,

                            shouldBeDisabled
                                ? (
                                    <div className="spinner-border text-warning"
                                         style={{margin: "10px 20px", fontSize: "25px", width: "30px", height: "30px"}}
                                         role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                )
                                : (
                                    <div className="font-weight-bold text-white"
                                         style={{fontSize: "20px", margin: "7px"}}>
                                        {isBuy ? "Bet YES" : "Bet NO"}
                                    </div>
                                )
                            ,
                            isBuy && <ShoppingCartIcon style={{margin: "0 10px 0 10px"}}/>
                        ]
                    }
                </Button>
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

        const bgColorLight = isBuy ? "#F0FFF0" : "#fff0f0"
        const bgColorDark = isBuy ? "#b4ffb4" : "#ffb4b4"

        return (
            <div key={(isBuy ? "buy" : "sell") + "OrderBook"}
                 style={{maxHeight: "200px", overflowY: "auto", direction: isBuy ? "rtl" : "ltr"}}>
                <Table stickyHeader size="small" aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        backgroundColor: column.id === "price" ? bgColorDark : bgColorLight,
                                        fontSize: "15px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 && <TableRow><TableCell style={{fontSize: "19px", textAlign: "center"}} colSpan={3}>No bets yet</TableCell></TableRow>}
                        {rows.map(row => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.price}>
                                    {columns.map(column => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}
                                                       style={{
                                                           backgroundColor: column.id === "price" ? bgColorDark : bgColorLight,
                                                           fontSize: "19px",
                                                           //fontWeight: "bold"
                                                       }}>
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