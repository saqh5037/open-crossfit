import type { Metadata } from "next"
import ScrollAnimator from "./scroll-animator"

export const metadata: Metadata = {
  title: "WE BUILD IT · Marketing Services",
  description: "Marketing Services — The life of a brand must be found in all spaces.",
}

export default function AboutWbiPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        :root{--b:#0098DA;--b2:#47B6E6;--g:#0C7347;--g2:#17D986;--o:#F58634;--o2:#BC5000;--y:#FBCE26;--c:#00AAFF;--d:#0f172a;--d2:#1e293b;--g600:#475569;--g400:#94a3b8;--g200:#e2e8f0;--g50:#f8fafc}
        .W *{margin:0;padding:0;box-sizing:border-box}
        .W{background:#fff;color:var(--d);font-family:'Plus Jakarta Sans',system-ui,sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}
        .W .mx{max-width:1140px;margin:0 auto}

        /* NAV */
        .W .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,4vw,3rem);height:72px;background:rgba(255,255,255,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.05)}
        .W .nav img{height:36px}
        .W .nav-r{display:flex;gap:1.75rem;align-items:center}
        .W .nav-r a{color:var(--g600);font-size:.88rem;font-weight:500;text-decoration:none;transition:color .25s}
        .W .nav-r a:hover{color:var(--b)}
        .W .nav-cta{padding:10px 24px;background:var(--b);color:#fff!important;border-radius:8px;font-weight:600;font-size:.85rem;box-shadow:0 2px 12px rgba(0,152,218,.25);transition:all .25s}
        .W .nav-cta:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,152,218,.35)}
        .W .nav-ham{display:none;background:none;border:none;cursor:pointer;padding:8px}
        .W .nav-ham svg{color:var(--d);width:24px;height:24px}

        /* MOBILE NAV */
        .W .mob-menu{display:none;position:fixed;top:72px;left:0;right:0;background:rgba(255,255,255,.98);backdrop-filter:blur(20px);padding:1.5rem 2rem;flex-direction:column;gap:1rem;border-bottom:1px solid var(--g200);z-index:99;animation:slideDown .3s ease}
        .W .mob-menu a{color:var(--g600);font-size:.95rem;font-weight:500;text-decoration:none;padding:.5rem 0}
        .W .mob-menu.open{display:flex}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}

        /* ══════════ HERO ══════════ */
        .W .hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:120px 2rem 80px;text-align:center;
          background:linear-gradient(135deg,#f0f9ff 0%,#ecfdf5 40%,#fffbeb 80%,#fff 100%)}
        .W .hero-mesh{position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse at 50% 30%,rgba(0,152,218,.08) 0%,transparent 50%),
                     radial-gradient(ellipse at 30% 70%,rgba(23,217,134,.06) 0%,transparent 50%),
                     radial-gradient(ellipse at 70% 60%,rgba(245,134,52,.04) 0%,transparent 40%)}
        /* W watermark */
        .W .hero-w{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(700px,90vw);height:auto;opacity:.04;pointer-events:none}
        .W .hero-in{position:relative;max-width:720px;margin:0 auto}

        .W .hero-chip{display:inline-flex;align-items:center;gap:10px;padding:8px 20px;border-radius:8px;font-size:.72rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:2rem;
          background:linear-gradient(135deg,rgba(0,152,218,.1),rgba(23,217,134,.08));color:var(--b)}
        .W .hero-chip::before{content:'';width:18px;height:1px;background:var(--b);display:block}
        .W .hero-chip i{width:7px;height:7px;border-radius:50%;background:var(--b);display:block;animation:p 2s infinite}
        @keyframes p{0%,100%{opacity:1}50%{opacity:.3}}
        .W .hero h1{font-size:clamp(2.8rem,6vw,4.5rem);font-weight:700;line-height:1.08;letter-spacing:-.5px;margin-bottom:1.5rem}
        .W .hero h1 .hl{background:linear-gradient(135deg,var(--b),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .W .hero-p{font-size:1.1rem;color:var(--g600);line-height:1.8;margin-bottom:2.5rem;max-width:540px;margin-left:auto;margin-right:auto}
        .W .hero-btns{display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center}
        .W .btn{padding:14px 32px;border-radius:10px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .4s;display:inline-flex;align-items:center;gap:8px;cursor:pointer}
        .W .btn-b{background:linear-gradient(135deg,var(--b),#0080bb);color:#fff;box-shadow:0 4px 16px rgba(0,152,218,.3)}
        .W .btn-b:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,152,218,.4)}
        .W .btn-w{background:#fff;color:var(--d);border:1.5px solid var(--g200);box-shadow:0 2px 8px rgba(0,0,0,.04)}
        .W .btn-w:hover{border-color:var(--b);color:var(--b);transform:translateY(-2px)}

        /* Hero stats strip */
        .W .hero-stats{display:flex;justify-content:center;gap:2.5rem;margin-top:3rem;flex-wrap:wrap}
        .W .hero-stat{text-align:center}
        .W .hero-stat-num{font-size:1.8rem;font-weight:700;line-height:1}
        .W .hero-stat:nth-child(1) .hero-stat-num{color:var(--b)}
        .W .hero-stat:nth-child(2) .hero-stat-num{color:var(--g)}
        .W .hero-stat:nth-child(3) .hero-stat-num{color:var(--o)}
        .W .hero-stat:nth-child(4) .hero-stat-num{color:var(--c)}
        .W .hero-stat-lbl{font-size:.68rem;color:var(--g400);text-transform:uppercase;letter-spacing:1.5px;font-weight:600;margin-top:4px}
        .W .hero-stat-sep{width:1px;height:36px;background:var(--g200);align-self:center}

        @media(max-width:768px){
          .W .hero{padding:100px 1.5rem 60px}
          .W .hero-stats{gap:1.5rem}
          .W .hero-stat-sep{display:none}
        }

        /* ══════════ COLOR BAND ══════════ */
        .W .band{padding:2.5rem 2rem;background:linear-gradient(135deg,var(--b) 0%,var(--g) 50%,var(--o) 100%);text-align:center;color:#fff;position:relative;overflow:hidden}
        .W .band::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08),transparent 60%);pointer-events:none}
        .W .band-text{font-size:clamp(1rem,2.5vw,1.3rem);font-weight:600;letter-spacing:.5px;position:relative;max-width:800px;margin:0 auto;line-height:1.6}
        .W .band-text span{opacity:.7;font-weight:400}

        /* ══════════ SERVICES ══════════ */
        .W .svc-sec{padding:80px 2rem;background:#fff}
        .W .tag{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--b);margin-bottom:.5rem}
        .W .tag::before{content:'';width:20px;height:1.5px;background:var(--b);display:block}
        .W .ttl{font-size:clamp(1.7rem,3.5vw,2.4rem);font-weight:700;line-height:1.2;margin-bottom:.5rem}
        .W .ttl .hl{background:linear-gradient(135deg,var(--b),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .W .sub{color:var(--g600);font-size:.95rem;line-height:1.75;max-width:520px}
        .W .svc-head{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin-bottom:2.5rem;flex-wrap:wrap}

        .W .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
        @media(max-width:960px){.W .svc-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.W .svc-grid{grid-template-columns:1fr}}
        .W .svc{padding:2rem;border-radius:16px;transition:all .4s;position:relative;overflow:hidden;border:1px solid var(--g200);background:#fff;cursor:pointer}
        .W .svc::after{content:'';position:absolute;top:0;left:0;bottom:0;width:5px;border-radius:16px 0 0 16px;transition:all .4s}
        .W .svc:hover{transform:translateY(-6px);border-color:transparent}
        .W .svc.sc:hover{border-color:rgba(0,152,218,.3);box-shadow:0 16px 48px rgba(0,152,218,.12)}
        .W .svc.sb:hover{border-color:rgba(26,86,168,.3);box-shadow:0 16px 48px rgba(26,86,168,.12)}
        .W .svc.so:hover{border-color:rgba(245,134,52,.3);box-shadow:0 16px 48px rgba(245,134,52,.12)}
        .W .svc.sg:hover{border-color:rgba(12,115,71,.3);box-shadow:0 16px 48px rgba(12,115,71,.12)}
        .W .sc::after{background:linear-gradient(180deg,var(--b),var(--c))}
        .W .sb::after{background:linear-gradient(180deg,#1a56a8,var(--b))}
        .W .so::after{background:linear-gradient(180deg,var(--o),var(--y))}
        .W .sg::after{background:linear-gradient(180deg,var(--g),var(--g2))}
        .W .svc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem}
        .W .svc-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center}
        .W .svc-ico svg{width:28px;height:28px}
        .W .svc-num{font-size:.7rem;font-weight:700;letter-spacing:1px;color:var(--g400);opacity:.5}
        .W .ic{background:linear-gradient(135deg,#dbeafe,#bfdbfe)}.W .ic svg{color:var(--b)}
        .W .ib{background:linear-gradient(135deg,#dbeafe,#c7d2fe)}.W .ib svg{color:#1a56a8}
        .W .io{background:linear-gradient(135deg,#ffedd5,#fed7aa)}.W .io svg{color:var(--o)}
        .W .ig{background:linear-gradient(135deg,#d1fae5,#a7f3d0)}.W .ig svg{color:var(--g)}
        .W .svc h3{font-size:1rem;font-weight:700;margin-bottom:.5rem}
        .W .svc h3 span{font-weight:700}
        .W .svc h3 .hc{color:var(--b)}.W .svc h3 .hb{color:#1a56a8}.W .svc h3 .ho{color:var(--o)}.W .svc h3 .hg{color:var(--g)}
        .W .svc p{font-size:.88rem;color:var(--g600);line-height:1.7}

        /* ══════════ PROCESS ══════════ */
        .W .proc-sec{padding:80px 2rem;background:var(--g50)}
        .W .proc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:2.5rem;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.04)}
        @media(max-width:768px){.W .proc-grid{grid-template-columns:1fr;gap:2px;border-radius:16px}}
        .W .proc{padding:2.5rem 2rem;color:#fff;position:relative;overflow:hidden}
        .W .proc::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.1),transparent 50%);pointer-events:none}
        .W .p1{background:linear-gradient(160deg,#0087c5,var(--b2))}
        .W .p2{background:linear-gradient(160deg,var(--g),#15c978)}
        .W .p3{background:linear-gradient(160deg,var(--o2),var(--o))}
        .W .proc-step{font-size:.65rem;letter-spacing:3px;text-transform:uppercase;opacity:.6;font-weight:700;margin-bottom:1rem}
        .W .proc-icon{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;margin-bottom:1rem;backdrop-filter:blur(4px)}
        .W .proc-icon svg{width:22px;height:22px;color:#fff}
        .W .proc h3{font-size:1.15rem;font-weight:700;margin-bottom:.5rem}
        .W .proc p{font-size:.88rem;line-height:1.7;color:rgba(255,255,255,.85)}
        .W .proc-num{position:absolute;right:1.5rem;bottom:1rem;font-size:5rem;font-weight:700;opacity:.06;line-height:1}
        /* Desktop separator lines */
        @media(min-width:769px){
          .W .proc.p1::after,.W .proc.p2::after{content:'';position:absolute;top:15%;right:0;width:1px;height:70%;background:rgba(255,255,255,.2)}
        }
        /* Mobile connector */
        @media(max-width:768px){
          .W .proc{border-radius:0}
        }

        /* ══════════ ABOUT ══════════ */
        .W .about-sec{padding:80px 2rem;background:#fff}
        .W .about-center{text-align:center;max-width:680px;margin:0 auto}
        .W .about-center p{color:var(--g600);font-size:.95rem;line-height:1.8;margin-bottom:1rem;margin-top:1.5rem}
        .W .about-center p strong{color:var(--d);font-weight:700}
        .W .mgr{display:inline-flex;align-items:center;gap:14px;padding:14px 24px;background:var(--g50);border:1px solid var(--g200);border-radius:14px;margin-top:1rem}
        .W .mgr-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--b),var(--g));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.9rem}
        .W .mgr-name{font-size:.88rem;font-weight:700}
        .W .mgr-role{font-size:.75rem;color:var(--g400);font-weight:500}
        .W .country-strip{display:flex;justify-content:center;flex-wrap:wrap;gap:.75rem;margin-top:2rem}
        .W .cs-item{display:flex;align-items:center;gap:6px;padding:6px 14px;background:#fff;border:1px solid var(--g200);border-radius:8px;font-size:.82rem;color:var(--g600);font-weight:500;transition:all .3s}
        .W .cs-item:hover{border-color:var(--b);color:var(--b);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,152,218,.1)}

        /* ══════════ CTA ══════════ */
        .W .cta-sec{padding:80px 2rem;text-align:center;position:relative;overflow:hidden;
          background:linear-gradient(135deg,var(--b) 0%,var(--g) 50%,var(--b2) 100%)}
        .W .cta-sec::before{content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 30% 50%,rgba(255,255,255,.12) 0%,transparent 50%),
                     radial-gradient(ellipse at 70% 50%,rgba(255,255,255,.08) 0%,transparent 50%);
          pointer-events:none}
        .W .cta-in{position:relative;max-width:600px;margin:0 auto}
        .W .cta-logo{height:40px;margin-bottom:1.5rem;filter:brightness(0) invert(1)}
        .W .cta-sec .tag{color:rgba(255,255,255,.7)}
        .W .cta-sec .tag::before{background:rgba(255,255,255,.5)}
        .W .cta-sec .ttl{color:#fff}
        .W .cta-sec .ttl .hl{background:linear-gradient(135deg,#fff,rgba(255,255,255,.8));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .W .cta-p{color:rgba(255,255,255,.8);font-size:1rem;line-height:1.8;margin:.75rem 0 2rem}
        .W .cta-btns{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
        .W .btn-cta{padding:14px 32px;background:#fff;color:var(--b);border-radius:10px;font-weight:600;font-size:.9rem;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all .4s;box-shadow:0 4px 20px rgba(0,0,0,.15);cursor:pointer}
        .W .btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.2)}
        .W .btn-cta-g{padding:14px 32px;border:1.5px solid rgba(255,255,255,.35);color:rgba(255,255,255,.9);border-radius:10px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .4s;cursor:pointer}
        .W .btn-cta-g:hover{border-color:#fff;color:#fff;transform:translateY(-2px)}

        /* ══════════ FOOTER ══════════ */
        .W .foot{padding:3rem clamp(1.5rem,4vw,3rem) 1.5rem;background:#fff;border-top:3px solid;border-image:linear-gradient(90deg,var(--b),var(--g2),var(--o)) 1}
        .W .foot-in{display:grid;grid-template-columns:1.3fr 1fr .8fr;gap:2rem;align-items:start}
        @media(max-width:768px){.W .foot-in{grid-template-columns:1fr;text-align:center}}
        .W .foot img{height:30px;margin-bottom:.75rem}
        .W .foot-tag{font-size:.82rem;color:var(--g400);font-style:italic;line-height:1.6}
        .W .foot-fl{display:flex;gap:6px;margin-top:.75rem;flex-wrap:wrap}
        @media(max-width:768px){.W .foot-fl{justify-content:center}}
        .W .foot-flag{padding:4px 10px;background:var(--g50);border:1px solid var(--g200);border-radius:6px;font-size:.85rem;line-height:1}
        .W .foot-ct-t{font-size:.7rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--b);margin-bottom:.75rem}
        .W .foot-ct a{display:block;color:var(--g600);text-decoration:none;font-size:.88rem;margin-bottom:.35rem;transition:color .25s}
        .W .foot-ct a:hover{color:var(--b)}
        .W .foot-leg{text-align:right;font-size:.72rem;color:var(--g400);line-height:1.7}
        @media(max-width:768px){.W .foot-leg{text-align:center}}
        .W .foot-btm{text-align:center;margin-top:2rem;padding-top:1.25rem;border-top:1px solid var(--g200);font-size:.75rem;color:var(--g400);font-weight:500}

        /* ANIM */
        .W .fu{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
        .W .fu.visible{opacity:1;transform:none}
        @media(max-width:768px){
          .W .nav-r{display:none}
          .W .nav-ham{display:block}
          .W .svc-sec,.W .proc-sec,.W .about-sec{padding:60px 1.5rem}
        }
      `}} />

      <div className="W">
        <nav className="nav">
          <img src="/wbi-logo-black.png" alt="WE BUILD IT" />
          <div className="nav-r">
            <a href="#servicios">Servicios</a>
            <a href="#proceso">Proceso</a>
            <a href="#nosotros">Nosotros</a>
            <a href="mailto:squiroz@wbinnova.com" className="nav-cta">Contáctanos</a>
          </div>
          <button className="nav-ham" aria-label="Menu" onClick={undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-mesh"></div>
          {/* W watermark from logo SVG */}
          <svg className="hero-w" viewBox="0 0 900 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M650 50L500 100L475 60L640 20L650 50Z" fill="currentColor"/>
            <path d="M550 500H420L475 60L640 20L550 500Z" fill="currentColor"/>
            <path d="M550 500H400L300 170L430 130L550 500Z" fill="currentColor"/>
            <path d="M360 600H220L280 175L430 130L360 600Z" fill="currentColor"/>
            <path d="M360 600H210L40 105L180 70L360 600Z" fill="currentColor"/>
            <path d="M155 130L20 165L40 105L180 70L155 130Z" fill="currentColor"/>
          </svg>
          <div className="hero-in fu">
            <div className="hero-chip"><i></i> Marketing Services</div>
            <h1>The life of a brand must be found in <span className="hl">all spaces.</span></h1>
            <p className="hero-p">{"Estrategia digital, diseño UX y automatización con IA para marcas que quieren dominar su mercado."}</p>
            <div className="hero-btns">
              <a href="mailto:squiroz@wbinnova.com" className="btn btn-b">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Escríbenos
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn btn-w">webuildit.tech →</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="hero-stat-num">7+</div><div className="hero-stat-lbl">Países</div></div>
              <div className="hero-stat-sep"></div>
              <div className="hero-stat"><div className="hero-stat-num">6+</div><div className="hero-stat-lbl">Años</div></div>
              <div className="hero-stat-sep"></div>
              <div className="hero-stat"><div className="hero-stat-num">20+</div><div className="hero-stat-lbl">Proyectos</div></div>
              <div className="hero-stat-sep"></div>
              <div className="hero-stat"><div className="hero-stat-num">100%</div><div className="hero-stat-lbl">Entregado</div></div>
            </div>
          </div>
        </section>

        {/* COLOR BAND */}
        <div className="band">
          <div className="band-text">{"\"Integrar la Inteligencia Artificial ya no es tendencia — "}<span>es una necesidad.</span>{"\""}</div>
        </div>

        {/* SERVICIOS */}
        <section className="svc-sec" id="servicios">
          <div className="mx">
            <div className="svc-head fu">
              <div>
                <div className="tag">Marketing Services</div>
                <h2 className="ttl">Soluciones que <span className="hl">posicionan</span> tu marca.</h2>
              </div>
              <p className="sub">{"Presencia digital estratégica y medible."}</p>
            </div>
            <div className="svc-grid">
              <div className="svc sc fu">
                <div className="svc-top">
                  <div className="svc-ico ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><rect x="9" y="12" width="6" height="8"/></svg></div>
                  <span className="svc-num">01</span>
                </div>
                <h3><span className="hc">Brand</span> Solutions</h3>
                <p>{"Identidad digital, voz de marca e impacto visual. Confianza desde el primer contacto."}</p>
              </div>
              <div className="svc sb fu">
                <div className="svc-top">
                  <div className="svc-ico ib"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>
                  <span className="svc-num">02</span>
                </div>
                <h3><span className="hb">UX/UI</span> Design Solutions</h3>
                <p>{"Research, prototipos y diseño final. Maximiza el ROI de tu inversión digital."}</p>
              </div>
              <div className="svc so fu">
                <div className="svc-top">
                  <div className="svc-ico io"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
                  <span className="svc-num">03</span>
                </div>
                <h3><span className="ho">Web</span> Solutions</h3>
                <p>{"Rendimiento, UX y conversión. Tu sitio trabaja 24/7 por tu negocio."}</p>
              </div>
              <div className="svc sc fu">
                <div className="svc-top">
                  <div className="svc-ico ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                  <span className="svc-num">04</span>
                </div>
                <h3><span className="hc">Content</span> Solutions</h3>
                <p>{"Blogs, ads y narrativas que conectan con tu público y fortalecen tu posición."}</p>
              </div>
              <div className="svc sg fu">
                <div className="svc-top">
                  <div className="svc-ico ig"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                  <span className="svc-num">05</span>
                </div>
                <h3><span className="hg">SEO/SEM</span> Solutions</h3>
                <p>{"Auditoría técnica, keywords y campañas de alto rendimiento. Resultados medibles."}</p>
              </div>
              <div className="svc so fu">
                <div className="svc-top">
                  <div className="svc-ico io"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
                  <span className="svc-num">06</span>
                </div>
                <h3><span className="ho">Mkt</span> Automation</h3>
                <p>{"Email nurturing, lead scoring y reportería con IA. Escala sin multiplicar esfuerzo."}</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="proc-sec" id="proceso">
          <div className="mx">
            <div className="fu" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div className="tag" style={{ justifyContent: 'center' }}>Nuestro proceso</div>
              <h2 className="ttl">Así <span className="hl">trabajamos</span> contigo.</h2>
              <p className="sub" style={{ margin: '.75rem auto 0' }}>{"Ágil, transparente y orientado a resultados."}</p>
            </div>
            <div className="proc-grid fu">
              <div className="proc p1">
                <div className="proc-step">Paso 01</div>
                <div className="proc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <h3>Reuniones semanales</h3>
                <p>{"Revisión de avances, mockups y feedback. Tu proyecto siempre en rumbo."}</p>
                <div className="proc-num">01</div>
              </div>
              <div className="proc p2">
                <div className="proc-step">Paso 02</div>
                <div className="proc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
                <h3>Propuestas aprobadas</h3>
                <p>{"Nada se publica sin tu aprobación. Sin sorpresas, sin retrabajos."}</p>
                <div className="proc-num">02</div>
              </div>
              <div className="proc p3">
                <div className="proc-step">Paso 03</div>
                <div className="proc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
                <h3>Entregables finales</h3>
                <p>{"Assets, código y documentación. Listo para producción."}</p>
                <div className="proc-num">03</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-sec" id="nosotros">
          <div className="mx">
            <div className="about-center fu">
              <div className="tag" style={{ justifyContent: 'center' }}>{"¿Quiénes somos?"}</div>
              <h2 className="ttl">{"¿Por qué "}<span className="hl">WE BUILD IT?</span></h2>
              <p>Tu socio tecnológico y de marketing. Ideas → soluciones digitales escalables con resultados medibles.</p>
              <p>Ingenieros, diseñadores UX/UI y especialistas en marketing digital operando desde <strong>WBInnova México, Mérida.</strong></p>
              <div className="mgr">
                <div className="mgr-avatar">SQ</div>
                <div><div className="mgr-name">Samuel Quiroz Herrera</div><div className="mgr-role">Country Manager — WBI México</div></div>
              </div>
            </div>
            <div className="country-strip fu">
              <div className="cs-item">{"🇺🇸"} Miami</div>
              <div className="cs-item">{"🇲🇽"} Mérida</div>
              <div className="cs-item">{"🇨🇴"} Bogotá</div>
              <div className="cs-item">{"🇪🇸"} Madrid</div>
              <div className="cs-item">{"🇻🇪"} Venezuela</div>
              <div className="cs-item">{"🇵🇦"} Panamá</div>
              <div className="cs-item">{"🇵🇪"} Perú</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-sec">
          <div className="cta-in fu">
            <img src="/wbi-logo-black.png" alt="WBI" className="cta-logo" />
            <div className="tag" style={{ justifyContent: 'center' }}>{"¿Listo para construir?"}</div>
            <h2 className="ttl">{"Construyamos algo "}<span className="hl">extraordinario.</span></h2>
            <p className="cta-p">{"Escríbenos. Respondemos rápido y sin compromisos."}</p>
            <div className="cta-btns">
              <a href="mailto:squiroz@wbinnova.com" className="btn-cta">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                squiroz@wbinnova.com
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-cta-g">webuildit.tech →</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="foot">
          <div className="foot-in mx">
            <div>
              <img src="/wbi-logo-black.png" alt="WE BUILD IT" />
              <div className="foot-tag">{"\"El futuro de su negocio empieza con la tecnología correcta\""}</div>
              <div className="foot-fl">
                <span className="foot-flag">{"🇺🇸"}</span>
                <span className="foot-flag">{"🇲🇽"}</span>
                <span className="foot-flag">{"🇨🇴"}</span>
                <span className="foot-flag">{"🇪🇸"}</span>
                <span className="foot-flag">{"🇻🇪"}</span>
                <span className="foot-flag">{"🇵🇦"}</span>
                <span className="foot-flag">{"🇵🇪"}</span>
              </div>
            </div>
            <div className="foot-ct">
              <div className="foot-ct-t">Contacto</div>
              <a href="mailto:squiroz@wbinnova.com">squiroz@wbinnova.com</a>
              <a href="mailto:info@webuildit.tech">info@webuildit.tech</a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer">webuildit.tech</a>
            </div>
            <div className="foot-leg">{"© 2026 WBInnova México SA de CV"}<br />{"RFC: WME231122U13"}<br />{"Mérida, Yucatán, México"}</div>
          </div>
          <div className="foot-btm mx">The life of a brand must be found in all spaces.</div>
        </footer>

        <ScrollAnimator />
      </div>
    </>
  )
}
