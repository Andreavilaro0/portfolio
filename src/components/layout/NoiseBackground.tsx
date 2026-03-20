'use client'

/**
 * Animated gradient background with floating color blobs.
 * 2026 aesthetic: soft diffuse lighting, pastel-leaning colors on dark base,
 * hazy daydream quality. GPU-composited with blur + mix-blend-mode.
 */
export function NoiseBackground() {
  return (
    <div className="noise-bg" aria-hidden="true">
      {/* Primary blobs — brand colors */}
      <div className="noise-bg__blob noise-bg__blob--pink" />
      <div className="noise-bg__blob noise-bg__blob--violet" />
      <div className="noise-bg__blob noise-bg__blob--cyan" />
      {/* Secondary blobs — warmth and depth */}
      <div className="noise-bg__blob noise-bg__blob--peach" />
      <div className="noise-bg__blob noise-bg__blob--lavender" />
      <div className="noise-bg__blob noise-bg__blob--lime" />

      <style jsx>{`
        .noise-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: linear-gradient(160deg, #08080f 0%, #0d0a14 40%, #0a0d12 100%);
          z-index: 0;
        }

        .noise-bg__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          will-change: transform;
          mix-blend-mode: screen;
        }

        .noise-bg__blob--pink {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,45,155,0.35) 0%, rgba(255,45,155,0.08) 60%, transparent 100%);
          top: 15%;
          left: 25%;
          animation: drift-1 20s ease-in-out infinite alternate;
        }

        .noise-bg__blob--violet {
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(123,47,255,0.3) 0%, rgba(123,47,255,0.06) 55%, transparent 100%);
          top: 5%;
          right: 5%;
          animation: drift-2 24s ease-in-out infinite alternate;
        }

        .noise-bg__blob--cyan {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(0,229,255,0.2) 0%, rgba(0,229,255,0.04) 60%, transparent 100%);
          bottom: 20%;
          left: 5%;
          animation: drift-3 18s ease-in-out infinite alternate;
        }

        .noise-bg__blob--peach {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255,180,130,0.2) 0%, rgba(255,130,80,0.04) 60%, transparent 100%);
          bottom: 10%;
          right: 20%;
          animation: drift-4 22s ease-in-out infinite alternate;
        }

        .noise-bg__blob--lavender {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(200,170,255,0.15) 0%, rgba(180,150,255,0.03) 60%, transparent 100%);
          top: 40%;
          left: 45%;
          animation: drift-5 26s ease-in-out infinite alternate;
        }

        .noise-bg__blob--lime {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(190,255,0,0.12) 0%, rgba(190,255,0,0.02) 60%, transparent 100%);
          bottom: 30%;
          right: 35%;
          animation: drift-6 16s ease-in-out infinite alternate;
        }

        @keyframes drift-1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, -80px) scale(1.15); }
          66% { transform: translate(-50px, 50px) scale(0.9); }
          100% { transform: translate(70px, -40px) scale(1.1); }
        }

        @keyframes drift-2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, 60px) scale(1.1); }
          100% { transform: translate(50px, -70px) scale(0.95); }
        }

        @keyframes drift-3 {
          0% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(60px, -50px) scale(1.2); }
          100% { transform: translate(-40px, 80px) scale(0.85); }
        }

        @keyframes drift-4 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-70px, -60px) scale(1.1); }
          100% { transform: translate(40px, 50px) scale(0.9); }
        }

        @keyframes drift-5 {
          0% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(50px, -40px) scale(1.08); }
          70% { transform: translate(-60px, 30px) scale(0.92); }
          100% { transform: translate(30px, -20px) scale(1.05); }
        }

        @keyframes drift-6 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -50px) scale(1.15); }
          100% { transform: translate(50px, 30px) scale(0.9); }
        }

        @media (prefers-reduced-motion: reduce) {
          .noise-bg__blob {
            animation: none !important;
          }
        }

        @media (max-width: 640px) {
          .noise-bg__blob {
            filter: blur(70px);
            transform: scale(0.5);
          }
        }
      `}</style>
    </div>
  )
}
