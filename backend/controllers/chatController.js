const ChatMessage = require('../models/chatModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

// Get all messages for a conversation between two users
const getRoomId = (senderId, recipientId) => {
    return [senderId, recipientId].sort().join('-');
};
exports.getAllMessages = async (senderId, recipientId) => {
    try {
        const roomId = getRoomId(senderId, recipientId);
        const chat = await ChatMessage.findOne({ roomId });

        if (!chat) {
            return { messages: [] }; // Return empty if no conversation is found
        }

        return { messages: chat.messages }; // Return the messages from the chat
    } catch (error) {
        console.error("Error in retrieving conversation:", error);
        throw new AppError('Internal server error', 500);
    }
};

//create message 

exports.createMessage = async (io, senderId, recipientId, content) => {
    if (!senderId) {
        throw new AppError('User is not authenticated');
    }

    if (typeof content !== 'string' || content.trim() === '') {
        throw new AppError('Content must be a non-empty string.');
    }

    const messageData = {
        sender: senderId,
        recipient: recipientId,
        content,
        status: 'sent',
        timestamp: Date.now(),
    };

    try {
        const roomId = getRoomId(senderId, recipientId);
        let chat = await ChatMessage.findOne({ roomId });

        if (chat) {
            chat.messages.push(messageData);
        } else {
            chat = await ChatMessage.create({
                roomId: roomId,
                messages: [messageData],
            });
        }

        // Save the chat after adding the message
        await chat.save();

        // Retrieve the latest saved message
        const savedMessage = chat.messages[chat.messages.length - 1];

        // Emit the message to the recipient's room
        io.to(`${recipientId}-${senderId}`).emit('messageReceived', {
            ...messageData,
            messageId: savedMessage._id,
        });

        // Return only the relevant properties of the latest message
        return {
            _id: savedMessage._id,
            sender: savedMessage.sender,
            recipient: savedMessage.recipient,
            content: savedMessage.content,
            status: savedMessage.status,
            timestamp: savedMessage.timestamp,
        };

    } catch (error) {
        console.error("Error in createMessage:", error);
        throw new AppError('Internal server error', 500);
    }
};


// Update a message
exports.updateMessage = async (io, senderId, messageId, content) => {
    if (!senderId) {
        throw new AppError('User is not authenticated');
    }

    try {
        let chat = await ChatMessage.findOne({ 'messages._id': messageId });
        if (!chat) {
            throw new AppError('Chat not found', 404);
        }
        const message = chat.messages.id(messageId);
        if (!message) {
            throw new AppError('Message not found', 404);
        }
        const senderIdFromMessage = message.sender;
        const recipientId = message.recipient;

        // Authorization check: Ensure the user is the sender
        if (String(senderId) !== String(senderIdFromMessage)) {
            throw new AppError('You are not authorized to edit the message', 404);
        }

        const now = new Date();
        const messageTime = new Date(message.timestamp);
        const tenMinutesAgo = new Date(now - 10 * 60 * 1000);
        
        // Check if the message is being edited within 10 minutes
        if (messageTime < tenMinutesAgo) {
            throw new AppError('You can only edit a message within 10 minutes of sending.', 403);
        }

        // Update content and save
        if (content) {
            message.content = content;
            message.status = 'edited';
            message.timestamp = Date.now();
        }

        await chat.save();
        const savedMessage = message;

        // Emit the updated message to the recipient
        io.to(`${recipientId}-${senderId}`).emit('messageUpdated', { message });

        return {
            sender: savedMessage.sender,
            recipient: savedMessage.recipient,
            _id: savedMessage._id,
            status: savedMessage.status,
            content: savedMessage.content,
            timestamp: savedMessage.timestamp,
        };
    } catch (error) {
        throw new AppError('Error in updating Message:',error);
    }
};

// Delete a message
exports.deleteMessage = async (io, senderId, messageId) => {
    try {
        let chat = await ChatMessage.findOne({ 'messages._id': messageId });
        if (!chat) {
            throw new AppError('Chat not found', 404);
        }

        const message = chat.messages.id(messageId);
        const senderIdFromMessage = message.sender;
        const recipientId = message.recipient;

        // Authorization check: Ensure the user is either the sender or the recipient
        if (String(senderId) !== String(senderIdFromMessage)) {
            throw new AppError('You are not authorized to delete this message.', 404);
        }

        // Filter out the message from the chat
        chat.messages = chat.messages.filter(msg => !msg._id.equals(messageId));
        await chat.save();

        const messages = chat.messages;

        // Emit the updated messages list to the room
        io.to(`${recipientId}-${senderId}`).emit('messageDeleted', { messages });

        return { chat };
    } catch (error) {
        console.error("Error in deleting Message:", error);
        throw new AppError('Internal server error', 500);
    }
};

exports.markAllMessagesAsSeen = async (io, senderId, recipientId) => {
    try {
        const roomId = getRoomId(senderId, recipientId);
        let chat = await ChatMessage.findOne({ roomId });
        
        if (!chat) {
            throw new AppError('Chat not found', 404);
        }
       
      
        // Mark all messages as seen
        chat.messages = chat.messages.map(message => {
            if (String(message.sender) === recipientId && String(message.recipient) === senderId && message.status !== 'seen') {
                message.status = 'seen';
            }
            return message;
        });

        await chat.save();
        io.to(`${senderId}-${recipientId}`).emit('allMessagesSeen', { messages: chat.messages });

        return { messages: chat.messages};
    } catch (error) {
        console.error("Error in marking messages as seen:", error);
        throw new AppError('Internal server error', 500);
    }
};


exports.updateLastSeen = async (userId) => {
    const timestamp = new Date();
    // Assuming you use MongoDB, but this can vary based on your DB setup
    await User.findByIdAndUpdate(userId, { lastSeen: timestamp });
  };