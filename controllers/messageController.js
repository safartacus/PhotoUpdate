import Message from '../models/messageModel.js'
import User from '../models/userModel.js'



const sendMessage = async (req, res) => {
    const { senderId, recipientId, text } = req.body;

    try {

        const newMessage = new Message({ sender: senderId, recipient: recipientId, text });
        await newMessage.save();

        req.io.to(recipientId).emit('receiveMessage', { 
            text: newMessage.text,
            sender: senderId,
            createdAt: newMessage.createdAt 
        });

        res.status(200).json({ message: 'Mesaj gönderildi', newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Mesaj gönderilemedi.' });
    }
}

const conversation = async (req, res) => {
    const { senderId, recipientId } = req.query;

    if (!senderId || !recipientId) {
        return res.status(400).json({ message: 'senderId ve recipientId gereklidir.' });
    }

    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
        })
        .populate('sender', 'userName')  // Yalnızca userName alanını getirir
        .populate('recipient', 'userName'); // Yalnızca userName alanını getirir

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Mesajlar yüklenirken bir hata oluştu.' });
    }
}
const getLastMessagesFromAllSenders = async (req, res) => {
    const { recipientId } = req.query; // Alıcının ID'si

    if (!recipientId) {
        return res.status(400).json({ message: 'recipientId gereklidir.' });
    }
    console.log(recipientId)
    try {
        // Alıcıya gelen son mesajları her gönderen için gruplayarak almak
        const messages = await Message.find({recipient: recipientId})
        const latestMessages = {};
        
        messages.forEach(message => {
            if (!latestMessages[message.sender]) {
                latestMessages[message.sender] = message;
            } else if (new Date(message.createdAt) > new Date(latestMessages[message.sender].createdAt)) {
                latestMessages[message.sender] = message;
            }
        });

        // Sonuçları diziye çevir
        const result = Object.values(latestMessages);
        const populatedMessages = await Message.populate(result, { path: 'sender', select: 'userName' });

        
        res.json(populatedMessages);
    } catch (error) {
        console.error("Hata: ", error); // Hata mesajını logla
        res.status(500).json({ message: error.message });
    }
};





export {sendMessage,conversation,getLastMessagesFromAllSenders};