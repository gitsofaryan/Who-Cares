"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { calculateStats } from "@/utils/calculator";
import IndiaMap from "@/components/IndiaMap";

// Helper functions for matching exact statistics presentation formats
function formatLakhCroreCompact(num: number) {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + "CR";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(0) + "L";
  } else {
    return (num / 1000).toFixed(0) + "K";
  }
}

function formatLakhCroreFull(num: number) {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + " CRORE";
  } else if (num >= 100000) {
    return (num / 100000).toFixed(0) + " LAKH";
  } else {
    return num.toLocaleString('en-IN');
  }
}

export default function Home() {
  const [salary, setSalary] = useState<string>("");
  const [stats, setStats] = useState<ReturnType<typeof calculateStats> | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("📋 Copy text only");
  const cardRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const num = parseInt(salary.replace(/\D/g, ""));
    if (!isNaN(num) && num > 0) {
      setStats(calculateStats(num));
    } else {
      setStats(null);
    }
  };

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#121110",
        scale: 2,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "who-cares-card.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image", error);
    }
  };

  const downloadInstaStory = async () => {
    if (!storyRef.current) return;
    try {
      const canvas = await html2canvas(storyRef.current, {
        backgroundColor: "#FF4D00",
        scale: 1,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "who-cares-instagram-story.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating Instagram Story image", error);
    }
  };

  const shareToX = () => {
    if (!stats) return;
    const text = `I'm in the TOP ${stats.topPercent}% of all 140 crore Indians  ELITE ⚡\n\nFind out where you stand at:`;
    const url = "https://whocares.vercel.app";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  const copyToClipboard = () => {
    if (!stats) return;
    const textToCopy = `I am in the TOP ${stats.topPercent}% of all 140 crore Indians  ${parseFloat(stats.topPercent) < 1 ? "ELITE ⚡" : parseFloat(stats.topPercent) < 10 ? "SOLID 🚀" : "HUSTLING 🛠️"}\n\n` +
      `Earn more than me: ${formatLakhCroreFull(stats.earnMore)}\n` +
      `Earn less than me: ${formatLakhCroreFull(stats.earnLess)}\n\n` +
      `Calculate yours at: https://whocares.vercel.app`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus("Copied! ✅");
      setTimeout(() => setCopyStatus("📋 Copy text only"), 2000);
    });
  };

  // State dynamic badge suffixes
  const getBadgeSuffix = (topPercent: string) => {
    const val = parseFloat(topPercent);
    if (val < 1) return "ELITE ⚡";
    if (val < 10) return "SOLID 🚀";
    return "HUSTLING 🛠️";
  };

  // Calculate WagonR savings rate (WagonR cost approx 5.5L)
  const getWagonRMonths = (monthlySalary: number) => {
    const cost = 550000;
    return (cost / monthlySalary).toFixed(1);
  };

  return (
    <div className="page-wrapper">
      <IndiaMap />
      <div className="container">

        {/* Top Header Badge */}
        <div style={{ display: "flex", justifyContent: "flex-start", position: "relative", zIndex: 2 }}>
          <div className="creator-pill">
            Created by <span style={{ marginLeft: "5px", fontWeight: "bold" }}>𝕏 ARIEN</span>
          </div>
        </div>

        {/* Overline branding */}
        <div className="overline">
          WHOCARES.VERCEL.APP · INDIA SALARY RANK
        </div>

        {/* Headline */}
        <h1 className="main-title">
          <span className="kya">
            WHO <span className="title-emoji"></span>
          </span>
          <span className="cares">CARES?</span>
        </h1>

        {/* Subtitle */}
        <p className="subtitle">
          Enter your monthly salary. Find out exactly where you stand among all 140 crore Indians  and get a card worth posting.
        </p>

        <div className="divider"></div>

        {/* Input Fields */}
        <label className="form-label">YOUR MONTHLY SALARY (TAKE-HOME)</label>

        <div className="input-group">
          <div className="input-currency">₹</div>
          <input
            type="text"
            inputMode="numeric"
            className="input-field"
            placeholder="50000"
            value={salary ? `${parseInt(salary.replace(/\D/g, "") || "0").toLocaleString('en-IN')}` : ""}
            onChange={(e) => setSalary(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
          />
          <button className="input-btn" onClick={handleCalculate}>
            CALCULATE
          </button>
        </div>

        <p className="under-text">
          In rupees · monthly · before or after tax, whatever feels like your number
        </p>

        {stats && (
          <div style={{ marginTop: "35px" }}>

            {/* 1. The Dark Share Card Component */}
            <div ref={cardRef} className="share-card">
              {/* Internal absolute dotted India map */}
              <IndiaMap />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "12px", color: "#666", fontWeight: 600, letterSpacing: "1px", marginBottom: "5px" }}>
                  WHOCARES.VERCEL.APP
                </div>

                <div className="share-card-header">
                  <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#666", fontWeight: 600, letterSpacing: "0.5px" }}>
                    I am in the
                  </div>
                  <h2>TOP {stats.topPercent}%</h2>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-black)", letterSpacing: "0.5px" }}>
                    of all 140 crore Indians  {getBadgeSuffix(stats.topPercent)}
                  </div>
                </div>

                <div className="share-card-stats-grid">
                  <div className="share-card-stat-box">
                    <div className="share-card-stat-label">Earn more than me</div>
                    <div className="share-card-stat-value">{formatLakhCroreCompact(stats.earnMore)}</div>
                  </div>
                  <div className="share-card-stat-box">
                    <div className="share-card-stat-label">Earn less than me</div>
                    <div className="share-card-stat-value">
                      {formatLakhCroreCompact(stats.earnLess)}
                    </div>
                  </div>
                </div>

                <div className="share-card-section-title">State Comparisons</div>
                <ul className="share-card-list">
                  <li className="share-card-list-item">
                    <span className="left-part">🏚️ Bihar</span>
                    <span className="right-part">TOP &lt;1% · BEATS 99%+</span>
                  </li>
                  <li className="share-card-list-item">
                    <span className="left-part">💻 Bengaluru</span>
                    <span className="right-part">TOP {stats.blrPercentile}% · BEATS {100 - parseFloat(stats.blrPercentile)}%</span>
                  </li>
                  <li className="share-card-list-item">
                    <span className="left-part">🏛️ Delhi</span>
                    <span className="right-part">TOP {stats.delPercentile}% · BEATS {100 - parseFloat(stats.delPercentile)}%</span>
                  </li>
                </ul>

                <div className="share-card-section-title">With this salary I could</div>
                <ul className="share-card-list" style={{ marginBottom: "15px" }}>
                  <li className="share-card-list-item">
                    <span className="left-part">🍺 Buy <strong>{stats.beers.toLocaleString('en-IN')} Kingfisher beers</strong> every month</span>
                  </li>
                  <li className="share-card-list-item">
                    <span className="left-part">📱 Buy an <strong>iPhone 16 Pro</strong> every single month  flex</span>
                  </li>
                  <li className="share-card-list-item">
                    <span className="left-part">✈️ Book <strong>{stats.flights} Delhi → Mumbai flights</strong> with one month's salary</span>
                  </li>
                </ul>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#666", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "12px", marginTop: "15px" }}>
                  <span>whocares.vercel.app</span>
                  <span>by 𝕏 ARIEN</span>
                </div>
              </div>
            </div>

            {/* 2. Four Control Buttons */}
            <div className="action-buttons-group">
              <button className="action-btn action-btn-save" onClick={downloadImage}>
                <span>📥</span> Save Feed Card as Image
              </button>
              <button className="action-btn" style={{ backgroundColor: "#FF007F", color: "var(--text-black)", borderColor: "var(--text-black)" }} onClick={downloadInstaStory}>
                <span>📸</span> Save Instagram Story / Reel (9:16)
              </button>
              <button className="action-btn action-btn-share" onClick={shareToX}>
                <span>𝕏</span> Post on 𝕏 (download image first, then attach)
              </button>
              <button className="action-btn action-btn-copy" onClick={copyToClipboard}>
                {copyStatus}
              </button>
            </div>
          </div>
        )}
      </div>

      {stats && (
        <div className="marquee-container" style={{ margin: "40px 0" }}>
          <div className="marquee-content" style={{ display: "flex", gap: "20px" }}>
            <span>BEGIN YOUR REALITY CHECK</span>
            <span>· WHO CARES? ·</span>
            <span>BEGIN YOUR REALITY CHECK</span>
            <span>· WHO CARES? ·</span>
            <span>BEGIN YOUR REALITY CHECK</span>
            <span>· WHO CARES? ·</span>
            <span>BEGIN YOUR REALITY CHECK</span>
            <span>· WHO CARES? ·</span>
            <span>BEGIN YOUR REALITY CHECK</span>
            <span>· WHO CARES? ·</span>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: 0 }}>
        {stats && (
          <div>
            {/* Panel 1: Your Rank */}
            <div className="detail-panel">
              <div className="detail-panel-label">Your rank among all Indians</div>
              <div className="detail-panel-title">TOP {stats.topPercent}%</div>

              <p className="detail-panel-desc" style={{ wordBreak: "break-all" }}>
                You earn more than <strong>{stats.percentile.toFixed(1)}%</strong> of all Indians. The median Indian earns <strong>₹5,917/month</strong>  yours is <strong>{Number(stats.multiplier).toLocaleString('en-IN')}×</strong> that. By any measure, you are {parseFloat(stats.topPercent) < 1 ? "rich" : parseFloat(stats.topPercent) < 10 ? "middle class" : "hustling"}.
              </p>

              <div className="detail-stats-grid">
                <div className="detail-stat-box">
                  <div className="detail-stat-label">Earn more than you</div>
                  <div className="detail-stat-value">{formatLakhCroreFull(stats.earnMore)}</div>
                </div>
                <div className="detail-stat-box">
                  <div className="detail-stat-label">Earn less than you</div>
                  <div className="detail-stat-value">{formatLakhCroreFull(stats.earnLess)}</div>
                </div>
              </div>

              {/* Dotted/Styled Progress slider */}
              <div className="progress-slider-wrapper">
                <div
                  className="progress-indicator"
                  style={{ left: `${Math.max(4, Math.min(96, stats.percentile))}%` }}
                >
                  <div className="progress-indicator-label">YOU</div>
                  <div className="progress-indicator-line"></div>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.max(0, Math.min(100, stats.percentile))}%` }}
                  ></div>
                </div>
                <div className="progress-labels">
                  <span>Poorest</span>
                  <span>Richest</span>
                </div>
              </div>

              <div style={{ textAlign: "center", fontSize: "11.5px", color: "var(--text-black)", marginTop: "18px", fontFamily: "var(--font-tech)" }}>
                India's median monthly income: <strong style={{ color: "var(--accent-color)" }}>₹5,917</strong> · Your salary is <strong style={{ color: "var(--accent-color)" }}>{Number(stats.multiplier).toLocaleString('en-IN')}× the median</strong>
              </div>
            </div>

            {/* Panel 2: State by State */}
            <div className="detail-panel">
              <div className="detail-panel-label">How you compare, state by state</div>

              <div className="compare-row">
                <div className="compare-row-left">
                  <div className="compare-row-title">🏚️ Bihar</div>
                  <div className="compare-row-desc">
                    Bihar is India's poorest large state  median income just ₹3,200/mo. You beat 100% of them.
                  </div>
                </div>
                <div className="compare-row-right">
                  <div className="compare-row-percent">{stats.biharPercentile}%</div>
                  <div className="compare-row-sub">You Beat</div>
                </div>
              </div>

              <div className="compare-row">
                <div className="compare-row-left">
                  <div className="compare-row-title">💻 Bengaluru</div>
                  <div className="compare-row-desc">
                    Even in India's Silicon Valley, you beat {100 - parseFloat(stats.blrPercentile)}% of Bengalureans. Solid.
                  </div>
                </div>
                <div className="compare-row-right">
                  <div className="compare-row-percent">{100 - parseFloat(stats.blrPercentile)}%</div>
                  <div className="compare-row-sub">You Beat</div>
                </div>
              </div>

              <div className="compare-row">
                <div className="compare-row-left">
                  <div className="compare-row-title">🏛️ Delhi</div>
                  <div className="compare-row-desc">
                    Even in the capital, you beat {100 - parseFloat(stats.delPercentile)}% of Delhiites. Impressive.
                  </div>
                </div>
                <div className="compare-row-right">
                  <div className="compare-row-percent">{100 - parseFloat(stats.delPercentile)}%</div>
                  <div className="compare-row-sub">You Beat</div>
                </div>
              </div>
            </div>

            {/* Panel 3: What salary can buy */}
            <div className="detail-panel">
              <div className="detail-panel-label">What your salary can buy</div>

              <div className="buy-list-item">
                <span className="icon">🚗</span>
                <div>
                  Buy a Maruti WagonR every <strong>{getWagonRMonths(parseInt(salary.replace(/\D/g, "")))} months</strong> of saving (if you saved your entire salary)
                </div>
              </div>

              <div className="buy-list-item">
                <span className="icon">✈️</span>
                <div>
                  Book <strong>{stats.flights} DelhiMumbai flights</strong> with one month's salary
                </div>
              </div>

              <div className="buy-list-item">
                <span className="icon">📱</span>
                <div>
                  Buy an <strong>iPhone 16 Pro</strong> every single month  flex
                </div>
              </div>

              <div className="buy-list-item">
                <span className="icon">🏠</span>
                <div>
                  Mumbai 1BHK rent (₹35k/mo) would eat <strong>{stats.rentPct}%</strong> of your salary
                </div>
              </div>

              <div className="buy-list-item">
                <span className="icon">🍺</span>
                <div>
                  Buy <strong>{stats.beers.toLocaleString('en-IN')} Kingfisher beers</strong> every month
                </div>
              </div>
            </div>

            {/* Context Box */}
            <div className="context-box">
              <strong>Context:</strong> India has ~140 crore people but only 8.2 crore file income taxes  because 90%+ work in the informal sector (farming, daily labour, small trade). This calculator covers all workers, not just taxpayers. If ₹2,50,000/month feels ordinary, it's because you compare yourself to your city peers  not to all of India.
            </div>

          </div>
        )}

      </div>

      <div className="marquee-container" style={{ marginTop: "40px" }}>
        <div className="marquee-content" style={{ display: "flex", gap: "20px" }}>
          <span>NO ONE CARES BUT YOU</span>
          <span>· WHOCARES.VERCEL.APP ·</span>
          <span>NO ONE CARES BUT YOU</span>
          <span>· WHOCARES.VERCEL.APP ·</span>
          <span>NO ONE CARES BUT YOU</span>
          <span>· WHOCARES.VERCEL.APP ·</span>
          <span>NO ONE CARES BUT YOU</span>
          <span>· WHOCARES.VERCEL.APP ·</span>
        </div>
      </div>

      {/* Blackish Bottom Footer */}
      <footer className="black-footer">
        <div className="black-footer-branding">
          Built by <a href="https://x.com/aryanjain1506" target="_blank" rel="noopener noreferrer"><strong>@aryanjain1506</strong></a>  follow for more
        </div>
        <p className="black-footer-disclaimer">
          <strong>Data:</strong> PLFS 2023-24 (Ministry of Labour) · World Inequality Database 2024 · RBI Per Capita NSDP 2024-25 · CMIE CPHS. <br /><br />
          All figures are estimates based on survey distributions. State comparisons use relative income modelling against state median wages.
        </p>
      </footer>

      {stats && (
        <div ref={storyRef} className="insta-story-wrapper">
          <div className="insta-story-bg-map">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              preserveAspectRatio="xMidYMid meet"
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <pattern
                  id="story-india-dots"
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="4" height="4" fill="rgba(0,0,0,0.15)" rx="1" />
                </pattern>
              </defs>
              <g
                transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
                fill="url(#story-india-dots)"
                stroke="none"
              >
                <path d="M4040 10225 c-14 -8 -40 -14 -58 -15 -64 0 -119 -22 -173 -66 -57 -47 -124 -77 -199 -89 -25 -4 -89 -29 -142 -56 l-97 -49 -17 -56 c-9 -33 -30 -71 -49 -92 -31 -34 -35 -36 -121 -42 -71 -5 -104 -13 -158 -38 -83 -39 -130 -40 -211 -7 -33 14 -91 30 -130 36 -38 6 -86 19 -106 29 -46 24 -69 26 -152 16 -65 -8 -68 -10 -82 -43 -21 -50 -19 -76 10 -103 16 -15 25 -35 25 -54 0 -17 7 -40 15 -50 22 -30 18 -58 -12 -82 -27 -21 -27 -24 -16 -65 10 -38 9 -50 -8 -88 -10 -24 -19 -51 -19 -60 0 -9 28 -44 63 -77 101 -97 102 -98 156 -95 54 2 47 11 67 -89 5 -26 12 -32 57 -44 29 -8 69 -17 90 -21 43 -7 49 -28 18 -66 -15 -19 -30 -24 -84 -27 -62 -4 -67 -6 -95 -42 -17 -20 -45 -43 -63 -50 l-32 -13 5 -123 c5 -137 -1 -162 -49 -196 -17 -13 -61 -60 -97 -106 -50 -63 -66 -90 -66 -115 0 -57 -9 -71 -56 -91 -58 -24 -107 -86 -205 -257 -77 -134 -85 -141 -164 -154 -64 -11 -92 -30 -110 -78 -10 -27 -34 -58 -60 -80 -54 -45 -101 -127 -110 -190 -4 -26 -12 -50 -17 -53 -5 -3 -30 2 -54 11 -31 12 -58 15 -87 11 -23 -4 -83 -9 -134 -12 l-92 -6 -3 49 c-3 47 -4 48 -38 51 -54 4 -102 -41 -136 -128 -25 -64 -34 -75 -96 -121 -37 -28 -68 -57 -68 -63 0 -7 -9 -21 -21 -32 -12 -10 -30 -31 -40 -46 -25 -35 -12 -72 33 -91 18 -8 44 -26 58 -41 21 -23 30 -26 61 -21 31 5 39 3 52 -16 17 -24 14 -65 -9 -111 -24 -47 -17 -87 27 -160 l41 -68 54 0 c53 0 54 0 54 -30 0 -16 11 -64 25 -107 14 -43 25 -94 25 -114 0 -28 6 -39 25 -49 22 -12 24 -18 19 -49 -3 -20 -15 -44 -26 -54 -17 -14 -19 -22 -11 -39 7 -16 5 -30 -6 -50 -14 -24 -23 -28 -58 -28 -36 0 -44 4 -48 23 -6 22 -7 22 -100 13 -78 -8 -96 -13 -101 -28 -9 -28 -70 -24 -118 10 -41 28 -41 28 -281 35 l-50 2 -3 -46 c-3 -43 -5 -47 -34 -53 -17 -3 -49 -6 -73 -6 -46 0 -82 -27 -72 -55 8 -20 122 -20 157 0 32 18 40 18 40 1 0 -8 -17 -20 -37 -27 -21 -6 -44 -16 -50 -22 -24 -18 -14 -76 27 -157 35 -69 44 -80 66 -80 15 0 48 -16 73 -35 56 -40 109 -54 211 -53 69 1 78 3 107 31 28 26 37 29 77 25 25 -3 49 -1 55 5 7 7 12 5 17 -7 10 -27 -46 -107 -104 -147 -38 -27 -65 -38 -106 -42 -31 -3 -66 -13 -78 -21 -35 -25 -95 -20 -130 9 -16 14 -35 25 -42 25 -18 0 -36 -21 -36 -42 0 -25 74 -143 125 -198 22 -25 57 -70 78 -100 20 -30 95 -123 166 -206 116 -135 134 -152 168 -157 26 -5 45 -2 62 9 17 12 37 15 73 11 41 -5 61 -1 126 27 42 19 87 37 99 40 12 4 31 18 42 32 13 16 29 24 51 24 38 0 69 32 70 73 0 19 12 38 40 63 47 43 51 76 20 147 l-21 46 27 63 c24 59 38 77 57 78 4 0 7 -6 7 -12 0 -28 17 -40 37 -30 11 6 25 7 33 2 11 -7 7 -15 -19 -39 -28 -26 -32 -36 -26 -59 3 -15 7 -43 9 -62 1 -19 8 -46 15 -59 11 -20 19 -23 49 -18 21 3 45 8 56 13 14 5 17 3 14 -7 -5 -14 -26 -23 -80 -34 -21 -4 -34 -18 -53 -55 -31 -62 -32 -87 -1 -101 21 -10 25 -20 31 -83 3 -39 13 -82 22 -94 18 -29 11 -62 -22 -114 -14 -20 -29 -56 -35 -80 -21 -93 -3 -256 34 -296 18 -20 17 -22 -9 -57 -27 -34 -27 -36 -10 -55 10 -11 31 -20 47 -20 25 0 28 -4 28 -31 0 -16 -9 -47 -19 -67 -39 -76 -41 -97 -15 -136 20 -29 23 -40 14 -56 -9 -17 -7 -28 9 -54 15 -24 21 -50 21 -95 0 -54 4 -68 35 -113 35 -50 40 -76 15 -70 -7 1 -9 -4 -6 -15 19 -62 27 -127 36 -272 l10 -164 75 -115 c59 -90 75 -122 75 -151 0 -28 9 -48 40 -85 22 -26 40 -59 40 -71 0 -15 11 -32 30 -45 38 -27 86 -128 95 -200 4 -30 18 -74 31 -97 18 -31 24 -57 24 -100 0 -32 5 -76 10 -98 6 -22 15 -74 20 -115 7 -49 22 -99 44 -145 19 -38 41 -95 50 -125 11 -37 48 -101 116 -199 55 -79 100 -148 100 -154 0 -5 15 -44 34 -87 19 -42 37 -99 41 -126 10 -74 25 -114 62 -169 20 -30 33 -62 33 -81 0 -25 12 -42 59 -87 70 -67 104 -142 56 -124 -8 4 -15 18 -15 32 0 20 -5 25 -25 25 -25 0 -33 -14 -15 -25 6 -3 10 -35 10 -71 0 -57 4 -71 31 -110 17 -25 42 -73 56 -107 31 -77 123 -175 207 -220 33 -18 68 -45 80 -64 27 -42 49 -41 97 2 22 19 49 35 61 35 13 0 43 23 80 61 53 56 58 65 58 107 0 34 8 60 32 99 36 59 58 71 161 83 41 5 76 15 87 25 21 19 72 15 122 -11 43 -22 68 -18 68 11 0 21 -8 27 -66 45 -36 11 -72 20 -80 20 -16 0 -34 31 -34 58 0 10 15 39 33 63 44 57 107 171 107 192 0 13 10 16 53 16 28 -1 59 0 67 0 8 1 27 -1 42 -5 24 -5 29 -2 44 30 15 31 16 44 6 98 -9 44 -9 89 -3 147 8 77 7 88 -13 125 -27 52 -29 193 -4 241 9 17 19 48 23 69" />
              </g>
            </svg>
          </div>

          <div className="insta-story-header">
            <div className="insta-story-branding">WHOCARES.VERCEL.APP</div>
            <h1 className="insta-story-title">WHO CARES?</h1>
          </div>

          <div className="insta-story-card">
            <div>
              <div className="insta-story-rank-title">I am in the</div>
              <div className="insta-story-rank-value">TOP {stats.topPercent}%</div>
              <div className="insta-story-rank-sub">of all 140 crore Indians · {getBadgeSuffix(stats.topPercent)}</div>
            </div>

            <div className="insta-story-stats-grid">
              <div className="insta-story-stat-box">
                <div className="insta-story-stat-label">Earn more than me</div>
                <div className="insta-story-stat-value">{formatLakhCroreCompact(stats.earnMore)}</div>
              </div>
              <div className="insta-story-stat-box">
                <div className="insta-story-stat-label">Earn less than me</div>
                <div className="insta-story-stat-value">{formatLakhCroreCompact(stats.earnLess)}</div>
              </div>
            </div>

            <div className="insta-story-divider"></div>

            <div>
              <div className="insta-story-list-title">State Comparisons</div>
              <ul className="insta-story-list">
                <li className="insta-story-list-item">
                  <span>🏚️ Bihar</span>
                  <span className="right-part">TOP &lt;1% · BEATS 99%+</span>
                </li>
                <li className="insta-story-list-item">
                  <span>💻 Bengaluru</span>
                  <span className="right-part">TOP {stats.blrPercentile}% · BEATS {100 - parseFloat(stats.blrPercentile)}%</span>
                </li>
                <li className="insta-story-list-item">
                  <span>🏛️ Delhi</span>
                  <span className="right-part">TOP {stats.delPercentile}% · BEATS {100 - parseFloat(stats.delPercentile)}%</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="insta-story-footer">
            <div className="insta-story-footer-text">Find your rank at: whocares.vercel.app</div>
          </div>
        </div>
      )}
    </div>
  );
}
