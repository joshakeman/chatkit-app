import React, { Component } from 'react';
import './App.css';

import ChatMessage from './components/ChatMessage';

    class App extends Component {
      constructor(props) {
          super(props);
          this.state = {
            currentView: 'ChatMessage'
          }
          this.changeView = this.changeView.bind(this);
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
            }
            return (
                <div className="App">
                    {view}
                </div>
            );
        }
    }

    export default App;
