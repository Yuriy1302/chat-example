import React from 'react';

import { socket } from '../../socket';

import './Chat.css';

const Chat = ({ users, messages, userName, roomId }) => {
  const [messageValue, setMessageValue] = React.useState('');

  const messagesRef = React.useRef(null);

  // console.log('roomId in Chat => ', roomId);

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 999);
  }, [messages]);


  const handleTextArea = (event) => {
    setMessageValue(event.target.value);
  };

  const handleSendMessage = () => {
    socket.emit('ROOM:NEW_MESSAGE', {
      userName,
      roomId,
      text: messageValue
    });
    setMessageValue('');
  };



  return (
    <div className="chat">
      <div className="chat-users">
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((user, index) => (
            <li key={user + index}>{user}</li>
          ))}
          
          
        </ul>
      </div>
      <div className="chat-messages">
        <div className="messages" ref={messagesRef}>
          {messages.map((message, index) => (
            <div className="message" key={message.userName + index}>
              <div>
                <span>{message.userName}</span>
              </div>
              <p className={message.userName === userName ? "my" : ""}>{message.text}</p>
              
            </div>))
          }
        </div>
        <form>
          <textarea
            value={messageValue}
            onChange={handleTextArea}
            className="form-control"
            cols="50"
            rows="3"
          ></textarea>
          <button
            type="button"
            onClick={handleSendMessage}
            className=""
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
