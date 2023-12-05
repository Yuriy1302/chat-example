import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

// import io from 'socket.io-client';

import { socket } from '../../socket';

import reducer from '../../reducer';

import './App.css';

import Chat from '../Chat';


// export const socket = io('http://192.168.0.3:5000');


const App = () => {

  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: []
  });

  // console.log('state => ', state);

  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Не относится к чату
  const [message, setMessage] = useState('');

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    });
  };

  useEffect(() => {
    /* socket.on('ROOM:JOINED', (users) => {
      setUsers(users);
    }); */

    // или так setUsers
    socket.on('ROOM:SET_USERS', setUsers);

    socket.on('ROOM:NEW_MESSAGE', (message) => {
      console.log('mes ==>> ', message);
      dispatch({
        type: 'NEW_MESSAGE',
        payload: message
      });
    });

    // Рабочий метод предотвращения двойного рендера (двойного вызова сокета)
    // return () => socket.off("ROOM:NEW_MESSAGE").off();
  }, []);

const onLogin = async (obj) => {
  dispatch({
    type: 'JOINED',
    payload: obj
  });
  // попробовать поменять местами socket и dispatch, может тогда через сокеты удастся передать данные себе
  // Когда отработал dispatch, ыщслуе еще не вызвал присоединение.

  socket.emit("ROOM:JOIN", obj);

  const { data } = await axios.get(`http://192.168.0.3:5000/rooms/${roomId}`);

  setUsers(data.users);

};




  // Не относится к чату
  // Проверка GET запроса
  const getFetch = async () => {
    try {
      const response = await fetch('http://192.168.0.3:5000/api');
      const data = await response.json();
      
      setMessage(data.message);
    } catch (err) {
      console.error("Возникла ошибка => ", err);
    }
  };


  const handleEnter = async () => {
    if (!roomId || !userName) {
      return alert("Не введены данные");
    }
    const obj = {
      roomId,
      userName
    };

    setIsLoading(true);
    await axios.post('http://192.168.0.3:5000/rooms', {
      roomId, userName
    });
    /* const result = await axios.post('http://192.168.0.3:5000/rooms', {
      roomId, userName
    }); */

    // console.log('result => ', result);

    onLogin(obj);

    setIsLoading(false);

    // setUsers(result.data.users);
  }

  

/*   const handleSendMessage = () => {
    // socket.send('Привет, Сервер!!!');
    socket.send(JSON.stringify({
      message: 'HELLO!',
      id: 555,
      username: "Yuriy Pro"
    }))
  }; */



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
      {/* <div style={{ paddingTop: '20px' }}>
        <button onClick={handleSendMessage}>SEND</button>
      </div> */}
      
      { !state.joined && (
        <div style={{ padding: "20px 0", display: 'flex', flexDirection: 'column', width: '300px' }}>
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
          />  
          <input
            type="text"
            placeholder="Ваше имя"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
          <button disabled={isLoading} onClick={handleEnter}>{isLoading ? 'Вход...' : 'Войти'}</button>
        </div>)
      }
      { state.joined && <Chat {...state} /> }

    </div>
  );
};

export default App;
