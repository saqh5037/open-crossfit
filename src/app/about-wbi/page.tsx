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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        :root{--b:#0098DA;--b2:#47B6E6;--g:#0C7347;--g2:#17D986;--o:#F58634;--o2:#BC5000;--y:#FBCE26;--c:#00AAFF;--d:#0f172a;--d2:#1e293b;--g600:#475569;--g400:#94a3b8;--g200:#e2e8f0;--g50:#f8fafc}
        .W *{margin:0;padding:0;box-sizing:border-box}
        .W{background:#fff;color:var(--d);font-family:'Plus Jakarta Sans',system-ui,sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
        .W .mx{max-width:1140px;margin:0 auto}

        /* NAV */
        .W .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,4vw,3rem);height:72px;background:rgba(255,255,255,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.05)}
        .W .nav img{height:36px}
        .W .nav-r{display:flex;gap:1.75rem;align-items:center}
        .W .nav-r a{color:var(--g600);font-size:.88rem;font-weight:500;text-decoration:none;transition:color .2s}
        .W .nav-r a:hover{color:var(--b)}
        .W .nav-cta{padding:10px 24px;background:var(--b);color:#fff!important;border-radius:8px;font-weight:600;font-size:.85rem;box-shadow:0 2px 12px rgba(0,152,218,.25);transition:all .25s}
        .W .nav-cta:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,152,218,.35)}

        /* ══════════ HERO ══════════ */
        .W .hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:100px 2rem 60px;
          background:linear-gradient(135deg,#f0f9ff 0%,#ecfdf5 40%,#fffbeb 80%,#fff 100%)}
        .W .hero::before{content:'';position:absolute;top:0;right:0;width:55%;height:100%;
          background:linear-gradient(160deg,var(--b) 0%,var(--g) 50%,var(--o) 100%);
          clip-path:polygon(15% 0,100% 0,100% 100%,0% 100%);opacity:.06}
        .W .hero-mesh{position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse at 80% 20%,rgba(0,152,218,.08) 0%,transparent 50%),
                     radial-gradient(ellipse at 20% 80%,rgba(23,217,134,.06) 0%,transparent 50%),
                     radial-gradient(ellipse at 60% 60%,rgba(245,134,52,.04) 0%,transparent 40%)}
        .W .hero-in{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}

        .W .hero-l{}
        .W .hero-chip{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:8px;font-size:.72rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:1.75rem;
          background:linear-gradient(135deg,rgba(0,152,218,.1),rgba(23,217,134,.08));color:var(--b)}
        .W .hero-chip i{width:7px;height:7px;border-radius:50%;background:var(--b);display:block;animation:p 2s infinite}
        @keyframes p{0%,100%{opacity:1}50%{opacity:.3}}
        .W .hero h1{font-size:clamp(2.4rem,5.2vw,3.8rem);font-weight:800;line-height:1.1;letter-spacing:-.5px;margin-bottom:1.25rem}
        .W .hero h1 .hl{background:linear-gradient(135deg,var(--b),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .W .hero-p{font-size:1.05rem;color:var(--g600);line-height:1.8;margin-bottom:2.25rem;max-width:460px}
        .W .hero-btns{display:flex;gap:.75rem;flex-wrap:wrap}
        .W .btn{padding:14px 32px;border-radius:10px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .3s;display:inline-flex;align-items:center;gap:8px}
        .W .btn-b{background:linear-gradient(135deg,var(--b),#0080bb);color:#fff;box-shadow:0 4px 16px rgba(0,152,218,.3)}
        .W .btn-b:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,152,218,.4)}
        .W .btn-w{background:#fff;color:var(--d);border:1.5px solid var(--g200);box-shadow:0 2px 8px rgba(0,0,0,.04)}
        .W .btn-w:hover{border-color:var(--b);color:var(--b);transform:translateY(-2px)}

        /* Hero right — visual card */
        .W .hero-r{position:relative}
        .W .hero-showcase{background:#fff;border-radius:24px;padding:2.5rem;box-shadow:0 20px 60px rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.04);position:relative;overflow:hidden}
        .W .hero-showcase::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--b),var(--g2),var(--o),var(--y))}
        .W .hs-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
        .W .hs-row:last-child{margin-bottom:0}
        .W .hs-stat{padding:1.25rem;border-radius:14px;text-align:center;transition:transform .3s}
        .W .hs-stat:hover{transform:scale(1.03)}
        .W .hs-1{background:linear-gradient(135deg,#e0f2fe,#bae6fd);border:1px solid #7dd3fc}
        .W .hs-2{background:linear-gradient(135deg,#dcfce7,#bbf7d0);border:1px solid #86efac}
        .W .hs-3{background:linear-gradient(135deg,#ffedd5,#fed7aa);border:1px solid #fdba74}
        .W .hs-4{background:linear-gradient(135deg,#e0f2fe,#c7ecff);border:1px solid #7ec8e3}
        .W .hs-num{font-size:2rem;font-weight:800;line-height:1}
        .W .hs-1 .hs-num{color:var(--b)}.W .hs-2 .hs-num{color:var(--g)}.W .hs-3 .hs-num{color:var(--o2)}.W .hs-4 .hs-num{color:#0284c7}
        .W .hs-lbl{font-size:.68rem;color:var(--g600);text-transform:uppercase;letter-spacing:1.5px;font-weight:600;margin-top:4px}
        .W .hs-tagline{text-align:center;margin-top:1.25rem;padding-top:1rem;border-top:1px solid var(--g200);font-size:.8rem;color:var(--g400);font-weight:500;font-style:italic;letter-spacing:.5px}

        @media(max-width:768px){
          .W .hero-in{grid-template-columns:1fr;text-align:center}
          .W .hero-p{max-width:100%;margin:0 auto 2.25rem}
          .W .hero-btns{justify-content:center}
          .W .hero::before{width:100%;clip-path:none;opacity:.03}
        }

        /* ══════════ COLOR BAND ══════════ */
        .W .band{padding:3rem 2rem;background:linear-gradient(135deg,var(--b) 0%,var(--g) 50%,var(--o) 100%);text-align:center;color:#fff;position:relative;overflow:hidden}
        .W .band::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.08),transparent 60%);pointer-events:none}
        .W .band-text{font-size:clamp(1rem,2.5vw,1.35rem);font-weight:600;letter-spacing:1px;position:relative;max-width:800px;margin:0 auto;line-height:1.6}
        .W .band-text span{opacity:.7;font-weight:400}

        /* ══════════ SERVICES ══════════ */
        .W .svc-sec{padding:100px 2rem;background:#fff}
        .W .tag{font-size:.72rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--b);margin-bottom:.5rem}
        .W .ttl{font-size:clamp(1.7rem,3.5vw,2.5rem);font-weight:800;line-height:1.2;margin-bottom:.5rem}
        .W .ttl .hl{background:linear-gradient(135deg,var(--b),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .W .sub{color:var(--g600);font-size:.95rem;line-height:1.75;max-width:520px}
        .W .svc-head{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin-bottom:3rem;flex-wrap:wrap}

        .W .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
        @media(max-width:960px){.W .svc-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.W .svc-grid{grid-template-columns:1fr}}
        .W .svc{padding:2rem;border-radius:16px;transition:all .35s;position:relative;overflow:hidden;border:1px solid var(--g200);background:#fff}
        .W .svc::after{content:'';position:absolute;top:0;left:0;bottom:0;width:4px;border-radius:16px 0 0 16px}
        .W .svc:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,.07);border-color:transparent}
        .W .sc::after{background:linear-gradient(180deg,var(--b),var(--c))}
        .W .sb::after{background:linear-gradient(180deg,#1a56a8,var(--b))}
        .W .so::after{background:linear-gradient(180deg,var(--o),var(--y))}
        .W .sg::after{background:linear-gradient(180deg,var(--g),var(--g2))}
        .W .svc-ico{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem}
        .W .svc-ico svg{width:24px;height:24px}
        .W .ic{background:linear-gradient(135deg,#dbeafe,#bfdbfe)}.W .ic svg{color:var(--b)}
        .W .ib{background:linear-gradient(135deg,#dbeafe,#c7d2fe)}.W .ib svg{color:#1a56a8}
        .W .io{background:linear-gradient(135deg,#ffedd5,#fed7aa)}.W .io svg{color:var(--o)}
        .W .ig{background:linear-gradient(135deg,#d1fae5,#a7f3d0)}.W .ig svg{color:var(--g)}
        .W .svc h3{font-size:1rem;font-weight:700;margin-bottom:.5rem}
        .W .svc h3 span{font-weight:800}
        .W .svc h3 .hc{color:var(--b)}.W .svc h3 .hb{color:#1a56a8}.W .svc h3 .ho{color:var(--o)}.W .svc h3 .hg{color:var(--g)}
        .W .svc p{font-size:.88rem;color:var(--g600);line-height:1.7}

        /* ══════════ PROCESS ══════════ */
        .W .proc-sec{padding:100px 2rem;background:var(--g50)}
        .W .proc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:3rem;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.08)}
        @media(max-width:768px){.W .proc-grid{grid-template-columns:1fr}}
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
        .W .proc-num{position:absolute;right:1.5rem;bottom:1rem;font-size:5rem;font-weight:800;opacity:.08;line-height:1}

        /* ══════════ ABOUT ══════════ */
        .W .about-sec{padding:100px 2rem;background:#fff}
        .W .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;margin-top:2.5rem}
        @media(max-width:768px){.W .about-grid{grid-template-columns:1fr;gap:2rem}}
        .W .about-text p{color:var(--g600);font-size:.95rem;line-height:1.8;margin-bottom:1rem}
        .W .about-text p strong{color:var(--d);font-weight:700}
        .W .mgr{display:inline-flex;align-items:center;gap:12px;padding:14px 20px;background:var(--g50);border:1px solid var(--g200);border-radius:14px;margin-top:.5rem}
        .W .mgr-dot{width:10px;height:10px;border-radius:50%;background:var(--g2);box-shadow:0 0 0 3px rgba(23,217,134,.2)}
        .W .mgr-name{font-size:.88rem;font-weight:700}
        .W .mgr-role{font-size:.75rem;color:var(--g400);font-weight:500}
        .W .flags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem}
        .W .fl{padding:7px 14px;background:var(--g50);border:1px solid var(--g200);border-radius:8px;font-size:.8rem;color:var(--g600);font-weight:500;transition:all .2s}
        .W .fl:hover{border-color:var(--b);color:var(--b);transform:translateY(-1px)}

        .W .about-r{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .W .as{padding:2rem;border-radius:16px;text-align:center;transition:all .35s;position:relative;overflow:hidden}
        .W .as::before{content:'';position:absolute;inset:0;opacity:.08;pointer-events:none}
        .W .as:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.08)}
        .W .as1{background:#f0f9ff;border:1px solid #bae6fd}.W .as1::before{background:linear-gradient(135deg,var(--b),var(--c))}
        .W .as2{background:#ecfdf5;border:1px solid #a7f3d0}.W .as2::before{background:linear-gradient(135deg,var(--g),var(--g2))}
        .W .as3{background:#fff7ed;border:1px solid #fed7aa}.W .as3::before{background:linear-gradient(135deg,var(--o2),var(--o))}
        .W .as4{background:#f0f9ff;border:1px solid #bae6fd}.W .as4::before{background:linear-gradient(135deg,var(--c),var(--b))}
        .W .as-num{font-size:2.6rem;font-weight:800;line-height:1}
        .W .as1 .as-num{color:var(--b)}.W .as2 .as-num{color:var(--g)}.W .as3 .as-num{color:var(--o)}.W .as4 .as-num{color:#0284c7}
        .W .as-lbl{font-size:.68rem;color:var(--g600);text-transform:uppercase;letter-spacing:1.5px;font-weight:600;margin-top:6px}

        /* ══════════ CTA ══════════ */
        .W .cta-sec{padding:100px 2rem;text-align:center;position:relative;overflow:hidden;
          background:linear-gradient(135deg,var(--d) 0%,var(--d2) 100%)}
        .W .cta-sec::before{content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 30% 50%,rgba(0,152,218,.15) 0%,transparent 50%),
                     radial-gradient(ellipse at 70% 50%,rgba(23,217,134,.1) 0%,transparent 50%);
          pointer-events:none}
        .W .cta-in{position:relative;max-width:640px;margin:0 auto}
        .W .cta-sec .tag{color:var(--b2)}
        .W .cta-sec .ttl{color:#fff}
        .W .cta-sec .ttl .hl{background:linear-gradient(135deg,var(--b2),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .W .cta-p{color:var(--g400);font-size:1rem;line-height:1.8;margin:.75rem 0 2rem}
        .W .cta-btns{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}
        .W .btn-cta{padding:14px 32px;background:linear-gradient(135deg,var(--b),var(--g));color:#fff;border-radius:10px;font-weight:600;font-size:.9rem;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:all .3s;box-shadow:0 4px 20px rgba(0,152,218,.3)}
        .W .btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,152,218,.4)}
        .W .btn-cta-g{padding:14px 32px;border:1.5px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);border-radius:10px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .3s}
        .W .btn-cta-g:hover{border-color:var(--b2);color:#fff}

        /* ══════════ FOOTER ══════════ */
        .W .foot{padding:3rem clamp(1.5rem,4vw,3rem) 1.5rem;background:#fff;border-top:3px solid;border-image:linear-gradient(90deg,var(--b),var(--g2),var(--o)) 1}
        .W .foot-in{display:grid;grid-template-columns:1.3fr 1fr .8fr;gap:2rem;align-items:start}
        @media(max-width:768px){.W .foot-in{grid-template-columns:1fr;text-align:center}}
        .W .foot img{height:30px;margin-bottom:.75rem}
        .W .foot-tag{font-size:.82rem;color:var(--g400);font-style:italic;line-height:1.6}
        .W .foot-fl{display:flex;gap:4px;margin-top:.75rem;font-size:1rem;flex-wrap:wrap}
        @media(max-width:768px){.W .foot-fl{justify-content:center}}
        .W .foot-ct-t{font-size:.7rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--b);margin-bottom:.75rem}
        .W .foot-ct a{display:block;color:var(--g600);text-decoration:none;font-size:.88rem;margin-bottom:.35rem;transition:color .2s}
        .W .foot-ct a:hover{color:var(--b)}
        .W .foot-leg{text-align:right;font-size:.72rem;color:var(--g400);line-height:1.7}
        @media(max-width:768px){.W .foot-leg{text-align:center}}
        .W .foot-btm{text-align:center;margin-top:2rem;padding-top:1.25rem;border-top:1px solid var(--g200);font-size:.75rem;color:var(--g400)}

        /* ANIM */
        .W .fu{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
        .W .fu.visible{opacity:1;transform:none}
        @media(max-width:768px){.W .nav-r{display:none}}
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
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-mesh"></div>
          <div className="hero-in mx">
            <div className="hero-l fu">
              <div className="hero-chip"><i></i> MARKETING SERVICES</div>
              <h1>The life of a brand must be found in <span className="hl">all spaces.</span></h1>
              <p className="hero-p">{"Conectamos marcas con su audiencia a través de estrategia digital, diseño de experiencia y tecnología de automatización."}</p>
              <div className="hero-btns">
                <a href="mailto:squiroz@wbinnova.com" className="btn btn-b">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Escríbenos
                </a>
                <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn btn-w">webuildit.tech →</a>
              </div>
            </div>
            <div className="hero-r fu">
              <div className="hero-showcase">
                <div className="hs-row">
                  <div className="hs-stat hs-1"><div className="hs-num">7+</div><div className="hs-lbl">Países</div></div>
                  <div className="hs-stat hs-2"><div className="hs-num">6+</div><div className="hs-lbl">Años</div></div>
                </div>
                <div className="hs-row">
                  <div className="hs-stat hs-3"><div className="hs-num">20+</div><div className="hs-lbl">Proyectos</div></div>
                  <div className="hs-stat hs-4"><div className="hs-num">100%</div><div className="hs-lbl">Entregado</div></div>
                </div>
                <div className="hs-tagline">If you can imagine it, WE can BUILD IT.</div>
              </div>
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
              <p className="sub">{"Cada servicio impulsa tu presencia digital de forma estratégica y medible."}</p>
            </div>
            <div className="svc-grid">
              <div className="svc sc fu">
                <div className="svc-ico ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><rect x="9" y="12" width="6" height="8"/></svg></div>
                <h3><span className="hc">BRAND</span> Solutions</h3>
                <p>{"Conecta, Destaca y Perdura. Identidad digital, voz de marca e impacto visual que genera confianza desde el primer contacto."}</p>
              </div>
              <div className="svc sb fu">
                <div className="svc-ico ib"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></div>
                <h3><span className="hb">UX/UI</span> Design Solutions</h3>
                <p>{"Research, prototipos y diseños finales. Estrategia core de diseño para maximizar el ROI de tu inversión digital."}</p>
              </div>
              <div className="svc so fu">
                <div className="svc-ico io"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
                <h3><span className="ho">WEB</span> Solutions</h3>
                <p>{"Sitios web optimizados para rendimiento, experiencia de usuario y conversión que trabajan 24/7 para tu negocio."}</p>
              </div>
              <div className="svc sc fu">
                <div className="svc-ico ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <h3><span className="hc">CONTENT</span> Solutions</h3>
                <p>{"Comunica tu valor. Blogs, contenido publicitario y narrativas que conectan y fortalecen tu posicionamiento."}</p>
              </div>
              <div className="svc sg fu">
                <div className="svc-ico ig"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                <h3><span className="hg">SEO/SEM</span> Solutions</h3>
                <p>{"Posiciónate de forma orgánica y estratégica. Auditoría técnica, keyword research y campañas de alto rendimiento."}</p>
              </div>
              <div className="svc so fu">
                <div className="svc-ico io"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
                <h3><span className="ho">MKT</span> Automation</h3>
                <p>{"Eficiencia e innovación con IA. Email nurturing, lead scoring y reportería para escalar sin multiplicar esfuerzo."}</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="proc-sec" id="proceso">
          <div className="mx">
            <div className="fu" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div className="tag">Nuestro proceso</div>
              <h2 className="ttl">Así <span className="hl">trabajamos</span> contigo.</h2>
              <p className="sub" style={{ margin: '.75rem auto 0' }}>{"Flujo ágil, transparente y orientado a resultados."}</p>
            </div>
            <div className="proc-grid fu">
              <div className="proc p1">
                <div className="proc-step">Paso 01</div>
                <div className="proc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <h3>Reuniones Semanales</h3>
                <p>{"Status meetings, revisión de mockups y retroalimentación ágil para mantener el proyecto en la dirección correcta."}</p>
                <div className="proc-num">01</div>
              </div>
              <div className="proc p2">
                <div className="proc-step">Paso 02</div>
                <div className="proc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
                <h3>Propuestas Aprobadas</h3>
                <p>{"Flujo semanal de avances. Cada propuesta pasa por tu revisión — sin sorpresas, sin retrabajos."}</p>
                <div className="proc-num">02</div>
              </div>
              <div className="proc p3">
                <div className="proc-step">Paso 03</div>
                <div className="proc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
                <h3>Entregables Finales</h3>
                <p>{"Mockups finales, assets para producción y documentación completa. Todo listo para lanzar."}</p>
                <div className="proc-num">03</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-sec" id="nosotros">
          <div className="mx">
            <div className="fu">
              <div className="tag">{"¿Quiénes somos?"}</div>
              <h2 className="ttl">{"¿Por qué "}<span className="hl">WE BUILD IT?</span></h2>
            </div>
            <div className="about-grid">
              <div className="about-text fu">
                <p>En <strong>WE BUILD IT</strong> somos el socio tecnológico y de marketing que tu empresa necesita. Transformamos ideas en soluciones digitales escalables, bien construidas y con resultados medibles.</p>
                <p>Operación liderada desde <strong>WBInnova México (Mérida, Yucatán)</strong> por <strong>Samuel Quiroz Herrera</strong>, con un equipo de ingenieros, diseñadores UX/UI y especialistas en marketing digital.</p>
                <div className="mgr">
                  <span className="mgr-dot"></span>
                  <div><div className="mgr-name">Samuel Quiroz Herrera</div><div className="mgr-role">Country Manager — WBI México</div></div>
                </div>
                <div className="flags">
                  <span className="fl">{"🇺🇸 Miami"}</span><span className="fl">{"🇲🇽 Mérida"}</span><span className="fl">{"🇨🇴 Bogotá"}</span><span className="fl">{"🇪🇸 Madrid"}</span><span className="fl">{"🇻🇪 Venezuela"}</span><span className="fl">{"🇵🇦 Panamá"}</span><span className="fl">{"🇵🇪 Perú"}</span>
                </div>
              </div>
              <div className="about-r fu">
                <div className="as as1"><div className="as-num">7+</div><div className="as-lbl">Países activos</div></div>
                <div className="as as2"><div className="as-num">6+</div><div className="as-lbl">Años de exp.</div></div>
                <div className="as as3"><div className="as-num">20+</div><div className="as-lbl">Proyectos</div></div>
                <div className="as as4"><div className="as-num">100%</div><div className="as-lbl">Código entregado</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-sec">
          <div className="cta-in fu">
            <div className="tag">{"¿Listo para construir?"}</div>
            <h2 className="ttl">{"Construyamos algo "}<span className="hl">extraordinario.</span></h2>
            <p className="cta-p">{"¿Tienes una idea o un reto de marca? Escríbenos. Respondemos rápido y sin compromisos."}</p>
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
              <div className="foot-fl"><span>{"🇺🇸"}</span><span>{"🇲🇽"}</span><span>{"🇨🇴"}</span><span>{"🇪🇸"}</span><span>{"🇻🇪"}</span><span>{"🇵🇦"}</span><span>{"🇵🇪"}</span></div>
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
