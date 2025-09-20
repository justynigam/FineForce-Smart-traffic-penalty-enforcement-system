import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getCommandCenterAIStream } from '../services/geminiService';

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .95.826L11.25 9.25v1.5L4.643 11.98a.75.75 0 0 0-.95.826l-1.414 4.949a.75.75 0 0 0 .95.826l15.228-5.439a.75.75 0 0 0 0-1.41L3.105 2.289Z" />
    </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const AIChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      text: "Welcome to the FineForce AI Command Center. I'm here to provide deep analysis and strategic insights into your traffic data. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = useCallback(async (messageText: string) => {
    if (messageText.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage, { id: Date.now() + 1, role: 'assistant', text: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await getCommandCenterAIStream(messageText);
      
      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage) {
              lastMessage.text = text;
          }
          return newMessages;
        });
      }
    } catch (error) {
      let errorMessage = "Sorry, I couldn't connect to the AI service. Please check the configuration.";
      if (error instanceof Error && error.message.includes("API key")) {
        errorMessage = "AI Assistant is not available. The API key is missing or invalid.";
      }
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage) {
            lastMessage.text = errorMessage;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(input);
  }

  const suggestedPrompts = [
    "Identify the top 3 violation hotspots from last month.",
    "Forecast revenue from speeding fines for the next quarter.",
    "What's the correlation between time of day and red light violations?",
    "Suggest an optimal patrol route for Zone B to reduce illegal parking."
  ];

  return (
    <div className="flex flex-col h-full">
        <div className="flex-shrink-0 mb-6">
            <h2 className="text-3xl font-bold text-slate-800">AI Chatbot Assistant</h2>
            <p className="text-slate-500 mt-1">Your command center for intelligent traffic analysis and insights.</p>
        </div>
        
        <div className="flex-1 bg-white rounded-xl shadow-md border border-slate-200/80 flex flex-col min-h-0">
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border-2 border-white shadow">
                            <SparklesIcon className="w-5 h-5 text-blue-400"/>
                        </div>
                    )}
                    <div 
                        className={`max-w-xl rounded-2xl px-4 py-3 text-sm lg:text-base prose prose-sm prose-slate max-w-none ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}
                        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                    >
                    {msg.text === '' && isLoading && index === messages.length -1 ? (
                        <div className="flex items-center justify-center p-2">
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                        </div>
                    ) : msg.text}
                    </div>
                </div>
                ))}

                {messages.length <= 1 && (
                    <div className="pt-4 animate-fade-in">
                        <p className="text-sm font-medium text-slate-600 mb-3 text-center">Or try one of these suggestions:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {suggestedPrompts.map(prompt => (
                                <button key={prompt} onClick={() => handleSendMessage(prompt)} className="text-left p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 transition">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white/50 backdrop-blur-sm rounded-b-xl">
                <form onSubmit={handleFormSubmit} className="flex items-center space-x-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about traffic trends, patrol strategies, or revenue forecasts..."
                    disabled={isLoading}
                    className="w-full bg-slate-100 border border-slate-200 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-slate-800 placeholder-slate-500"
                />
                <button type="submit" disabled={isLoading || !input} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex-shrink-0">
                    <SendIcon className="w-6 h-6" />
                </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default AIChatbotPage;