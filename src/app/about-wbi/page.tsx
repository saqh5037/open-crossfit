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
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --bg-light:    #FFFFFF;
          --bg-alt:      #F1F5F9;
          --bg-soft:     #F8FAFC;
          --bg-dark:     #0B0F1A;
          --bg-dark2:    #111827;
          --card-white:  #FFFFFF;
          --border-light:#E2E8F0;
          --border-dark: #1E2A45;
          --text-dark:   #0F172A;
          --text-body:   #334155;
          --text-muted:  #64748B;
          --text-white:  #F0F4FF;
          --blue:        #1565C0;
          --cyan:        #00AAFF;
          --green:       #22C55E;
          --orange:      #F5A050;
          --orange-vivid:#F97316;
          --dark-blue:   #1A1A2E;
        }

        .wbi-page * { margin:0; padding:0; box-sizing:border-box; }
        .wbi-page { background:var(--bg-light); color:var(--text-dark); font-family:'Inter',sans-serif; overflow-x:hidden; }

        /* ═══════════ NAVBAR (dark) ═══════════ */
        .wbi-page .wbi-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 3rem; height:68px;
          background:rgba(11,15,26,0.95); backdrop-filter:blur(16px);
          border-bottom:1px solid rgba(255,255,255,0.06);
        }
        .wbi-page .nav-logo { display:flex; align-items:center; }
        .wbi-page .nav-logo img { height:36px; width:auto; }
        .wbi-page .nav-links { display:flex; gap:2rem; align-items:center; }
        .wbi-page .nav-link { color:rgba(255,255,255,0.6); font-size:0.82rem; font-weight:500; text-decoration:none; letter-spacing:0.5px; transition:color .2s; }
        .wbi-page .nav-link:hover { color:#fff; }
        .wbi-page .nav-cta {
          padding:10px 24px; background:var(--cyan); color:#000;
          border-radius:8px; font-weight:600; font-size:0.82rem; letter-spacing:0.5px;
          text-decoration:none; transition:all .25s;
        }
        .wbi-page .nav-cta:hover { background:#33bbff; transform:translateY(-1px); }

        /* ═══════════ HERO (dark, impactante) ═══════════ */
        .wbi-page .hero {
          min-height:100vh; display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden; padding:120px 2rem 80px;
          background:var(--bg-dark);
        }
        .wbi-page .hero::before {
          content:''; position:absolute; inset:0;
          background:
            linear-gradient(135deg, rgba(0,170,255,0.08) 0%, transparent 50%),
            linear-gradient(225deg, rgba(34,197,94,0.06) 0%, transparent 50%),
            linear-gradient(315deg, rgba(245,160,80,0.05) 0%, transparent 50%);
        }
        .wbi-page .hero-grid {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size:80px 80px;
        }
        .wbi-page .hero-glow {
          position:absolute; top:-30%; left:50%; transform:translateX(-50%);
          width:900px; height:700px; border-radius:50%;
          background:radial-gradient(ellipse, rgba(0,170,255,0.12) 0%, transparent 65%);
          pointer-events:none;
        }
        .wbi-page .hero-content { position:relative; text-align:center; max-width:860px; }
        .wbi-page .hero-badge {
          display:inline-flex; align-items:center; gap:10px;
          padding:8px 20px; background:rgba(0,170,255,0.08);
          border:1px solid rgba(0,170,255,0.2); border-radius:999px;
          font-size:0.72rem; letter-spacing:3px; color:var(--cyan); margin-bottom:2rem;
          font-weight:600; text-transform:uppercase;
        }
        .wbi-page .hero-badge-dot { width:6px; height:6px; border-radius:50%; background:var(--cyan); animation:wbi-pulse 2s infinite; }
        @keyframes wbi-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

        .wbi-page .hero h1 {
          font-family:'Rajdhani',sans-serif; font-size:clamp(2.6rem,6.5vw,4.5rem);
          font-weight:700; line-height:1.08; margin-bottom:1.5rem; color:var(--text-white);
        }
        .wbi-page .hero h1 em { font-style:normal; color:var(--cyan); }
        .wbi-page .hero-tagline {
          font-size:1rem; color:rgba(255,255,255,0.5); letter-spacing:4px;
          text-transform:uppercase; font-weight:500; margin-bottom:2rem;
        }
        .wbi-page .hero-sub {
          font-size:1.1rem; color:rgba(255,255,255,0.65); line-height:1.8;
          max-width:620px; margin:0 auto 2.5rem; font-weight:300;
        }
        .wbi-page .hero-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
        .wbi-page .btn-primary {
          padding:14px 36px; background:var(--cyan); color:#000;
          border-radius:10px; font-weight:700; font-size:0.9rem; letter-spacing:0.5px;
          text-decoration:none; transition:all .25s; display:inline-flex; align-items:center; gap:10px;
          box-shadow:0 4px 20px rgba(0,170,255,0.25);
        }
        .wbi-page .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,170,255,0.35); }
        .wbi-page .btn-outline {
          padding:14px 36px; border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.7);
          border-radius:10px; font-weight:500; font-size:0.9rem; text-decoration:none;
          transition:all .25s;
        }
        .wbi-page .btn-outline:hover { border-color:var(--cyan); color:var(--cyan); }

        .wbi-page .hero-stats {
          display:flex; gap:3rem; justify-content:center; margin-top:4rem;
          padding-top:2.5rem; border-top:1px solid rgba(255,255,255,0.08);
        }
        .wbi-page .hero-stat-num { font-family:'Rajdhani',sans-serif; font-size:2.2rem; font-weight:700; color:#fff; }
        .wbi-page .hero-stat-num span { color:var(--cyan); }
        .wbi-page .hero-stat-lbl { font-size:0.72rem; color:rgba(255,255,255,0.4); letter-spacing:1.5px; text-transform:uppercase; margin-top:4px; }

        /* ═══════════ ASTRONAUT ICON ═══════════ */
        .wbi-page .astro-icon {
          width:56px; height:56px; border-radius:50%; display:flex;
          align-items:center; justify-content:center; margin-bottom:1.5rem;
          position:relative;
        }
        .wbi-page .astro-icon .helmet {
          width:30px; height:28px; background:#fff; border-radius:50%;
          position:relative; border:2px solid rgba(0,0,0,0.1);
        }
        .wbi-page .astro-icon .visor {
          position:absolute; top:7px; left:5px; right:5px; bottom:8px;
          background:linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
          border-radius:50%; border:1px solid rgba(255,255,255,0.3);
        }
        .wbi-page .astro-icon .visor::after {
          content:''; position:absolute; top:3px; left:3px;
          width:6px; height:4px; background:rgba(255,255,255,0.5);
          border-radius:50%; transform:rotate(-20deg);
        }
        .wbi-page .astro-cyan   { background:rgba(0,170,255,0.12); border:2px solid rgba(0,170,255,0.2); }
        .wbi-page .astro-blue   { background:rgba(21,101,192,0.12); border:2px solid rgba(21,101,192,0.2); }
        .wbi-page .astro-orange { background:rgba(245,160,80,0.12); border:2px solid rgba(245,160,80,0.2); }
        .wbi-page .astro-green  { background:rgba(34,197,94,0.12); border:2px solid rgba(34,197,94,0.2); }

        /* ═══════════ SECTIONS COMMON ═══════════ */
        .wbi-page section { padding:100px 2rem; }
        .wbi-page .container { max-width:1120px; margin:0 auto; }
        .wbi-page .section-tag {
          font-size:0.72rem; letter-spacing:4px; color:var(--cyan); font-weight:600;
          text-transform:uppercase; margin-bottom:0.75rem;
        }
        .wbi-page .section-title {
          font-family:'Rajdhani',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem);
          font-weight:700; line-height:1.15; color:var(--text-dark);
        }
        .wbi-page .section-title em { font-style:normal; color:var(--cyan); }
        .wbi-page .section-title .green { color:var(--green); }
        .wbi-page .section-title .orange { color:var(--orange); }
        .wbi-page .section-sub { color:var(--text-body); font-size:1rem; line-height:1.8; max-width:560px; margin-top:1rem; font-weight:300; }

        /* ═══════════ SOBRE NOSOTROS (light bg) ═══════════ */
        .wbi-page .about-section { background:var(--bg-light); }
        .wbi-page .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; margin-top:3.5rem; }
        @media(max-width:768px){ .wbi-page .about-grid { grid-template-columns:1fr; gap:2.5rem; } }
        .wbi-page .about-text p { color:var(--text-body); font-size:0.95rem; line-height:1.85; margin-bottom:1rem; font-weight:300; }
        .wbi-page .about-text p strong { color:var(--text-dark); font-weight:600; }
        .wbi-page .about-text .manager-tag {
          display:inline-flex; align-items:center; gap:10px;
          padding:10px 16px; background:var(--bg-alt); border:1px solid var(--border-light);
          border-radius:10px; margin-top:0.75rem;
        }
        .wbi-page .manager-dot { width:8px; height:8px; border-radius:50%; background:var(--green); }
        .wbi-page .manager-name { font-size:0.85rem; font-weight:600; color:var(--text-dark); }
        .wbi-page .manager-role { font-size:0.75rem; color:var(--text-muted); }
        .wbi-page .stat-cards { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .wbi-page .stat-card {
          padding:1.75rem; background:var(--bg-soft); border:1px solid var(--border-light);
          border-radius:14px; text-align:center; transition:all .3s;
        }
        .wbi-page .stat-card:hover { border-color:var(--cyan); box-shadow:0 4px 20px rgba(0,170,255,0.08); transform:translateY(-2px); }
        .wbi-page .stat-card-num { font-family:'Rajdhani',sans-serif; font-size:2.4rem; font-weight:700; color:var(--cyan); }
        .wbi-page .stat-card-lbl { font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1.5px; margin-top:4px; }
        .wbi-page .presence { display:flex; flex-wrap:wrap; gap:0.6rem; margin-top:1.5rem; }
        .wbi-page .presence-pill {
          padding:6px 14px; border:1px solid var(--border-light); border-radius:999px;
          font-size:0.78rem; color:var(--text-body); background:var(--bg-soft); transition:all .2s;
        }
        .wbi-page .presence-pill:hover { border-color:var(--cyan); }

        /* ═══════════ SERVICIOS (alt bg) ═══════════ */
        .wbi-page .services-section {
          background:var(--bg-alt); position:relative; overflow:hidden;
        }
        .wbi-page .services-section::before {
          content:''; position:absolute; top:-80px; right:-200px;
          width:600px; height:600px; transform:rotate(45deg);
          background:linear-gradient(135deg, rgba(0,170,255,0.03) 0%, transparent 70%);
          pointer-events:none;
        }
        .wbi-page .services-section::after {
          content:''; position:absolute; bottom:-120px; left:-150px;
          width:500px; height:500px; transform:rotate(25deg);
          background:linear-gradient(135deg, rgba(34,197,94,0.03) 0%, transparent 70%);
          pointer-events:none;
        }
        .wbi-page .services-grid {
          display:grid; grid-template-columns:repeat(3, 1fr); gap:1.5rem; margin-top:3rem;
          position:relative;
        }
        @media(max-width:960px){ .wbi-page .services-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px){ .wbi-page .services-grid { grid-template-columns:1fr; } }

        .wbi-page .service-card {
          padding:2.25rem 2rem; background:var(--card-white);
          border:1px solid var(--border-light);
          border-radius:16px; transition:all .35s; cursor:default;
          position:relative; overflow:hidden;
          box-shadow:0 1px 3px rgba(0,0,0,0.04);
        }
        .wbi-page .service-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:4px;
          border-radius:16px 16px 0 0;
        }
        .wbi-page .svc-cyan::before  { background:linear-gradient(90deg, var(--cyan), #66ccff); }
        .wbi-page .svc-blue::before  { background:linear-gradient(90deg, var(--blue), #2979d6); }
        .wbi-page .svc-orange::before { background:linear-gradient(90deg, var(--orange), #ffbb77); }
        .wbi-page .svc-green::before  { background:linear-gradient(90deg, var(--green), #4ade80); }
        .wbi-page .service-card:hover {
          transform:translateY(-6px);
          box-shadow:0 12px 40px rgba(0,0,0,0.08);
          border-color:transparent;
        }
        .wbi-page .svc-title {
          font-family:'Rajdhani',sans-serif; font-size:1.1rem; font-weight:700;
          margin-bottom:0.75rem; letter-spacing:0.5px; color:var(--text-dark);
        }
        .wbi-page .svc-title .accent-cyan { color:var(--cyan); }
        .wbi-page .svc-title .accent-blue { color:var(--blue); }
        .wbi-page .svc-title .accent-orange { color:var(--orange-vivid); }
        .wbi-page .svc-title .accent-green { color:var(--green); }
        .wbi-page .svc-desc { font-size:0.88rem; color:var(--text-body); line-height:1.75; font-weight:300; }

        /* ═══════════ PROPUESTA DE VALOR ═══════════ */
        .wbi-page .value-section { background:var(--bg-light); }
        .wbi-page .value-grid {
          display:grid; grid-template-columns:repeat(3, 1fr); gap:1.5rem; margin-top:3rem;
        }
        @media(max-width:768px){ .wbi-page .value-grid { grid-template-columns:1fr; } }
        .wbi-page .value-card {
          padding:2.5rem 2rem; border-radius:16px; text-align:center;
          color:#fff; position:relative; overflow:hidden;
          transition:transform .3s;
        }
        .wbi-page .value-card:hover { transform:translateY(-4px); }
        .wbi-page .value-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events:none;
        }
        .wbi-page .val-cyan  { background:linear-gradient(135deg, #0099dd 0%, #00bbff 100%); }
        .wbi-page .val-green { background:linear-gradient(135deg, #1aaa4a 0%, #2dd760 100%); }
        .wbi-page .val-orange { background:linear-gradient(135deg, #e8862e 0%, #ffaa55 100%); }
        .wbi-page .value-card .val-icon {
          width:52px; height:52px; border-radius:50%; background:rgba(255,255,255,0.2);
          display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;
          font-size:1.5rem;
        }
        .wbi-page .value-card h3 {
          font-family:'Rajdhani',sans-serif; font-size:1.2rem; font-weight:700;
          letter-spacing:1px; margin-bottom:0.75rem; position:relative;
        }
        .wbi-page .value-card p {
          font-size:0.88rem; line-height:1.7; font-weight:300;
          color:rgba(255,255,255,0.9); position:relative;
        }

        /* ═══════════ CTA ═══════════ */
        .wbi-page .cta-section {
          text-align:center; padding:120px 2rem;
          background:linear-gradient(180deg, var(--bg-alt) 0%, var(--bg-light) 100%);
          position:relative; overflow:hidden;
        }
        .wbi-page .cta-section::before {
          content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
          width:700px; height:700px; border-radius:50%;
          background:radial-gradient(ellipse, rgba(0,170,255,0.05) 0%, transparent 65%);
          pointer-events:none;
        }
        .wbi-page .cta-section h2 {
          font-family:'Rajdhani',sans-serif; font-size:clamp(1.8rem,4vw,3rem);
          font-weight:700; position:relative; color:var(--text-dark);
        }
        .wbi-page .cta-section h2 em { font-style:normal; color:var(--cyan); }
        .wbi-page .cta-body {
          color:var(--text-body); max-width:520px; margin:1.2rem auto 2.5rem;
          font-size:1rem; line-height:1.8; font-weight:300; position:relative;
        }
        .wbi-page .cta-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; position:relative; }
        .wbi-page .btn-primary-dark {
          padding:14px 36px; background:var(--bg-dark); color:#fff;
          border-radius:10px; font-weight:700; font-size:0.9rem; letter-spacing:0.5px;
          text-decoration:none; transition:all .25s; display:inline-flex; align-items:center; gap:10px;
          box-shadow:0 4px 20px rgba(0,0,0,0.15);
        }
        .wbi-page .btn-primary-dark:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(0,0,0,0.2); }
        .wbi-page .btn-outline-dark {
          padding:14px 36px; border:1px solid var(--border-light); color:var(--text-body);
          border-radius:10px; font-weight:500; font-size:0.9rem; text-decoration:none;
          transition:all .25s;
        }
        .wbi-page .btn-outline-dark:hover { border-color:var(--cyan); color:var(--cyan); }

        /* ═══════════ LOGO IMG UTILITIES ═══════════ */
        .wbi-page .hero-logo { height:48px; width:auto; margin-bottom:2rem; opacity:0.85; }
        .wbi-page .about-logo { height:36px; width:auto; margin-bottom:1.5rem; opacity:0.9; }
        .wbi-page .cta-logo { height:40px; width:auto; margin-bottom:1.5rem; opacity:0.9; }

        /* ═══════════ ASTRONAUT HERO DECORATION ═══════════ */
        .wbi-page .hero-astronaut {
          position:absolute; bottom:8%; right:8%;
          font-size:4rem; opacity:0.12; pointer-events:none;
          animation:wbi-float 6s ease-in-out infinite;
        }
        @keyframes wbi-float {
          0%,100%{ transform:translateY(0) rotate(0deg); }
          50%{ transform:translateY(-20px) rotate(5deg); }
        }

        /* ═══════════ DIVIDER ═══════════ */
        .wbi-page .divider-light { height:1px; background:var(--border-light); margin:0; }

        /* ═══════════ FOOTER (dark) ═══════════ */
        .wbi-page .wbi-footer {
          padding:3rem; background:var(--bg-dark);
          border-top:1px solid rgba(255,255,255,0.06);
          position:relative; overflow:hidden;
        }
        .wbi-page .footer-inner {
          max-width:1120px; margin:0 auto;
          display:grid; grid-template-columns:1fr 1fr 1fr; gap:2rem; align-items:start;
        }
        @media(max-width:768px){ .wbi-page .footer-inner { grid-template-columns:1fr; text-align:center; } }
        .wbi-page .footer-brand {}
        .wbi-page .footer-logo { margin-bottom:0.75rem; }
        .wbi-page .footer-logo img { height:32px; width:auto; }
        .wbi-page .footer-tagline {
          font-size:0.82rem; color:rgba(255,255,255,0.4); font-style:italic;
          line-height:1.6; max-width:280px;
        }
        .wbi-page .footer-flags {
          display:flex; gap:0.5rem; margin-top:1rem; flex-wrap:wrap; font-size:1.2rem;
        }
        @media(max-width:768px){ .wbi-page .footer-flags { justify-content:center; } }
        .wbi-page .footer-contact {}
        .wbi-page .footer-contact-title {
          font-family:'Rajdhani',sans-serif; font-size:0.85rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.5);
          margin-bottom:0.75rem;
        }
        .wbi-page .footer-contact a {
          display:block; color:rgba(255,255,255,0.7); text-decoration:none;
          font-size:0.88rem; margin-bottom:0.4rem; transition:color .2s;
        }
        .wbi-page .footer-contact a:hover { color:var(--cyan); }
        .wbi-page .footer-legal {
          text-align:right; font-size:0.75rem; color:rgba(255,255,255,0.3);
          line-height:1.7;
        }
        @media(max-width:768px){ .wbi-page .footer-legal { text-align:center; } }
        .wbi-page .footer-rocket {
          position:absolute; top:1.5rem; right:3rem;
          font-size:1.8rem; opacity:0.15;
          animation:wbi-launch 4s ease-in-out infinite;
        }
        @keyframes wbi-launch {
          0%,100%{ transform:translateY(0) rotate(-45deg); }
          50%{ transform:translateY(-10px) rotate(-45deg); }
        }

        /* ═══════════ SCROLL ANIMATION ═══════════ */
        .wbi-page .fade-up { opacity:0; transform:translateY(28px); transition:opacity .7s ease, transform .7s ease; }
        .wbi-page .fade-up.visible { opacity:1; transform:none; }

        /* ═══════════ RESPONSIVE ═══════════ */
        @media(max-width:768px){
          .wbi-page .wbi-nav { padding:0 1.5rem; }
          .wbi-page .nav-links { display:none; }
          .wbi-page .hero-stats { gap:1.5rem; flex-wrap:wrap; }
          .wbi-page .hero-astronaut { display:none; }
          .wbi-page .wbi-footer { padding:2rem 1.5rem; }
          .wbi-page .footer-rocket { display:none; }
        }
      `}} />

      <div className="wbi-page">
        {/* NAVBAR */}
        <nav className="wbi-nav">
          <div className="nav-logo">
            <img src="/wbi-logo-white.svg" alt="WE BUILD IT" />
          </div>
          <div className="nav-links">
            <a href="#servicios" className="nav-link">Servicios</a>
            <a href="#nosotros" className="nav-link">Nosotros</a>
            <a href="mailto:squiroz@wbinnova.com" className="nav-cta">Contáctanos</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
          <div className="hero-astronaut">{"🧑‍🚀"}</div>
          <div className="hero-content fade-up">
            <img src="/wbi-logo-white.svg" alt="WE BUILD IT" className="hero-logo" />
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              MARKETING SERVICES
            </div>
            <h1>The life of a brand<br />must be found in <em>all spaces.</em></h1>
            <p className="hero-tagline">WE BUILD IT · Marketing · Branding · Digital</p>
            <p className="hero-sub">
              {"Conectamos marcas con su audiencia ideal a través de estrategia digital, diseño de experiencia y tecnología de automatización. Si lo puedes imaginar, WE can BUILD IT."}
            </p>
            <div className="hero-actions">
              <a href="mailto:squiroz@wbinnova.com" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Escríbenos
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-outline">webuildit.tech →</a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">7<span>+</span></div>
                <div className="hero-stat-lbl">Países</div>
              </div>
              <div>
                <div className="hero-stat-num">6<span>+</span></div>
                <div className="hero-stat-lbl">Años</div>
              </div>
              <div>
                <div className="hero-stat-num">20<span>+</span></div>
                <div className="hero-stat-lbl">Proyectos</div>
              </div>
              <div>
                <div className="hero-stat-num">100<span>%</span></div>
                <div className="hero-stat-lbl">Código entregado</div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="services-section" id="servicios">
          <div className="container">
            <div className="fade-up">
              <div className="section-tag">Marketing Services</div>
              <h2 className="section-title">Soluciones que <em>posicionan</em><br />y hacen crecer tu marca.</h2>
              <p className="section-sub">{"Cada servicio está diseñado para impulsar tu presencia digital de forma estratégica, medible y con resultados reales."}</p>
            </div>
            <div className="services-grid">

              {/* 1. BRAND Solutions */}
              <div className="service-card svc-cyan fade-up">
                <div className="astro-icon astro-cyan">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent-cyan">BRAND</span> Solutions</div>
                <p className="svc-desc">{"Conecta, Destaca y Perdura. Identidad digital, voz de marca, impacto visual. Construimos marcas que resuenan con su audiencia y generan confianza desde el primer contacto."}</p>
              </div>

              {/* 2. UX/UI Design Solutions */}
              <div className="service-card svc-blue fade-up">
                <div className="astro-icon astro-blue">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent-blue">UX/UI</span> Design Solutions</div>
                <p className="svc-desc">{"Reunión inicial, research, prototipos, entrega de diseños finales. Tratamos el diseño como estrategia core para maximizar el ROI de tu inversión digital."}</p>
              </div>

              {/* 3. Web Solutions */}
              <div className="service-card svc-orange fade-up">
                <div className="astro-icon astro-orange">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent-orange">WEB</span> Solutions</div>
                <p className="svc-desc">{"Genera confianza e impulsa el crecimiento. Sitios web optimizados para rendimiento, experiencia de usuario y conversión que trabajan 24/7 para tu negocio."}</p>
              </div>

              {/* 4. Content Solutions */}
              <div className="service-card svc-cyan fade-up">
                <div className="astro-icon astro-cyan">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent-cyan">CONTENT</span> Solutions</div>
                <p className="svc-desc">{"Comunica tu valor. Blogs, páginas web, contenido publicitario. Creamos narrativas que conectan con tu audiencia y fortalecen tu posicionamiento de marca."}</p>
              </div>

              {/* 5. SEO/SEM Solutions */}
              <div className="service-card svc-green fade-up">
                <div className="astro-icon astro-green">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent-green">SEO/SEM</span> Solutions</div>
                <p className="svc-desc">{"Posiciónate de forma orgánica, sostenible y estratégica. Auditoría técnica, keyword research, campañas SEM y optimización continua para dominar los resultados de búsqueda."}</p>
              </div>

              {/* 6. MKT Automation */}
              <div className="service-card svc-orange fade-up">
                <div className="astro-icon astro-orange">
                  <div className="helmet"><div className="visor"></div></div>
                </div>
                <div className="svc-title"><span className="accent-orange">MKT</span> Automation</div>
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
              <h2 className="section-title">Así <em>trabajamos</em> contigo.</h2>
              <p className="section-sub" style={{ margin: '1rem auto 0' }}>{"Un flujo ágil, transparente y orientado a resultados. Sin sorpresas, con entregas constantes."}</p>
            </div>
            <div className="value-grid fade-up">

              <div className="value-card val-cyan">
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

        <div className="divider-light"></div>

        {/* SOBRE NOSOTROS */}
        <section className="about-section" id="nosotros">
          <div className="container fade-up">
            <img src="/wbi-logo-black.png" alt="WE BUILD IT" className="about-logo" />
            <div className="section-tag">{"¿Quiénes somos?"}</div>
            <h2 className="section-title">{"¿Por qué "}<em>WE BUILD IT?</em></h2>
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
            <h2>{"¿Listo para construir algo "}<em>extraordinario?</em></h2>
            <p className="cta-body">{"Si tienes una idea, un reto de marca o simplemente quieres saber qué podemos hacer por ti, escríbenos. Respondemos rápido y sin compromisos."}</p>
            <div className="cta-actions">
              <a href="mailto:squiroz@wbinnova.com" className="btn-primary-dark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                squiroz@wbinnova.com
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-outline-dark">webuildit.tech →</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="wbi-footer">
          <div className="footer-rocket">{"🚀"}</div>
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/wbi-logo-white.svg" alt="WE BUILD IT" />
              </div>
              <div className="footer-tagline">{"\"El futuro de su negocio empieza con la tecnología correcta\""}</div>
              <div className="footer-flags">
                <span>{"🇺🇸"}</span>
                <span>{"🇲🇽"}</span>
                <span>{"🇨🇴"}</span>
                <span>{"🇪🇸"}</span>
                <span>{"🇻🇪"}</span>
                <span>{"🇵🇦"}</span>
                <span>{"🇵🇪"}</span>
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
        </footer>

        <ScrollAnimator />
      </div>
    </>
  )
}
