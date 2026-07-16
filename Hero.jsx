"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { VoiceEngine } from "@/lib/voice";
import { CONFIG } from "@/lib/config";

const StageFX = dynamic(() => import("./StageFX"), { ssr: false });

const VIDEO_SRC = "/avatar-talking.mp4";
const AUDIO_SRC = "/audio/greeting.mp3";

export default function Hero() {
  const engine = useMemo(() => new VoiceEngine(), []);
  const ampRef = useRef(0);
  const [speaking, setSpeaking] = useState(false);
  const [caption, setCaption] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const root = useRef();

  // Detect an ML talking-video (exact lip sync) if the user added one
  useEffect(() => {
    fetch(VIDEO_SRC, { method: "HEAD" })
      .then((r) => {
        const ct = (r.headers.get("content-type") || "").toLowerCase();
        if (r.ok && ct.includes("video")) setHasVideo(true);
      })
      .catch(() => {});
  }, []);

  // Amplitude loop → CSS variable drives photo glow / breathing
  useEffect(() => {
    let raf;
    const loop = () => {
      let amp = engine.amplitude();
      if (hasVideo && videoRef.current && !videoRef.current.paused) {
        const t = performance.now() / 1000;
        amp = 0.5 + 0.3 * Math.abs(Math.sin(t * 5.7));
      }
      ampRef.current = amp;
      if (stageRef.current) stageRef.current.style.setProperty("--amp", amp.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [engine, hasVideo]);

  // GSAP entrance — one orchestrated moment
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-stage", { scale: 0.85, opacity: 0, duration: 1.1 })
        .from(".hero-photo", { y: 40, opacity: 0, duration: 1.0, ease: "power4.out" }, "-=0.7")
        .from(".hero-eyebrow", { y: 24, opacity: 0, duration: 0.6 }, "-=0.7")
        .from(".hero-title .line", { y: "110%", duration: 0.9, stagger: 0.12 }, "-=0.4")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.4")
        .from(".hero-stat", { y: 14, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3");
    }, root);
    return () => ctx.revert();
  }, []);

  // Word-by-word captions while speaking
  useEffect(() => {
    if (!speaking) { setCaption(""); return; }
    const words = CONFIG.greeting.split(/\s+/);
    const dur = hasVideo && videoRef.current?.duration
      ? videoRef.current.duration
      : engine.duration || 10;
    const per = (dur * 1000) / words.length;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setCaption(words.slice(Math.max(0, i - 9), i).join(" "));
      if (i >= words.length) clearInterval(id);
    }, per);
    return () => clearInterval(id);
  }, [speaking, engine, hasVideo]);

  const stopAll = () => {
    engine.stop();
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setSpeaking(false);
  };

  const speak = async () => {
    if (speaking) { stopAll(); return; }

    if (hasVideo && videoRef.current) {
      // Mode 1 — ML talking video: YOUR face, exact lip sync
      const v = videoRef.current;
      v.muted = false;
      v.currentTime = 0;
      v.onended = () => setSpeaking(false);
      await v.play().catch(() => {});
      setSpeaking(true);
    } else {
      // Mode 2 — natural mp3 voice / Mode 3 — browser voice
      engine.onEnd = () => setSpeaking(false);
      try {
        await engine.playAudio(AUDIO_SRC);
      } catch {
        engine.speakBrowser(CONFIG.greeting, CONFIG.browserVoice);
      }
      setSpeaking(true);
    }
    gsap.fromTo(".hero-stage", { scale: 0.98 }, { scale: 1, duration: 0.5, ease: "back.out(2)" });
  };

  return (
    <section className="hero" ref={root}>
      <div className="hero-copy">
        <p className="hero-eyebrow">◉ Available for opportunities</p>
        <h1 className="hero-title" aria-label="Kumara Vijay M G">
          <span className="mask"><span className="line">Kumara</span></span>
          <span className="mask"><span className="line">Vijay <em>M G</em></span></span>
        </h1>
        <p className="hero-sub">
          Freelance <strong>Data Analyst</strong> · <strong>Gen AI</strong> ·
          AI-powered <strong>full-stack</strong> apps
        </p>
        <div className="hero-actions">
          <button className="hero-cta primary" onClick={speak}>
            {speaking ? "■ Stop" : "▶ Meet me — hear my intro"}
          </button>
          <a className="hero-cta ghost" href="#projects">View projects</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><b>1M+</b><span>records analyzed</span></div>
          <div className="hero-stat"><b>4+</b><span>data projects</span></div>
          <div className="hero-stat"><b>3</b><span>certifications</span></div>
        </div>
      </div>

      <div className="hero-stage" ref={stageRef} data-speaking={speaking}>
        <div className="stage-glow" />
        <div className="stage-fx"><StageFX ampRef={ampRef} /></div>

        {hasVideo ? (
          <video
            ref={videoRef}
            className="hero-photo hero-video"
            src={VIDEO_SRC}
            playsInline
            preload="auto"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="hero-photo" src="/me-cutout.png" alt="Kumara Vijay" />
        )}

        <div className={`caption ${caption ? "on" : ""}`}>{caption}</div>
      </div>
    </section>
  );
}
