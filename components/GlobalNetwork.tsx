"use client";

import { useState } from "react";
import { Globe2, MapPin, Network } from "lucide-react";
import "./global-network.css";

const regions = [
  { name: "中国大陆", code: "CN", description: "面向国内用户，结合华南、华东等区域规划部署。", x: 450, y: 165 },
  { name: "中国香港", code: "HK", description: "面向跨区域业务，比较接入网络与应用依赖。", x: 477, y: 227 },
  { name: "国际美国", code: "US", description: "面向北美用户，按目标访问区域评估线路。", x: 690, y: 192 },
  { name: "国际日本", code: "JP", description: "面向日本及周边市场，规划相应的部署区域。", x: 561, y: 150 },
  { name: "国际韩国", code: "KR", description: "面向韩国及周边市场，结合业务需求选择节点。", x: 524, y: 185 },
];

export default function GlobalNetwork() {
  const [selected, setSelected] = useState(0);
  const active = regions[selected];

  return (
    <section className="nx-section" id="network" aria-labelledby="nx-title">
      <div className="container nx-container">
        <header className="nx-heading">
          <h2 id="nx-title">全球云计算资源 BGP链路</h2>
          <p>从业务部署到网络连接，让云资源更贴近你的用户</p>
        </header>

        <div className="nx-body">
          <div className="nx-copy">
            <div>
              <h3>国内互联</h3>
              <p>围绕主要用户分布，规划大陆区域及跨区域访问链路，让资源选择与业务需求相匹配。</p>
            </div>
            <div>
              <h3>国际互联</h3>
              <p>从业务的目标市场出发，了解不同地区的部署选择，为跨区域应用规划合适的网络连接。</p>
            </div>
          </div>

          <svg className="nx-globe" viewBox="0 0 880 460" fill="none" aria-hidden="true">
            <defs>
              <clipPath id="nx-sphere-clip"><circle cx="500" cy="405" r="370" /></clipPath>
              <linearGradient id="nx-globe-field" x1="500" y1="35" x2="500" y2="460" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--brand-wash)" stopOpacity=".78" />
                <stop offset="1" stopColor="var(--brand-soft)" stopOpacity=".25" />
              </linearGradient>
            </defs>
            <circle cx="500" cy="405" r="370" fill="url(#nx-globe-field)" stroke="var(--brand-line)" strokeWidth="1.2" />
            <g clipPath="url(#nx-sphere-clip)" stroke="var(--brand-line)" strokeWidth="1" opacity=".72">
              <ellipse cx="500" cy="405" rx="303" ry="370" />
              <ellipse cx="500" cy="405" rx="197" ry="370" />
              <ellipse cx="500" cy="405" rx="76" ry="370" />
              <ellipse cx="500" cy="405" rx="370" ry="295" />
              <ellipse cx="500" cy="405" rx="370" ry="198" />
              <ellipse cx="500" cy="405" rx="370" ry="92" />
              <path d="M130 405h740M500 35v740" />
            </g>
            <g stroke="var(--brand-line)" strokeWidth="1.4" strokeDasharray="4 7">
              <path d="M450 165Q550 65 690 192" />
              <path d="M477 227Q460 111 561 150" />
              <path d="M450 165Q480 133 524 185" />
              <path d="M477 227Q640 125 690 192" />
            </g>
            {regions.map((region, index) => (
              <g key={region.code}>
                <circle cx={region.x} cy={region.y} r={selected === index ? 18 : 9} fill="var(--brand)" opacity={selected === index ? .12 : .06} />
                <circle cx={region.x} cy={region.y} r={selected === index ? 6 : 4} fill={selected === index ? "var(--brand)" : "var(--subtle)"} stroke="var(--surface)" strokeWidth="2" />
                <text x={region.x + 14} y={region.y + 5} fill={selected === index ? "var(--brand-ink)" : "var(--subtle-ink)"} fontSize="12" fontWeight={selected === index ? 700 : 400}>{region.code}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="nx-region-rail" role="group" aria-label="查看网络区域">
          {regions.map((region, index) => (
            <button
              type="button"
              key={region.code}
              className={`nx-region${selected === index ? " nx-region-active" : ""}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className="nx-region-icon" aria-hidden="true">
                {index < 2 ? <MapPin size={32} strokeWidth={1.45} /> : <Globe2 size={34} strokeWidth={1.35} />}
                <span>{region.code}</span>
              </span>
              <span className="nx-region-name">{region.name}</span>
            </button>
          ))}
        </div>
        <div className="nx-bottomline">
          <p className="nx-current" aria-live="polite"><Network size={14} aria-hidden="true" /><strong>{active.name}</strong><span>{active.description}</span></p>
          <p className="nx-note">区域与线路为样板展示，不代表实际资源覆盖。</p>
        </div>
      </div>
    </section>
  );
}
