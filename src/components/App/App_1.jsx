import React, { useEffect, useState } from 'react';

// import { useWebSocket } from 'react-use-websocket';

import './App.css';

const App = () => {

  const [socket, setSocket] = useState({});
  const [message, setMessage] = useState('');
  //const []

  const getFetch = async () => {
    
    const response = await fetch('http://192.168.0.3:5000/api');
    const data = await response.json();
    
    setMessage(data.message);
  };

  useEffect(() => {
    const newSocket = new WebSocket('ws://192.168.0.3:5000/');

    /* newSocket.onerror = () => {
      console.error('Подключение не удалось!');
      newSocket.close();
      // Переподключение
    }; */

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    socket.onopen = () => {
      console.log('Соединение установлено. Ура!');
    };

    socket.onmessage = (event) => {
      console.log('С сервера пришло сообщение ==>> ', event.data);
    };

  }, [socket]);

  const handleSendMessage = () => {
    // socket.send('Привет, Сервер!!!');
    socket.send(JSON.stringify({
      message: 'HELLO!',
      id: 555,
      username: "Yuriy Pro"
    }))
  };



  return (
    <div className="container">
      <h1>Hi, Everybody!!!</h1>
      <div>
        <button
          className="btn"
          onClick={getFetch}
          disabled={!!message}
        >
          GET MESSAGE
        </button>
        {message ? <h2 style={{ color: 'yellowgreen'}}>{message}</h2> : <h2 style={{ color: '#434243'}}>Server?</h2>}
        <button
          className="btn"
          onClick={() => setMessage('')}
          disabled={!message}
        >
          RESET
        </button>
      </div>
      <div style={{ paddingTop: '20px' }}>
        <button onClick={handleSendMessage}>SEND</button>
      </div>
    </div>
  );
};

export default App;
