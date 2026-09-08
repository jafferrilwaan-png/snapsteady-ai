import React, { useEffect, useRef } from 'react';

export function CloudShader({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle clouds with soft luminous floating layers
    const cloudBlobs = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: (Math.random() * 0.6 + 0.1) * window.innerHeight,
      radius: Math.random() * 200 + 140,
      speed: (Math.random() * 0.25 + 0.08) * (i % 2 === 0 ? 1 : -1),
      alpha: Math.random() * 0.2 + 0.1,
      color: i % 3 === 0 ? '#FFD600' : i % 2 === 0 ? '#38bdf8' : '#ffffff'
    }));

    const render = () => {
      time += 0.006;
      // Keep canvas transparent so background artwork shines through
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render drifting soft atmospheric glowing clouds
      cloudBlobs.forEach((cloud, index) => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.radius > canvas.width) cloud.x = -cloud.radius;
        if (cloud.x + cloud.radius < 0) cloud.x = canvas.width + cloud.radius;

        const currentY = cloud.y + Math.sin(time + index) * 22;

        const radGrad = ctx.createRadialGradient(
          cloud.x, currentY, cloud.radius * 0.05,
          cloud.x, currentY, cloud.radius
        );

        if (cloud.color === '#FFD600') {
          radGrad.addColorStop(0, `rgba(255, 214, 0, ${cloud.alpha * 0.6})`);
          radGrad.addColorStop(0.5, `rgba(255, 214, 0, ${cloud.alpha * 0.2})`);
          radGrad.addColorStop(1, 'rgba(255, 214, 0, 0)');
        } else if (cloud.color === '#38bdf8') {
          radGrad.addColorStop(0, `rgba(56, 189, 248, ${cloud.alpha * 0.7})`);
          radGrad.addColorStop(0.5, `rgba(14, 165, 233, ${cloud.alpha * 0.2})`);
          radGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
        } else {
          radGrad.addColorStop(0, `rgba(255, 255, 255, ${cloud.alpha * 0.5})`);
          radGrad.addColorStop(0.5, `rgba(240, 249, 255, ${cloud.alpha * 0.15})`);
          radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cloud.x, currentY, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Luminous golden horizon pulse
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 214, 0, 0.2)';
      ctx.lineWidth = 3;
      for (let x = 0; x < canvas.width; x += 25) {
        const y = canvas.height * 0.78 + Math.sin(x * 0.003 + time) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block pointer-events-none select-none ${className}`}
    />
  );
}
