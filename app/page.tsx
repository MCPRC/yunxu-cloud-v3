"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, ArrowUp, BookOpen, Check, ChevronDown, ChevronRight, Cloud, Code2, Database, FileText, Gift, Globe2, Headphones, HeartHandshake, Layers3, LockKeyhole, Menu, MonitorCog, Network, Search, Server, ShieldCheck, ShoppingBag, SlidersHorizontal, Users, X, Zap } from "lucide-react";
import ProductCatalog, { type CategoryId } from "../components/ProductCatalog";
import GlobalNetwork from "../components/GlobalNetwork";
import HeroCarousel from "../components/HeroCarousel";

type DialogView = { kind: "help" | "solutions" | "text" | "search"; title: string; body?: string[] };
type NavEntry = { title: string; description: string; action: string };
const productItems: NavEntry[] = [
  { title: "弹性云服务器 | ECS", description: "按需组合计算、存储与网络资源", action: "product:cloud" },
  { title: "高频云服务器 | HCS", description: "为高频计算与实时业务选择配置", action: "product:hcs" },
  { title: "裸金属服务器 | BMS", description: "独享物理资源，构建专属环境", action: "product:metal" },
  { title: "安全证书 | SSL", description: "了解域名与组织验证证书", action: "product:ssl" },
];
const solutions = [
  { name: "网站解决方案", icon: Code2, title: "为网站入口规划 DDoS 防护", description: "为企业官网、内容站和 API 入口梳理访问域名、正常带宽及历史攻击情况，评估接入方式与防护容量。", tags: ["企业官网", "个人博客", "开发测试"], flow: ["访问用户", "安全防护", "云服务器", "数据存储"], tips: ["梳理对外域名、端口和业务协议", "核对源站访问限制和回源方式", "为域名配置 HTTPS，保护访问连接"] },
  { name: "电商解决方案", icon: ShoppingBag, title: "保护商城与订单入口", description: "区分促销期间的正常流量与异常流量，优先评估商城、登录及订单接口的防护需求。", tags: ["在线商城", "企业系统", "内容平台"], flow: ["业务流量", "流量分发", "应用集群", "业务数据库"], tips: ["应用与数据库独立部署", "记录促销峰值与关键接口的容量需求", "规划异常流量处置和业务恢复流程"] },
  { name: "游戏解决方案", icon: Zap, title: "高防游戏盾 · 百 T 级防护", description: "面向游戏登录、网关和长连接业务。按玩家分布、协议与历史攻击峰值评估接入方案。实际防护容量与适用条件以方案确认为准。", tags: ["游戏服务", "实时互动", "长连接应用"], flow: ["在线玩家", "游戏盾接入", "游戏网关", "游戏源站"], tips: ["根据主要玩家位置选择部署区域", "记录连接峰值、协议和端口", "将公共入口与内部服务隔离"] },
];
const faqs = [
  { question: "国内高防选型需要准备哪些信息？", answer: "建议先整理业务类型、用户所在地区、正常带宽峰值和对外开放的端口。如果遇到过 DDoS 攻击，也可以记录攻击峰值、持续时间和受影响的业务入口，用于评估防护需求。" },
  { question: "月付和年付应该怎么选择？", answer: "短期测试或需求尚未确定时，月付便于控制投入；持续运行的业务可以比较年付总额。本样板以年付相对月付合计优惠 20% 演示，同时展示全年金额，不代表真实报价。" },
  { question: "国内高防方案如何选择部署地域？", answer: "先看用户所在地区和运营商，再核对业务入口到源站的回源路径、时延及数据要求。实际接入表现以线路测试为准。" },
  { question: "这里可以直接购买或开通服务器吗？", answer: "当前页面是国内高防与 DDoS 防护。你可以切换产品、预览配置和复制清单；品牌、配置、价格与公告均为演示内容，没有接入实际付款、账户或云资源开通服务。" },
];
const notices = [
  { title: "国内高防选型需要准备什么", date: "2026-11-10", body: "梳理业务入口、用户分布、正常流量与历史攻击情况，再评估合适的接入方式和防护容量。" },
  { title: "源站部署与防护配置如何区分", date: "2026-11-09", body: "源站按应用负载选择计算、内存、存储和公网带宽。防护容量与清洗能力需要按业务协议和攻击情况另行确认。" },
  { title: "国内业务如何评估接入线路", date: "2026-11-08", body: "结合主要用户的地区与运营商，比较访问质量、回源路径与接入要求。页面上的地域和线路用于选型示意。" },
  { title: "HTTPS 证书与 DDoS 防护的分工", date: "2026-11-07", body: "SSL 证书用于验证站点身份和加密连接。DDoS 防护用于处置异常流量。网站选型时可分别核对证书类型、接入方式和防护容量。" },
  { title: "源站配置的月付与年付示例", date: "2026-11-06", body: "计算类产品配置支持月付与年付切换。年付演示使用相对月付总额优惠 20% 的规则，同时展示年付总额。所有价格均为样板数据。" },
  { title: "如何使用防护选型清单", date: "2026-11-05", body: "可以复制源站配置清单，并补充业务端口、正常流量与历史攻击峰值，作为方案沟通资料。实际防护能力和费用以确认后的方案为准。" },
];
const navigation = [
  { id: "products", label: "产品服务", description: "从源站配置到接入线路，梳理部署与防护需求", items: productItems },
  { id: "solutions", label: "解决方案", description: "按网站、电商和游戏场景梳理 DDoS 防护需求", items: solutions.map((s, i) => ({ title: s.name, description: s.description, action: `solution:${i}` })) },
  { id: "partners", label: "生态合作", description: "在开放协作中，找到新的可能", items: [
    { title: "合作伙伴", description: "了解合作方向与资源协作方式", action: "partners" },
    { title: "推广计划", description: "查看推广合作入口的样板说明", action: "affiliate" },
    { title: "开发者支持", description: "从需求梳理到产品选型", action: "help" },
  ] },
  { id: "support", label: "支持与条款", description: "选型指南、服务说明与使用帮助", items: [
    { title: "联系我们", description: "通过选型助手梳理业务需求", action: "consult" },
    { title: "服务保障", description: "了解样板中的服务入口", action: "assurances" },
    { title: "帮助文档", description: "查看常见问题与选型说明", action: "help" },
    { title: "服务条款", description: "查看本演示站的使用说明", action: "terms" },
  ] },
  { id: "about", label: "关于我们", description: "了解安信云官网样板与页面动态", items: [
    { title: "公司简介", description: "了解安信云的高防业务方向", action: "about" },
    { title: "新闻动态", description: "查看网站公告与产品说明", action: "announcements" },
    { title: "国内高防线路", description: "比较国内地域与接入线路", action: "network" },
  ] },
];
const featureItems = [
  { icon: Code2, title: "弹性计算", description: "围绕业务负载选择计算资源，从轻量应用到持续运行的服务，让配置与实际需求相匹配。", tags: ["按需配置", "成本规划", "业务弹性"] },
  { icon: SlidersHorizontal, title: "多样化配置", description: "对比 CPU、内存、存储与带宽，为不同应用选择合适的实例类型和操作系统。", tags: ["灵活选择", "配置预览", "多系统选型"] },
  { icon: ShieldCheck, title: "DDoS 防护规划", description: "根据业务入口、历史攻击峰值和可接受的中断时间，评估防护容量与接入方式。", tags: ["业务入口", "攻击峰值", "接入方式"] },
  { icon: MonitorCog, title: "管理简单", description: "以清楚的产品分类和配置清单，统一理解资源选择，让每一步操作都有明确方向。", tags: ["清晰选型", "直观界面", "配置清单", "便捷管理"] },
];

function Brand() {
  return <a className="brand" href="#top" aria-label="安信云首页"><svg className="brand-symbol" viewBox="0 0 38 38" fill="none" aria-hidden="true"><path d="M9 26.5h20a6 6 0 0 0 .8-11.95A10.5 10.5 0 0 0 9.5 13.2 6.7 6.7 0 0 0 9 26.5Z" stroke="currentColor" strokeWidth="2.7" strokeLinejoin="round"/><path d="m13 20 5-5 5 5m-5-5v15" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="brand-wordmark"><strong>安信云</strong><small>国内高防 · DDoS 防护</small></span></a>;
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryId>("cloud");
  const [info, setInfo] = useState<DialogView | null>(null);
  const [solution, setSolution] = useState(0);
  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDialogElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const navTriggerRef = useRef<HTMLButtonElement | null>(null);
  const infoOpenerRef = useRef<HTMLElement | null>(null);
  const currentMenu = navigation.find(item => item.id === navOpen);
  const activeSolution = solutions[solution];

  useEffect(() => {
    const scroll = () => setShowTop(window.scrollY > 500);
    const outside = (event: PointerEvent) => { if (!headerRef.current?.contains(event.target as Node)) { setNavOpen(null); setMobileOpen(false); } };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && !infoRef.current?.open) { setNavOpen(null); setMobileOpen(false); if (mobileOpen) mobileTriggerRef.current?.focus(); else if (navOpen) navTriggerRef.current?.focus(); } };
    scroll(); window.addEventListener("scroll", scroll, { passive: true }); document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { window.removeEventListener("scroll", scroll); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [navOpen, mobileOpen]);
  useEffect(() => { if (mobileOpen) headerRef.current?.querySelector<HTMLAnchorElement>(".main-nav a")?.focus(); }, [mobileOpen]);
  useEffect(() => { if (info && !infoRef.current?.open) infoRef.current?.showModal(); else if (!info && infoRef.current?.open) infoRef.current.close(); }, [info]);

  function jump(id: string) { setNavOpen(null); setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
  function openInfo(view: DialogView) {
    if (!info) infoOpenerRef.current = navOpen ? (mobileOpen ? mobileTriggerRef.current : navTriggerRef.current) : document.activeElement as HTMLElement;
    setInfo(view);
  }
  function textDialog(title: string, ...body: string[]) { openInfo({ kind: "text", title, body }); }
  function openSolution(index = 0) { setSolution(index); openInfo({ kind: "solutions", title: "DDoS 防护场景" }); }
  function act(action: string) {
    setNavOpen(null); setMobileOpen(false);
    if (action.startsWith("product:")) { setCategory(action.split(":")[1] as CategoryId); setInfo(null); jump("products"); return; }
    if (action.startsWith("solution:")) { openSolution(Number(action.split(":")[1])); return; }
    if (["network", "announcements", "assurances", "products"].includes(action)) { setInfo(null); jump(action); return; }
    if (action === "help") { openInfo({ kind: "help", title: "帮助文档" }); return; }
    if (action === "consult") { openSolution(); return; }
    const content: Record<string, [string, ...string[]]> = {
      terms: ["服务条款 · 样板说明", "本站展示安信云国内高防与 DDoS 防护的选型流程。本页面不提供实际云资源售卖、账户注册或付款服务。", "页面中的配置、价格、区域、公告和服务入口均为演示内容。复制的配置清单不构成实际报价或订单。正式运营前需配置真实产品及适用条款。"],
      about: ["关于安信云", "安信云面向国内业务，聚焦高防与 DDoS 防护。本站提供产品分类、地域选择与配置预览，帮助梳理部署和防护需求。", "当前展示弹性云服务器、高频云服务器、裸金属服务器与安全证书四类入口。"],
      partners: ["合作伙伴", "这里展示合作伙伴入口。在正式网站中，可用于介绍渠道合作、资源互联及技术服务合作。", "当前样板不征集真实合作申请。你可以通过产品入口了解资源分类，或使用选型助手比较业务方案。"],
      affiliate: ["推广计划", "这里展示推广合作入口，正式网站可接入申请、推广链接和佣金明细。当前样板未设立真实返佣或奖励计划。"],
      console: ["控制台 · 功能预览", "当前为官网设计样板，未接入真实资源控制台。你可以在产品服务中选择地区、预览配置，并复制配置清单。"],
      login: ["账户入口 · 样板说明", "登录与免费注册入口用于展示官网导航结构，当前没有真实账户系统。无需提交个人信息即可浏览全部演示内容。"],
      refund: ["退款规则", "此处为退款政策说明入口。当前样板不收取费用、不创建订单，也不提供退款服务。正式交易时应以运营方公布的政策为准。"],
      filing: ["备案指南", "正式部署前，请根据实际服务地区与业务类型确认所需的备案及其他要求。这里保留备案指引入口，样板不提供真实备案办理。"],
      downloads: ["文件与配置", "可在产品配置详情中复制演示清单，用于讨论和选型。当前样板没有安装程序或镜像文件下载。"],
    };
    const entry = content[action] ?? content.about;
    textDialog(entry[0], ...entry.slice(1));
  }
  function search(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setNavOpen(null); setMobileOpen(false); openInfo({ kind: "search", title: "站内搜索" }); }
  const searchItems = [...productItems, ...solutions.map((s, i) => ({ title: s.name, description: s.description, action: `solution:${i}` })), { title: "帮助文档与常见问题", description: "了解配置、地域与计费方式", action: "help" }, { title: "官网公告", description: "查看样板说明与产品动态", action: "announcements" }].filter(item => !query.trim() || `${item.title}${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  return <>
    <a className="skip-link" href="#main">跳转到主要内容</a>
    <header className="site-header" ref={headerRef}>
      <div className="header-inner"><Brand />
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`} aria-label="主导航">
          <a className="activity-link" href="#announcements" onClick={() => { setNavOpen(null); setMobileOpen(false); }}>最新活动<span>HOT</span></a>
          {navigation.map(item => <button key={item.id} type="button" className={`nav-button ${navOpen === item.id ? "is-active" : ""}`} aria-expanded={navOpen === item.id} aria-controls="nav-panel" onClick={event => { navTriggerRef.current = event.currentTarget; setNavOpen(navOpen === item.id ? null : item.id); }}>{item.label}<ChevronDown size={12} /></button>)}
        </nav>
        <div className="header-actions">
          <form className="header-search" role="search" onSubmit={search}><input aria-label="搜索产品与帮助" placeholder="云服务器" value={query} onChange={e => setQuery(e.target.value)} /><button type="submit" aria-label="搜索"><Search size={17} /></button></form>
          <button className="header-docs" type="button" onClick={() => act("help")}>文档中心</button>
          <button className="header-console" type="button" onClick={() => act("console")}>控制台</button>
          <button className="header-login" type="button" onClick={() => act("login")}>登录</button>
          <button className="header-register" type="button" onClick={() => act("login")}><Gift size={16} />免费注册</button>
          <button type="button" className="mobile-toggle icon-button" ref={mobileTriggerRef} aria-label={mobileOpen ? "关闭导航" : "打开导航"} aria-expanded={mobileOpen} onClick={() => { setMobileOpen(!mobileOpen); setNavOpen(null); }}>{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button>
        </div>
      </div>
      {currentMenu && <div className={`nav-panel ${mobileOpen ? "nav-panel-mobile" : ""}`} id="nav-panel"><div className="nav-panel-inner container"><div className="nav-panel-heading"><h2>{currentMenu.label}</h2><p>{currentMenu.description}</p></div><div className="nav-panel-items">{currentMenu.items.map(item => <button type="button" key={item.title} onClick={() => act(item.action)}><span><strong>{item.title}</strong><small>{item.description}</small></span><ChevronRight size={17} /></button>)}</div></div></div>}
    </header>

    <main id="main">
      <HeroCarousel onGameShield={() => openSolution(2)} />
      <div className="service-rail container" aria-label="快捷入口">
        {[{ icon: Gift, title: "最新活动", text: "产品资讯，了解最新动态", action: "announcements" }, { icon: Layers3, title: "高防方案选型", text: "对比地域、规格与带宽", action: "products" }, { icon: Users, title: "生态合作，携手同行", text: "了解合作伙伴与推广计划", action: "partners" }, { icon: MonitorCog, title: "弹性计算，管理简单", text: "云端资源，清楚选配", action: "console" }].map(({ icon: Icon, title, text, action }) => <button type="button" key={title} onClick={() => act(action)}><span className="rail-icon"><Icon size={29} strokeWidth={1.6} /></span><span><strong>{title}</strong><small>{text}</small></span></button>)}
      </div>

      <ProductCatalog category={category} onCategoryChange={setCategory} onConsult={() => act("consult")} />

      <section className="advantages-section section-pad" id="advantages" aria-labelledby="advantages-title"><div className="container"><div className="section-heading"><h2 id="advantages-title">高防选型关注什么</h2><p>从流量、地域和业务入口入手，明确 DDoS 防护需求。</p></div><div className="advantages-grid">{featureItems.map(({ icon: Icon, title, description, tags }) => <article className="advantage" key={title}><div className="advantage-copy"><h3>{title}</h3><p>{description}</p><div className="feature-tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="advantage-icon"><Icon size={47} strokeWidth={1.45} /></div></article>)}</div></div></section>

      <GlobalNetwork />

      <section className="announcements-section section-pad" id="announcements" aria-labelledby="announcements-title"><div className="container"><div className="section-heading"><h2 id="announcements-title">高防选型指南与站点公告</h2><p>了解 DDoS 防护选型、线路评估和配置示例</p></div><div className="announcements-grid"><article className="agreement-card"><FileText size={35} strokeWidth={1.5} /><h3>高防服务与选型说明</h3><p>评估高防方案时，请确认接入方式、防护范围、容量与异常流量处置规则。</p><p className="agreement-note">本页为设计样板，产品及服务信息用于演示，不产生真实订单。</p><button type="button" className="button button-secondary button-small" onClick={() => act("terms")}>阅读条款<ArrowRight size={15} /></button><Cloud className="agreement-cloud" size={145} strokeWidth={0.8} aria-hidden="true" /></article><div className="notice-card"><div className="notice-heading"><h3>官网公告</h3><span>示例内容</span></div><div className="notice-list">{notices.map((notice, i) => <button type="button" key={notice.title} onClick={() => textDialog(notice.title, `公告示例 · ${notice.date}`, notice.body)}><span>{i === 0 && <b>样板</b>}{notice.title}</span><time dateTime={notice.date}>{notice.date}</time><ChevronRight size={14} /></button>)}</div></div></div></div></section>

      <section className="assurance-strip" id="assurances" aria-label="服务保障与支持"><div className="container assurance-grid">{[{ icon: HeartHandshake, title: "退款规则", text: "了解交易与退款政策", action: "refund" }, { icon: Gift, title: "新手指引", text: "了解国内高防选型步骤", action: "help" }, { icon: ShieldCheck, title: "备案指南", text: "部署之前，了解相关要求", action: "filing" }, { icon: Headphones, title: "客户服务", text: "梳理业务入口与防护需求", action: "consult" }].map(({ icon: Icon, title, text, action }) => <button type="button" key={title} onClick={() => act(action)}><Icon size={33} strokeWidth={1.5} /><strong>{title}</strong><span>{text}</span></button>)}</div></section>
    </main>

    <footer className="site-footer"><div className="container footer-main"><div className="footer-links">{[
      { title: "服务指南", links: [["安全中心", "product:ssl"], ["实名认证", "login"], ["API 管理", "console"], ["提交工单", "consult"], ["服务条款", "terms"]] },
      { title: "代理系统", links: [["合作伙伴", "partners"], ["代理推广", "affiliate"], ["推广明细", "affiliate"]] },
      { title: "帮助中心", links: [["行业新闻", "announcements"], ["帮助文档", "help"], ["文件下载", "downloads"]] },
      { title: "关于我们", links: [["公司简介", "about"], ["联系我们", "consult"], ["公司动态", "announcements"], ["国内高防线路", "network"]] },
    ].map(group => <div key={group.title}><h3>{group.title}</h3>{group.links.map(([label, action]) => <button type="button" key={label} onClick={() => act(action)}>{label}</button>)}</div>)}</div><div className="footer-contact"><div className="footer-contact-shortcuts"><button type="button" onClick={() => act("consult")}><span><Headphones size={32} strokeWidth={1.4} /></span>选型咨询</button><button type="button" onClick={() => act("help")}><span><BookOpen size={32} strokeWidth={1.4} /></span>帮助文档</button></div><Brand /><p>专注国内高防与 DDoS 防护。</p></div><div className="technology-row" aria-label="技术主题示意">{[{ icon: LockKeyhole, name: "HTTPS" }, { icon: Globe2, name: "IPv6" }, { icon: Network, name: "HTTP/2" }, { icon: ShieldCheck, name: "HSTS" }, { icon: Globe2, name: "BGP" }].map(({ icon: Icon, name }) => <span key={name}><Icon size={25} strokeWidth={1.5} /><strong>{name}</strong></span>)}<small>技术主题 · 示意</small></div></div><div className="footer-bottom"><div className="container"><div><span>© 2026 安信云 · 国内高防与 DDoS 防护</span><p>品牌、配置、价格、区域与公告仅用于演示，不提供实际售卖服务。</p></div><button type="button" onClick={() => act("about")}>关于本站<ChevronRight size={15} /></button></div></div></footer>

    <aside className="floating-tools" aria-label="页面工具"><button className="support-trigger" type="button" aria-label="在线咨询" onClick={() => act("consult")}><Headphones size={24} strokeWidth={1.6} /><span>在线咨询</span></button><button type="button" aria-label="查看帮助文档" onClick={() => act("help")}><BookOpen size={20} /></button><button type="button" aria-label="查看服务条款" onClick={() => act("terms")}><FileText size={20} /></button>{showTop && <button type="button" aria-label="返回顶部" onClick={() => jump("top")}><ArrowUp size={21} /></button>}</aside>

    <dialog className="info-dialog" ref={infoRef} aria-labelledby="info-dialog-title" onCancel={() => setInfo(null)} onClose={() => { setInfo(null); if (infoOpenerRef.current?.isConnected) infoOpenerRef.current.focus({ preventScroll: true }); }} onClick={event => { if (event.target === event.currentTarget) setInfo(null); }}><div className="info-dialog-shell"><div className="info-dialog-header"><h2 id="info-dialog-title">{info?.title}</h2><button type="button" className="icon-button" aria-label="关闭详情" onClick={() => setInfo(null)}><X size={21} /></button></div><div className="info-dialog-body">
      {info?.kind === "text" && <><div className="info-prose">{info.body?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div><button className="button button-primary button-small" type="button" onClick={() => act("products")}>查看云产品<ArrowRight size={16} /></button></>}
      {info?.kind === "help" && <div className="faq-list">{faqs.map((faq, i) => <details className="faq" key={faq.question} open={i === 0}><summary>{faq.question}<ChevronDown size={17} /></summary><p>{faq.answer}</p></details>)}</div>}
      {info?.kind === "solutions" && <><div className="solution-tabs" role="tablist" aria-label="业务场景">{solutions.map((s, i) => <button key={s.name} type="button" role="tab" id={`solution-tab-${i}`} aria-controls="solution-content" aria-selected={solution === i} tabIndex={solution === i ? 0 : -1} onClick={() => setSolution(i)} onKeyDown={e => { let next = i; if (e.key === "ArrowRight") next = (i + 1) % 3; else if (e.key === "ArrowLeft") next = (i + 2) % 3; else if (e.key === "Home") next = 0; else if (e.key === "End") next = 2; else return; e.preventDefault(); setSolution(next); document.getElementById(`solution-tab-${next}`)?.focus(); }}><s.icon size={20} />{s.name}</button>)}</div><div id="solution-content" role="tabpanel" aria-labelledby={`solution-tab-${solution}`} className="solution-detail"><div className="solution-tags">{activeSolution.tags.map(tag => <span key={tag}>{tag}</span>)}</div><h3>{activeSolution.title}</h3><p>{activeSolution.description}</p><div className="architecture">{activeSolution.flow.map((step, i) => { const Icon = [Globe2, ShieldCheck, Server, Database][i]; return <div className="arch-step" key={step}><Icon size={26} /><span>{step}</span>{i < 3 && <ArrowRight className="arch-arrow" size={17} />}</div>; })}</div><ul>{activeSolution.tips.map(tip => <li key={tip}><Check size={16} />{tip}</li>)}</ul><button type="button" className="button button-primary button-small" onClick={() => act(`product:${solution === 2 ? "hcs" : "cloud"}`)}>查看推荐产品<ArrowRight size={16} /></button></div></>}
      {info?.kind === "search" && <><form className="dialog-search" role="search" onSubmit={search}><input aria-label="输入搜索关键词" placeholder="搜索产品、解决方案与帮助" value={query} onChange={e => setQuery(e.target.value)} /><button className="button button-primary button-small" type="submit">搜索</button></form><p className="search-caption">{query.trim() ? `“${query.trim()}”的站内结果` : "全部产品与帮助入口"} · {searchItems.length} 项</p><div className="search-results">{searchItems.map(item => <button type="button" key={item.title} onClick={() => act(item.action)}><strong>{item.title}</strong><span>{item.description}</span><ArrowRight size={17} /></button>)}{searchItems.length === 0 && <p>没有找到匹配内容。试试“云服务器”“证书”或“帮助”。</p>}</div></>}
    </div></div></dialog>
  </>;
}
