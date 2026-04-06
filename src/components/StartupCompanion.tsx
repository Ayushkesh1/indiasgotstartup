import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "Every great founder started with a blank page. What's your story?",
  "Fun Fact: Airbnb's first pitch deck was rejected by 7 investors!",
  "💡 'It's not about ideas. It's about making ideas happen.' - Scott Belsky",
  "The world needs your innovation. Keep building!",
  "🦄 Did you know? The term 'Unicorn' was coined by Aileen Lee in 2013.",
  "🚀 New articles are dropping daily! Keep up the momentum.",
  "Failure is just a resting place. It is an opportunity to begin again more intelligently.",
  "Be stubborn on vision, but flexible on details. - Jeff Bezos",
  "Don't worry about failures, worry about the chances you miss when you don't even try."
];

const EMOJIS = ["💡", "🚀", "🦄", "🤓", "🔥", "✨", "🧠", "🎯"];

const StartupCompanion = () => {
  const [currentMessage, setCurrentMessage] = useState(MESSAGES[0]);
  const [currentEmoji, setCurrentEmoji] = useState(EMOJIS[0]);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsgTemp = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      setCurrentMessage(randomMsgTemp);
      setCurrentEmoji(randomEmoji);
      
      // Auto-pop the bubble to show new message
      setIsExpanded(true);
      
      // Auto-hide bubble after some seconds so it doesn't block the screen forever
      setTimeout(() => setIsExpanded(false), 9000);
    }, 20000); // Trigger a new insight every 20 seconds

    // Initial hide timeout
    const initialHide = setTimeout(() => setIsExpanded(false), 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialHide);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      {/* Speech Bubble */}
      <div 
        className={`bg-white/90 dark:bg-black/90 backdrop-blur-md border-[3px] border-primary shadow-2xl rounded-3xl rounded-br-none p-4 w-[280px] md:w-[320px] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right pointer-events-auto
          ${isExpanded ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-8'}`}
      >
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute -top-3 -right-3 bg-muted rounded-full p-1 border shadow-sm hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors z-10"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="relative">
          <p className="text-[15px] font-medium text-foreground leading-relaxed italic pr-2">
            "{currentMessage}"
          </p>
        </div>
      </div>

      {/* The Emoji Pet button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-16 h-16 bg-gradient-to-tr from-primary to-accent rounded-full shadow-[0_0_25px_rgba(0,0,0,0.2)] flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-transform cursor-pointer pointer-events-auto border-[3px] border-white dark:border-slate-800 group"
        title="Your Startup Companion"
      >
        <span className="group-hover:animate-bounce inline-block transition-transform">{currentEmoji}</span>
      </button>
    </div>
  );
};

export default StartupCompanion;
