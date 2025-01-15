import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let allSockets: User[] = [];
let rooms: Map<string, { users: WebSocket[]; messages: string[] }> = new Map();

interface User {
  socket: WebSocket;
  room: string;
}

wss.on("connection", (socket) => {
  console.log("New connection established");

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);

    if (parsedMessage.type === "create") {
      const { roomId } = parsedMessage.payload;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, { users: [], messages: [] }); 
        console.log(`Room created: ${roomId}`);
      }

      // Add user to room
      rooms.get(roomId)?.users.push(socket);
      allSockets.push({ socket, room: roomId });

      socket.send(
        JSON.stringify({
          type: "success",
          roomId: roomId,
          message: `Successfully joined room ${roomId}`,
        })
      );

      rooms.get(roomId)?.messages.forEach((message) => {
        socket.send(
          JSON.stringify({
            type: "chat",
            roomId: roomId,
            payload: { message: message },
          })
        );
      });
    }

 
    if (parsedMessage.type === "join") {
      const { roomId } = parsedMessage.payload;

      if (rooms.has(roomId)) {
    
        rooms.get(roomId)?.users.push(socket);
        allSockets.push({ socket, room: roomId });

        console.log(`User joined room: ${roomId}`);

        socket.send(
          JSON.stringify({
            type: "success",
            roomId: roomId,
            message: `Successfully joined room ${roomId}`,
          })
        );

        rooms.get(roomId)?.messages.forEach((message) => {
          socket.send(
            JSON.stringify({
              type: "chat",
              roomId: roomId,
              payload: { message: message },
            })
          );
        });
      } else {
        console.log(`Room ${roomId} does not exist`);
        socket.send(
          JSON.stringify({
            type: "error",
            message: `Room ${roomId} does not exist`,
          })
        );
      }
    }

    
    if (parsedMessage.type === "chat") {
      const currentUserRoom = allSockets.find((x) => x.socket === socket)?.room;

      if (currentUserRoom) {

        rooms.get(currentUserRoom)?.messages.push(parsedMessage.payload.message); 

        rooms.get(currentUserRoom)?.users.forEach((userSocket) => {
          userSocket.send(
            JSON.stringify({
              type: "chat",
              roomId: currentUserRoom,
              payload: { message: parsedMessage.payload.message },
            })
          );
        });
      }
    }
  });

  socket.on("close", () => {

    allSockets = allSockets.filter((user) => user.socket !== socket);

   
    rooms.forEach((room) => {
      room.users = room.users.filter((userSocket) => userSocket !== socket);
    });

    console.log("Connection closed");
  });
});
