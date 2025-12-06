import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLI_URL,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on('join-group', async (idgroup) => {
      socket.join(idgroup);
      console.log("Đã join group:", idgroup);
    });

    socket.on('leave-group', async (idgroup) => {
      socket.leave(idgroup);
      console.log("Đã leave group:", idgroup);
    });


    socket.on('disconnect', () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo!");
  }
  return io;
};
