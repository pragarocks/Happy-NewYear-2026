
import React, { useEffect, useRef } from 'react';

const FireworkDisplay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      gravity: number;
      friction: number;

      constructor(x: number, y: number, color: string, speedMultiplier = 1) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const velocity = (Math.random() * 6 + 2) * speedMultiplier;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        this.alpha = 1;
        this.color = color;
        this.gravity = 0.05;
        this.friction = 0.98;
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;
      }
    }

    const colors = ['#ff0044', '#00ffcc', '#ffff00', '#ff00ff', '#0099ff', '#ffffff', '#ffa500'];

    const createFirework = (x: number, y: number, intense = false) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = intense ? 80 : 50;
      const speed = intense ? 1.5 : 1;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color, speed));
      }
    };

    const handleManual = (e: any) => {
      createFirework(e.detail.x, e.detail.y, true);
    };

    window.addEventListener('manual-firework' as any, handleManual);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      if (Math.random() < 0.04) {
        createFirework(
          Math.random() * canvas.width,
          Math.random() * (canvas.height * 0.6)
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('manual-firework' as any, handleManual);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default FireworkDisplay;
