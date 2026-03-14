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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --wbi-blue:#0098DA; --wbi-blue2:#47B6E6; --wbi-green:#0C7347;
          --wbi-green2:#17D986; --wbi-orange:#F58634; --wbi-orange2:#BC5000;
          --wbi-yellow:#FBCE26; --wbi-cyan:#00AAFF;
          --g800:#1a202c; --g700:#2d3748; --g600:#4a5568; --g500:#718096;
          --g300:#cbd5e0; --g100:#edf2f7; --g50:#f7fafc;
        }
        .wbi *{margin:0;padding:0;box-sizing:border-box}
        .wbi{background:#fff;color:var(--g800);font-family:'Plus Jakarta Sans',system-ui,sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}

        /* ══ NAV ══ */
        .wbi .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,4vw,3rem);height:72px;background:rgba(255,255,255,.92);backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(0,0,0,.04)}
        .wbi .nav-logo img{height:38px;width:auto}
        .wbi .nav-r{display:flex;gap:2rem;align-items:center}
        .wbi .nav-a{color:var(--g600);font-size:.875rem;font-weight:500;text-decoration:none;transition:color .2s}
        .wbi .nav-a:hover{color:var(--wbi-blue)}
        .wbi .nav-cta{padding:10px 26px;background:var(--wbi-blue);color:#fff;border-radius:8px;font-weight:600;font-size:.85rem;text-decoration:none;transition:all .25s;box-shadow:0 2px 12px rgba(0,152,218,.25)}
        .wbi .nav-cta:hover{background:#0086c2;transform:translateY(-1px);box-shadow:0 4px 20px rgba(0,152,218,.35)}

        /* ══ HERO ══ */
        .wbi .hero{min-height:100vh;display:flex;align-items:center;padding:100px 2rem 60px;position:relative;overflow:hidden;background:#fff}
        .wbi .hero-bg{position:absolute;inset:0;pointer-events:none}
        .wbi .hero-bg::before{content:'';position:absolute;top:-200px;right:-200px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(0,152,218,.07) 0%,transparent 70%)}
        .wbi .hero-bg::after{content:'';position:absolute;bottom:-150px;left:-100px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(23,217,134,.05) 0%,transparent 70%)}
        .wbi .hero-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;position:relative}
        .wbi .hero-text{}
        .wbi .hero-label{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:rgba(0,152,218,.06);border:1px solid rgba(0,152,218,.12);border-radius:6px;font-size:.7rem;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--wbi-blue);margin-bottom:1.5rem}
        .wbi .hero-label span{width:6px;height:6px;border-radius:50%;background:var(--wbi-blue);animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .wbi .hero h1{font-size:clamp(2.2rem,5vw,3.6rem);font-weight:800;line-height:1.12;color:var(--g800);letter-spacing:-.5px;margin-bottom:1.25rem}
        .wbi .hero h1 .hl{background:linear-gradient(135deg,var(--wbi-blue),var(--wbi-green2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .wbi .hero-p{font-size:1.05rem;color:var(--g600);line-height:1.8;margin-bottom:2rem;font-weight:400;max-width:480px}
        .wbi .hero-btns{display:flex;gap:.75rem;flex-wrap:wrap}
        .wbi .btn-fill{padding:14px 32px;background:var(--wbi-blue);color:#fff;border-radius:8px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .25s;display:inline-flex;align-items:center;gap:8px;box-shadow:0 2px 12px rgba(0,152,218,.2)}
        .wbi .btn-fill:hover{background:#0086c2;transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,152,218,.3)}
        .wbi .btn-ghost{padding:14px 32px;border:1.5px solid var(--g300);color:var(--g700);border-radius:8px;font-weight:600;font-size:.9rem;text-decoration:none;transition:all .25s}
        .wbi .btn-ghost:hover{border-color:var(--wbi-blue);color:var(--wbi-blue)}

        /* Hero right — stats grid */
        .wbi .hero-visual{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .wbi .hero-card{padding:1.75rem;border-radius:16px;text-align:center;transition:transform .3s}
        .wbi .hero-card:hover{transform:translateY(-4px)}
        .wbi .hc-1{background:linear-gradient(135deg,rgba(0,152,218,.06),rgba(71,182,230,.04));border:1px solid rgba(0,152,218,.1)}
        .wbi .hc-2{background:linear-gradient(135deg,rgba(12,115,71,.06),rgba(23,217,134,.04));border:1px solid rgba(23,217,134,.1)}
        .wbi .hc-3{background:linear-gradient(135deg,rgba(245,134,52,.06),rgba(251,206,38,.04));border:1px solid rgba(245,134,52,.1)}
        .wbi .hc-4{background:linear-gradient(135deg,rgba(0,170,255,.06),rgba(0,152,218,.04));border:1px solid rgba(0,170,255,.1)}
        .wbi .hc-num{font-size:2.4rem;font-weight:800;line-height:1}
        .wbi .hc-1 .hc-num{color:var(--wbi-blue)}
        .wbi .hc-2 .hc-num{color:var(--wbi-green)}
        .wbi .hc-3 .hc-num{color:var(--wbi-orange)}
        .wbi .hc-4 .hc-num{color:var(--wbi-cyan)}
        .wbi .hc-lbl{font-size:.7rem;color:var(--g500);text-transform:uppercase;letter-spacing:1.5px;margin-top:6px;font-weight:600}

        @media(max-width:768px){
          .wbi .hero-inner{grid-template-columns:1fr;text-align:center}
          .wbi .hero-p{max-width:100%;margin-left:auto;margin-right:auto}
          .wbi .hero-btns{justify-content:center}
        }

        /* ══ SERVICES ══ */
        .wbi .svc-sec{padding:100px 2rem;background:var(--g50)}
        .wbi .con{max-width:1140px;margin:0 auto}
        .wbi .tag{font-size:.7rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--wbi-blue);margin-bottom:.5rem}
        .wbi .ttl{font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:800;line-height:1.2;color:var(--g800);margin-bottom:.5rem}
        .wbi .ttl .hl{background:linear-gradient(135deg,var(--wbi-blue),var(--wbi-green2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .wbi .sub{color:var(--g500);font-size:.95rem;line-height:1.7;max-width:520px;font-weight:400}
        .wbi .svc-head{display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin-bottom:3rem;flex-wrap:wrap}

        .wbi .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}
        @media(max-width:960px){.wbi .svc-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.wbi .svc-grid{grid-template-columns:1fr}}

        .wbi .svc{padding:2rem;background:#fff;border-radius:16px;border:1px solid var(--g100);transition:all .35s;position:relative;overflow:hidden}
        .wbi .svc:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,.06);border-color:transparent}
        .wbi .svc-bar{position:absolute;top:0;left:0;right:0;height:3px}
        .wbi .svc .svc-ico{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem}
        .wbi .svc .svc-ico svg{width:24px;height:24px}
        .wbi .svc h3{font-size:1rem;font-weight:700;margin-bottom:.6rem;color:var(--g800)}
        .wbi .svc p{font-size:.875rem;color:var(--g500);line-height:1.7;font-weight:400}

        /* Icon colors */
        .wbi .ico-cyan{background:linear-gradient(135deg,#e6f7ff,#ccefff)} .wbi .ico-cyan svg{color:var(--wbi-blue)}
        .wbi .ico-blue{background:linear-gradient(135deg,#e6f0ff,#cce0ff)} .wbi .ico-blue svg{color:#1a56a8}
        .wbi .ico-orange{background:linear-gradient(135deg,#fff3e6,#ffe8cc)} .wbi .ico-orange svg{color:var(--wbi-orange)}
        .wbi .ico-green{background:linear-gradient(135deg,#e6fff2,#ccffe6)} .wbi .ico-green svg{color:var(--wbi-green)}
        .wbi .bar-cyan{background:linear-gradient(90deg,var(--wbi-blue),var(--wbi-cyan))}
        .wbi .bar-blue{background:linear-gradient(90deg,#1a56a8,var(--wbi-blue))}
        .wbi .bar-orange{background:linear-gradient(90deg,var(--wbi-orange),var(--wbi-yellow))}
        .wbi .bar-green{background:linear-gradient(90deg,var(--wbi-green),var(--wbi-green2))}

        /* ══ PROCESS ══ */
        .wbi .proc-sec{padding:100px 2rem;background:#fff}
        .wbi .proc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3rem}
        @media(max-width:768px){.wbi .proc-grid{grid-template-columns:1fr}}
        .wbi .proc{padding:2.5rem 2rem;border-radius:16px;position:relative;color:#fff;overflow:hidden}
        .wbi .proc::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12),transparent 60%);pointer-events:none}
        .wbi .proc-blue{background:linear-gradient(135deg,var(--wbi-blue),var(--wbi-blue2));box-shadow:0 8px 32px rgba(0,152,218,.25)}
        .wbi .proc-green{background:linear-gradient(135deg,var(--wbi-green),var(--wbi-green2));box-shadow:0 8px 32px rgba(12,115,71,.25)}
        .wbi .proc-orange{background:linear-gradient(135deg,var(--wbi-orange2),var(--wbi-orange));box-shadow:0 8px 32px rgba(245,134,52,.25)}
        .wbi .proc:hover{transform:translateY(-4px)}
        .wbi .proc{transition:transform .3s}
        .wbi .proc-num{font-size:3.5rem;font-weight:800;opacity:.15;position:absolute;top:1rem;right:1.5rem;line-height:1}
        .wbi .proc-ico{width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem;backdrop-filter:blur(4px)}
        .wbi .proc-ico svg{width:22px;height:22px;color:#fff}
        .wbi .proc h3{font-size:1.1rem;font-weight:700;margin-bottom:.6rem;position:relative}
        .wbi .proc p{font-size:.875rem;line-height:1.7;color:rgba(255,255,255,.88);font-weight:400;position:relative}

        /* ══ ABOUT ══ */
        .wbi .about-sec{padding:100px 2rem;background:var(--g50)}
        .wbi .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;margin-top:2.5rem}
        @media(max-width:768px){.wbi .about-grid{grid-template-columns:1fr;gap:2.5rem}}
        .wbi .about-text p{color:var(--g600);font-size:.95rem;line-height:1.8;margin-bottom:1rem;font-weight:400}
        .wbi .about-text p strong{color:var(--g800);font-weight:700}
        .wbi .mgr{display:inline-flex;align-items:center;gap:12px;padding:12px 18px;background:#fff;border:1px solid var(--g100);border-radius:12px;margin-top:.5rem;box-shadow:0 2px 8px rgba(0,0,0,.03)}
        .wbi .mgr-dot{width:10px;height:10px;border-radius:50%;background:var(--wbi-green2);box-shadow:0 0 0 3px rgba(23,217,134,.2)}
        .wbi .mgr-name{font-size:.88rem;font-weight:700;color:var(--g800)}
        .wbi .mgr-role{font-size:.75rem;color:var(--g500);font-weight:500}
        .wbi .flags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem}
        .wbi .flag{display:flex;align-items:center;gap:6px;padding:6px 14px;background:#fff;border:1px solid var(--g100);border-radius:8px;font-size:.8rem;color:var(--g600);font-weight:500;transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.02)}
        .wbi .flag:hover{border-color:var(--wbi-blue);color:var(--wbi-blue);transform:translateY(-1px)}

        /* About right — big stats */
        .wbi .about-right{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .wbi .a-stat{padding:2rem;background:#fff;border-radius:16px;text-align:center;border:1px solid var(--g100);transition:all .3s;box-shadow:0 2px 8px rgba(0,0,0,.02)}
        .wbi .a-stat:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.05);border-color:var(--wbi-blue)}
        .wbi .a-stat-num{font-size:2.6rem;font-weight:800;color:var(--wbi-blue);line-height:1}
        .wbi .a-stat:nth-child(2) .a-stat-num{color:var(--wbi-green)}
        .wbi .a-stat:nth-child(3) .a-stat-num{color:var(--wbi-orange)}
        .wbi .a-stat:nth-child(4) .a-stat-num{color:var(--wbi-cyan)}
        .wbi .a-stat-lbl{font-size:.7rem;color:var(--g500);text-transform:uppercase;letter-spacing:1.5px;margin-top:6px;font-weight:600}

        /* ══ CTA ══ */
        .wbi .cta-sec{padding:100px 2rem;background:#fff;text-align:center;position:relative;overflow:hidden}
        .wbi .cta-sec::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,152,218,.03),rgba(23,217,134,.02),rgba(245,134,52,.02));pointer-events:none}
        .wbi .cta-inner{position:relative;max-width:640px;margin:0 auto}
        .wbi .cta-inner .ttl{margin-bottom:.75rem}
        .wbi .cta-p{color:var(--g500);font-size:1rem;line-height:1.8;margin-bottom:2rem;font-weight:400}
        .wbi .cta-btns{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}

        /* ══ FOOTER ══ */
        .wbi .foot{padding:3rem clamp(1.5rem,4vw,3rem) 2rem;background:var(--g50);border-top:1px solid var(--g100)}
        .wbi .foot-inner{max-width:1140px;margin:0 auto;display:grid;grid-template-columns:1.3fr 1fr .8fr;gap:2rem;align-items:start}
        @media(max-width:768px){.wbi .foot-inner{grid-template-columns:1fr;text-align:center}}
        .wbi .foot-logo img{height:32px;width:auto;margin-bottom:.75rem}
        .wbi .foot-tag{font-size:.82rem;color:var(--g500);font-style:italic;line-height:1.6;max-width:280px}
        @media(max-width:768px){.wbi .foot-tag{max-width:100%}}
        .wbi .foot-flags{display:flex;gap:6px;margin-top:1rem;flex-wrap:wrap;font-size:1.1rem}
        @media(max-width:768px){.wbi .foot-flags{justify-content:center}}
        .wbi .foot-ct-title{font-size:.72rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--wbi-blue);margin-bottom:.75rem}
        .wbi .foot-ct a{display:block;color:var(--g600);text-decoration:none;font-size:.875rem;margin-bottom:.4rem;transition:color .2s;font-weight:400}
        .wbi .foot-ct a:hover{color:var(--wbi-blue)}
        .wbi .foot-legal{text-align:right;font-size:.75rem;color:var(--g500);line-height:1.7}
        @media(max-width:768px){.wbi .foot-legal{text-align:center}}
        .wbi .foot-bar{max-width:1140px;margin:2rem auto 0;padding-top:1.25rem;border-top:1px solid var(--g100);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}
        .wbi .foot-bar-text{font-size:.75rem;color:var(--g500);font-weight:400}
        .wbi .foot-bar-line{height:2px;flex:1;max-width:200px;margin:0 1rem;background:linear-gradient(90deg,var(--wbi-blue),var(--wbi-green2),var(--wbi-orange));border-radius:2px;opacity:.3}
        @media(max-width:768px){.wbi .foot-bar{justify-content:center;text-align:center}.wbi .foot-bar-line{display:none}}

        /* ══ ANIM ══ */
        .wbi .fu{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
        .wbi .fu.visible{opacity:1;transform:none}
        @media(max-width:768px){.wbi .nav-r{display:none}}
      `}} />

      <div className="wbi">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo"><img src="/wbi-logo-black.png" alt="WE BUILD IT" /></div>
          <div className="nav-r">
            <a href="#servicios" className="nav-a">Servicios</a>
            <a href="#proceso" className="nav-a">Proceso</a>
            <a href="#nosotros" className="nav-a">Nosotros</a>
            <a href="mailto:squiroz@wbinnova.com" className="nav-cta">Contáctanos</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-inner">
            <div className="hero-text fu">
              <div className="hero-label"><span></span> MARKETING SERVICES</div>
              <h1>The life of a brand must be found in <span className="hl">all spaces.</span></h1>
              <p className="hero-p">{"Conectamos marcas con su audiencia ideal a través de estrategia digital, diseño de experiencia y tecnología de automatización."}</p>
              <div className="hero-btns">
                <a href="mailto:squiroz@wbinnova.com" className="btn-fill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Escríbenos
                </a>
                <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-ghost">webuildit.tech →</a>
              </div>
            </div>
            <div className="hero-visual fu">
              <div className="hero-card hc-1"><div className="hc-num">7+</div><div className="hc-lbl">Países</div></div>
              <div className="hero-card hc-2"><div className="hc-num">6+</div><div className="hc-lbl">Años</div></div>
              <div className="hero-card hc-3"><div className="hc-num">20+</div><div className="hc-lbl">Proyectos</div></div>
              <div className="hero-card hc-4"><div className="hc-num">100%</div><div className="hc-lbl">Código entregado</div></div>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="svc-sec" id="servicios">
          <div className="con">
            <div className="svc-head fu">
              <div>
                <div className="tag">Marketing Services</div>
                <h2 className="ttl">Soluciones que <span className="hl">posicionan</span> tu marca.</h2>
              </div>
              <p className="sub">{"Cada servicio impulsa tu presencia digital de forma estratégica, medible y con resultados reales."}</p>
            </div>
            <div className="svc-grid">

              <div className="svc fu">
                <div className="svc-bar bar-cyan"></div>
                <div className="svc-ico ico-cyan">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 20h20"/><path d="M5 20V8l7-5 7 5v12"/><rect x="9" y="12" width="6" height="8"/></svg>
                </div>
                <h3>BRAND Solutions</h3>
                <p>{"Conecta, Destaca y Perdura. Identidad digital, voz de marca e impacto visual que genera confianza desde el primer contacto."}</p>
              </div>

              <div className="svc fu">
                <div className="svc-bar bar-blue"></div>
                <div className="svc-ico ico-blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </div>
                <h3>UX/UI Design Solutions</h3>
                <p>{"Research, prototipos y diseños finales. Tratamos el diseño como estrategia core para maximizar el ROI de tu inversión digital."}</p>
              </div>

              <div className="svc fu">
                <div className="svc-bar bar-orange"></div>
                <div className="svc-ico ico-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <h3>WEB Solutions</h3>
                <p>{"Sitios web optimizados para rendimiento, experiencia de usuario y conversión que trabajan 24/7 para tu negocio."}</p>
              </div>

              <div className="svc fu">
                <div className="svc-bar bar-cyan"></div>
                <div className="svc-ico ico-cyan">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <h3>CONTENT Solutions</h3>
                <p>{"Comunica tu valor. Blogs, contenido publicitario y narrativas que conectan con tu audiencia y fortalecen tu posicionamiento."}</p>
              </div>

              <div className="svc fu">
                <div className="svc-bar bar-green"></div>
                <div className="svc-ico ico-green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <h3>SEO/SEM Solutions</h3>
                <p>{"Posiciónate de forma orgánica y estratégica. Auditoría técnica, keyword research y campañas SEM de alto rendimiento."}</p>
              </div>

              <div className="svc fu">
                <div className="svc-bar bar-orange"></div>
                <div className="svc-ico ico-orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                </div>
                <h3>MKT Automation</h3>
                <p>{"Eficiencia e innovación con IA. Email nurturing, lead scoring y reportería automatizada para escalar sin multiplicar esfuerzo."}</p>
              </div>

            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="proc-sec" id="proceso">
          <div className="con">
            <div className="fu" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div className="tag">Nuestro proceso</div>
              <h2 className="ttl">Así <span className="hl">trabajamos</span> contigo.</h2>
              <p className="sub" style={{ margin: '.75rem auto 0' }}>{"Flujo ágil, transparente y orientado a resultados."}</p>
            </div>
            <div className="proc-grid fu">

              <div className="proc proc-blue">
                <div className="proc-num">01</div>
                <div className="proc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3>Reuniones Semanales</h3>
                <p>{"Status meetings, revisión de mockups y retroalimentación ágil. Comunicación constante para mantener el proyecto en la dirección correcta."}</p>
              </div>

              <div className="proc proc-green">
                <div className="proc-num">02</div>
                <div className="proc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <h3>Propuestas Aprobadas</h3>
                <p>{"Flujo semanal de avances. Cada propuesta pasa por tu revisión antes de continuar — sin sorpresas, sin retrabajos."}</p>
              </div>

              <div className="proc proc-orange">
                <div className="proc-num">03</div>
                <div className="proc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <h3>Entregables Finales</h3>
                <p>{"Mockups finales, assets listos para producción y documentación completa. Todo lo que necesitas para lanzar."}</p>
              </div>

            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-sec" id="nosotros">
          <div className="con">
            <div className="fu">
              <div className="tag">{"¿Quiénes somos?"}</div>
              <h2 className="ttl">{"¿Por qué "}<span className="hl">WE BUILD IT?</span></h2>
            </div>
            <div className="about-grid">
              <div className="about-text fu">
                <p>En <strong>WE BUILD IT</strong> somos el socio tecnológico y de marketing que tu empresa necesita. Transformamos ideas de negocio en soluciones digitales escalables, bien construidas y con resultados medibles.</p>
                <p>Nuestra operación latinoamericana está liderada desde <strong>WBInnova México (Mérida, Yucatán)</strong>, bajo la dirección de <strong>Samuel Quiroz Herrera</strong>, con un equipo multidisciplinario de ingenieros, diseñadores UX/UI y especialistas en marketing digital.</p>
                <div className="mgr">
                  <span className="mgr-dot"></span>
                  <div>
                    <div className="mgr-name">Samuel Quiroz Herrera</div>
                    <div className="mgr-role">Country Manager — WBI México</div>
                  </div>
                </div>
                <div className="flags">
                  <span className="flag">{"🇺🇸 Miami"}</span>
                  <span className="flag">{"🇲🇽 Mérida"}</span>
                  <span className="flag">{"🇨🇴 Bogotá"}</span>
                  <span className="flag">{"🇪🇸 Madrid"}</span>
                  <span className="flag">{"🇻🇪 Venezuela"}</span>
                  <span className="flag">{"🇵🇦 Panamá"}</span>
                  <span className="flag">{"🇵🇪 Perú"}</span>
                </div>
              </div>
              <div className="about-right fu">
                <div className="a-stat"><div className="a-stat-num">7+</div><div className="a-stat-lbl">Países activos</div></div>
                <div className="a-stat"><div className="a-stat-num">6+</div><div className="a-stat-lbl">Años de exp.</div></div>
                <div className="a-stat"><div className="a-stat-num">20+</div><div className="a-stat-lbl">Proyectos</div></div>
                <div className="a-stat"><div className="a-stat-num">100%</div><div className="a-stat-lbl">Código entregado</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-sec">
          <div className="cta-inner fu">
            <div className="tag">{"¿Listo para construir?"}</div>
            <h2 className="ttl">{"Construyamos algo "}<span className="hl">extraordinario.</span></h2>
            <p className="cta-p">{"¿Tienes una idea o un reto de marca? Escríbenos. Respondemos rápido y sin compromisos."}</p>
            <div className="cta-btns">
              <a href="mailto:squiroz@wbinnova.com" className="btn-fill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                squiroz@wbinnova.com
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-ghost">webuildit.tech →</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="foot">
          <div className="foot-inner">
            <div>
              <div className="foot-logo"><img src="/wbi-logo-black.png" alt="WE BUILD IT" /></div>
              <div className="foot-tag">{"\"El futuro de su negocio empieza con la tecnología correcta\""}</div>
              <div className="foot-flags">
                <span>{"🇺🇸"}</span><span>{"🇲🇽"}</span><span>{"🇨🇴"}</span><span>{"🇪🇸"}</span><span>{"🇻🇪"}</span><span>{"🇵🇦"}</span><span>{"🇵🇪"}</span>
              </div>
            </div>
            <div className="foot-ct">
              <div className="foot-ct-title">Contacto</div>
              <a href="mailto:squiroz@wbinnova.com">squiroz@wbinnova.com</a>
              <a href="mailto:info@webuildit.tech">info@webuildit.tech</a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer">webuildit.tech</a>
            </div>
            <div className="foot-legal">
              {"© 2026 WBInnova México SA de CV"}<br />
              {"RFC: WME231122U13"}<br />
              {"Mérida, Yucatán, México"}
            </div>
          </div>
          <div className="foot-bar">
            <span className="foot-bar-text">WE BUILD IT</span>
            <span className="foot-bar-line"></span>
            <span className="foot-bar-text">The life of a brand must be found in all spaces.</span>
          </div>
        </footer>

        <ScrollAnimator />
      </div>
    </>
  )
}
