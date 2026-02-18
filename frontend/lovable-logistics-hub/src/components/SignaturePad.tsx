import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (base64: string) => void;
  onClose: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#22c55e'; // Primary green
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setIsEmpty(false);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
      const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">Capture Digital Signature</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        
        <div className="p-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full bg-slate-950 border border-primary/20 rounded-xl cursor-crosshair touch-none"
          />
          <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase font-bold tracking-tighter italic">Signature is encrypted and GPS-timestamped upon submission.</p>
        </div>

        <div className="p-4 bg-slate-950/50 flex gap-3">
          <button 
            onClick={clear}
            className="flex-1 py-3 bg-secondary/50 text-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/70 transition-all border border-white/5"
          >
            <Eraser className="w-4 h-4" /> CLEAR
          </button>
          <button 
            onClick={handleSave}
            disabled={isEmpty}
            className="flex-[2] py-3 bg-primary text-primary-foreground font-black rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg glow-primary disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> CONFIRM SIGNATURE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
