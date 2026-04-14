import logoImage from '../assets/cannastoreLogo';
import MenuSection from './MenuSection';

// ─── Smoke path shape library ─────────────────────────────────────────────────
// All main-flow shapes share the same M+4C command structure so SVG animate d
// can interpolate between any of them.
const S = {
  // balanced baseline
  A: 'M-60 115 C60 115, 155 115, 244 115 C306 115, 362 62, 434 115 C506 168, 550 184, 607 130 C664 76, 728 42, 795 106 C846 148, 904 174, 960 122',
  // high tight peaks, deep troughs
  B: 'M-60 108 C46 92, 128 80, 210 72 C274 64, 332 22, 408 80 C484 138, 546 206, 614 152 C682 98, 746 18, 818 80 C864 116, 914 160, 962 106',
  // wide dispersed, low amplitude
  C: 'M-60 124 C74 136, 176 146, 268 150 C330 154, 384 112, 458 150 C532 188, 566 172, 624 118 C682 64, 742 46, 810 120 C856 158, 910 186, 960 136',
  // asymmetric big sweep, compressed right
  D: 'M-60 116 C42 116, 112 100, 194 84 C258 68, 308 28, 380 76 C452 124, 530 188, 600 164 C670 140, 736 66, 808 100 C852 120, 906 158, 960 116',
  // rolling wider horizontal bias
  E: 'M-60 120 C66 130, 162 138, 256 142 C318 146, 374 100, 448 142 C522 184, 558 176, 618 124 C678 72, 740 38, 808 104 C852 138, 908 170, 960 130',
  // dominant right-side peak, soft left
  F: 'M-60 122 C58 130, 148 138, 240 144 C304 150, 362 108, 434 144 C506 180, 552 186, 614 136 C676 86, 740 36, 812 94 C858 128, 910 164, 962 128',
};

// Tendril paths – heavier Y offset + independent curvature
const T = {
  A: 'M-60 124 C52 124, 142 124, 230 124 C292 124, 350 72, 422 124 C494 176, 540 190, 597 136 C654 82, 720 50, 787 112 C838 152, 896 178, 952 128',
  B: 'M-60 130 C44 112, 124 96, 206 84 C268 72, 326 30, 400 90 C474 150, 534 208, 604 158 C674 108, 736 30, 810 92 C856 128, 910 166, 954 114',
  C: 'M-60 118 C64 136, 166 148, 258 154 C320 160, 376 118, 450 154 C524 190, 562 176, 620 118 C678 60, 738 38, 806 120 C852 160, 906 188, 956 140',
  D: 'M-60 126 C38 126, 108 106, 190 88 C252 70, 302 24, 374 76 C446 128, 526 194, 596 174 C666 154, 726 78, 800 112 C848 134, 902 168, 950 122',
  E: 'M-60 122 C58 134, 150 142, 242 148 C304 154, 362 112, 436 148 C510 184, 556 180, 616 128 C676 76, 738 42, 806 114 C852 150, 908 178, 956 136',
  F: 'M-60 128 C56 136, 146 144, 238 150 C300 156, 358 116, 430 152 C502 188, 548 184, 608 134 C668 84, 730 46, 798 116 C848 152, 906 180, 954 134',
};

// helper: join path array for SVG animate values attribute
const v = (...keys) => keys.map(k => S[k]).join(';');
const vt = (...keys) => keys.map(k => T[k]).join(';');

// Irregular keyTimes patterns (different rhythms per layer)
const KT = {
  synco:  '0;0.15;0.40;0.62;0.82;1',   // quick-snap, hold, snap, hold, snap
  lazy:   '0;0.22;0.44;0.66;0.85;1',   // even with late bias
  lurch:  '0;0.12;0.35;0.58;0.80;1',   // front-loaded chaos
  drift:  '0;0.20;0.45;0.68;0.86;1',   // mid-heavy
  rush:   '0;0.18;0.38;0.60;0.82;1',   // quick early moves, slower end
};

// Mixed keySplines – alternating snap & ease to break regularity
const KS5 = '0.1 0 0.9 1;0.4 0 0.6 1;0.1 0 0.9 1;0.4 0 0.6 1;0.3 0 0.7 1';
const KS5b = '0.4 0 0.6 1;0.1 0 0.9 1;0.3 0 0.7 1;0.1 0 0.9 1;0.4 0 0.6 1';
const KS5c = '0.2 0 0.8 1;0.1 0 0.9 1;0.2 0 0.8 1;0.1 0 0.9 1;0.2 0 0.8 1';
const KS2  = '0.45 0 0.55 1;0.45 0 0.55 1';

function CannastoreMenu({ sections, activeMenuId }) {
  return (
    <section className="menu-panel">
      <header className="menu-header">
        <div className="brand-row">
          <div className="brand-smoke" aria-hidden="true">
            <svg
              className="smoke-wave"
              viewBox="0 0 920 220"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Light turbulence – ribbon, core, highlight */}
                <filter id="smokeTurbLight" x="-15%" y="-55%" width="130%" height="210%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.014 0.055" numOctaves="5" seed="6" result="noise">
                    <animate attributeName="baseFrequency"
                      values="0.011 0.048;0.018 0.070;0.013 0.054;0.016 0.062;0.011 0.048"
                      dur="19s" repeatCount="indefinite"/>
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="d"/>
                  <feGaussianBlur in="d" stdDeviation="3.5"/>
                </filter>

                {/* Medium turbulence – mid glow, tendril, wisps */}
                <filter id="smokeTurbMed" x="-20%" y="-65%" width="140%" height="230%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.011 0.045" numOctaves="4" seed="18" result="noise">
                    <animate attributeName="baseFrequency"
                      values="0.008 0.038;0.015 0.062;0.010 0.048;0.013 0.056;0.008 0.038"
                      dur="26s" repeatCount="indefinite"/>
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" result="d"/>
                  <feGaussianBlur in="d" stdDeviation="9"/>
                </filter>

                {/* Heavy turbulence – outer atmospheric bloom */}
                <filter id="smokeTurbHeavy" x="-25%" y="-85%" width="150%" height="270%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.009 0.038" numOctaves="4" seed="29" result="noise">
                    <animate attributeName="baseFrequency"
                      values="0.007 0.030;0.013 0.052;0.009 0.040;0.011 0.046;0.007 0.030"
                      dur="32s" repeatCount="indefinite"/>
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="46" xChannelSelector="R" yChannelSelector="G" result="d"/>
                  <feGaussianBlur in="d" stdDeviation="19"/>
                </filter>

                <linearGradient id="smokeGradCore" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%"   stopColor="rgba(111,255,140,0.92)"/>
                  <stop offset="38%"  stopColor="rgba(138,255,163,0.78)"/>
                  <stop offset="78%"  stopColor="rgba(111,255,140,0.42)"/>
                  <stop offset="100%" stopColor="rgba(111,255,140,0)"/>
                </linearGradient>
                <linearGradient id="smokeGradMid" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%"   stopColor="rgba(72,210,100,0.62)"/>
                  <stop offset="50%"  stopColor="rgba(111,255,140,0.52)"/>
                  <stop offset="100%" stopColor="rgba(72,200,100,0)"/>
                </linearGradient>
                <linearGradient id="smokeGradGlow" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%"   stopColor="rgba(50,190,80,0.38)"/>
                  <stop offset="55%"  stopColor="rgba(111,255,140,0.32)"/>
                  <stop offset="100%" stopColor="rgba(50,170,80,0)"/>
                </linearGradient>
                <linearGradient id="smokeGradHighlight" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%"   stopColor="rgba(210,255,220,0.65)"/>
                  <stop offset="45%"  stopColor="rgba(230,255,235,0.52)"/>
                  <stop offset="100%" stopColor="rgba(210,255,220,0)"/>
                </linearGradient>
              </defs>

              {/* ── L1 outer atmospheric bloom – 5 unique shapes, syncopated timing ── */}
              <path className="smoke-outer-glow" d={S.A}>
                <animate attributeName="d"
                  values={v('A','C','E','B','D','A')}
                  dur="54s" repeatCount="indefinite"
                  calcMode="spline" keyTimes={KT.synco} keySplines={KS5}/>
              </path>

              {/* ── L2 mid volume glow – opposite phase to L1 ── */}
              <path className="smoke-mid-glow" d={S.D}>
                <animate attributeName="d"
                  values={v('D','A','F','C','B','D')}
                  dur="41s" repeatCount="indefinite"
                  calcMode="spline" keyTimes={KT.lazy} keySplines={KS5b}/>
              </path>

              {/* ── L3 tendril – fully independent curvature library ── */}
              <path className="smoke-tendril" d={T.A}>
                <animate attributeName="d"
                  values={vt('A','C','F','B','E','D','A')}
                  dur="46s" repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.14;0.32;0.54;0.72;0.88;1"
                  keySplines={`${KS5};0.4 0 0.6 1`}/>
              </path>

              {/* ── L4 main ribbon – fastest morph, sharpest shape transitions ── */}
              <path className="smoke-ribbon" d={S.B}>
                <animate attributeName="d"
                  values={v('B','E','A','D','F','C','B')}
                  dur="29s" repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.14;0.32;0.54;0.72;0.88;1"
                  keySplines={`${KS5c};0.2 0 0.8 1`}/>
              </path>

              {/* ── L5 tight core – counter-phase to ribbon ── */}
              <path className="smoke-core" d={S.F}>
                <animate attributeName="d"
                  values={v('F','B','D','A','E','C','F')}
                  dur="22s" repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.16;0.36;0.56;0.74;0.90;1"
                  keySplines={`${KS5c};0.1 0 0.9 1`}/>
              </path>

              {/* ── L6 bright highlight – yet another unique sequence ── */}
              <path className="smoke-highlight" d={S.E}>
                <animate attributeName="d"
                  values={v('E','D','B','F','A','C','E')}
                  dur="36s" repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.18;0.40;0.62;0.80;0.92;1"
                  keySplines={`${KS5b};0.3 0 0.7 1`}/>
              </path>

              {/* ── Dispersion wisp 1 – first peak, rises & drifts left ── */}
              <path className="smoke-wisp-1"
                d="M362 62 C354 44, 340 20, 330 -2 C320 -20, 322 -36, 332 -44">
                <animate attributeName="d"
                  values="M362 62 C354 44, 340 20, 330 -2 C320 -20, 322 -36, 332 -44;M354 66 C342 44, 322 14, 308 -12 C294 -34, 298 -54, 312 -62;M362 62 C354 44, 340 20, 330 -2 C320 -20, 322 -36, 332 -44"
                  dur="15s" repeatCount="indefinite"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines={KS2}/>
              </path>

              {/* ── Dispersion wisp 2 – second peak, rises straight ── */}
              <path className="smoke-wisp-2"
                d="M728 42 C722 22, 714 0, 708 -20 C702 -36, 706 -46, 716 -52">
                <animate attributeName="d"
                  values="M728 42 C722 22, 714 0, 708 -20 C702 -36, 706 -46, 716 -52;M720 48 C708 22, 694 -4, 686 -28 C678 -48, 684 -62, 698 -68;M728 42 C722 22, 714 0, 708 -20 C702 -36, 706 -46, 716 -52"
                  dur="19s" repeatCount="indefinite"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines={KS2}/>
              </path>

              {/* ── Dispersion wisp 3 – mid trough, breaks off diagonally ── */}
              <path className="smoke-wisp-3"
                d="M550 184 C556 164, 566 142, 578 124 C590 106, 604 98, 618 96">
                <animate attributeName="d"
                  values="M550 184 C556 164, 566 142, 578 124 C590 106, 604 98, 618 96;M558 188 C568 166, 582 142, 598 122 C614 102, 630 94, 648 90;M550 184 C556 164, 566 142, 578 124 C590 106, 604 98, 618 96"
                  dur="14s" repeatCount="indefinite"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines={KS2}/>
              </path>

              {/* ── Dispersion wisp 4 – left entry area, thin upward escape ── */}
              <path className="smoke-wisp-4"
                d="M244 115 C238 94, 228 70, 218 48 C208 28, 214 10, 226 4">
                <animate attributeName="d"
                  values="M244 115 C238 94, 228 70, 218 48 C208 28, 214 10, 226 4;M238 118 C228 94, 214 66, 202 42 C190 20, 198 0, 212 -6;M244 115 C238 94, 228 70, 218 48 C208 28, 214 10, 226 4"
                  dur="12s" repeatCount="indefinite"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines={KS2}/>
              </path>

              {/* ── Dispersion wisp 5 – third peak, rises & curls right ── */}
              <path className="smoke-wisp-5"
                d="M795 106 C802 84, 814 58, 822 36 C830 14, 824 -2, 812 -8">
                <animate attributeName="d"
                  values="M795 106 C802 84, 814 58, 822 36 C830 14, 824 -2, 812 -8;M800 110 C810 86, 824 58, 834 34 C844 10, 838 -8, 824 -14;M795 106 C802 84, 814 58, 822 36 C830 14, 824 -2, 812 -8"
                  dur="20s" repeatCount="indefinite"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines={KS2}/>
              </path>

              {/* ── Flow-back curl 1 – large curl near right end ── */}
              <path className="smoke-flowback"
                d="M876 168 C858 148, 840 126, 832 108 C824 90, 832 72, 848 78 C864 84, 872 108, 864 134">
                <animate attributeName="d"
                  values="M876 168 C858 148, 840 126, 832 108 C824 90, 832 72, 848 78 C864 84, 872 108, 864 134;M884 174 C866 154, 848 132, 840 112 C832 92, 840 72, 858 78 C876 84, 884 110, 874 138;M876 168 C858 148, 840 126, 832 108 C824 90, 832 72, 848 78 C864 84, 872 108, 864 134"
                  dur="24s" repeatCount="indefinite"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines={KS2}/>
              </path>

              {/* ── Flow-back curl 2 – smaller mid-stream curl near first loop ── */}
              <path className="smoke-flowback-2"
                d="M444 108 C454 88, 472 72, 488 80 C504 88, 508 112, 494 126">
                <animate attributeName="d"
                  values="M444 108 C454 88, 472 72, 488 80 C504 88, 508 112, 494 126;M450 112 C460 92, 478 76, 494 84 C510 92, 514 118, 498 132;M444 108 C454 88, 472 72, 488 80 C504 88, 508 112, 494 126"
                  dur="17s" repeatCount="indefinite"
                  calcMode="spline" keyTimes="0;0.5;1" keySplines={KS2}/>
              </path>
            </svg>
          </div>
          <div className="brand-mark" aria-hidden="true">
            <img src={logoImage} alt="" />
          </div>
          <div className="brand-copy">
            <h1>Cannabis Store Vienna</h1>
            <p>Premium Menu</p>
          </div>
        </div>
        <div className="header-divider" />
      </header>

      <div className="menu-grid">
        {sections.map((section) => (
          <MenuSection
            key={section.titleDe}
            titleDe={section.titleDe}
            titleEn={section.titleEn}
            items={section.items}
            groups={section.groups}
            activeMenuId={activeMenuId}
          />
        ))}
      </div>
    </section>
  );
}

export default CannastoreMenu;
