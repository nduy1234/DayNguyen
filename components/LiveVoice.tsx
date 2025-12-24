import React, { useEffect, useRef, useState } from 'react';
import { getAI, createBlob } from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Volume2, Activity, Radio } from 'lucide-react';
import { decode, decodeAudioData } from '../services/audioUtils';

const LiveVoice = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  const stopSession = () => {
    if (sessionRef.current) {
        sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  };

  const startSession = async () => {
    setIsConnecting(true);
    const ai = getAI();
    
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    
    audioContextRef.current = outputAudioContext;
    nextStartTimeRef.current = 0;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setIsConnecting(false);
                    setIsActive(true);
                    
                    const source = inputAudioContext.createMediaStreamSource(stream);
                    const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        
                        sessionPromise.then((session) => {
                            if (isActive) {
                                session.sendRealtimeInput({ media: pcmBlob });
                            }
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContext.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio) {
                        const ctx = audioContextRef.current;
                        if (!ctx) return;

                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        
                        const audioBuffer = await decodeAudioData(
                            decode(base64Audio),
                            ctx,
                            24000,
                            1
                        );
                        
                        const source = ctx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(ctx.destination);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                    }
                },
                onclose: () => {
                    stopSession();
                },
                onerror: (e) => {
                    console.error("Live API Error", e);
                    stopSession();
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                systemInstruction: "You are Day's digital avatar. You are friendly, professional, and knowledgeable about Day's portfolio. Keep answers concise.",
            }
        });

        sessionRef.current = {}; 

    } catch (e) {
        console.error("Failed to connect", e);
        setIsConnecting(false);
    }
  };

  const toggleSession = () => {
    if (isActive) {
        stopSession();
    } else {
        startSession();
    }
  };

  return (
    <div className="relative group">
        {/* Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isActive ? 'animate-pulse opacity-75' : ''}`}></div>
        
        <div className="relative flex flex-col items-center justify-center p-8 bg-slate-900/90 backdrop-blur-xl rounded-[1.8rem] border border-white/10 max-w-sm w-full transition-all">
            {/* Visualizer Circle */}
            <div className="relative mb-8">
                {isActive && (
                    <>
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute -inset-4 bg-blue-500 rounded-full animate-pulse opacity-10 delay-75"></div>
                    </>
                )}
                <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isActive ? 'border-blue-500/50 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.6)]' : 'bg-slate-700'}`}>
                        {isConnecting ? (
                            <Activity className="animate-spin text-white" size={32}/> 
                        ) : isActive ? (
                            <div className="flex gap-1 items-center">
                                <div className="w-1 h-3 bg-white rounded-full animate-[music_1s_ease-in-out_infinite]"></div>
                                <div className="w-1 h-5 bg-white rounded-full animate-[music_1.2s_ease-in-out_infinite_0.1s]"></div>
                                <div className="w-1 h-4 bg-white rounded-full animate-[music_0.8s_ease-in-out_infinite_0.2s]"></div>
                            </div>
                        ) : (
                            <Mic size={32} className="text-slate-400" />
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center space-y-2 mb-8">
                <h3 className="text-white text-xl font-bold tracking-wide">
                    {isActive ? "Listening..." : "Live Voice Chat"}
                </h3>
                <p className="text-slate-400 text-sm">
                    {isConnecting ? "Establishing secure connection..." : isActive ? "Speak now. I'm listening." : "Click start to talk to my AI assistant."}
                </p>
            </div>

            <button 
                onClick={toggleSession}
                disabled={isConnecting}
                className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${isActive ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-white hover:bg-blue-50 text-slate-900'}`}
            >
                {isActive ? <><Radio size={18} /> End Call</> : <><Mic size={18} /> Start Call</>}
            </button>
        </div>
        <style>{`
            @keyframes music {
                0%, 100% { height: 12px; }
                50% { height: 24px; }
            }
        `}</style>
    </div>
  );
};

export default LiveVoice;