import React, {Component} from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

import Input from './Input'
import MessageList from './MessageList';


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
            roomIsOpen: true
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
                localStorage.setItem('currentUser', JSON.stringify(currentUser))
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

    render() {
        const { roomName, messages } = this.state
        return (
            <div>
                <h2 className="header">{roomName}</h2>
                <MessageList messages={messages} />
                <Input className="input-field" onSubmit={this.addMessage} />
            </div>
        )
    }
}

export default ChatApp;