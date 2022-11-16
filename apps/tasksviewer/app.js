const clear = require('clear');
const axios = require('axios');
const WebSocket = require('ws');
const { stateUsersSeeded, stateInitial, stateLoggedAsManager, stateConnectedWebsocket, stateReadyReceiveTasksDone, stateWebsocketClosed } = require('./lib');

let LOGGED_USER_ID = null;
let LOGGED_TOKEN = null;

initProcess();

async function initProcess() {
  stateInitial();
  await checkUsersSeeded(); 
  await loginAsManager();
  await connectWebsocket();
}

async function checkUsersSeeded() {
  let info_step_1 = '';
  try {
    let post_res = await axios.post('http://localhost:3000/api/v1/users/seed');
  } catch (error) {
    if (error.response.status == 400) {
      info_step_1 = '(Already seeded)';
    } else {
      process.exit(1);
    }
  }
  stateUsersSeeded(info_step_1);
}

async function loginAsManager() {
  try {
    let payload = {
      email: 'nikola@shmail.com',
      password: '123456'
    };
    let post_res = await axios.post('http://localhost:3000/api/v1/auth/login', payload);
    console.log(post_res.data);
    LOGGED_USER_ID = post_res.data.id;
    LOGGED_TOKEN = post_res.data.token;
    stateLoggedAsManager('OK');
  } catch (error) {
    stateLoggedAsManager('FAIL');
    process.exit(1);
  }
}

async function linkWebsocketClient(user_id, client_id) {
  try {
    let payload = {
      user_id,
      client_id
    };
    let post_res = await axios.post('http://localhost:3000/api/v1/users/ws/allowance', payload, {
      headers: {
        'x-auth': LOGGED_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    stateReadyReceiveTasksDone('OK');
  } catch (error) {
    stateReadyReceiveTasksDone('FAIL');
    process.exit(1);
  }
}

async function connectWebsocket() {
  const connection = new WebSocket("ws://localhost:3001", "json");
  console.log(connection);
  connection.onopen = (event) => {
      console.log('ON OPEN!');
      stateConnectedWebsocket('OK');
  }
  connection.onmessage = async (event) => {
    let message = JSON.parse(event.data);
    if (message.pattern == 'CLIENT_CONNECTED') {
      await linkWebsocketClient(LOGGED_USER_ID, message.data.client_id);
    }
    if (message.pattern == 'NEW_TASK_DONE') {
      console.log(`  [NEW]  Task Finished!`);
      console.log(`         Technician Name:  ${message.data.user.first_name} ${message.data.user.last_name}`);
      console.log(`         Technician Email:  ${message.data.user.email}`);
      console.log("         Task Completed Date: ", message.data.updated_date);
      console.log("         Task Title: ", message.data.title);
      console.log("         Task Summary: ", message.data.summary);
      console.log('');
      console.log('');
    }
  }
  connection.onclose = (event) => {
    stateWebsocketClosed();
    process.exit(1);
  }
}

