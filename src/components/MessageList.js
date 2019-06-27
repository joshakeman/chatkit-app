 // src/Components/MessageList.js

 import { Paper } from '@material-ui/core'
 import { withStyles } from '@material-ui/core/styles'

 import React, {Component} from 'react';

 const styles = theme => ({
     paper: {
        margin: '10px 0',
        mindWidth: 300,
     },
     message: {
        padding: 10,
        minWidth: 300,
        display: 'inline-block'
     }
 })

 class MessageList extends Component {
     render() {
         const { classes } = this.props
         return(
             <ul className="message-list">
                 {this.props.messages.map((message, index) => (
                     <Paper className={classes.paper}>
                     <li key={index} className={classes.message}>
                         <h4 className="message-sender">{message.senderId}</h4>
                         <p className="message-text">{message.text}</p>
                     </li>
                     </Paper>
                 ))}
                 <li></li>
             </ul>
         )
     }
 }
 export default withStyles(styles)(MessageList);