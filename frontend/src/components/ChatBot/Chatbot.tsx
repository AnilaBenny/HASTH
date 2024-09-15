import  { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import ReactDOM from 'react-dom';

export default function MainComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
        
      <img
        src="images/profile.avif" 
        alt="Open Chat"
        onClick={openModal}
        className=" border border-blue-950 w-16 h-16 rounded-full cursor-pointer fixed bottom-5 right-5 z-50"
        
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

function Modal({ isOpen, onClose }:any) {
  const [messages, setMessages] = useState<any|[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      const newMessages:any[]  = [...messages, { text: inputValue, sender: 'user' }];
      setMessages(newMessages);
      setInputValue('');

      try {
        const response = await axiosInstance.post('/api/auth/dialogflow', {
          queryInput: {
            text: {
              text: inputValue,
              languageCode: 'en-US',
            },
          },
        });

        const botMessage = response.data.fulfillmentText;
        setMessages((prev:any) => [...prev, { text: botMessage, sender: 'bot' }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev:any) => [
          ...prev,
          { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' },
        ]);
      }
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm h-96 flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex items-center rounded-t-lg">
          <img
            src="images/profile.avif"
            alt="Hasth"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h1 className="text-xl font-bold">Hasth</h1>
            <p className="text-sm">Your friendly chatbot</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-2 text-white rounded-full hover:bg-red-600"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message:any, index:any) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <img
                  src="images/profile.avif"
                  alt="Hasth"
                  className="w-8 h-8 rounded-full mr-2 self-end"
                />
              )}
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
