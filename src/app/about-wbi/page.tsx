import type { Metadata } from "next"
import ScrollAnimator from "./scroll-animator"

export const metadata: Metadata = {
  title: "WE BUILD IT · Marketing Services",
  description: "Marketing Services — The life of a brand must be found in all spaces. Brand, UX/UI, Web, Content, SEO/SEM & MKT Automation.",
}

export default function AboutWbiPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --wbi-blue:    #0098DA;
          --wbi-blue2:   #47B6E6;
          --wbi-green:   #0C7347;
          --wbi-green2:  #17D986;
          --wbi-orange:  #F58634;
          --wbi-orange2: #BC5000;
          --wbi-yellow:  #FBCE26;
          --wbi-cyan:    #00AAFF;
          --white:       #FFFFFF;
          --off-white:   #F7FAFD;
          --gray-50:     #F0F5FA;
          --gray-100:    #E1E8F0;
          --gray-600:    #4A5568;
          --gray-800:    #1A202C;
        }

        .wbi-page * { margin:0; padding:0; box-sizing:border-box; }
        .wbi-page {
          background:var(--white); color:var(--gray-800);
          font-family:'Poppins',sans-serif; overflow-x:hidden;
        }

        /* ═══════════ NAVBAR ═══════════ */
        .wbi-page .wbi-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 3rem; height:72px;
          background:rgba(255,255,255,0.92); backdrop-filter:blur(20px) saturate(180%);
          border-bottom:1px solid rgba(0,152,218,0.08);
          box-shadow:0 1px 20px rgba(0,152,218,0.06);
        }
        .wbi-page .nav-logo img { height:40px; width:auto; }
        .wbi-page .nav-links { display:flex; gap:2rem; align-items:center; }
        .wbi-page .nav-link {
          color:var(--gray-600); font-size:0.88rem; font-weight:500;
          text-decoration:none; transition:all .25s; position:relative;
        }
        .wbi-page .nav-link:hover { color:var(--wbi-blue); }
        .wbi-page .nav-link::after {
          content:''; position:absolute; bottom:-4px; left:0; width:0; height:2px;
          background:linear-gradient(90deg, var(--wbi-blue), var(--wbi-green2));
          transition:width .3s; border-radius:2px;
        }
        .wbi-page .nav-link:hover::after { width:100%; }
        .wbi-page .nav-cta {
          padding:10px 28px;
          background:linear-gradient(135deg, var(--wbi-blue) 0%, var(--wbi-blue2) 100%);
          color:#fff; border-radius:50px; font-weight:600; font-size:0.85rem;
          text-decoration:none; transition:all .3s; letter-spacing:0.3px;
          box-shadow:0 4px 15px rgba(0,152,218,0.3);
        }
        .wbi-page .nav-cta:hover {
          transform:translateY(-2px);
          box-shadow:0 6px 25px rgba(0,152,218,0.4);
        }

        /* ═══════════ HERO ═══════════ */
        .wbi-page .hero {
          min-height:100vh; display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden; padding:120px 2rem 80px;
          background:linear-gradient(160deg, #F0F9FF 0%, #FFFFFF 30%, #F0FFF4 60%, #FFFBEB 100%);
        }
        /* Orbs decorativas */
        .wbi-page .hero-orb {
          position:absolute; border-radius:50%; pointer-events:none; filter:blur(80px);
        }
        .wbi-page .orb-blue {
          width:500px; height:500px; top:-10%; left:-10%;
          background:radial-gradient(circle, rgba(0,152,218,0.15) 0%, transparent 70%);
        }
        .wbi-page .orb-green {
          width:400px; height:400px; bottom:5%; right:-5%;
          background:radial-gradient(circle, rgba(23,217,134,0.12) 0%, transparent 70%);
        }
        .wbi-page .orb-orange {
          width:350px; height:350px; top:20%; right:10%;
          background:radial-gradient(circle, rgba(245,134,52,0.1) 0%, transparent 70%);
        }
        /* Geometric shapes */
        .wbi-page .hero-shapes { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
        .wbi-page .shape {
          position:absolute; border-radius:20px; opacity:0.06;
          animation:wbi-drift 20s ease-in-out infinite;
        }
        .wbi-page .shape-1 {
          width:120px; height:120px; top:15%; left:8%;
          background:var(--wbi-blue); transform:rotate(30deg);
        }
        .wbi-page .shape-2 {
          width:80px; height:80px; top:60%; left:15%;
          background:var(--wbi-green2); transform:rotate(-20deg);
          animation-delay:-5s;
        }
        .wbi-page .shape-3 {
          width:100px; height:100px; top:25%; right:12%;
          background:var(--wbi-orange); transform:rotate(45deg);
          animation-delay:-10s;
        }
        .wbi-page .shape-4 {
          width:60px; height:60px; bottom:20%; right:20%;
          background:var(--wbi-yellow); transform:rotate(15deg);
          animation-delay:-15s;
        }
        .wbi-page .shape-5 {
          width:90px; height:90px; bottom:30%; left:5%;
          background:var(--wbi-cyan); transform:rotate(-35deg);
          animation-delay:-8s;
        }
        @keyframes wbi-drift {
          0%,100%{ transform:rotate(var(--r,30deg)) translateY(0); }
          50%{ transform:rotate(var(--r,30deg)) translateY(-20px); }
        }

        .wbi-page .hero-content { position:relative; text-align:center; max-width:880px; }
        .wbi-page .hero-logo { height:56px; width:auto; margin-bottom:1.5rem; }
        .wbi-page .hero-badge {
          display:inline-flex; align-items:center; gap:10px;
          padding:8px 24px;
          background:linear-gradient(135deg, rgba(0,152,218,0.08) 0%, rgba(23,217,134,0.08) 100%);
          border:1px solid rgba(0,152,218,0.15);
          border-radius:999px; font-size:0.72rem; letter-spacing:3px;
          font-weight:600; text-transform:uppercase; margin-bottom:2rem;
          background-clip:padding-box;
        }
        .wbi-page .hero-badge .badge-text {
          background:linear-gradient(135deg, var(--wbi-blue) 0%, var(--wbi-green2) 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .wbi-page .hero-badge-dot {
          width:7px; height:7px; border-radius:50%;
          background:linear-gradient(135deg, var(--wbi-blue), var(--wbi-green2));
          animation:wbi-pulse 2s infinite;
        }
        @keyframes wbi-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.8)} }

        .wbi-page .hero h1 {
          font-size:clamp(2.4rem,6vw,4.2rem); font-weight:800;
          line-height:1.12; margin-bottom:1.5rem; color:var(--gray-800);
          letter-spacing:-0.5px;
        }
        .wbi-page .hero h1 .gradient-text {
          background:linear-gradient(135deg, var(--wbi-blue) 0%, var(--wbi-green2) 50%, var(--wbi-orange) 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .wbi-page .hero-sub {
          font-size:1.1rem; color:var(--gray-600); line-height:1.85;
          max-width:600px; margin:0 auto 2.5rem; font-weight:300;
        }
        .wbi-page .hero-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
        .wbi-page .btn-gradient {
          padding:16px 40px;
          background:linear-gradient(135deg, var(--wbi-blue) 0%, var(--wbi-green) 100%);
          color:#fff; border-radius:50px; font-weight:600; font-size:0.92rem;
          text-decoration:none; transition:all .3s; display:inline-flex;
          align-items:center; gap:10px; letter-spacing:0.3px;
          box-shadow:0 6px 25px rgba(0,152,218,0.3);
        }
        .wbi-page .btn-gradient:hover {
          transform:translateY(-3px);
          box-shadow:0 10px 40px rgba(0,152,218,0.4);
        }
        .wbi-page .btn-soft {
          padding:16px 40px;
          background:rgba(0,152,218,0.06); color:var(--wbi-blue);
          border:2px solid rgba(0,152,218,0.15);
          border-radius:50px; font-weight:600; font-size:0.92rem;
          text-decoration:none; transition:all .3s;
        }
        .wbi-page .btn-soft:hover {
          background:rgba(0,152,218,0.12); border-color:var(--wbi-blue);
          transform:translateY(-2px);
        }

        .wbi-page .hero-stats {
          display:flex; gap:2rem; justify-content:center; margin-top:4rem;
          padding-top:2.5rem; border-top:2px solid var(--gray-100);
          flex-wrap:wrap;
        }
        .wbi-page .hero-stat {
          padding:0 1.5rem; text-align:center;
        }
        .wbi-page .hero-stat-num {
          font-size:2.4rem; font-weight:800; line-height:1;
          background:linear-gradient(135deg, var(--wbi-blue), var(--wbi-green2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .wbi-page .hero-stat-lbl {
          font-size:0.72rem; color:var(--gray-600); letter-spacing:1.5px;
          text-transform:uppercase; margin-top:6px; font-weight:500;
        }

        /* ═══════════ SECTIONS COMMON ═══════════ */
        .wbi-page section { padding:100px 2rem; }
        .wbi-page .container { max-width:1140px; margin:0 auto; }
        .wbi-page .section-tag {
          font-size:0.75rem; letter-spacing:4px; font-weight:700;
          text-transform:uppercase; margin-bottom:0.75rem;
          background:linear-gradient(135deg, var(--wbi-blue), var(--wbi-green2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; display:inline-block;
        }
        .wbi-page .section-title {
          font-size:clamp(1.8rem,4vw,2.8rem);
          font-weight:800; line-height:1.15; color:var(--gray-800);
        }
        .wbi-page .section-title .gradient-text {
          background:linear-gradient(135deg, var(--wbi-blue) 0%, var(--wbi-green2) 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .wbi-page .section-sub {
          color:var(--gray-600); font-size:1rem; line-height:1.85;
          max-width:560px; margin-top:1rem; font-weight:300;
        }

        /* ═══════════ SERVICIOS ═══════════ */
        .wbi-page .services-section {
          background:linear-gradient(180deg, var(--white) 0%, var(--off-white) 50%, var(--white) 100%);
          position:relative;
        }
        .wbi-page .services-grid {
          display:grid; grid-template-columns:repeat(3, 1fr); gap:1.5rem; margin-top:3rem;
        }
        @media(max-width:960px){ .wbi-page .services-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px){ .wbi-page .services-grid { grid-template-columns:1fr; } }

        .wbi-page .service-card {
          padding:2.25rem 2rem; background:var(--white);
          border-radius:20px; transition:all .4s; cursor:default;
          position:relative; overflow:hidden;
          border:1px solid transparent;
          box-shadow:0 2px 20px rgba(0,0,0,0.04);
        }
        .wbi-page .service-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:4px;
        }
        .wbi-page .service-card:hover {
          transform:translateY(-8px);
          box-shadow:0 20px 60px rgba(0,0,0,0.08);
        }
        /* Color variants */
        .wbi-page .svc-card-cyan::before { background:linear-gradient(90deg, var(--wbi-blue), var(--wbi-cyan)); }
        .wbi-page .svc-card-cyan:hover { border-color:rgba(0,170,255,0.2); box-shadow:0 20px 60px rgba(0,152,218,0.12); }
        .wbi-page .svc-card-blue::before { background:linear-gradient(90deg, #1a365d, var(--wbi-blue)); }
        .wbi-page .svc-card-blue:hover { border-color:rgba(0,152,218,0.2); box-shadow:0 20px 60px rgba(0,152,218,0.1); }
        .wbi-page .svc-card-orange::before { background:linear-gradient(90deg, var(--wbi-orange), var(--wbi-yellow)); }
        .wbi-page .svc-card-orange:hover { border-color:rgba(245,134,52,0.2); box-shadow:0 20px 60px rgba(245,134,52,0.1); }
        .wbi-page .svc-card-green::before { background:linear-gradient(90deg, var(--wbi-green), var(--wbi-green2)); }
        .wbi-page .svc-card-green:hover { border-color:rgba(23,217,134,0.2); box-shadow:0 20px 60px rgba(23,217,134,0.1); }

        /* Astronaut helmet icons */
        .wbi-page .astro-icon {
          width:56px; height:56px; border-radius:16px; display:flex;
          align-items:center; justify-content:center; margin-bottom:1.5rem;
        }
        .wbi-page .astro-icon .helmet {
          width:28px; height:26px; background:#fff; border-radius:50%;
          position:relative; border:2.5px solid rgba(255,255,255,0.8);
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
        }
        .wbi-page .astro-icon .visor {
          position:absolute; top:6px; left:5px; right:5px; bottom:7px;
          border-radius:50%;
          border:1px solid rgba(255,255,255,0.4);
        }
        .wbi-page .astro-icon .visor::after {
          content:''; position:absolute; top:2px; left:3px;
          width:5px; height:3px; background:rgba(255,255,255,0.7);
          border-radius:50%; transform:rotate(-20deg);
        }
        .wbi-page .astro-cyan {
          background:linear-gradient(135deg, var(--wbi-blue), var(--wbi-cyan));
        }
        .wbi-page .astro-cyan .visor { background:linear-gradient(135deg, rgba(0,60,100,0.7), rgba(0,120,180,0.4)); }
        .wbi-page .astro-blue {
          background:linear-gradient(135deg, #1a365d, var(--wbi-blue));
        }
        .wbi-page .astro-blue .visor { background:linear-gradient(135deg, rgba(0,40,80,0.7), rgba(0,80,140,0.4)); }
        .wbi-page .astro-orange {
          background:linear-gradient(135deg, var(--wbi-orange), var(--wbi-yellow));
        }
        .wbi-page .astro-orange .visor { background:linear-gradient(135deg, rgba(120,50,0,0.6), rgba(180,80,0,0.3)); }
        .wbi-page .astro-green {
          background:linear-gradient(135deg, var(--wbi-green), var(--wbi-green2));
        }
        .wbi-page .astro-green .visor { background:linear-gradient(135deg, rgba(0,60,30,0.7), rgba(0,100,50,0.4)); }

        .wbi-page .svc-title {
          font-size:1.05rem; font-weight:700;
          margin-bottom:0.75rem; color:var(--gray-800);
        }
        .wbi-page .svc-title .accent { font-weight:800; }
        .wbi-page .accent-cyan { color:var(--wbi-blue); }
        .wbi-page .accent-blue { color:#1a365d; }
        .wbi-page .accent-orange { color:var(--wbi-orange); }
        .wbi-page .accent-green { color:var(--wbi-green); }
        .wbi-page .svc-desc { font-size:0.88rem; color:var(--gray-600); line-height:1.75; font-weight:300; }

        /* ═══════════ PROPUESTA DE VALOR ═══════════ */
        .wbi-page .value-section {
          background:linear-gradient(135deg,
            rgba(0,152,218,0.03) 0%,
            rgba(23,217,134,0.03) 50%,
            rgba(245,134,52,0.03) 100%
          );
        }
        .wbi-page .value-grid {
          display:grid; grid-template-columns:repeat(3, 1fr); gap:1.5rem; margin-top:3rem;
        }
        @media(max-width:768px){ .wbi-page .value-grid { grid-template-columns:1fr; } }
        .wbi-page .value-card {
          padding:2.5rem 2rem; border-radius:24px; text-align:center;
          color:#fff; position:relative; overflow:hidden;
          transition:all .35s;
        }
        .wbi-page .value-card:hover { transform:translateY(-6px) scale(1.02); }
        .wbi-page .value-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events:none;
        }
        .wbi-page .val-blue {
          background:linear-gradient(135deg, var(--wbi-blue) 0%, var(--wbi-blue2) 100%);
          box-shadow:0 8px 30px rgba(0,152,218,0.3);
        }
        .wbi-page .val-green {
          background:linear-gradient(135deg, var(--wbi-green) 0%, var(--wbi-green2) 100%);
          box-shadow:0 8px 30px rgba(12,115,71,0.3);
        }
        .wbi-page .val-orange {
          background:linear-gradient(135deg, var(--wbi-orange2) 0%, var(--wbi-orange) 50%, var(--wbi-yellow) 100%);
          box-shadow:0 8px 30px rgba(245,134,52,0.3);
        }
        .wbi-page .value-card .val-icon {
          width:56px; height:56px; border-radius:50%; background:rgba(255,255,255,0.2);
          display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;
          font-size:1.5rem; backdrop-filter:blur(10px);
        }
        .wbi-page .value-card h3 {
          font-size:1.15rem; font-weight:700;
          margin-bottom:0.75rem; position:relative;
        }
        .wbi-page .value-card p {
          font-size:0.88rem; line-height:1.75; font-weight:300;
          color:rgba(255,255,255,0.92); position:relative;
        }

        /* ═══════════ SOBRE NOSOTROS ═══════════ */
        .wbi-page .about-section { background:var(--white); }
        .wbi-page .about-logo { height:44px; width:auto; margin-bottom:1.5rem; }
        .wbi-page .about-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; margin-top:3rem;
        }
        @media(max-width:768px){ .wbi-page .about-grid { grid-template-columns:1fr; gap:2.5rem; } }
        .wbi-page .about-text p {
          color:var(--gray-600); font-size:0.95rem; line-height:1.85;
          margin-bottom:1rem; font-weight:300;
        }
        .wbi-page .about-text p strong { color:var(--gray-800); font-weight:600; }
        .wbi-page .about-text .manager-tag {
          display:inline-flex; align-items:center; gap:10px;
          padding:12px 18px;
          background:linear-gradient(135deg, rgba(0,152,218,0.06), rgba(23,217,134,0.06));
          border:1px solid rgba(0,152,218,0.1);
          border-radius:14px; margin-top:0.75rem;
        }
        .wbi-page .manager-dot {
          width:10px; height:10px; border-radius:50%;
          background:linear-gradient(135deg, var(--wbi-green), var(--wbi-green2));
          box-shadow:0 0 8px rgba(23,217,134,0.4);
        }
        .wbi-page .manager-name { font-size:0.88rem; font-weight:600; color:var(--gray-800); }
        .wbi-page .manager-role { font-size:0.75rem; color:var(--gray-600); }
        .wbi-page .stat-cards { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .wbi-page .stat-card {
          padding:1.75rem; background:var(--white);
          border:1px solid var(--gray-100); border-radius:18px;
          text-align:center; transition:all .35s;
          box-shadow:0 2px 15px rgba(0,0,0,0.03);
        }
        .wbi-page .stat-card:hover {
          transform:translateY(-4px);
          box-shadow:0 10px 30px rgba(0,152,218,0.1);
          border-color:rgba(0,152,218,0.2);
        }
        .wbi-page .stat-card-num {
          font-size:2.6rem; font-weight:800; line-height:1;
          background:linear-gradient(135deg, var(--wbi-blue), var(--wbi-green2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .wbi-page .stat-card-lbl {
          font-size:0.72rem; color:var(--gray-600); text-transform:uppercase;
          letter-spacing:1.5px; margin-top:6px; font-weight:500;
        }
        .wbi-page .presence { display:flex; flex-wrap:wrap; gap:0.6rem; margin-top:1.5rem; }
        .wbi-page .presence-pill {
          padding:7px 16px; border:1px solid var(--gray-100); border-radius:999px;
          font-size:0.8rem; color:var(--gray-600); background:var(--white);
          transition:all .25s; box-shadow:0 1px 5px rgba(0,0,0,0.03);
        }
        .wbi-page .presence-pill:hover {
          border-color:var(--wbi-blue); color:var(--wbi-blue);
          box-shadow:0 3px 12px rgba(0,152,218,0.1);
        }

        /* ═══════════ CTA ═══════════ */
        .wbi-page .cta-section {
          text-align:center; padding:120px 2rem;
          background:linear-gradient(180deg, var(--off-white) 0%, var(--white) 100%);
          position:relative; overflow:hidden;
        }
        .wbi-page .cta-section::before {
          content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:800px; height:800px; border-radius:50%;
          background:radial-gradient(ellipse,
            rgba(0,152,218,0.04) 0%,
            rgba(23,217,134,0.03) 30%,
            transparent 60%
          );
          pointer-events:none;
        }
        .wbi-page .cta-section h2 {
          font-size:clamp(1.8rem,4vw,3rem);
          font-weight:800; position:relative; color:var(--gray-800);
        }
        .wbi-page .cta-section h2 .gradient-text {
          background:linear-gradient(135deg, var(--wbi-blue), var(--wbi-green2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .wbi-page .cta-body {
          color:var(--gray-600); max-width:520px; margin:1.2rem auto 2.5rem;
          font-size:1rem; line-height:1.85; font-weight:300; position:relative;
        }
        .wbi-page .cta-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; position:relative; }

        /* ═══════════ FOOTER ═══════════ */
        .wbi-page .wbi-footer {
          padding:3.5rem 3rem 2.5rem;
          background:linear-gradient(135deg, #F0F9FF 0%, #F0FFF4 50%, #FFFBEB 100%);
          border-top:2px solid;
          border-image:linear-gradient(90deg, var(--wbi-blue), var(--wbi-green2), var(--wbi-orange)) 1;
          position:relative;
        }
        .wbi-page .footer-inner {
          max-width:1140px; margin:0 auto;
          display:grid; grid-template-columns:1.2fr 1fr 0.8fr; gap:2rem; align-items:start;
        }
        @media(max-width:768px){
          .wbi-page .footer-inner { grid-template-columns:1fr; text-align:center; }
        }
        .wbi-page .footer-logo { margin-bottom:0.75rem; }
        .wbi-page .footer-logo img { height:36px; width:auto; }
        .wbi-page .footer-tagline {
          font-size:0.85rem; color:var(--gray-600); font-style:italic;
          line-height:1.6; max-width:300px;
        }
        @media(max-width:768px){ .wbi-page .footer-tagline { max-width:100%; } }
        .wbi-page .footer-flags {
          display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap; font-size:1.3rem;
        }
        @media(max-width:768px){ .wbi-page .footer-flags { justify-content:center; } }
        .wbi-page .footer-flag {
          width:36px; height:36px; display:flex; align-items:center; justify-content:center;
          background:var(--white); border-radius:10px; font-size:1.15rem;
          box-shadow:0 1px 5px rgba(0,0,0,0.06); transition:transform .2s;
        }
        .wbi-page .footer-flag:hover { transform:scale(1.15); }
        .wbi-page .footer-contact-title {
          font-size:0.78rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; margin-bottom:0.75rem;
          background:linear-gradient(135deg, var(--wbi-blue), var(--wbi-green2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; display:inline-block;
        }
        .wbi-page .footer-contact a {
          display:block; color:var(--gray-600); text-decoration:none;
          font-size:0.88rem; margin-bottom:0.5rem; transition:color .2s; font-weight:400;
        }
        .wbi-page .footer-contact a:hover { color:var(--wbi-blue); }
        .wbi-page .footer-legal {
          text-align:right; font-size:0.75rem; color:var(--gray-600);
          line-height:1.7; opacity:0.7;
        }
        @media(max-width:768px){ .wbi-page .footer-legal { text-align:center; } }
        .wbi-page .footer-bottom {
          max-width:1140px; margin:2rem auto 0; padding-top:1.5rem;
          border-top:1px solid rgba(0,152,218,0.1);
          text-align:center; font-size:0.78rem; color:var(--gray-600);
          font-weight:300;
        }

        /* ═══════════ DIVIDER ═══════════ */
        .wbi-page .divider-gradient {
          height:2px; margin:0;
          background:linear-gradient(90deg, transparent, var(--wbi-blue), var(--wbi-green2), var(--wbi-orange), transparent);
          opacity:0.3;
        }

        /* ═══════════ SCROLL ANIMATION ═══════════ */
        .wbi-page .fade-up { opacity:0; transform:translateY(30px); transition:opacity .8s ease, transform .8s ease; }
        .wbi-page .fade-up.visible { opacity:1; transform:none; }

        /* ═══════════ RESPONSIVE ═══════════ */
        @media(max-width:768px){
          .wbi-page .wbi-nav { padding:0 1.5rem; height:64px; }
          .wbi-page .nav-logo img { height:32px; }
          .wbi-page .nav-links { display:none; }
          .wbi-page .hero-stats { gap:1rem; }
          .wbi-page .hero-stat { padding:0 1rem; }
          .wbi-page .wbi-footer { padding:2.5rem 1.5rem 2rem; }
          .wbi-page section { padding:80px 1.5rem; }
        }
      `}} />

      <div className="wbi-page">
        {/* NAVBAR */}
        <nav className="wbi-nav">
          <div className="nav-logo">
            <img src="/wbi-logo-black.png" alt="WE BUILD IT" />
          </div>
          <div className="nav-links">
            <a href="#servicios" className="nav-link">Servicios</a>
            <a href="#nosotros" className="nav-link">Nosotros</a>
            <a href="mailto:squiroz@wbinnova.com" className="nav-cta">Contáctanos</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-orb orb-blue"></div>
          <div className="hero-orb orb-green"></div>
          <div className="hero-orb orb-orange"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
          <div className="hero-content fade-up">
            <img src="/wbi-logo-black.png" alt="WE BUILD IT" className="hero-logo" />
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span className="badge-text">MARKETING SERVICES</span>
            </div>
            <h1>The life of a brand<br />must be found in<br /><span className="gradient-text">all spaces.</span></h1>
            <p className="hero-sub">
              {"Conectamos marcas con su audiencia ideal a través de estrategia digital, diseño de experiencia y tecnología de automatización. Si lo puedes imaginar, WE can BUILD IT."}
            </p>
            <div className="hero-actions">
              <a href="mailto:squiroz@wbinnova.com" className="btn-gradient">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Escríbenos
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-soft">webuildit.tech →</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">7+</div>
                <div className="hero-stat-lbl">Países</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">6+</div>
                <div className="hero-stat-lbl">Años</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">20+</div>
                <div className="hero-stat-lbl">Proyectos</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-lbl">Código entregado</div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-gradient"></div>

        {/* SERVICIOS */}
        <section className="services-section" id="servicios">
          <div className="container">
            <div className="fade-up">
              <div className="section-tag">Marketing Services</div>
              <h2 className="section-title">Soluciones que <span className="gradient-text">posicionan</span><br />y hacen crecer tu marca.</h2>
              <p className="section-sub">{"Cada servicio está diseñado para impulsar tu presencia digital de forma estratégica, medible y con resultados reales."}</p>
            </div>
            <div className="services-grid">

              <div className="service-card svc-card-cyan fade-up">
                <div className="astro-icon astro-cyan">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent accent-cyan">BRAND</span> Solutions</div>
                <p className="svc-desc">{"Conecta, Destaca y Perdura. Identidad digital, voz de marca, impacto visual. Construimos marcas que resuenan con su audiencia y generan confianza desde el primer contacto."}</p>
              </div>

              <div className="service-card svc-card-blue fade-up">
                <div className="astro-icon astro-blue">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent accent-blue">UX/UI</span> Design Solutions</div>
                <p className="svc-desc">{"Reunión inicial, research, prototipos, entrega de diseños finales. Tratamos el diseño como estrategia core para maximizar el ROI de tu inversión digital."}</p>
              </div>

              <div className="service-card svc-card-orange fade-up">
                <div className="astro-icon astro-orange">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent accent-orange">WEB</span> Solutions</div>
                <p className="svc-desc">{"Genera confianza e impulsa el crecimiento. Sitios web optimizados para rendimiento, experiencia de usuario y conversión que trabajan 24/7 para tu negocio."}</p>
              </div>

              <div className="service-card svc-card-cyan fade-up">
                <div className="astro-icon astro-cyan">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent accent-cyan">CONTENT</span> Solutions</div>
                <p className="svc-desc">{"Comunica tu valor. Blogs, páginas web, contenido publicitario. Creamos narrativas que conectan con tu audiencia y fortalecen tu posicionamiento de marca."}</p>
              </div>

              <div className="service-card svc-card-green fade-up">
                <div className="astro-icon astro-green">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent accent-green">SEO/SEM</span> Solutions</div>
                <p className="svc-desc">{"Posiciónate de forma orgánica, sostenible y estratégica. Auditoría técnica, keyword research, campañas SEM y optimización continua para dominar los resultados de búsqueda."}</p>
              </div>

              <div className="service-card svc-card-orange fade-up">
                <div className="astro-icon astro-orange">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent accent-orange">MKT</span> Automation</div>
                <p className="svc-desc">{"Eficiencia, innovación y crecimiento con IA. Automatizamos flujos de marketing, email nurturing, lead scoring y reportería para escalar sin multiplicar esfuerzo."}</p>
              </div>

            </div>
          </div>
        </section>

        {/* PROPUESTA DE VALOR */}
        <section className="value-section">
          <div className="container">
            <div className="fade-up" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div className="section-tag">Nuestro proceso</div>
              <h2 className="section-title">Así <span className="gradient-text">trabajamos</span> contigo.</h2>
              <p className="section-sub" style={{ margin: '1rem auto 0' }}>{"Un flujo ágil, transparente y orientado a resultados. Sin sorpresas, con entregas constantes."}</p>
            </div>
            <div className="value-grid fade-up">
              <div className="value-card val-blue">
                <div className="val-icon">{"📋"}</div>
                <h3>Reuniones Semanales</h3>
                <p>{"Status meetings, revisión de mockups, retroalimentación ágil. Comunicación constante para mantener el proyecto en la dirección correcta."}</p>
              </div>
              <div className="value-card val-green">
                <div className="val-icon">{"✅"}</div>
                <h3>Propuestas</h3>
                <p>{"Vistas aprobadas, flujo semanal de avances. Cada propuesta pasa por tu revisión antes de continuar — sin sorpresas, sin retrabajos."}</p>
              </div>
              <div className="value-card val-orange">
                <div className="val-icon">{"📦"}</div>
                <h3>Entregables</h3>
                <p>{"Mockups finales, assets listos para producción, documentación completa. Todo lo que necesitas para lanzar, en tiempo y forma."}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-gradient"></div>

        {/* SOBRE NOSOTROS */}
        <section className="about-section" id="nosotros">
          <div className="container fade-up">
            <img src="/wbi-logo-black.png" alt="WE BUILD IT" className="about-logo" />
            <div className="section-tag">{"¿Quiénes somos?"}</div>
            <h2 className="section-title">{"¿Por qué "}<span className="gradient-text">WE BUILD IT?</span></h2>
            <div className="about-grid">
              <div className="about-text">
                <p>En <strong>WE BUILD IT</strong> somos el socio tecnológico y de marketing que tu empresa necesita. Nacimos como un grupo de especialistas en tecnología, diseño y estrategia digital, con la misión de transformar ideas de negocio en soluciones digitales que funcionan: escalables, bien construidas y con resultados medibles.</p>
                <p>Nuestra operación latinoamericana está liderada desde <strong>WBInnova México (Mérida, Yucatán)</strong>, bajo la dirección de <strong>Samuel Quiroz Herrera</strong>, quien encabeza un equipo multidisciplinario de ingenieros, consultores, diseñadores UX/UI y especialistas en marketing digital.</p>
                <div className="manager-tag">
                  <span className="manager-dot"></span>
                  <div>
                    <div className="manager-name">Samuel Quiroz Herrera</div>
                    <div className="manager-role">Country Manager — WBI México</div>
                  </div>
                </div>
                <div className="presence">
                  <span className="presence-pill">{"🇺🇸 Miami"}</span>
                  <span className="presence-pill">{"🇲🇽 Mérida"}</span>
                  <span className="presence-pill">{"🇨🇴 Bogotá"}</span>
                  <span className="presence-pill">{"🇪🇸 Madrid"}</span>
                  <span className="presence-pill">{"🇻🇪 Venezuela"}</span>
                  <span className="presence-pill">{"🇵🇦 Panamá"}</span>
                  <span className="presence-pill">{"🇵🇪 Perú"}</span>
                </div>
              </div>
              <div className="stat-cards">
                <div className="stat-card"><div className="stat-card-num">7+</div><div className="stat-card-lbl">Países activos</div></div>
                <div className="stat-card"><div className="stat-card-num">6+</div><div className="stat-card-lbl">Años de exp.</div></div>
                <div className="stat-card"><div className="stat-card-num">20+</div><div className="stat-card-lbl">Proyectos</div></div>
                <div className="stat-card"><div className="stat-card-num">100%</div><div className="stat-card-lbl">Código entregado</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="cta-section">
          <div className="container fade-up">
            <div className="section-tag">{"¿Listo para construir?"}</div>
            <h2>{"¿Listo para construir algo "}<span className="gradient-text">extraordinario?</span></h2>
            <p className="cta-body">{"Si tienes una idea, un reto de marca o simplemente quieres saber qué podemos hacer por ti, escríbenos. Respondemos rápido y sin compromisos."}</p>
            <div className="cta-actions">
              <a href="mailto:squiroz@wbinnova.com" className="btn-gradient">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                squiroz@wbinnova.com
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-soft">webuildit.tech →</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="wbi-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/wbi-logo-black.png" alt="WE BUILD IT" />
              </div>
              <div className="footer-tagline">{"\"El futuro de su negocio empieza con la tecnología correcta\""}</div>
              <div className="footer-flags">
                <span className="footer-flag">{"🇺🇸"}</span>
                <span className="footer-flag">{"🇲🇽"}</span>
                <span className="footer-flag">{"🇨🇴"}</span>
                <span className="footer-flag">{"🇪🇸"}</span>
                <span className="footer-flag">{"🇻🇪"}</span>
                <span className="footer-flag">{"🇵🇦"}</span>
                <span className="footer-flag">{"🇵🇪"}</span>
              </div>
            </div>
            <div className="footer-contact">
              <div className="footer-contact-title">Contacto</div>
              <a href="mailto:squiroz@wbinnova.com">squiroz@wbinnova.com</a>
              <a href="mailto:info@webuildit.tech">info@webuildit.tech</a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer">webuildit.tech</a>
            </div>
            <div className="footer-legal">
              {"© 2026 WBInnova México SA de CV"}<br />
              {"RFC: WME231122U13"}<br />
              {"Mérida, Yucatán, México"}
            </div>
          </div>
          <div className="footer-bottom">
            {"Designed with ♥ by WBI · The life of a brand must be found in all spaces."}
          </div>
        </footer>

        <ScrollAnimator />
      </div>
    </>
  )
}
