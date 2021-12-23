import io from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import { nanoid } from 'nanoid';

const app = express();
const server = createServer(app);

let socketServer = io(server);

/* Add a rooms dict to keep track of rooms, clients and upstreams coming to it for making data comparison :feat */

socketServer.on('connection', (socket) => {
	socket.on('subscribe-as-upstream', () => {
		let roomId = nanoid();
		socket.join(roomId);
		socket.emit('subscribed', roomId);
	});
	socket.on('subscribe-as-downstream', (roomId) => {
		socket.join(roomId);
		socket.emit('connected');
	});
	socket.on('update-data', (data, roomId) => {
		socket.to(roomId).broadcast.emit('update-data', data);
	});
});

server.listen(5000, () => {
	console.log('Up and running!!!');
});
