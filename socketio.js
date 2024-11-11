import { Server } from 'socket.io';
import jwt from "jsonwebtoken";
import Message from './models/messageModel.js'
import User from './models/userModel.js'

let io;
const messageQueue = [];
const BATCH_INTERVAL = 10000;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:8080', // Vue.js uygulamanızın URL'sini belirtin
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error('Unauthorized'));
        }
        socket.user = decoded; 
        next();
      });
    } else {
      next(new Error('No token provided'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    // Kullanıcının belirli bir odaya katılması
    socket.on('join', (userId) => {
      console.log('bağlanan kullanıcı: ', userId)
      socket.join(userId);
    });

    socket.on('sendMessage', async({ senderId, recipientId, text }) => {
        if (!senderId || !recipientId || !text) {
          console.error('Mesaj gönderimi için senderId, recipientId ve text alanları gereklidir.');
          return; // Hatalı veri varsa çık
        }
      
        // Mesajı kuyrukla
        messageQueue.push({ sender: senderId, recipient: recipientId, text });
        const senderUserName = await User.findOne({_id: senderId});
        const senderModel = {
          _id: senderUserName._id,
          userName: senderUserName.userName
        };
        console.log(senderModel)
        // Alıcıya mesajı hemen gönder
        io.to(recipientId).emit('receiveMessage', {
          text,
          sender: senderModel,
          createdAt: new Date() // Mesajı anlık tarih ile gönder
        });
      
        console.log('Mesaj kuyruklandı:', text);
      });

    
    setInterval(async () => {
      if (messageQueue.length > 0) {
        try {
          // Tüm mesajları topluca kaydedin
          await Message.insertMany(messageQueue);
          console.log('Mesajlar topluca kaydedildi:', messageQueue);
          messageQueue.length = 0; // Kuyruğu temizle
        } catch (error) {
          console.error('Mesajlar kaydedilemedi:', error);
        }
      }
    }, BATCH_INTERVAL);

    socket.on('disconnect', () => {
      console.log('Kullanıcı ayrıldı:', socket.id);
    });
  });
};

export const getSocketIo = () => io;