import type { Metadata } from "next"
import ScrollAnimator from "./scroll-animator"

export const metadata: Metadata = {
  title: "WE BUILD IT · México",
  description: "Construimos el software que hace crecer tu negocio. Empresa nearshore de tecnología.",
}

export default function AboutWbiPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg:        #080B14;
          --bg2:       #0D1220;
          --bg3:       #111827;
          --card:      #141B2D;
          --border:    #1E2A45;
          --blue:      #1565C0;
          --cyan:      #00AAFF;
          --green:     #22C55E;
          --orange:    #F97316;
          --white:     #F0F4FF;
          --muted:     #6B7A99;
          --light:     #A8B8D0;
        }
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .wbi-page * { margin:0; padding:0; box-sizing:border-box; }
        .wbi-page { background:var(--bg); color:var(--white); font-family:'Inter',sans-serif; overflow-x:hidden; }

        /* -- NAVBAR -- */
        .wbi-page .wbi-nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 3rem; height:64px;
          background:rgba(8,11,20,0.85); backdrop-filter:blur(12px);
          border-bottom:1px solid var(--border);
        }
        .wbi-page .nav-logo { display:flex; align-items:center; gap:10px; }
        .wbi-page .logo-mark { display:flex; gap:2px; }
        .wbi-page .logo-mark span { width:6px; height:20px; border-radius:2px; }
        .wbi-page .lm1 { background:var(--blue); }
        .wbi-page .lm2 { background:var(--green); height:14px !important; align-self:flex-end; }
        .wbi-page .lm3 { background:var(--orange); }
        .wbi-page .logo-text { font-family:'Rajdhani',sans-serif; font-size:1.2rem; font-weight:700; letter-spacing:2px; color:var(--white); }
        .wbi-page .nav-cta {
          padding:8px 20px; background:var(--cyan); color:#000;
          border-radius:6px; font-weight:600; font-size:0.85rem; letter-spacing:0.5px;
          text-decoration:none; transition:opacity .2s;
        }
        .wbi-page .nav-cta:hover { opacity:.85; }

        /* -- HERO -- */
        .wbi-page .hero {
          min-height:100vh; display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden; padding:100px 2rem 60px;
        }
        .wbi-page .hero-grid {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(0,170,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,170,255,0.04) 1px, transparent 1px);
          background-size:60px 60px;
        }
        .wbi-page .hero-glow {
          position:absolute; top:-20%; left:50%; transform:translateX(-50%);
          width:800px; height:600px; border-radius:50%;
          background:radial-gradient(ellipse, rgba(21,101,192,0.18) 0%, transparent 70%);
        }
        .wbi-page .hero-content { position:relative; text-align:center; max-width:820px; }
        .wbi-page .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          padding:6px 16px; background:rgba(0,170,255,0.08);
          border:1px solid rgba(0,170,255,0.25); border-radius:999px;
          font-size:0.75rem; letter-spacing:2px; color:var(--cyan); margin-bottom:2rem;
          font-weight:600;
        }
        .wbi-page .hero-badge-dot { width:6px; height:6px; border-radius:50%; background:var(--cyan); animation:wbi-pulse 2s infinite; }
        @keyframes wbi-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

        .wbi-page .hero h1 { font-family:'Rajdhani',sans-serif; font-size:clamp(2.4rem,6vw,4.2rem); font-weight:700; line-height:1.1; margin-bottom:1.5rem; }
        .wbi-page .hero h1 em { font-style:normal; color:var(--cyan); }
        .wbi-page .hero-sub { font-size:1.05rem; color:var(--light); line-height:1.7; max-width:600px; margin:0 auto 2.5rem; font-weight:300; }
        .wbi-page .hero-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
        .wbi-page .btn-primary {
          padding:14px 32px; background:var(--cyan); color:#000;
          border-radius:8px; font-weight:700; font-size:0.9rem; letter-spacing:0.5px;
          text-decoration:none; transition:transform .2s, opacity .2s; display:inline-flex; align-items:center; gap:8px;
        }
        .wbi-page .btn-primary:hover { transform:translateY(-2px); opacity:.9; }
        .wbi-page .btn-outline {
          padding:14px 32px; border:1px solid var(--border); color:var(--light);
          border-radius:8px; font-weight:500; font-size:0.9rem; text-decoration:none;
          transition:border-color .2s, color .2s;
        }
        .wbi-page .btn-outline:hover { border-color:var(--cyan); color:var(--cyan); }

        .wbi-page .hero-stats {
          display:flex; gap:3rem; justify-content:center; margin-top:4rem;
          padding-top:2.5rem; border-top:1px solid var(--border);
        }
        .wbi-page .hero-stat-num { font-family:'Rajdhani',sans-serif; font-size:2rem; font-weight:700; color:var(--white); }
        .wbi-page .hero-stat-num span { color:var(--cyan); }
        .wbi-page .hero-stat-lbl { font-size:0.75rem; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-top:2px; }

        /* -- SECTIONS COMMON -- */
        .wbi-page section { padding:100px 2rem; }
        .wbi-page .container { max-width:1100px; margin:0 auto; }
        .wbi-page .section-tag {
          font-size:0.72rem; letter-spacing:3px; color:var(--cyan); font-weight:600;
          text-transform:uppercase; margin-bottom:0.75rem;
        }
        .wbi-page .section-title { font-family:'Rajdhani',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:700; line-height:1.15; }
        .wbi-page .section-title em { font-style:normal; color:var(--cyan); }
        .wbi-page .section-title .orange { color:var(--orange); }
        .wbi-page .section-sub { color:var(--light); font-size:1rem; line-height:1.7; max-width:540px; margin-top:1rem; font-weight:300; }

        /* -- SOBRE NOSOTROS -- */
        .wbi-page .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; margin-top:3.5rem; }
        @media(max-width:768px){ .wbi-page .about-grid { grid-template-columns:1fr; gap:2.5rem; } }
        .wbi-page .about-text p { color:var(--light); font-size:0.95rem; line-height:1.8; margin-bottom:1rem; font-weight:300; }
        .wbi-page .about-text p strong { color:var(--white); font-weight:600; }
        .wbi-page .about-text .manager-tag {
          display:inline-flex; align-items:center; gap:8px;
          padding:8px 14px; background:var(--card); border:1px solid var(--border);
          border-radius:8px; margin-top:0.5rem;
        }
        .wbi-page .manager-dot { width:8px; height:8px; border-radius:50%; background:var(--green); }
        .wbi-page .manager-name { font-size:0.85rem; font-weight:600; color:var(--white); }
        .wbi-page .manager-role { font-size:0.75rem; color:var(--muted); }
        .wbi-page .stat-cards { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .wbi-page .stat-card {
          padding:1.5rem; background:var(--card); border:1px solid var(--border);
          border-radius:12px; text-align:center; transition:border-color .2s;
        }
        .wbi-page .stat-card:hover { border-color:var(--cyan); }
        .wbi-page .stat-card-num { font-family:'Rajdhani',sans-serif; font-size:2.2rem; font-weight:700; color:var(--cyan); }
        .wbi-page .stat-card-lbl { font-size:0.75rem; color:var(--muted); text-transform:uppercase; letter-spacing:1px; margin-top:4px; }
        .wbi-page .presence { display:flex; flex-wrap:wrap; gap:0.6rem; margin-top:1.5rem; }
        .wbi-page .presence-pill {
          padding:5px 12px; border:1px solid var(--border); border-radius:999px;
          font-size:0.78rem; color:var(--light); background:var(--card);
        }

        /* -- SERVICIOS -- */
        .wbi-page .services-section { background:var(--bg2); }
        .wbi-page .services-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px,1fr)); gap:1.5rem; margin-top:3rem; }
        .wbi-page .service-card {
          padding:2rem; background:var(--card); border:1px solid var(--border);
          border-radius:14px; transition:transform .25s, border-color .25s; cursor:default;
          position:relative; overflow:hidden;
        }
        .wbi-page .service-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          border-radius:14px 14px 0 0;
        }
        .wbi-page .svc-blue::before  { background:var(--blue); }
        .wbi-page .svc-cyan::before  { background:var(--cyan); }
        .wbi-page .svc-orange::before{ background:var(--orange); }
        .wbi-page .svc-green::before { background:var(--green); }
        .wbi-page .service-card:hover { transform:translateY(-4px); border-color:rgba(0,170,255,0.3); }
        .wbi-page .svc-icon {
          width:44px; height:44px; border-radius:10px; display:flex;
          align-items:center; justify-content:center; font-size:20px; margin-bottom:1.25rem;
        }
        .wbi-page .icon-blue   { background:rgba(21,101,192,0.15); }
        .wbi-page .icon-cyan   { background:rgba(0,170,255,0.12); }
        .wbi-page .icon-orange { background:rgba(249,115,22,0.12); }
        .wbi-page .icon-green  { background:rgba(34,197,94,0.12); }
        .wbi-page .svc-title { font-family:'Rajdhani',sans-serif; font-size:1.15rem; font-weight:700; margin-bottom:0.75rem; }
        .wbi-page .svc-title strong { color:var(--cyan); }
        .wbi-page .svc-orange-t .svc-title strong { color:var(--orange); }
        .wbi-page .svc-blue-t .svc-title strong { color:#5B9BD5; }
        .wbi-page .svc-desc { font-size:0.88rem; color:var(--light); line-height:1.7; font-weight:300; }

        /* -- CTA -- */
        .wbi-page .cta-section {
          text-align:center; padding:120px 2rem;
          background:linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%);
          position:relative; overflow:hidden;
        }
        .wbi-page .cta-glow {
          position:absolute; bottom:-30%; left:50%; transform:translateX(-50%);
          width:600px; height:400px; border-radius:50%;
          background:radial-gradient(ellipse, rgba(0,170,255,0.1) 0%, transparent 70%);
        }
        .wbi-page .cta-section h2 { font-family:'Rajdhani',sans-serif; font-size:clamp(1.8rem,4vw,3rem); font-weight:700; position:relative; }
        .wbi-page .cta-section h2 em { font-style:normal; color:var(--cyan); }
        .wbi-page .cta-body { color:var(--light); max-width:520px; margin:1.2rem auto 2.5rem; font-size:1rem; line-height:1.7; font-weight:300; position:relative; }
        .wbi-page .cta-actions { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; position:relative; }

        /* -- FOOTER -- */
        .wbi-page .wbi-footer {
          padding:2rem 3rem; background:var(--bg);
          border-top:1px solid var(--border);
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;
        }
        .wbi-page .footer-logo { font-family:'Rajdhani',sans-serif; font-size:1.1rem; font-weight:700; letter-spacing:2px; }
        .wbi-page .footer-logo .fb { color:var(--blue); }
        .wbi-page .footer-logo .fg { color:var(--green); }
        .wbi-page .footer-logo .fo { color:var(--orange); }
        .wbi-page .footer-meta { font-size:0.78rem; color:var(--muted); }

        /* -- BADGE -- */
        .wbi-page .badge-demo-section { padding:60px 2rem; background:var(--bg3); text-align:center; }
        .wbi-page .badge-demo-label { font-size:0.72rem; letter-spacing:3px; color:var(--muted); text-transform:uppercase; margin-bottom:1.5rem; }
        .wbi-page .wbi-badge {
          display:inline-flex; align-items:center; gap:6px;
          font-size:0.8rem; color:var(--muted);
        }
        .wbi-page .wbi-badge a { color:var(--cyan); font-weight:600; text-decoration:none; }
        .wbi-page .wbi-badge a:hover { text-decoration:underline; }

        /* -- DIVIDER -- */
        .wbi-page .divider { height:1px; background:var(--border); margin:0; }

        /* Scroll animation */
        .wbi-page .fade-up { opacity:0; transform:translateY(24px); transition:opacity .6s, transform .6s; }
        .wbi-page .fade-up.visible { opacity:1; transform:none; }
      `}} />

      <div className="wbi-page">
        {/* NAVBAR */}
        <nav className="wbi-nav">
          <div className="nav-logo">
            <div className="logo-mark">
              <span className="lm1"></span>
              <span className="lm2"></span>
              <span className="lm3"></span>
            </div>
            <div className="logo-text">WE.BUILD.IT</div>
          </div>
          <a href="mailto:squiroz@wbinnova.com" className="nav-cta">{"Contáctanos"}</a>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
          <div className="hero-content fade-up">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              {"NEARSHORE TECH · MÉXICO · LATAM"}
            </div>
            <h1>Construimos el software que<br /><em>hace crecer</em> tu negocio.</h1>
            <p className="hero-sub">
              {"WE BUILD IT es una empresa nearshore de tecnología con presencia en Miami, Mérida, Bogotá y Madrid. Diseñamos, desarrollamos e implementamos soluciones digitales a la medida para empresas que quieren escalar sin límites."}
            </p>
            <div className="hero-actions">
              <a href="mailto:squiroz@wbinnova.com" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {"Escríbenos"}
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-outline">webuildit.tech →</a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">4<span>+</span></div>
                <div className="hero-stat-lbl">{"Países"}</div>
              </div>
              <div>
                <div className="hero-stat-num">6<span>+</span></div>
                <div className="hero-stat-lbl">{"Años"}</div>
              </div>
              <div>
                <div className="hero-stat-num">20<span>+</span></div>
                <div className="hero-stat-lbl">Proyectos</div>
              </div>
              <div>
                <div className="hero-stat-num">100<span>%</span></div>
                <div className="hero-stat-lbl">{"Código entregado"}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* SOBRE NOSOTROS */}
        <section>
          <div className="container fade-up">
            <div className="section-tag">{"¿Quiénes somos?"}</div>
            <h2 className="section-title">{"¿Por qué "}<em>WE BUILD IT?</em></h2>
            <div className="about-grid">
              <div className="about-text">
                <p>En <strong>WE BUILD IT</strong> somos el socio tecnológico que tu empresa necesita. Nacimos como un grupo de especialistas en tecnología, diseño y estrategia digital, con la misión de transformar ideas de negocio en soluciones digitales que funcionan de verdad: escalables, bien construidas y con resultados medibles.</p>
                <p>Nuestra operación latinoamericana está liderada desde <strong>WBInnova México (Mérida, Yucatán)</strong>, bajo la dirección de <strong>Samuel Quiroz Herrera</strong>, quien encabeza un equipo multidisciplinario de ingenieros, consultores SAP, diseñadores UX/UI y especialistas en marketing digital.</p>
                <div className="manager-tag">
                  <span className="manager-dot"></span>
                  <div>
                    <div className="manager-name">Samuel Quiroz Herrera</div>
                    <div className="manager-role">{"Country Manager — WBI México"}</div>
                  </div>
                </div>
                <div className="presence">
                  <span className="presence-pill">{"🇺🇸 Miami"}</span>
                  <span className="presence-pill">{"🇲🇽 Mérida"}</span>
                  <span className="presence-pill">{"🇨🇴 Bogotá"}</span>
                  <span className="presence-pill">{"🇪🇸 Madrid"}</span>
                </div>
              </div>
              <div className="stat-cards">
                <div className="stat-card"><div className="stat-card-num">4</div><div className="stat-card-lbl">{"Países activos"}</div></div>
                <div className="stat-card"><div className="stat-card-num">6+</div><div className="stat-card-lbl">{"Años de exp."}</div></div>
                <div className="stat-card"><div className="stat-card-num">20+</div><div className="stat-card-lbl">Proyectos</div></div>
                <div className="stat-card"><div className="stat-card-num">100%</div><div className="stat-card-lbl">{"Código entregado"}</div></div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* SERVICIOS */}
        <section className="services-section">
          <div className="container">
            <div className="fade-up">
              <div className="section-tag">Nuestros servicios</div>
              <h2 className="section-title">{"Tecnología a la medida"}<br />que <em>impulsa</em> tu negocio.</h2>
              <p className="section-sub">{"Tu negocio no es genérico, tu software tampoco debería serlo. If you can imagine it, WE can BUILD IT."}</p>
            </div>
            <div className="services-grid">

              <div className="service-card svc-blue svc-blue-t fade-up">
                <div className="svc-icon icon-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B9BD5" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <div className="svc-title"><strong>SOFTWARE</strong> SOLUTIONS</div>
                <p className="svc-desc">{"Desarrollo full-spectrum para digitalizar tu negocio. Engineeriamos el Digital Core: desde front-end apps y sitios web hasta back-end APIs y automatizaciones, con Enterprise Software potente y preciso."}</p>
              </div>

              <div className="service-card svc-cyan fade-up">
                <div className="svc-icon icon-cyan">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00AAFF" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                </div>
                <div className="svc-title"><strong>UX/UI</strong> SOLUTIONS</div>
                <p className="svc-desc">{"Especialistas en UX/UI Design Excellence. Tratamos el diseño como estrategia core, usando research y prototipado para construir experiencias verdaderamente intuitivas que maximizan el ROI de tu inversión."}</p>
              </div>

              <div className="service-card svc-blue svc-blue-t fade-up">
                <div className="svc-icon icon-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B9BD5" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                </div>
                <div className="svc-title"><strong>CLOUD</strong> SOLUTIONS</div>
                <p className="svc-desc">{"Infraestructura cloud robusta end-to-end: Strategic Setup, cost optimization y High-Performance Hosting. Manejamos arquitectura, seguridad y escalabilidad para que tu negocio opere con máxima agilidad."}</p>
              </div>

              <div className="service-card svc-cyan fade-up">
                <div className="svc-icon icon-cyan">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00AAFF" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="svc-title"><strong>IA</strong> AUTOMATIONS</div>
                <p className="svc-desc">{"Strategic AI Adoption: AI Readiness Audit, Data-Driven Roadmap e Intelligent Automation Buildout. Integramos modelos IA en tus procesos core para optimización tangible y ventaja competitiva clara."}</p>
              </div>

              <div className="service-card svc-blue svc-blue-t fade-up">
                <div className="svc-icon icon-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B9BD5" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="svc-title"><strong>CONSULTING</strong> SERVICES</div>
                <p className="svc-desc">{"Tu aliado tecnológico. Consultoría SAP FI/CO, ABAP, BTP e integraciones. Mesa de Ayuda N1/N2 para soporte continuo en producción. Acompañamiento estratégico en transformación digital."}</p>
              </div>

              <div className="service-card svc-orange svc-orange-t fade-up">
                <div className="svc-icon icon-orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div className="svc-title"><strong>MARKETING</strong> AUTOMATION</div>
                <p className="svc-desc">{"Brand Solutions, SEO/SEM, Content Solutions, Web Solutions y MKT Automation con IA. Integrar la Inteligencia Artificial ya no es tendencia: es una necesidad. The life of a brand must be found in all spaces."}</p>
              </div>

            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* CTA FINAL */}
        <section className="cta-section">
          <div className="cta-glow"></div>
          <div className="container fade-up">
            <div className="section-tag">{"¿Listo para construir?"}</div>
            <h2>{"¿Listo para construir algo "}<em>extraordinario?</em></h2>
            <p className="cta-body">{"Si tienes una idea, un problema de negocio o simplemente quieres saber qué podemos hacer por ti, escríbenos. Respondemos rápido y sin compromisos."}</p>
            <div className="cta-actions">
              <a href="mailto:squiroz@wbinnova.com" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                squiroz@wbinnova.com
              </a>
              <a href="https://webuildit.tech" target="_blank" rel="noopener noreferrer" className="btn-outline">webuildit.tech →</a>
            </div>
          </div>
        </section>

        {/* BADGE DEMO */}
        <section className="badge-demo-section">
          <div className="badge-demo-label">{"↓ Así se ve el badge en la app Profit"}</div>
          <div className="wbi-badge">
            {"Desarrollado con ♥ por "}<a href="#">{"WBI México"}</a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="wbi-footer">
          <div className="footer-logo">
            <span className="fb">WE</span><span className="fg">.</span><span className="fo">BUILD</span><span className="fb">.IT</span>
          </div>
          <div className="footer-meta">{"© 2026 WBInnova México SA de CV · RFC: WME231122U13 · Mérida, Yucatán · squiroz@wbinnova.com"}</div>
          <div className="footer-meta" style={{ color: "#2E7D32", fontStyle: "italic", fontSize: "0.72rem" }}>{"\"El futuro de su negocio empieza con la tecnología correcta\""}</div>
        </footer>

        <ScrollAnimator />
      </div>
    </>
  )
}
