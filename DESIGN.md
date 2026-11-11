---
name: 云序 YUNXU
description: Reference-aligned Chinese cloud-services homepage
colors:
  blue: "#165dff"
  blue-dark: "#1048cf"
  ink: "#172b46"
  muted: "#5d6d82"
  line: "#e6ebf3"
  pale: "#f5f7fa"
  hero: "#edf2fb"
typography:
  family: '"Yunxu Sans", "PingFang SC", "Microsoft YaHei", sans-serif'
  hero: "38px / 1.45 / 700"
  heading: "30px / 1.45 / 700"
  body: "14px / 1.7 / 400"
---

# 云序官网设计记录

## Direction

The 2026-11-10 correction follows the structural reference at https://www.jinghanyun.com/. The same block ordering and desktop topology govern implementation. The fictional 云序 brand, local fonts and glass-cloud image remain. This is a design sample, not a real cloud service.

## Homepage structure

Compact navigation → broad carousel hero → four quick entries → four-category product catalogue → two-by-two service advantages → global network and five regional entries → agreement/announcements → four support entries → four-column footer with a side contact block, technology-topic row and legal/demo note.

The homepage no longer adds standalone solution, FAQ or closing-CTA sections. Solutions and FAQ remain available through the navigation and related support links.

## Layout and spacing

The common container is at most 1200px, with desktop width calc(100% - 128px). It changes to 80px total outer spacing below 1270px, 48px below 900px and 36px below 600px. Desktop header height is 64px, becoming 62px at the mobile-nav breakpoint of 900px. Hero height is 480px on standard desktop and 520px at 600px and below, where the illustration moves under the text. Four quick entries overlap the hero and become two columns below 900px.

Generic section spacing is 78px, 64px at 900px and 49px at 600px; components retain their own reference-aligned spacing. Section headings are centered. Most edges use thin borders; selected blue fields carry interactive state.

## Catalogue

Four tabs: 弹性云服务器 ECS, 高频云服务器 HCS, 裸金属服务器 BMS, 安全证书 SSL. The title remains on white; the catalogue band has a full-width pale-gray background. A left introduction/consultation column uses approximately one quarter of the inner width. The right column has a two-column grid. ECS/BMS have six 148px-minimum cards; HCS/SSL have two. The introduction moves above the card grid at 800px; cards become one column and tabs scroll horizontally at 600px.

Selecting a card opens a native configuration dialog. Computing products support region, configuration, OS and monthly/annual billing; annual examples display the annual total and equivalent monthly amount. SSL offers certificate type and domain scope without an unsupported price. A visible text summary can be copied, with polite success/failure feedback. The dialog closes with Escape, outside click or the close button and restores focus.

## Network

A centered heading sits above two left explanations and a pale geometric globe on the right. Five buttons—中国大陆、中国香港、国际美国、国际日本、国际韩国—change highlighted diagram points and explanatory text. The diagram is illustrative, not a geographic or performance measurement. The regional rail becomes internally scrollable on mobile.

## Navigation, help and announcements

Six navigation topics follow the reference, with a utility/account group on desktop. Menus expose product categories, solution dialogs, cooperation descriptions, terms and help. The mobile disclosure focuses the first entry; Escape returns focus to its trigger. The search looks through local products, solutions and help entries.

Announcements are a two-column composition: a service-terms introduction on the left, a dated six-item example list on the right. Each opens its own content. Service-support links and footer links open local content or jump to the relevant section. Account and console entries disclose that no live backend is connected; no personal data is solicited.

## Assets and typography

Retained image: public/images/hero-cloud.webp with its existing provenance sidecar. Fonts remain self-hosted Yunxu Sans (Noto Sans CJK SC) at regular and bold weights. Icons are Lucide with consistent outline weights; the brand uses its existing SVG mark. The geometric network graphic conveys selected connections.

## Accessibility and state

Visible focus rings, a skip link, labeled fields, keyboard category/solution tabs, native dialog containment, pressed-state regional controls and reduced-motion handling are preserved. The floating consultation button has a persistent accessible name even when its mobile label is hidden. Prices and dates use tabular numerals.

## Truthful demonstration content

Catalogue and network text label sample regions, configurations and prices. Announcements are explicitly example content. The footer identifies the whole site as a concept sample. Technology labels are themes for illustration, not claimed certifications. No real resource provisioning, payments, registrations, partnerships, refunds or customer service SLAs are implemented.
