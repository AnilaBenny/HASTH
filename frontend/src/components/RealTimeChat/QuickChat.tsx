import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { format } from 'date-fns';
import { PhotoIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useSocket } from './socket';
import { Socket } from 'socket.io-client';

interface Message {
  senderId: string;
  recieverId: string;
  content: string;
  type: 'text' | 'image' | 'voice_note';
  conversationId: string;
  timestamp: string;
}

interface Conversation {
  conversation: {
    _id: string;
    lastMessage?: { content: string };
  };
  user: { _id: string; name: string; image: string };
  creative: { _id: string; name: string; image: string };
}

const QuickChat: React.FC = () => {
  const socket: Socket|null= useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const user = useSelector((state: any) => state.user);
  const messageRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    fetchConversations();
  }, [user.user._id, user.user.role]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (socket) {
      socket.on('getMessage', (data: Message) => {
        console.log('Received message:', data);
        if (data.conversationId === selectedConversation?.conversation._id) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
        
      });
  
      return () => {
        socket.off('getMessage');
      };
    }
  }, [socket, selectedConversation]);
  

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/getconversations?id=${user.user._id}&role=${user.user.role}`);
      if (response.data.status) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await axiosInstance.get(`/api/auth/getConverstationById?id=${conversationId}`);
      if (response.data.status) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (socket) {
      socket.emit('joinChat', { id: user.user._id, chatId: conversation.conversation._id });
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && selectedConversation && socket) {
      const newMessage: Message = {
        senderId: user.user._id,
        recieverId: user.user.role === 'user' ? selectedConversation.creative._id : selectedConversation.user._id,
        content: messageInput,
        type: 'text',
        conversationId: selectedConversation.conversation._id,
        timestamp: new Date().toISOString(),
      };
  
      setMessageInput('');
  
      socket.emit('sendMessage', newMessage, (response: any) => {
        if(response.success){

        }
        

      });
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendImage = () => {
    if (!selectedFile || !socket || !selectedConversation) {
      console.error('Missing required data for sending image');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result as string;
      const newMessage: Message = {
        senderId: user.user._id,
        recieverId: user.user.role === 'user' ? selectedConversation.creative._id : selectedConversation.user._id,
        content: base64Image,
        type: 'image',
        conversationId: selectedConversation.conversation._id,
        timestamp: new Date().toISOString(),
      };
      console.log(newMessage);
      setImagePreview(null);
          setSelectedFile(null);
      
      socket.emit('sendImage', newMessage, () => {
     
      });
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsDataURL(selectedFile);
  };
  const toggleEmojiPicker = () => setEmojiPickerOpen(!emojiPickerOpen);

  const onEmojiClick = (emoji: any) => {
    setMessageInput((prev) => prev + (emoji.native || emoji.emoji || ''));
    setEmojiPickerOpen(false);
  };
//audio
const startRecording = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      setIsRecording(true); 
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream); 

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        console.log("Data available:", event.data.size, event.data.type); 
        setAudioData(new Blob([event.data], { type: 'audio/wav' })); 
      };

      mediaRecorder.start(); 
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  } else {
    console.error("getUserMedia is not supported in this browser");
  }
};
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div className="w-1/3 bg-white border-r shadow-lg">
        <h2 className="text-2xl font-bold p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">Welcome to chat room</h2>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {conversations.map((conv) => (
            <div
              key={conv.conversation._id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                selectedConversation?.conversation._id === conv.conversation._id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleConversationSelect(conv)}
            >
              <div className="flex items-center">
                <img
                  src={`http://localhost:8080/src/uploads/${user.user.role === 'user' ? conv.creative.image : conv.user.image}`}
                  alt={user.user.role === 'user' ? conv.creative.name : conv.user.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-blue-200"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.user.role === 'user' ? conv.creative.name : conv.user.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.conversation.lastMessage?.content || 'Start a conversation'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
         
            <div className="bg-white p-4 border-b shadow-sm flex items-center">
              <img
                src={`http://localhost:8080/src/uploads/${user.user.role === 'user' ? selectedConversation.creative.image : selectedConversation.user.image}`}
                alt={user.user.role === 'user' ? selectedConversation.creative.name : selectedConversation.user.name}
                className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-200"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {user.user.role === 'user' ? selectedConversation.creative.name : selectedConversation.user.name}
              </h3>
            </div>

       
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.senderId === user.user._id ? 'justify-end' : 'justify-start'}`}
                  ref={messageRef}
                >
                  <div
                    className={`p-4 rounded-lg shadow-sm mb-4 max-w-xs ${
                      message.senderId === user.user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.type === 'text' && <p>{message.content}</p>}
                    {message.type === 'image' && (
                      <img src={message.content} alt="Image" className="rounded-lg max-w-full max-h-64 object-cover" />
                    )}    
                    {imagePreview && (
                      <div className="absolute bottom-16 left-4 bg-white p-2 border rounded-lg shadow-lg flex items-center">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => setImagePreview(null)}
                          className="ml-2 text-gray-600 hover:text-red-500"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                    {message.type === 'voice_note' && <AudioPlayer src={message.content} />}
                    <p className="text-xs mt-2 text-gray-500 text-right">{format(new Date(message.timestamp), 'p, MMM d')}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t shadow-sm flex items-center">
            <button onClick={startRecording}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a5 5 0 0 1 5 5v6a5 5 0 0 1-10 0V6a5 5 0 0 1 5-5z" />
              <path d="M19 11v2a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-2" />
              <path d="M12 19v4" />
            </svg>
          </button>
              <button className="mr-2" onClick={toggleEmojiPicker}>
                😊
              </button>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <PhotoIcon className="w-6 h-6 text-gray-500" />
              </label>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mx-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={imagePreview ? sendImage : sendMessage}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                <PaperAirplaneIcon className="w-6 h-6 transform rotate-90" />
              </button>
              {emojiPickerOpen && (
                <div className="absolute bottom-16 left-4">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
          
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickChat;
