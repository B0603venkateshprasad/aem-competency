function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  class Particle {
    constructor() {
      this.angle = Math.random() * Math.PI * 2;
      // Exponential distribution pushes more stars to the center
      const r = Math.random();
      this.radius = r * r * (width > height ? width : height) * 0.8;
      
      // Inner stars move faster, outer move slower
      this.speed = 1 / (this.radius + 100) * 0.8;
      this.size = Math.random() * 1.5 + 0.5;
      
      // Beautiful galaxy colors (blue, purple, cyan, white)
      const hues = [220, 260, 190, 0];
      const hue = hues[Math.floor(Math.random() * hues.length)];
      this.color = hue === 0 ? '#ffffff' : `hsla(${hue + Math.random() * 20 - 10}, 100%, ${60 + Math.random() * 40}%, ${0.3 + Math.random() * 0.7})`;
    }
    update() {
      this.angle -= this.speed;
    }
    draw(isLight) {
      // Perspective tilt: flatten Y-axis for 3D effect
      const x = width / 2 + Math.cos(this.angle) * this.radius;
      const y = height / 2 + Math.sin(this.angle) * this.radius * 0.35;
      
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      if (isLight) {
          ctx.fillStyle = this.color.replace('100%,', '60%,').replace('#ffffff', '#888888');
      }
      ctx.fill();
    }
  }

  for (let i = 0; i < 800; i++) {
    particles.push(new Particle());
  }

  function animate() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Trail effect
    ctx.fillStyle = isLight ? 'rgba(245, 247, 251, 0.3)' : 'rgba(10, 14, 26, 0.3)';
    ctx.fillRect(0, 0, width, height);

    // Glowing core
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.4);
    if (isLight) {
      gradient.addColorStop(0, 'rgba(108, 92, 231, 0.15)');
      gradient.addColorStop(1, 'transparent');
    } else {
      gradient.addColorStop(0, 'rgba(108, 92, 231, 0.1)');
      gradient.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw(isLight);
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

document.addEventListener('DOMContentLoaded', initGalaxy);
