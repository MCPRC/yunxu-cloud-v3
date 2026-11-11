# Yunxu Sans font provenance

- Source family: Noto Sans CJK SC, local Debian fonts-noto-cjk package.
- Source files: `/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc` and `/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc`; collection index 2.
- Upstream: https://github.com/notofonts/noto-cjk
- License: SIL Open Font License 1.1; retained at `public/fonts/OFL.txt`.
- Modification: fontTools 4.57.0 glyph subsetting and WOFF2 compression; renamed internally to `Yunxu Sans`. No glyph artwork changes.
- Coverage: all Unicode characters in current `app/**/*.tsx` and `components/**/*.tsx`, basic ASCII, Chinese/General/Fullwidth punctuation, common currencies. Unsupported or future characters use the CSS system-font fallback.
- Regenerate after changing page text that introduces new Chinese characters.

| File | Bytes | Unicode mappings | SHA-256 |
|---|---:|---:|---|
| `yunxu-sans-regular.woff2` | 171892 | 879 | `7537f2a627f2814dc8be57dd457fe5b65846321db961f83925c07565603da6c4` |
| `yunxu-sans-bold.woff2` | 174360 | 879 | `ff9e62538c5f0589716d8700cadc7aec792b1f708f06ae4c78d1b8782319a157` |


Validation: both output fonts reopen successfully, all source-supported characters are retained, and title/brand text “云序让每一次连接都有可靠的云为每一种业务找到合适的云” is present in both weights.
