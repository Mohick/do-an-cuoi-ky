





import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hammer, Cog, Cpu } from 'lucide-react';
import gsap from 'gsap';

const Developing = () => {
  const glowRef = useRef(null);

  // Hiệu ứng GSAP cho nền quét vàng cam
  useEffect(() => {
    gsap.to(glowRef.current, {
      duration: 3,
      x: '100%',
      repeat: -1,
      ease: 'none',
      opacity: 0.5,
    });
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-black font-sans text-white">
      
      {/* Nền Animation Vàng Cam (GSAP) */}
      <div 
        ref={glowRef}
        className="absolute -left-[50%] h-[500px] w-[500px] rounded-full bg-orange-500 blur-[150px] opacity-20 pointer-events-none"
      />

      {/* Icon chính với Framer Motion */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mb-8"
      >
        <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 shadow-[0_0_50px_rgba(249,115,22,0.2)]">
          <Hammer size={50} className="text-orange-500 animate-bounce" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute -right-4 -top-4 text-orange-400"
          >
            <Cog size={30} />
          </motion.div>
        </div>
      </motion.div>

      {/* Nội dung text */}
      <div className="z-10 text-center px-4">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-5xl font-black tracking-tighter md:text-7xl"
        >
          ĐANG <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-600">PHÁT TRIỂN</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md text-lg text-gray-400"
        >
          Tính năng này đang được chúng tôi "độ" lại cực mạnh. 
          Vui lòng quay lại sau khi thợ máy hoàn thành!
        </motion.p>
      </div>

      {/* Bottom Bar giả lập công nghệ */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md text-sm text-orange-200"
      >
        <Cpu size={18} className="animate-pulse" />
        <span>Deploying v1.0.4 - Framer Engine Active</span>
      </motion.div>

      {/* Hiệu ứng hạt bụi bay lơ lửng */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-orange-300 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-20%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Developing;