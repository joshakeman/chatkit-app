import React, { Component } from 'react';
import './App.css';

import ChatMessage from './components/ChatMessage';

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
      this.changeView = this.changeView.bind(this);
      this.createUser = this.createUser.bind(this);
  }

  componentDidMount() {

    //Simulating passing email as props... would be setting user_email
    //as this.props.user_email
    this.setState({
        user_email: 'info@email.com'
    })
  }

  createUser(username) {
      chatkit.createUser({
          id: username,
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

changeView(view) {
    this.setState({
        currentView: view
    })
}

render() {
      let view ='';

      if (this.state.currentView === "ChatMessage") {
          view = <ChatMessage  changeView={this.changeView}/>
      } else if (this.state.currentView === "chatApp") {
          view = <h1>The chatapp will go here</h1>
      }
      return (
          <div className="App">
              {view}
          </div>
      );
  }
}
export default App;
