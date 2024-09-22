import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import { format } from 'date-fns';
import { PhotoIcon, XMarkIcon, PaperAirplaneIcon, MicrophoneIcon, TrashIcon, PauseIcon, PlayIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import EmojiPicker from 'emoji-picker-react';
import 'react-h5-audio-player/lib/styles.css';
import { useSocket } from './socket';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'voice_note';
  conversationId: string;
  timestamp: string;
}
type Conversation = {
  receiver: {
    _id: string;
    name: string;
    image: string;
  };
  conversation: {
    _id: string;
  };
};


const QuickChat: React.FC = () => {
  const socket: Socket | null = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const user = useSelector((state: any) => state.user);
  const messageRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ roomId: string; caller: string } | null>(null);
  //@ts-ignore
  const [isCallPending, setIsCallPending] = useState(false);
    //@ts-ignore
  const [isCallInitiated, setIsCallInitiated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, [user.user._id]);



  useEffect(() => {
    if (socket) {
      socket.on('getMessage', (data: Message) => {
        console.log('Received message:', data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('incomingCall', (data: { roomId: string; caller: string }) => {
        setIncomingCall(data);
      });

      socket.on('callAccepted', ({ roomId }) => {
        setIsCallPending(false);
        navigate(`/videoCall/${roomId}`);
      });

      socket.on('callRejected', () => {
        setIsCallPending(false);
        console.log("Call was rejected");
      });
      console.log('Socket connected:', socket.connected);
      socket.on('connect', () => console.log('Socket connected'));
      socket.on('disconnect', () => console.log('Socket disconnected'));

      return () => {
        socket.off('getMessage');
        socket.off('incomingCall');
        socket.off('callAccepted');
        socket.off('callRejected');
      };
    }
  }, [socket,selectedConversation]);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/getconversations?id=${user.user._id}`);
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

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation);
    console.log('concid',conversation.conversation._id);
    
    fetchMessages(conversation.conversation._id);
    if (socket) {
      socket.emit('joinChat', { 
        senderId: user.user._id, 
        receiverId: conversation.receiver._id, 
        chatId: conversation.conversation._id
      });


    }
  };

  const sendMessage = () => {
    if (messageInput.trim() && selectedConversation && socket) {
      const newMessage: Message = {
        senderId: user.user._id,
        receiverId: selectedConversation.receiver._id ,
        content: messageInput,
        type: 'text',
        conversationId: selectedConversation.conversation._id,
        timestamp: new Date().toISOString(),
      };
      console.log(newMessage,'kkkk');
      

      setMessageInput('');

      socket.emit('sendMessage', newMessage, (response: any) => {
        if (response.success) {

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
        receiverId: selectedConversation.receiver._id,
        content: base64Image,
        type: 'image',
        conversationId: selectedConversation.conversation._id,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
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

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setAudioData(blob);
          setAudioURL(URL.createObjectURL(blob));
        };

        mediaRecorder.start();
        setIsRecording(true);
        startTimer();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const deleteRecording = () => {
    setAudioData(null);
    setAudioURL(null);
    setRecordingDuration(0);
  };

  const startTimer = () => {
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendVoiceMessage = () => {
    if (audioData && socket && selectedConversation) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Audio = reader.result as string;
        const newMessage: Message = {
          senderId: user.user._id,
          receiverId: selectedConversation.receiver._id,
          content: base64Audio,
          type: 'voice_note',
          conversationId: selectedConversation.conversation._id,
          timestamp: new Date().toISOString(),
        };
        console.log();
        

        socket.emit('audioStream', newMessage, () => {
        });

        deleteRecording();
      };
      reader.readAsDataURL(audioData);
    }
  };

  const generateRoomId = () => {
    const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    const maxPos = chars.length;
    const len = 6;
    let roomId = "";
    for (let i = 0; i < len; i++) {
      roomId += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return roomId;
  };

  const initiateVideoCall = () => {
    if (!selectedConversation || !socket) return;

    const roomId = generateRoomId();

    setIsCallPending(true);
    setIsCallInitiated(true);

    socket.emit("videoCall", {
      userId: user.user._id,
      creativeId: selectedConversation.receiver._id,
      roomId: roomId,
      userName: user.user.name,
      creativeName: selectedConversation.receiver.name
    }, (response: { success: boolean; message?: string }) => {
      if (response.success) {
        console.log("Waiting for recipient to accept the call...");
      } else {
        console.error("Failed to initiate video call:", response.message);
        setIsCallPending(false);
        setIsCallInitiated(false);
      }
      navigate(`/videoCall/${roomId}`);
    });
  };

  const acceptCall = () => {
    if (incomingCall && socket) {
      socket.emit('acceptCall', { roomId: incomingCall.roomId, acceptedBy: user.user._id });
      navigate(`/videoCall/${incomingCall.roomId}`);
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall && socket) {
      socket.emit('rejectCall', { roomId: incomingCall.roomId, rejectedBy: user.user.name });
      setIncomingCall(null);
    }
  };

  return (
    <div className=" rounded-2xl flex justify-evenly">
      {/* Conversation List */}
      <div className="w-1/3 h-1/3 bg-white border-r shadow-lg">
  <h2 className="text-2xl font-bold p-6 bg-gradient-to-r from-blue-300 to-blue-600 text-white rounded-t-2xl">
    Welcome to chat room
  </h2>
  <div className="overflow-y-auto p-2 ">
    {conversations.map((conv:any) => (
      <div
        key={conv.conversation._id}
        className={`flex items-center p-3 my-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150 shadow-sm ${
          selectedConversation?.conversation._id === conv.conversation._id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
        }`}
        onClick={() => handleConversationSelect(conv)}
      >
        <img
          src={`https://hasth.mooo.com/src/uploads/${conv.receiver.image}`}
          alt={conv.receiver.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 mr-3"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{conv.receiver.name}</p>
          <p className="text-sm text-gray-500 truncate">
            { 'Start a conversation'}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>


      
      <div className="bg-gray-50 w-1/3">
        {selectedConversation ? (
          <>
         
            <div className="bg-white p-4 border-b shadow-sm flex justify-between rounded-t-3xl">
              <div className='flex items-center  ms-3'>
              <img
                src={`https://hasth.mooo.com/src/uploads/${selectedConversation.receiver.image}`}
                alt={selectedConversation.receiver.name}
                className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-blue-200"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedConversation.receiver.name}
              </h3>
              </div>
              <VideoCameraIcon className="w-6 h-6 me-3 text-gray-600 cursor-pointer hover:text-blue-500 " onClick={initiateVideoCall} />
            </div>

       
            <div className="p-2 overflow-hidden ">
  <div className="overflow-y-auto h-80 pr-2">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${message.senderId === user.user._id ? 'justify-end' : 'justify-start'} mb-4`}
        ref={messageRef}
      >
        <div
          className={`relative p-4 rounded-xl shadow-lg max-w-xs ${
            message.senderId === user.user._id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {message.type === 'text' && <p>{message.content}</p>}
          {message.type === 'image' && (
            <img src={message.content} alt="Image" className="rounded-lg max-w-full max-h-64 object-cover mt-2" />
          )}
          {message.type === 'voice_note' && (
            <audio src={message.content} controls className="w-56 h-8 mt-2 rounded">
              Your browser does not support the audio element.
            </audio>
          )}
          <p className="text-xs mt-2 text-gray-300 text-right">
            {format(new Date(message.timestamp), 'p, MMM d')}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
{imagePreview && (
                      <div className="absolute bottom-16 left-4 bg-white p-2 border rounded-lg shadow-lg flex items-center rounded-b-2xl">
                        <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => setImagePreview(null)}
                          className="ml-2 text-gray-600 hover:text-red-500"
                        >
                          <XMarkIcon className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                    {incomingCall && (
  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <p className="mb-4">Incoming call from {incomingCall.caller}</p>
      <div className="flex justify-around">
        <button onClick={acceptCall} className="bg-green-500 text-white px-4 py-2 rounded">Accept</button>
        <button onClick={rejectCall} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
      </div>
    </div>
  </div>
)}



            {/* Message Input */}
            <div className="bg-white p-4 border-t shadow-sm flex items-center">
            {!isRecording && !audioURL && (
          <button 
            onClick={startRecording}
            className="mr-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
        )}
        {isRecording && (
          <div className="flex items-center mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-red-500 font-medium">{formatDuration(recordingDuration)}</span>
            {!isPaused ? (
              <button onClick={pauseRecording} className="ml-2 text-gray-600 hover:text-gray-800">
                <PauseIcon className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={resumeRecording} className="ml-2 text-gray-600 hover:text-gray-800">
                <PlayIcon className="w-5 h-5" />
              </button>
            )}
            <button onClick={stopRecording} className="ml-2 text-gray-600 hover:text-gray-800">
              <XMarkIcon className="w-5 h-5" />
            </button>
            <button onClick={sendVoiceMessage} className="ml-2 text-blue-500 hover:text-blue-700">
              <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
            </button>
          </div>
        )}
        {audioURL && (
          <div className="flex items-center mr-2">
            <audio src={audioURL} controls className="w-32 h-8" />
            <button onClick={deleteRecording} className="ml-2 text-red-500 hover:text-red-700">
              <TrashIcon className="w-5 h-5" />
            </button>
            <button onClick={sendVoiceMessage} className="ml-2 text-blue-500 hover:text-blue-700">
              <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
            </button>
          </div>
        )}
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
          <div className="flex-1 flex  items-center justify-center">
            <p className="text-xl text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickChat;
