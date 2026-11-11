"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, Cloud, Copy, Cpu, Headphones, MapPin, Server, ShieldCheck, X } from "lucide-react";
import "./product-catalog.css";

export type CategoryId = "cloud" | "hcs" | "metal" | "ssl";
type Billing = "monthly" | "yearly";
type ProductEntry = { id: string; name: string; tag?: string; description: string; detail: string; region?: string };
type ComputePlan = { name: string; monthlyPrice: number; specs: [string, string][] };

const categories = [
  { id: "cloud" as const, name: "弹性云服务器", code: "ECS", icon: Cloud, description: "为网站与在线应用选择源站的计算、内存、存储及带宽配置，防护容量按业务风险单独评估。", features: ["多地域配置选择", "计算与存储按需组合", "适用于网站与业务应用"] },
  { id: "hcs" as const, name: "高频云服务器", code: "HCS", icon: Cpu, description: "为游戏与实时应用评估源站单核性能，结合连接数和延迟要求比较通用型与轻量型配置。", features: ["通用与轻量两种类型", "面向计算密集型应用", "适用于构建与实时服务"] },
  { id: "metal" as const, name: "裸金属服务器", code: "BMS", icon: Server, description: "适合需要独立物理源站的业务，可对比硬件规格、部署地域和线路示例。", features: ["独立物理资源配置", "多种地域与线路示例", "适用于数据库与专属集群"] },
  { id: "ssl" as const, name: "安全证书", code: "SSL", icon: ShieldCheck, description: "为网站入口选择 DV 或 OV 证书，规划 HTTPS 身份验证和加密。流量防护需单独评估。", features: ["DV 与 OV 类型选择", "单域名及多域名示例", "适用于网站与应用入口"] },
];

const entries: Record<CategoryId, ProductEntry[]> = {
  cloud: [
    { id: "ecs-guangzhou", name: "广东 · 广州", tag: "BGP", description: "面向华南的网站与应用部署", detail: "源站计算 · 查看配置", region: "广州" },
    { id: "ecs-shenzhen", name: "广东 · 深圳", tag: "电信", description: "适合企业应用与开发环境", detail: "源站计算 · 查看配置", region: "深圳" },
    { id: "ecs-ningbo", name: "浙江 · 宁波", tag: "BGP", description: "面向华东的业务与服务部署", detail: "源站计算 · 查看配置", region: "宁波" },
    { id: "ecs-xiangyang", name: "湖北 · 襄阳", tag: "电信", description: "适合网站与持续运行的业务", detail: "源站计算 · 查看配置", region: "襄阳" },
    { id: "ecs-kunming", name: "云南 · 昆明", tag: "BGP", description: "面向西南的应用部署示例", detail: "源站计算 · 查看配置", region: "昆明" },
    { id: "ecs-haikou", name: "海南 · 海口", tag: "BGP", description: "适合轻量应用与开发测试", detail: "源站计算 · 查看配置", region: "海口" },
  ],
  hcs: [
    { id: "hcs-general", name: "通用型 · 高频云", tag: "AMD", description: "为构建任务与业务计算选择资源", detail: "通用配置 · 查看方案", region: "广州" },
    { id: "hcs-light", name: "轻量型 · 高频云", tag: "AMD", description: "为轻量应用与测试环境规划配置", detail: "轻量配置 · 查看方案", region: "深圳" },
  ],
  metal: [
    { id: "bms-shenzhen", name: "广东 · 深圳", tag: "电信", description: "独立物理资源，承载专属业务", detail: "独立源站 · 查看配置", region: "深圳" },
    { id: "bms-guangzhou", name: "华南 · 广州", tag: "BGP", description: "面向华南的专属环境部署", detail: "独立源站 · 查看配置", region: "广州" },
    { id: "bms-ningbo-telecom", name: "浙江 · 宁波", tag: "电信", description: "适合企业系统与数据库部署", detail: "独立源站 · 查看配置", region: "宁波" },
    { id: "bms-ningbo-bgp", name: "浙江 · 宁波", tag: "BGP", description: "为多业务场景规划独立资源", detail: "独立源站 · 查看配置", region: "宁波" },
    { id: "bms-ningbo-security", name: "浙江 · 宁波", tag: "精防", description: "结合防护需求规划业务入口", detail: "独立源站 · 查看配置", region: "宁波" },
    { id: "bms-xiangyang", name: "湖北 · 襄阳", tag: "电信", description: "面向专属集群的硬件配置示例", detail: "独立源站 · 查看配置", region: "襄阳" },
  ],
  ssl: [
    { id: "ssl-dv", name: "DV 安全证书", description: "域名验证，适合个人网站与应用", detail: "域名验证型 · 查看配置" },
    { id: "ssl-ov", name: "OV 安全证书", description: "组织验证，适合企业网站与业务", detail: "组织验证型 · 查看配置" },
  ],
};

const computePlans: Record<Exclude<CategoryId, "ssl">, ComputePlan[]> = {
  cloud: [
    { name: "轻量起步", monthlyPrice: 29, specs: [["vCPU", "2 核"], ["内存", "2 GB"], ["SSD 存储", "40 GB"], ["公网带宽", "3 Mbps"]] },
    { name: "通用计算", monthlyPrice: 79, specs: [["vCPU", "4 核"], ["内存", "8 GB"], ["SSD 存储", "100 GB"], ["公网带宽", "5 Mbps"]] },
    { name: "进阶计算", monthlyPrice: 159, specs: [["vCPU", "8 核"], ["内存", "16 GB"], ["SSD 存储", "200 GB"], ["公网带宽", "10 Mbps"]] },
  ],
  hcs: [
    { name: "高频基础", monthlyPrice: 49, specs: [["vCPU", "2 核"], ["内存", "4 GB"], ["SSD 存储", "60 GB"], ["公网带宽", "3 Mbps"]] },
    { name: "高频均衡", monthlyPrice: 109, specs: [["vCPU", "4 核"], ["内存", "8 GB"], ["SSD 存储", "100 GB"], ["公网带宽", "5 Mbps"]] },
    { name: "高频进阶", monthlyPrice: 219, specs: [["vCPU", "8 核"], ["内存", "16 GB"], ["SSD 存储", "200 GB"], ["公网带宽", "10 Mbps"]] },
  ],
  metal: [
    { name: "独享基础", monthlyPrice: 599, specs: [["物理 CPU", "8 核"], ["内存", "32 GB"], ["SSD 存储", "480 GB"], ["公网带宽", "20 Mbps"]] },
    { name: "独享均衡", monthlyPrice: 1099, specs: [["物理 CPU", "16 核"], ["内存", "64 GB"], ["SSD 存储", "960 GB"], ["公网带宽", "50 Mbps"]] },
    { name: "独享进阶", monthlyPrice: 1999, specs: [["物理 CPU", "32 核"], ["内存", "128 GB"], ["SSD 存储", "1.92 TB"], ["公网带宽", "100 Mbps"]] },
  ],
};

const regions = ["广州", "深圳", "宁波", "襄阳", "昆明", "海口"];
const operatingSystems = ["Ubuntu 24.04 LTS", "Debian 12", "Windows Server 2022"];
const domainScopes = ["单域名", "多域名", "泛域名"];
const money = (value: number) => value.toLocaleString("zh-CN", { maximumFractionDigits: 2 });
const annualTotal = (price: number) => Math.round(price * 12 * 0.8 * 100) / 100;

export default function ProductCatalog({ category: controlledCategory, onCategoryChange, onConsult }: {
  category?: CategoryId;
  onCategoryChange?: (category: CategoryId) => void;
  onConsult?: () => void;
} = {}) {
  const [internalCategory, setInternalCategory] = useState<CategoryId>("cloud");
  const category = controlledCategory ?? internalCategory;
  const [selectedEntry, setSelectedEntry] = useState<ProductEntry | null>(null);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [region, setRegion] = useState("广州");
  const [planIndex, setPlanIndex] = useState(0);
  const [operatingSystem, setOperatingSystem] = useState(operatingSystems[0]);
  const [domainScope, setDomainScope] = useState(domainScopes[0]);
  const [copyStatus, setCopyStatus] = useState("");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogHeadingRef = useRef<HTMLHeadingElement>(null);
  const selectionTrigger = useRef<HTMLButtonElement | null>(null);
  const activeCategory = categories.find((item) => item.id === category)!;
  const CategoryIcon = activeCategory.icon;
  const plans = computePlans[category === "ssl" ? "cloud" : category];
  const plan = plans[planIndex] ?? plans[0];

  useEffect(() => { setSelectedEntry(null); }, [category]);
  useEffect(() => {
    if (!selectedEntry) { dialogRef.current?.close(); return; }
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (dialog && !dialog.open) dialog.showModal();
    dialogHeadingRef.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedEntry]);
  useEffect(() => { setCopyStatus(""); }, [selectedEntry, billing, region, planIndex, operatingSystem, domainScope]);

  function selectCategory(next: CategoryId) {
    setInternalCategory(next);
    onCategoryChange?.(next);
    setSelectedEntry(null);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft") next = (index + categories.length - 1) % categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = categories.length - 1;
    else return;
    event.preventDefault();
    selectCategory(categories[next].id);
    tabRefs.current[next]?.focus();
  }

  function openConfiguration(entry: ProductEntry, trigger: HTMLButtonElement) {
    selectionTrigger.current = trigger;
    if (entry.region) setRegion(entry.region);
    setPlanIndex(0);
    setSelectedEntry(entry);
  }

  function closeConfiguration() {
    dialogRef.current?.close();
    setSelectedEntry(null);
    selectionTrigger.current?.focus({ preventScroll: true });
  }

  const configurationText = !selectedEntry ? "" : category === "ssl" ? [
    "安信云 · 演示配置清单",
    `产品：${selectedEntry.name}`,
    `证书类型：${selectedEntry.id === "ssl-dv" ? "域名验证型 DV" : "组织验证型 OV"}`,
    `域名范围：${domainScope}`,
    "用途：网站与应用 HTTPS 连接",
    "签发流程与服务价格：按实际需求确认",
    "此清单仅用于样板展示，不构成实际报价或订单。",
  ].join("\n") : [
    "安信云 · 演示配置清单",
    `产品：${activeCategory.name} / ${plan.name}`,
    `选型入口：${selectedEntry.name}${selectedEntry.tag ? ` · ${selectedEntry.tag}` : ""}`,
    `部署地域：${region}`,
    ...plan.specs.map(([label, value]) => `${label}：${value}`),
    `操作系统：${operatingSystem}`,
    `付费方式：${billing === "monthly" ? "月付" : "年付"}`,
    billing === "monthly" ? `演示价格：¥${money(plan.monthlyPrice)} / 月` : `演示价格：¥${money(annualTotal(plan.monthlyPrice))} / 年（折合 ¥${money(plan.monthlyPrice * 0.8)} / 月）`,
    "此清单仅用于样板展示，不构成实际报价或订单。",
  ].join("\n");

  async function copyConfiguration() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(configurationText);
      setCopyStatus("配置清单已复制。");
    } catch {
      setCopyStatus("无法自动复制，请选中右侧清单中的文字手动复制。");
    }
  }

  return <section className="products-section" id="products" aria-labelledby="pc-heading">
    <div className="container pc-section-heading">
      <h2 id="pc-heading">按业务场景选择部署配置</h2>
      <p>对比部署地域、服务器规格与带宽，为国内高防方案选型做准备。</p>
    </div>
    <div className="pc-catalog-band"><div className="container pc-catalog-shell">
      <div className="pc-tabs" role="tablist" aria-label="云产品分类">
        {categories.map((item, index) => <button type="button" key={item.id}
          className={`pc-tab${category === item.id ? " pc-tab-active" : ""}`}
          role="tab" id={`pc-tab-${item.id}`} aria-selected={category === item.id}
          aria-controls={`pc-panel-${item.id}`} tabIndex={category === item.id ? 0 : -1}
          ref={(node) => { tabRefs.current[index] = node; }}
          onClick={() => selectCategory(item.id)} onKeyDown={(event) => handleTabKeyDown(event, index)}>
          <span>{item.name}</span><span className="pc-tab-divider" aria-hidden="true">|</span><span className="pc-tab-code">{item.code}</span>
        </button>)}
      </div>
      <div className={`pc-product-layout${entries[category].length === 2 ? " pc-product-layout-short" : ""}`} role="tabpanel" id={`pc-panel-${category}`} aria-labelledby={`pc-tab-${category}`}>
        <aside className="pc-product-intro">
          <div className="pc-intro-main">
            <CategoryIcon className="pc-intro-icon" size={32} strokeWidth={1.5} aria-hidden="true" />
            <h3>{activeCategory.name}</h3>
            <p>{activeCategory.description}</p>
          </div>
          <div className="pc-consult">
            <h4>需要规划高防方案？</h4>
            <p>从你的业务需求出发，<br />了解适合的产品组合。</p>
            {onConsult ? <button type="button" onClick={onConsult}><Headphones size={16} aria-hidden="true" />定制咨询<ArrowRight size={15} aria-hidden="true" /></button> : <a href="#help"><Headphones size={16} aria-hidden="true" />了解选型建议<ArrowRight size={15} aria-hidden="true" /></a>}
          </div>
        </aside>
        <div className="pc-region-grid">
          {entries[category].map((entry) => <button type="button" className="pc-region-card" key={entry.id}
            onClick={(event) => openConfiguration(entry, event.currentTarget)}
            aria-label={`查看${entry.name}${entry.tag ? ` ${entry.tag}` : ""}演示配置`} aria-haspopup="dialog">
            <span className="pc-card-title"><strong>{entry.name}</strong>{entry.tag && <span className="pc-card-tag">{entry.tag}</span>}</span>
            <span className="pc-card-description">{entry.description}</span>
            <span className="pc-card-bottom"><span>{entry.detail}</span><ArrowRight size={18} aria-hidden="true" /></span>
          </button>)}
        </div>
      </div>
      <p className="pc-demo-note">产品、地域及线路为样板展示。点击卡片可预览演示配置。</p>
    </div></div>

    <dialog className="pc-dialog" ref={dialogRef} aria-labelledby="pc-dialog-title" aria-describedby="pc-dialog-description"
      onCancel={(event) => { event.preventDefault(); closeConfiguration(); }}
      onClick={(event) => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeConfiguration(); } }}>
      {selectedEntry && <div className="pc-dialog-content">
        <div className="pc-dialog-header">
          <div><h2 id="pc-dialog-title" ref={dialogHeadingRef} tabIndex={-1}>预览产品配置</h2><p id="pc-dialog-description">{activeCategory.name} / {selectedEntry.name}{selectedEntry.tag ? ` · ${selectedEntry.tag}` : ""}</p></div>
          <button type="button" className="pc-close" aria-label="关闭配置预览" onClick={closeConfiguration}><X size={22} aria-hidden="true" /></button>
        </div>
        <div className="pc-dialog-body">
          <div className="pc-configuration-options">
            {category === "ssl" ? <>
              <div className="pc-certificate-intro"><ShieldCheck size={28} aria-hidden="true" /><div><strong>{selectedEntry.name}</strong><p>{selectedEntry.description}</p></div></div>
              <label htmlFor="pc-domain-scope">域名范围<select id="pc-domain-scope" value={domainScope} onChange={(event) => setDomainScope(event.target.value)}>{domainScopes.map((scope) => <option key={scope}>{scope}</option>)}</select></label>
              <p className="pc-configuration-note">配置清单用于梳理证书需求，具体签发流程与服务价格需按实际需求确认。</p>
            </> : <>
              <label htmlFor="pc-selected-region"><span><MapPin size={15} aria-hidden="true" />部署地域</span><select id="pc-selected-region" value={region} onChange={(event) => setRegion(event.target.value)}>{regions.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label htmlFor="pc-selected-plan">配置方案<select id="pc-selected-plan" value={planIndex} onChange={(event) => setPlanIndex(Number(event.target.value))}>{plans.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select></label>
              <dl className="pc-specs">{plan.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              <label htmlFor="pc-selected-os">操作系统<select id="pc-selected-os" value={operatingSystem} onChange={(event) => setOperatingSystem(event.target.value)}>{operatingSystems.map((item) => <option key={item}>{item}</option>)}</select></label>
              <div className="pc-billing" role="group" aria-label="付费周期">
                <button type="button" className={billing === "monthly" ? "pc-billing-active" : ""} aria-pressed={billing === "monthly"} onClick={() => setBilling("monthly")}>按月付费</button>
                <button type="button" className={billing === "yearly" ? "pc-billing-active" : ""} aria-pressed={billing === "yearly"} onClick={() => setBilling("yearly")}>按年付费<span>省 20%</span></button>
              </div>
              <div className="pc-price-preview"><span>演示价格</span><p><strong>¥{money(billing === "monthly" ? plan.monthlyPrice : annualTotal(plan.monthlyPrice))}</strong><span> / {billing === "monthly" ? "月" : "年"}</span></p>{billing === "yearly" && <small>折合 ¥{money(plan.monthlyPrice * 0.8)} / 月</small>}</div>
            </>}
            <button type="button" className="pc-copy-button" onClick={copyConfiguration}><Copy size={16} aria-hidden="true" />复制配置清单</button>
            <p className="pc-copy-status" role="status" aria-live="polite">{copyStatus || "演示配置与价格，非实际售卖方案。"}</p>
          </div>
          <div className="pc-preview-column"><h3>你的配置清单</h3><pre className="pc-configuration-preview" tabIndex={0} aria-label="可复制的配置清单">{configurationText}</pre></div>
        </div>
      </div>}
    </dialog>
  </section>;
}
