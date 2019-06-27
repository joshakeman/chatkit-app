import React, {Component} from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

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
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles'

import Input from './Input'
import MessageList from './MessageList';

const drawerWidth = 240;

const styles = theme => ({
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
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
})


class ChatApp extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            currentUser: null,
            currentRoom: {users:[]},
            messages: [],
            users: [],
            roomId: '',
            roomName: '',
            roomIsOpen: true,
            mobileOpen: false,
        }
    }

    componentDidMount() {
        console.log(JSON.parse(localStorage.getItem('currentUser')))

        const chatManager = new ChatManager({
            instanceLocator: "v1:us1:3a28e9bf-26c6-4a14-afa9-c74b59e740e6",
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/3a28e9bf-26c6-4a14-afa9-c74b59e740e6/token"
            })
        })

        // const storedRoomId = localStorage.getItem('roomId') ?

        // chatManager
        //     .connect()
        //     //check if a room id already exists on local storage
        //     .then(currentUser => {
        //         this.setState({ 
        //             currentUser: currentUser,
        //             roomId: storedRoomId 
        //         })
        //     currentUser.fetchMultipartMessages({
        //         roomId: storedRoomId,
        //         initialId: 42,
        //         direction: 'older',
        //         limit: 10,
        //       })
        //         .then(messages => {
              
        //           // do something with the messages
        //         })
        //         .catch(err => {
        //           console.log(`Error fetching messages: ${err}`)
        //         })
        //     }).catch(error => console.log(error)) :

            chatManager
            .connect()
            .then(currentUser => {
                console.log(currentUser)
                this.setState({ currentUser: currentUser })
                // localStorage.setItem('currentUser', JSON.stringify(currentUser))
                return currentUser.createRoom({
                    name: `fakeuser's room`,
                    private: true,
                    addUserIds: ['fakeuser', 'User 2'],
                    customData: { foo: 42 },
                  }).then(room => {
                    console.log(`Created room called ${room.name}`)
                    this.setState({
                        roomId: room.id,
                        roomName: room.name
                    })
                    console.log(room)
                  })
                  .catch(err => {
                    console.log(`Error creating room ${err}`)
                  })
            })
            .then(() => {
                // console.log(currentUser)
                return this.state.currentUser.subscribeToRoom({
                    roomId: this.state.roomId,
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                // roomIsOpen: true,
                                messages: [...this.state.messages, message],
                            })
                        },
                    }
                })
            })
            .then(currentRoom => {
                console.log(currentRoom)
                this.setState({
                    currentRoom,
                    users: currentRoom.userIds
                })
                localStorage.setItem('roomId', this.state.roomId);
                this.props.startTimer()
            })
            .catch(error => console.log(error))
    }

    // componentDidUpdate(prevProps, prevState) {
    //     // only update chart if the data has changed
    //     console.log(prevState)
    //     if (prevState.roomIsOpen) {
    //     this.state = {...prevState}
    //     console.log(this.state)
    //     }
    //   }
    
    addMessage = (text) => {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
        .catch(error => console.error('error', error));
    }

    handleDrawerToggle = () => {
        this.setState({
            mobileOpen: !this.state.mobileOpen
        })
      }

    render() {
        const { roomName, messages, mobileOpen } = this.state,
              { classes } = this.props

        const drawer = (
            <div>
              <div className={classes.toolbar} />
              <Divider />
              <List>
                {['janedoe', 'billgates', 'lydster'].map((text, index) => (
                  <ListItem button key={text}>
                    {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
              {/* <Divider />
              <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List> */}
            </div>
          );
        
          return (
            <div className={classes.root}>
              <CssBaseline />
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    edge="start"
                    onClick={this.handleDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap>
                    {roomName}
                  </Typography>
                </Toolbar>
              </AppBar>
              <nav className={classes.drawer} aria-label="Mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                  <Drawer
                    // container={container}
                    variant="temporary"
                    anchor="left"
                    open={mobileOpen}
                    onClose={this.handleDrawerToggle}
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

                <MessageList messages={messages} />
                <Input className="input-field" onSubmit={this.addMessage} />
              </main>
            </div>
          );
        // return (
        //     <div>
        //         <h2 className="header">{roomName}</h2>
        //         <MessageList messages={messages} />
        //         <Input className="input-field" onSubmit={this.addMessage} />
        //     </div>
        // )
    }
}

export default withStyles(styles)(ChatApp);