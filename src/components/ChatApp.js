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
        const chatManager = new ChatManager({
            instanceLocator: "v1:us1:3a28e9bf-26c6-4a14-afa9-c74b59e740e6",
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/3a28e9bf-26c6-4a14-afa9-c74b59e740e6/token"
            })
        })

        chatManager
            .connect()
            .then(currentUser => {
                console.log(currentUser)
                this.setState({ currentUser: currentUser })
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