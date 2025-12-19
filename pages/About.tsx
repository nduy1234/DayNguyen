import React, { useState, useEffect, useRef } from 'react';
import { generateSpeech, createChatSession } from '../services/geminiService';
import { Volume2, Loader2, PlayCircle, StopCircle, ArrowRight, Sparkles, Send, User, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveVoice from '../components/LiveVoice';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';

const About = () => {
  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: "Hello! I've analyzed Day's entire portfolio. Ask me anything about his skills, projects, or professional experience.", 
      timestamp: new Date() 
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bioText = "I’m a versatile professional who enjoys connecting people, technology, and creative ideas to solve meaningful problems. I bring a mix of strategic thinking, technical skills, and creative vision to the work I do, whether I’m building systems, shaping content, or improving processes. My background spans automation, marketing, design, and business analysis, giving me a broad perspective across higher education, public service, and tech environments. I’ve worked closely with cross-functional teams to translate complex needs into practical, user-centered solutions. Across roles, I’m motivated by creating inclusive, high-impact work that blends innovation with real value.";

  // TTS Handler
  const handlePlayTTS = async () => {
    if (isPlaying && audioContext) {
      audioContext.suspend();
      setIsPlaying(false);
      return;
    }

    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const buffer = await generateSpeech(bioText);
      if (buffer) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
        
        setAudioContext(ctx);
        setSourceNode(source);
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Failed to play TTS", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  // Chat Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat Logic
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Initialize session if needed
    if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      // Add placeholder message
      setMessages(prev => [...prev, {
          id: modelMsgId,
          role: 'model',
          text: "",
          timestamp: new Date()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: fullText } : msg
          ));
        }
      }
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to Gemini right now. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setChatInput(question);
    // User still needs to press enter/send to confirm action
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="order-2 md:order-1 relative w-full max-w-[350px] mx-auto md:mx-0">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
             <img 
               src="/profile.jpg" 
               alt="Day Nguyen" 
               className="rounded-3xl shadow-2xl w-full object-cover h-[350px] transition-transform duration-700 hover:scale-[1.02]"
             />
           </div>
           <div className="order-1 md:order-2 space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Hi, <br/> I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Day Nguyen</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                {bioText}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={handlePlayTTS}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : isPlaying ? <StopCircle size={20} /> : <Volume2 size={20} />}
                  <span>{isPlaying ? 'Pause Bio' : isLoading ? 'Generating Audio...' : 'Listen to Bio'}</span>
                </button>
                <Link to="/projects" className="flex items-center space-x-2 bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-full hover:border-gray-900 transition-all">
                  <span>View Projects</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
           </div>
        </div>
      </div>

      {/* Inline Chat Section */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[600px]">
           {/* Sidebar */}
           <div className="bg-slate-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
              <div>
                 <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                    <Sparkles size={24} />
                 </div>
                 <h3 className="text-2xl font-bold mb-4">Ask me anything.</h3>
                 <p className="text-slate-300 leading-relaxed text-sm">
                   I'm an AI assistant powered by <strong>Gemini 3 Pro</strong>. I've been trained on Day's portfolio and can answer questions about his experience.
                 </p>
              </div>
              <div className="hidden md:block">
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-4">Try asking</p>
                 <ul className="space-y-3 text-sm text-slate-300">
                    <li className="cursor-pointer hover:text-white hover:translate-x-1 transition-all flex items-center gap-2" onClick={() => handleSuggestedQuestion("What are your core technical skills?")}>
                       <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                       Technical skills
                    </li>
                    <li className="cursor-pointer hover:text-white hover:translate-x-1 transition-all flex items-center gap-2" onClick={() => handleSuggestedQuestion("Tell me about the Youtube Clone project.")}>
                       <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                       Project details
                    </li>
                    <li className="cursor-pointer hover:text-white hover:translate-x-1 transition-all flex items-center gap-2" onClick={() => handleSuggestedQuestion("What is your contact info?")}>
                       <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                       Contact info
                    </li>
                 </ul>
              </div>
           </div>

           {/* Chat Interface */}
           <div className="flex-1 flex flex-col bg-slate-50 relative">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                       <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-slate-800' : 'bg-blue-600'}`}>
                             {msg.role === 'user' ? <User size={14} className="text-white"/> : <Bot size={14} className="text-white"/>}
                          </div>
                          <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              msg.role === 'user' 
                                ? 'bg-white text-gray-800 rounded-br-none border border-slate-200' 
                                : 'bg-blue-600 text-white rounded-bl-none shadow-blue-200'
                          }`}>
                             {msg.text}
                          </div>
                       </div>
                    </div>
                 ))}
                 {isChatTyping && (
                    <div className="flex justify-start">
                       <div className="flex items-end gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                             <Bot size={14} className="text-white"/>
                          </div>
                          <div className="bg-blue-600 p-4 rounded-2xl rounded-bl-none shadow-blue-200">
                             <Loader2 size={16} className="animate-spin text-white" />
                          </div>
                       </div>
                    </div>
                 )}
                 <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                 <form onSubmit={handleChatSubmit} className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your question regarding my portfolio..."
                      className="w-full pl-6 pr-14 py-4 rounded-full bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700"
                    />
                    <button 
                       type="submit" 
                       disabled={!chatInput.trim() || isChatTyping}
                       className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors shadow-sm"
                    >
                       <Send size={20} />
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </section>

      {/* Live Voice Demo Section */}
      <section className="w-full bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Talk to my AI</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            Experience real-time conversation powered by Gemini 2.5 Native Audio. Ask about my work, skills, or just say hello.
          </p>
          <div className="flex justify-center">
            <LiveVoice />
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;