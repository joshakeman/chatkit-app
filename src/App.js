import React, { Component } from 'react';
import './App.css';

import ChatMessage from './components/ChatMessage';
import ChatApp from './components/ChatApp'

import { default as Chatkit } from '@pusher/chatkit-server';

const chatkit = new Chatkit({
  instanceLocator: "v1:us1:3a28e9bf-26c6-4a14-afa9-c74b59e740e6",
  key: "d4bf7765-bfd1-4d61-ad71-9e1ef17c0b4b:xQq9tcw78iOpffZ13fnagzNupvOsXY0kLQ09hEdnQFA="
})

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          user_email: '',
          currentUsername: '',
          currentId: '',
          currentView: 'ChatMessage'
      }
  }

  componentDidMount() {

    //Simulating passing email as props... would be setting user_email
    //as this.props.user_email
    //username could be this.props.username
    this.setState({
        username: 'fakeuser',
        user_email: 'info@email.com'
    })
  }

  createUser = () => {
    const username= this.state.user_email
      chatkit.createUser({
          //might make sense to have id be their email
          id: username,
          // in final app name could be this.props.first_name + this.props.last_name or
          // `${this.props.first_name} ${this.props.last_name}`
          name: username,
      })
      .then((currentUser) => {
          this.setState({
              currentUsername: username,
              currentId: username,
              currentView: 'chatApp'
          })
      }).catch((err) => {
               if(err.status === 400) {
              this.setState({
                  currentUsername: username,
                  currentId: username,
                  currentView: 'chatApp'
              })
          } else {
              console.log(err.status);
          }
      });
  }

render() {
      let view ='';

      if (this.state.currentView === "ChatMessage") {
          view = <ChatMessage  authorize={this.createUser}/>
      } else if (this.state.currentView === "chatApp") {
          view = <ChatApp currentId={this.state.currentId} />
      }
      return (
          <div className="App">
              {view}
          </div>
      );
  }
}
export default App;