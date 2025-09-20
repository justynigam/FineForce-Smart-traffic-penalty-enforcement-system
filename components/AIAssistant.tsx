

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getAIInsightStream } from '../services/geminiService';

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

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage, { id: Date.now() + 1, role: 'assistant', text: '' }]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await getAIInsightStream(input);
      
      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = text;
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
        newMessages[newMessages.length - 1].text = errorMessage;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);


  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200/80 flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
        <SparklesIcon className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-slate-800">AI Assistant</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-blue-400"/>
                </div>
            )}
            <div className={`max-w-xs md:max-w-sm lg:max-w-md rounded-2xl px-4 py-3 text-sm lg:text-base ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
              {msg.text || (isLoading && index === messages.length -1) ? (
                 <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                </div>
              ) : null}
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about traffic patterns..."
            disabled={isLoading}
            className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 text-slate-800 placeholder-slate-500"
          />
          <button type="submit" disabled={isLoading} className="p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;