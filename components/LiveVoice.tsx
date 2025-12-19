import React, { useEffect, useRef, useState } from 'react';
import { getAI, createBlob } from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Volume2, Activity } from 'lucide-react';
import { decode, decodeAudioData } from '../services/audioUtils';

const LiveVoice = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  const stopSession = () => {
    if (sessionRef.current) {
        // Unfortunately, the SDK's session object doesn't always have a clear close method exposed in the type definition in all versions
        // But we can ensure we stop sending data.
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
                            if (isActive) { // Check if we should still be sending
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
                systemInstruction: "You are Day's digital avatar. You are friendly, professional, and knowledgeable about Day's portfolio.",
            }
        });

        // Store session wrapper to check active state roughly
        // We can't cancel the promise easily, but we can control the input stream
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
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl max-w-sm w-full">
        {/* Visualizer Circle */}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isActive ? 'bg-blue-600/20 shadow-[0_0_50px_rgba(37,99,235,0.3)] scale-110' : 'bg-gray-800'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-blue-600 animate-pulse' : 'bg-gray-700'}`}>
                 {isConnecting ? <Activity className="animate-spin text-white" size={40}/> : isActive ? <Volume2 size={40} className="text-white" /> : <MicOff size={40} className="text-gray-400" />}
            </div>
        </div>

        <h3 className="text-white text-xl font-bold mb-2">Live Voice Chat</h3>
        <p className="text-gray-400 text-center mb-6 text-sm">
            {isConnecting ? "Connecting to Gemini..." : isActive ? "Listening... Speak now." : "Click start to talk to my AI assistant in real-time."}
        </p>

        <button 
            onClick={toggleSession}
            disabled={isConnecting}
            className={`w-full py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 ${isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'}`}
        >
            {isActive ? "End Conversation" : "Start Conversation"}
        </button>
    </div>
  );
};

export default LiveVoice;