import React, {Component} from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';

import Input from './Input'


class ChatApp extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            currentUser: null,
            currentRoom: {users:[]},
            messages: [],
            users: []
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
                return currentUser.subscribeToRoom({
                    roomId: "31230419",
                    messageLimit: 100,
                    hooks: {
                        onMessage: message => {
                            this.setState({
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
            })
            .catch(error => console.log(error))
    }
    
    addMessage = (text) => {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
        .catch(error => console.error('error', error));
    }

    render() {
        return (
            <div>
                <h2 className="header">Let's Talk</h2>
                <Input className="input-field" onSubmit={this.addMessage} />
            </div>
        )
    }
}

export default ChatApp;