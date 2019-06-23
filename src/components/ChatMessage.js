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

    handleClickOpen = () => {
        this.setState({
            open: true
        })
      }
    
    handleCancelClose = () => {
        this.setState({
            open: false
        })
      }
    
    handleAuthorize = () => {
        this.setState({
            open: false
        })
        this.props.changeView('chatApp')
    }

    render() {

        const { classes } = this.props,
              { open } = this.state
        return (
            <div>
                <Button 
                    className={classes.chatButton} 
                    color="primary" 
                    variant="contained" 
                    onClick={this.handleClickOpen}>
                        Send a message
                </Button>
                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Authorize ChatKit to use email</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    ChatKit needs to authorize you as a user via your email account before you can begin your chat session.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleAuthorize} color="primary">
                    Authorize
                </Button>
                <Button onClick={this.handleCancelClose} color="default" autoFocus>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>
            </div>
        )
    }
}
export default withStyles(styles)(ChatMessage);