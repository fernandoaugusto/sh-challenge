const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

let INFO_STEP_1 = null;

const stateInitial = () => {
  clear();
  printTitle('Tasks');
  print2LinesBlank();
  printWhiteMessage("        Step #1: Checking if Users are already created.");
  printWhiteMessage("        Step #2: Logging as 'nikola@shmail.com' (Manager User).");
  printWhiteMessage("        Step #3: Connected to Websocket.");
  printWhiteMessage("        Step #4: Client allowed to receive tasks done.");
  print2LinesBlank();
}

const stateUsersSeeded = (info) => {
  INFO_STEP_1 = info;
  clear();
  printTitle('Tasks');
  print2LinesBlank();
  printWhiteMessage(` [OK]   Step #1: Checking if Users are already created. ${INFO_STEP_1}`);
  printWhiteMessage("        Step #2: Logging as 'nikola@shmail.com' (Manager User).");
  printWhiteMessage("        Step #3: Connected to Websocket.");
  printWhiteMessage("        Step #4: Client allowed to receive tasks done.");
  print2LinesBlank();
}

const stateLoggedAsManager = (status) => {
  clear();
  printTitle('Tasks');
  print2LinesBlank();
  printWhiteMessage(` [OK]   Step #1: Checking if Users are already created. ${INFO_STEP_1}`);
  if (status == 'OK') 
    printWhiteMessage(" [OK]   Step #2: Logging as 'nikola@shmail.com' (Manager User).");
  if (status == 'FAIL')
    printWhiteMessage(" [FAIL] Step #2: Logging as 'nikola@shmail.com' (Manager User).");
  printWhiteMessage("        Step #3: Connected to Websocket.");
  printWhiteMessage("        Step #4: Client allowed to receive tasks done.");
  print2LinesBlank();
}

const stateConnectedWebsocket = (status) => {
  clear();
  printTitle('Tasks');
  print2LinesBlank();
  printWhiteMessage(` [OK]   Step #1: Checking if Users are already created. ${INFO_STEP_1}`);
  printWhiteMessage(" [OK]   Step #2: Logging as 'nikola@shmail.com' (Manager User).");
  if (status == 'OK') 
    printWhiteMessage(" [OK]   Step #3: Connected to Websocket.");
  if (status == 'FAIL')
    printWhiteMessage(" [FAIL] Step #3: Connected to Websocket.");
  printWhiteMessage("        Step #4: Client allowed to receive tasks done.");
  print2LinesBlank();
}

const stateReadyReceiveTasksDone = (status) => {
  clear();
  printTitle('Tasks');
  print2LinesBlank();
  printWhiteMessage(` [OK]   Step #1: Checking if Users are already created. ${INFO_STEP_1}`);
  printWhiteMessage(" [OK]   Step #2: Logging as 'nikola@shmail.com' (Manager User).");
  printWhiteMessage(" [OK]   Step #3: Connected to Websocket.");
  if (status == 'OK') 
    printWhiteMessage(" [OK]   Step #4: Client allowed to receive tasks done.");
  if (status == 'FAIL')
    printWhiteMessage(" [FAIL] Step #4: Client allowed to receive tasks done.");
  print2LinesBlank();
}

const stateWebsocketClosed = () => {
  clear();
  printTitle('Tasks');
  print2LinesBlank();
  printWhiteMessage(` [OK]   Step #1: Checking if Users are already created. ${INFO_STEP_1}`);
  printWhiteMessage(" [OK]   Step #2: Logging as 'nikola@shmail.com' (Manager User).");
  printWhiteMessage(" [FAIL] Step #3: Connected to Websocket.");
  printWhiteMessage(" [FAIL] Step #4: Client allowed to receive tasks done.");
  print2LinesBlank();
}

const printTitle = (text) => {
  console.log(chalk.green(figlet.textSync(text, { horizontalLayout: 'full' })));
}

const print2LinesBlank = () => {
  console.log(''); console.log('');
}

const print3LinesBlank = () => {
  console.log(''); console.log(''); console.log('');
}

const printWhiteMessage = (text) => {
  console.log(chalk.white(` ${text}`));
  console.log('');
}

const printGreenMessage = (text) => {
  console.log(chalk.green(` ${text}`));
  console.log('');
}

const printRedMessage = (text) => {
  console.log(chalk.red(` ${text}`));
  console.log('');
}


module.exports = { stateInitial, stateUsersSeeded, stateLoggedAsManager, stateConnectedWebsocket, stateReadyReceiveTasksDone, stateWebsocketClosed };
