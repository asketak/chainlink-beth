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

import AppContext from "./AppContext";
import RemainingTimeSpan from "./RemainingTimeSpan.jsx";

export default class EventFragment extends React.Component {

    static contextType = AppContext

    constructor(props, context) {
        super(props, context)
    }

    state = {
        inited: false,
        address: null,
        expanded: false
    }

    componentDidMount() {
        this.fetchEvent()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.fetchEvent()
    }

    fetchEvent(force) {
        if (force || (!this.state.inited && this.state.address === null && this.context.w3a)) {
            this.setState({inited: true})
            this.context.w3a.contracts.PredictEvent._at(this.props.address).myAddress.call()
                .then(address => {
                    this.setState(state => ({address}))
                })
        }
    }

    handleExpandClick = () => {
        this.setState(state => ({
            marketsExpand: state.marketsExpand
        }));
    }

    render() {



        const endTimestamp = this.props.endTimestamp
        const endDateString = "September 14 2016 12:30";


        return (
            <Card>
                <CardHeader className="event-head"
                            style={{backgroundImage: "linear-gradient(to bottom, rgba(245, 246, 252, 0.52), rgba(117, 19, 93, 0.73)) url('/img/trump1.jpg')"}}
                            title={
                                <div>
                                    <h3>Nazev Eventu</h3>
                                    <h5>EndDate: {endDateString} in (<RemainingTimeSpan endTimestamp={endTimestamp}/>)</h5>
                                </div>
                            }
                            subheader={
                                <Typography variant="body2" color="textSecondary" component="p">
                                    This impressive paella is a perfect party dish and a fun meal to cook together with your
                                    guests. Add 1 cup of frozen peas along with the mussels, if you like.
                                </Typography>
                            }
                />
                <CardContent>
                    Sazky
                </CardContent>

                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon/>
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon/>
                    </IconButton>
                    <IconButton styles={{
                        transform: "rotate(" + (expanded ? 180 : 0) + "deg)",
                        marginLeft: 'auto',
                        transition: "transform 300",
                    }} onClick={handleExpandClick} aria-label="show more">
                        <ExpandMoreIcon/>
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>Method:</Typography>
                        <Typography paragraph>
                            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                            minutes.
                        </Typography>
                        <Typography paragraph>
                            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
                        </Typography>
                        <Typography paragraph>
                            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                            medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                            again without stirring, until mussels have opened and rice is just tender, 5 to 7
                            minutes more. (Discard any mussels that don’t open.)
                        </Typography>
                        <Typography>
                            Set aside off of the heat to let rest for 10 minutes, and then serve.
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }
}