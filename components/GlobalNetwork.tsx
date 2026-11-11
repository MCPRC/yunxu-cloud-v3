"use client";

import { useState } from "react";
import { MapPin, Network } from "lucide-react";
import "./global-network.css";

const regions = [
  { name: "华南 · 广州", code: "GZ", description: "面向华南用户，可从接入时延、运营商分布和业务入口开始评估。", x: 520, y: 230 },
  { name: "华东 · 宁波", code: "NB", description: "面向华东用户，可比较主要运营商到业务入口的访问质量。", x: 650, y: 138 },
  { name: "华中 · 襄阳", code: "XY", description: "面向华中用户，可结合源站位置评估回源路径与时延。", x: 522, y: 138 },
  { name: "西南 · 昆明", code: "KM", description: "面向西南用户，可按正常峰值流量和业务协议核对接入需求。", x: 382, y: 176 },
  { name: "海南 · 海口", code: "HKU", description: "面向海南用户，可比较本地接入与跨省访问的实际表现。", x: 457, y: 275 },
];

export default function GlobalNetwork() {
  const [selected, setSelected] = useState(0);
  const active = regions[selected];

  return (
    <section className="nx-section" id="network" aria-labelledby="nx-title">
      <div className="container nx-container">
        <header className="nx-heading">
          <h2 id="nx-title">国内高防地域与线路选型</h2>
          <p>根据用户分布和业务入口，比较国内部署地域与接入线路</p>
        </header>

        <div className="nx-body">
          <div className="nx-copy">
            <div>
              <h3>选择部署地域</h3>
              <p>优先考虑主要用户所在区域，并结合源站位置与延迟要求比较部署地域。</p>
            </div>
            <div>
              <h3>评估接入线路</h3>
              <p>按用户运营商分布、业务协议和正常带宽评估线路，防护容量另按历史攻击情况评估。</p>
            </div>
          </div>

          <svg className="nx-diagram" viewBox="320 100 420 215" fill="none" aria-hidden="true">
            <rect x="322" y="102" width="416" height="211" rx="14" fill="var(--surface)" fillOpacity=".64" stroke="var(--line)" />
            <circle cx="553" cy="201" r="71" fill="var(--brand-soft)" />
            <circle cx="553" cy="201" r="93" stroke="var(--brand-line)" strokeDasharray="3 6" />
            {regions.map((region, index) => (
              <path key={region.code} d={`M553 201 L${region.x} ${region.y}`} stroke={selected === index ? "var(--brand)" : "var(--brand-line)"} strokeWidth="1.5" strokeDasharray={selected === index ? undefined : "4 5"} />
            ))}
            <circle cx="553" cy="201" r="27" fill="var(--surface)" stroke="var(--brand-line)" />
            <path d="M553 186c5 4 10 5 14 6v8c0 9-6 14-14 18-8-4-14-9-14-18v-8c4-1 9-2 14-6Z" fill="var(--brand-soft)" stroke="var(--brand)" strokeWidth="2" />
            <path d="m547 201 4 4 8-8" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {regions.map((region, index) => (
              <g key={region.code}>
                <circle cx={region.x} cy={region.y} r={selected === index ? 18 : 9} fill="var(--brand)" opacity={selected === index ? .12 : .06} />
                <circle cx={region.x} cy={region.y} r={selected === index ? 6 : 4} fill={selected === index ? "var(--brand)" : "var(--subtle)"} stroke="var(--surface)" strokeWidth="2" />
                <text x={region.x + 14} y={region.y + 5} fill={selected === index ? "var(--brand-ink)" : "var(--subtle-ink)"} fontSize="12" fontWeight={selected === index ? 700 : 400}>{region.code}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="nx-region-rail" role="group" aria-label="查看国内选型地域">
          {regions.map((region, index) => (
            <button
              type="button"
              key={region.code}
              className={`nx-region${selected === index ? " nx-region-active" : ""}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span className="nx-region-icon" aria-hidden="true">
                <MapPin size={32} strokeWidth={1.45} />
                <span>{region.code}</span>
              </span>
              <span className="nx-region-name">{region.name}</span>
            </button>
          ))}
        </div>
        <div className="nx-bottomline">
          <p className="nx-current" aria-live="polite"><Network size={14} aria-hidden="true" /><strong>{active.name}</strong><span>{active.description}</span></p>
          <p className="nx-note">点位与连线仅为选型示意。实际节点、线路与防护能力以方案确认为准。</p>
        </div>
      </div>
    </section>
  );
}
