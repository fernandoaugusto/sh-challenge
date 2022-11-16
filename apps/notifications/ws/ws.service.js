const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
var _ = require('lodash');
var emitter = require('./emitter.service')

function onError(ws, err) {
    console.error(`[WS] Error: ${err.message}`);
}
 
function onMessage(ws, data) {
    console.log(`[WS] Message received: ${data.toString()}`);
}
 
function onConnection(ws) {
    var user_allowed = null;
    const client = {
        id: uuidv4(),
        conn: ws
    }
    console.log('[WS] New client connected:', client.id);
    ws.send(JSON.stringify({ pattern: 'CLIENT_CONNECTED', data: { client_id: client.id }}));
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    emitter.eventBus.on('SEND_WS_MESSAGE', function(data) {
        const message_string = JSON.stringify(data);
        const message_parsed = JSON.parse(message_string);
        if (message_parsed.pattern == 'user.allowed') {
            if (message_parsed.data.client_id == client.id) {
                console.log('[WS] New user allowed:', message_parsed.data.user_id);
                user_allowed = { 
                    user_id: message_parsed.data.user_id,
                    client_id: message_parsed.data.client_id
                };
            }
        }
        if (message_parsed.pattern == 'notify.taskdone' && user_allowed) {
            if (message_parsed.data.user.manager_id == user_allowed.user_id) {
                if (client.id == user_allowed.client_id) {
                    console.log('[WS] Sending task done to Manager:', user_allowed.user_id);
                    const task_done = {
                        pattern: 'NEW_TASK_DONE',
                        data: message_parsed.data
                    }
                    client.conn.send(JSON.stringify(task_done));
                }
            }
        }
    });
}

function initWS(port) {
    const ws = new WebSocket.Server({ port });
    ws.on('connection', onConnection);
    console.log(`[WS] Websocket Server is running!`);
    return ws;
} 
 
module.exports = { initWS };