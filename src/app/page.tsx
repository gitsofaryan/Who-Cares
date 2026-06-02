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
  const downloadCardRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const num = parseInt(salary.replace(/\D/g, ""));
    if (!isNaN(num) && num > 0) {
      setStats(calculateStats(num));
    } else {
      setStats(null);
    }
  };

  const downloadImage = async () => {
    if (!downloadCardRef.current) return;
    try {
      // 1. Wait for web fonts (Inter, Space Mono, Archivo Black) to be fully loaded
      await document.fonts.ready;

      // 2. Save current scroll position & scroll to top temporarily
      // This completely solves coordinates calculation shift bugs in html2canvas
      const scrollPos = window.scrollY;
      window.scrollTo(0, 0);

      // Wait a short delay to allow viewport layout to recalculate
      await new Promise((resolve) => setTimeout(resolve, 80));

      const canvas = await html2canvas(downloadCardRef.current, {
        backgroundColor: "#0B0A0A", // Matches CSS rich black card background
        scale: 3, // Set scale to 3 for ultra-crisp high-res output text
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: downloadCardRef.current.offsetWidth,
        height: downloadCardRef.current.offsetHeight,
        windowWidth: downloadCardRef.current.scrollWidth,
        windowHeight: downloadCardRef.current.scrollHeight
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "who-cares-card.png";
      link.href = dataUrl;
      link.click();

      // 3. Restore user scroll position
      window.scrollTo(0, scrollPos);
    } catch (error) {
      console.error("Error generating image", error);
    }
  };



  const shareToX = () => {
    if (!stats) return;
    const text = `I'm in the TOP ${stats.topPercent}% of all 140 crore Indians · ELITE ⚡\n\nFind out where you stand at:`;
    const url = "https://who-caress.vercel.app";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  const copyToClipboard = () => {
    if (!stats) return;
    const textToCopy = `I am in the TOP ${stats.topPercent}% of all 140 crore Indians · ${parseFloat(stats.topPercent) < 1 ? "ELITE ⚡" : parseFloat(stats.topPercent) < 10 ? "SOLID 🚀" : "HUSTLING 🛠️"}\n\n` +
      `Earn more than me: ${formatLakhCroreFull(stats.earnMore)}\n` +
      `Earn less than me: ${formatLakhCroreFull(stats.earnLess)}\n\n` +
      `Calculate yours at: https://who-caress.vercel.app`;

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
          WHO-CARESS.VERCEL.APP · INDIA SALARY RANK
        </div>

        {/* Headline */}
        <h1 className="main-title">
          <span className="kya">
            WHO <span className="title-emoji">🤑</span>
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
                <div style={{ fontSize: "12px", color: "#8c8a85", fontWeight: 600, letterSpacing: "1px", marginBottom: "5px" }}>
                  WHO-CARESS.VERCEL.APP
                </div>

                <div className="share-card-header">
                  <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#8c8a85", fontWeight: 600, letterSpacing: "0.5px" }}>
                    I am in the
                  </div>
                  <h2>TOP {stats.topPercent}%</h2>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-white)", letterSpacing: "0.5px" }}>
                    of all 140 crore Indians · {getBadgeSuffix(stats.topPercent)}
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
                    <span className="left-part">📱 Buy an <strong>iPhone 16 Pro</strong> every single month · flex</span>
                  </li>
                  <li className="share-card-list-item">
                    <span className="left-part">✈️ Book <strong>{stats.flights} Delhi → Mumbai flights</strong> with one month's salary</span>
                  </li>
                </ul>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#8c8a85", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "12px", marginTop: "15px" }}>
                  <span>who-caress.vercel.app</span>
                  <span>by 𝕏 ARIEN</span>
                </div>
              </div>
            </div>

            {/* 2. Control Buttons */}
            <div className="action-buttons-group">
              <button className="action-btn action-btn-save" onClick={downloadImage}>
                <span>📥</span> Save Feed Card as Image
              </button>
              <button className="action-btn action-btn-share" onClick={shareToX}>
                <span>𝕏</span> Post on 𝕏
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
                  <div className="detail-stat-value color-red">{formatLakhCroreFull(stats.earnMore)}</div>
                </div>
                <div className="detail-stat-box">
                  <div className="detail-stat-label">Earn less than you</div>
                  <div className="detail-stat-value color-green">{formatLakhCroreFull(stats.earnLess)}</div>
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
                <div className="compare-row-left" style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
                  <span className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#F0EDE6", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", flexShrink: 0 }}>🏚️</span>
                  <div>
                    <div className="compare-row-title">Bihar</div>
                    <div className="compare-row-desc">
                      Bihar is India's poorest large state · median income just ₹3,200/mo. You beat 99%+ of them.
                    </div>
                  </div>
                </div>
                <div className="compare-row-right">
                  <div className="compare-row-percent">{stats.biharPercentile}%</div>
                  <div className="compare-row-sub">You Beat</div>
                </div>
              </div>

              <div className="compare-row">
                <div className="compare-row-left" style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
                  <span className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#F0EDE6", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", flexShrink: 0 }}>💻</span>
                  <div>
                    <div className="compare-row-title">Bengaluru</div>
                    <div className="compare-row-desc">
                      Even in India's Silicon Valley, you beat {100 - parseFloat(stats.blrPercentile)}% of Bengalureans. Solid.
                    </div>
                  </div>
                </div>
                <div className="compare-row-right">
                  <div className="compare-row-percent">{100 - parseFloat(stats.blrPercentile)}%</div>
                  <div className="compare-row-sub">You Beat</div>
                </div>
              </div>

              <div className="compare-row">
                <div className="compare-row-left" style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "center" }}>
                  <span className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#F0EDE6", borderRadius: "50%", width: "40px", height: "40px", fontSize: "18px", flexShrink: 0 }}>🏛️</span>
                  <div>
                    <div className="compare-row-title">Delhi</div>
                    <div className="compare-row-desc">
                      Even in the capital, you beat {100 - parseFloat(stats.delPercentile)}% of Delhiites. Impressive.
                    </div>
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
          <span>· WHO-CARESS.VERCEL.APP ·</span>
          <span>NO ONE CARES BUT YOU</span>
          <span>· WHO-CARESS.VERCEL.APP ·</span>
          <span>NO ONE CARES BUT YOU</span>
          <span>· WHO-CARESS.VERCEL.APP ·</span>
          <span>NO ONE CARES BUT YOU</span>
          <span>· WHO-CARESS.VERCEL.APP ·</span>
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
        <div className="offscreen-container">
          {/* Cloned Feed Card for High-Res Download (Zero responsive clipping) */}
          <div ref={downloadCardRef} className="share-card download-card-render">
            <IndiaMap />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "12px", color: "#8c8a85", fontWeight: 600, letterSpacing: "1px", marginBottom: "5px" }}>
                WHO-CARESS.VERCEL.APP
              </div>

              <div className="share-card-header">
                <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#8c8a85", fontWeight: 600, letterSpacing: "0.5px" }}>
                  I am in the
                </div>
                <h2>TOP {stats.topPercent}%</h2>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-white)", letterSpacing: "0.5px" }}>
                  of all 140 crore Indians · {getBadgeSuffix(stats.topPercent)}
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
                  <span className="left-part">📱 Buy an <strong>iPhone 16 Pro</strong> every single month · flex</span>
                </li>
                <li className="share-card-list-item">
                  <span className="left-part">✈️ Book <strong>{stats.flights} Delhi → Mumbai flights</strong> with one month's salary</span>
                </li>
              </ul>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#8c8a85", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "12px", marginTop: "15px" }}>
                <span>who-caress.vercel.app</span>
                <span>by 𝕏 ARIEN</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
