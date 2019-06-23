// src/Components/ChatMessage.js

import React, { Component } from 'react';
import { Button, withStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const styles = theme => ({
    chatButton: {

    }
})


class  ChatMessage extends Component {
    constructor(props) {
        super(props);

        this.state={
            open: false
        }
    }

    changeView = () => {
        this.props.changeView('chatApp')
    }

    handleClickOpen = () => {
        setOpen(true);
      }
    
    handleClose = () => {
        setOpen(false);
      }

    render() {

        const { classes } = this.props
        return (
            <div>
                <Button className={classes.chatButton} color="primary" variant="contained" onClick={this.handleClickOpen}>Send a message</Button>
            </div>
        )
    }
}
export default withStyles(styles)(ChatMessage);