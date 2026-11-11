import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  {
    image: "/images/hero-idc-datacenter.webp",
    kicker: "国内高防",
    title: "国内高防，专注 DDoS 防护",
    description: "面向国内网站、游戏和在线服务，按业务流量与攻击风险规划防护。",
    link: "查看产品配置",
  },
  {
    image: "/images/hero-idc-edge.webp",
    kicker: "防护方案选型",
    title: "按业务场景规划防护",
    description: "结合用户分布、正常流量和历史攻击峰值，评估接入方式与防护需求。",
    link: "对比产品配置",
  },
  {
    image: "/images/hero-game-shield.webp",
    kicker: "游戏业务 DDoS 防护",
    title: "高防游戏盾 · 百 T 级防护",
    description: "面向游戏登录、网关和长连接场景。实际防护容量与接入条件以方案确认为准。",
    link: "了解游戏盾方案",
    gameShield: true,
  },
];
const rotationDelay = 6000;

export default function HeroCarousel({ onGameShield }: { onGameShield: () => void }) {
  const heroRef = useRef<HTMLElement>(null);
  const [frame, setFrame] = useState({ active: 0, previous: -1, direction: 1 });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const current = slides[frame.active];
  const canRotate = visible && motionAllowed && !paused && !hovered && !focused;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const updateVisibility = () => setVisible(inView && !document.hidden);
    const updateMotion = () => setMotionAllowed(!motion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      updateVisibility();
    }, { threshold: 0.2 });

    observer.observe(hero);
    document.addEventListener("visibilitychange", updateVisibility);
    motion.addEventListener("change", updateMotion);
    updateMotion();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      motion.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    if (!canRotate) return;
    const timer = window.setTimeout(() => {
      setFrame(({ active }) => ({ active: (active + 1) % slides.length, previous: active, direction: 1 }));
    }, rotationDelay);
    return () => window.clearTimeout(timer);
  }, [canRotate, frame]);

  function move(direction: number) {
    setFrame(({ active }) => ({
      active: (active + direction + slides.length) % slides.length,
      previous: active,
      direction,
    }));
  }

  function select(index: number) {
    setFrame(current => index === current.active ? current : {
      active: index,
      previous: current.active,
      direction: Math.sign(index - current.active),
    });
  }

  return (
    <section
      ref={heroRef}
      className="hero"
      id="top"
      aria-labelledby="hero-title"
      aria-roledescription="轮播图"
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div className="hero-inner container">
        <div className="hero-copy">
          <div className="hero-message" aria-live={canRotate ? "off" : "polite"} aria-atomic="true">
            <span className="hero-kicker">{current.kicker}</span>
            <h1 id="hero-title">{current.title}</h1>
            <p>{current.description}</p>
            {current.gameShield ? (
              <button type="button" className="hero-link" onClick={onGameShield}>{current.link}<ArrowRight size={17} /></button>
            ) : (
              <a href="#products" className="hero-link">{current.link}<ArrowRight size={17} /></a>
            )}
          </div>
          <div className="hero-dots" role="group" aria-label="选择主视觉内容">
            <button
              type="button"
              className="hero-rotation"
              aria-label={paused ? "继续自动轮播" : "暂停自动轮播"}
              onClick={() => setPaused(value => !value)}
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>
            {slides.map(({ image }, index) => (
              <button
                type="button"
                key={image}
                aria-label={`第 ${index + 1} 张主视觉`}
                aria-pressed={frame.active === index}
                className="hero-dot"
                onClick={() => select(index)}
              />
            ))}
          </div>
        </div>
        <div className="hero-visual" data-direction={frame.direction} aria-hidden="true">
          {slides.map(({ image }, index) => (
            <img
              key={image}
              className={index === frame.active ? (frame.previous < 0 ? "is-current" : "is-entering") : index === frame.previous ? "is-leaving" : undefined}
              src={image}
              width={1536}
              height={1024}
              alt=""
              fetchPriority={index === 0 ? "high" : "low"}
            />
          ))}
        </div>
      </div>
      <button className="hero-arrow hero-prev" type="button" aria-label="上一张主视觉" onClick={() => move(-1)}><ChevronLeft size={24} /></button>
      <button className="hero-arrow hero-next" type="button" aria-label="下一张主视觉" onClick={() => move(1)}><ChevronRight size={24} /></button>
    </section>
  );
}
