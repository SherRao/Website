# Changelog

## [0.11.0](https://github.com/SherRao/Website/compare/v0.10.3...v0.11.0) (2026-11-02)


### Features

* **security:** add a content security policy to the public site ([#118](https://github.com/SherRao/Website/issues/118)) ([de0341d](https://github.com/SherRao/Website/commit/de0341d809215f0a334e652a28a543239237b4f8))
* **security:** send basic security headers across the site ([#117](https://github.com/SherRao/Website/issues/117)) ([f62a4e7](https://github.com/SherRao/Website/commit/f62a4e7da815d076ff0dc5f67aff921d6a05478f))
* **seo:** add a sitemap ([#116](https://github.com/SherRao/Website/issues/116)) ([123cb0d](https://github.com/SherRao/Website/commit/123cb0dc867dd4e74ebc471c1cdefb12dbd5f035))
* **seo:** add robots.txt ([#115](https://github.com/SherRao/Website/issues/115)) ([0d68084](https://github.com/SherRao/Website/commit/0d68084aa82181d9961c04ed6eff5ef8961c776a))


### Bug Fixes

* add timeouts to the Letterboxd, Spotify and resume requests ([#95](https://github.com/SherRao/Website/issues/95)) ([0bc8c20](https://github.com/SherRao/Website/commit/0bc8c2032eaf59226b18c49cfb3d3d0e034e3ab6))
* **images:** limit the image optimizer to this site's Blob store ([#96](https://github.com/SherRao/Website/issues/96)) ([4c98798](https://github.com/SherRao/Website/commit/4c9879867834043edb6817e915a54c182a537d1b))
* **motion:** keep stage photos still on hover with reduced motion ([#97](https://github.com/SherRao/Website/issues/97)) ([84e84f7](https://github.com/SherRao/Website/commit/84e84f726fc572bed169fa1703bad9d68c0073a1))


### Documentation

* correct the README's TypeScript badge, resume path and sections ([#110](https://github.com/SherRao/Website/issues/110)) ([c776fbe](https://github.com/SherRao/Website/commit/c776fbe948ac8db060944b6d3d82c9dc49f2589a))
* **openspec:** bring the main specs in line with the code ([#109](https://github.com/SherRao/Website/issues/109)) ([51b0b57](https://github.com/SherRao/Website/commit/51b0b571ec7a1338c0b3adba17063a0d3f21317f))


### Miscellaneous Chores

* **css:** remove the unused --blue variable ([#111](https://github.com/SherRao/Website/issues/111)) ([1969a22](https://github.com/SherRao/Website/commit/1969a22b5daf9dd1cb1311907dc22a376dc91a31))
* delete the mascot prototype and archive its OpenSpec change ([#108](https://github.com/SherRao/Website/issues/108)) ([a5782c8](https://github.com/SherRao/Website/commit/a5782c8409d12aa2eea1675e066d3408bed83d53))
* move local setups and CI to Node 26 ([#119](https://github.com/SherRao/Website/issues/119)) ([19d6ad3](https://github.com/SherRao/Website/commit/19d6ad364cd3750f8ab1eb01b69aee9c5b51fe37))
* **test:** rename the Vitest config to .mts ([#112](https://github.com/SherRao/Website/issues/112)) ([7adff58](https://github.com/SherRao/Website/commit/7adff581e781e743d4ecdcea0e61c48abb1aecf7))

## [0.10.3](https://github.com/SherRao/Website/compare/v0.10.2...v0.10.3) (2026-11-01)


### Bug Fixes

* **admin:** check a restored revision's resume is really a PDF ([#94](https://github.com/SherRao/Website/issues/94)) ([f5205ee](https://github.com/SherRao/Website/commit/f5205ee94e43a458cdadceb8eff2fdab88d38044))
* **content:** open only outside social links in a new tab ([#92](https://github.com/SherRao/Website/issues/92)) ([bc15607](https://github.com/SherRao/Website/commit/bc1560741697ca9af318d2271c89cf877ae99263))
* **content:** refuse link paths that browsers read as another site ([#91](https://github.com/SherRao/Website/issues/91)) ([b04f9b5](https://github.com/SherRao/Website/commit/b04f9b594cf3c30b780e5ea46c7a300bc155aa5f))
* **db:** log idle pool errors instead of crashing the process ([#93](https://github.com/SherRao/Website/issues/93)) ([d439f1c](https://github.com/SherRao/Website/commit/d439f1c22777f0247e452e7698ce16bad0322678))
* **deps:** override esbuild under drizzle-kit for GHSA-67mh-4wv8-2f99 ([#89](https://github.com/SherRao/Website/issues/89)) ([92763da](https://github.com/SherRao/Website/commit/92763da9930f1f5299cc3809ed995e3c9e5c0139))
* **films:** encode the Letterboxd username in the feed URL ([#88](https://github.com/SherRao/Website/issues/88)) ([3b8ea91](https://github.com/SherRao/Website/commit/3b8ea9107376300752e96b252b99891905e61597))
* **films:** stop announcing unrated films as zero stars ([#90](https://github.com/SherRao/Website/issues/90)) ([6121c47](https://github.com/SherRao/Website/commit/6121c475062dbe79af80fca671f17be60a4c2db9))

## [0.10.2](https://github.com/SherRao/Website/compare/v0.10.1...v0.10.2) (2026-11-01)


### Bug Fixes

* **admin:** keep guarding unsaved changes after leaving the form ([#80](https://github.com/SherRao/Website/issues/80)) ([86f9c69](https://github.com/SherRao/Website/commit/86f9c69b9e208391af5cab8ef559e3313fcf7e26))
* **content:** make admin edits reach the miniature and the "now" item ([#85](https://github.com/SherRao/Website/issues/85)) ([3a9d069](https://github.com/SherRao/Website/commit/3a9d0694af594244383613c000a7c492fca4e468))
* **deps:** override zod under @vercel/cli-config for GHSA-mrhx-c7xc-m3w5 ([#84](https://github.com/SherRao/Website/issues/84)) ([d8b6e97](https://github.com/SherRao/Website/commit/d8b6e9740b6e0812bc8e74cb3afe8e8cade7e534))
* **music:** stop serving an old track as playing now ([#82](https://github.com/SherRao/Website/issues/82)) ([a58e59a](https://github.com/SherRao/Website/commit/a58e59adfc08f1d271a9616d5eda61412c16ddcc))


### Documentation

* **openspec:** complete and archive add-content-admin-panel ([#86](https://github.com/SherRao/Website/issues/86)) ([17296d0](https://github.com/SherRao/Website/commit/17296d07f697d11d6b81ecadbc54fcba6780c8a1))


### Miscellaneous Chores

* remove the stealth scan and the save-time stealth check ([#83](https://github.com/SherRao/Website/issues/83)) ([9519b55](https://github.com/SherRao/Website/commit/9519b55cd4a13b86727b687564ef6a299840d494))

## [0.10.1](https://github.com/SherRao/Website/compare/v0.10.0...v0.10.1) (2026-11-01)


### Bug Fixes

* **dayjob:** stop job names and roles overlapping in the small layout ([#79](https://github.com/SherRao/Website/issues/79)) ([aea6666](https://github.com/SherRao/Website/commit/aea6666a79910f42669b46504779d3cc91c1ee01))

## [0.10.0](https://github.com/SherRao/Website/compare/v0.9.0...v0.10.0) (2026-10-31)


### Features

* add content admin panel ([#45](https://github.com/SherRao/Website/issues/45)) ([1f4901e](https://github.com/SherRao/Website/commit/1f4901e9943ce82421a1b2b870542540e5b3fc5a))

## [0.9.0](https://github.com/SherRao/Website/compare/v0.8.0...v0.9.0) (2026-10-31)


### Features

* let the followspots turn toward the pointer ([#64](https://github.com/SherRao/Website/issues/64)) ([21bc513](https://github.com/SherRao/Website/commit/21bc5138ddf6bfe86438f37ec5fd51453e771074))


### Bug Fixes

* load photos at the small layout's size on short screens ([#67](https://github.com/SherRao/Website/issues/67)) ([ce43752](https://github.com/SherRao/Website/commit/ce4375214acd8aab76204317bd36e9a69e7b5a23))
* **motion:** follow a reduced-motion change mid-visit ([#76](https://github.com/SherRao/Website/issues/76)) ([0b1cb38](https://github.com/SherRao/Website/commit/0b1cb3815a455ee74d6976fc061206cadd76869b))
* **music:** keep the now-playing card to a single poll ([#73](https://github.com/SherRao/Website/issues/73)) ([236852a](https://github.com/SherRao/Website/commit/236852a7aa5c2e6dfeb2cda210f44432a1af216c))
* **spotify:** log failed requests instead of hiding them as "not listening" ([#69](https://github.com/SherRao/Website/issues/69)) ([97bb676](https://github.com/SherRao/Website/commit/97bb676c3835e2edf1da027e44037b2be9d57831))


### Documentation

* archive restructure-career-panels and replace-scrolling-with-lenis ([#71](https://github.com/SherRao/Website/issues/71)) ([cafffdf](https://github.com/SherRao/Website/commit/cafffdfccb104d1d5e9ebe5d1399d716ef211026))

## [0.8.0](https://github.com/SherRao/Website/compare/v0.7.0...v0.8.0) (2026-10-29)


### Features

* add the followspot mascot ([#56](https://github.com/SherRao/Website/issues/56)) ([098765a](https://github.com/SherRao/Website/commit/098765a14b8f37e2facd0a7f0ce9cb914e74fc43))


### Miscellaneous Chores

* **deps:** bump typescript from 6.0.3 to 7.0.2 ([#62](https://github.com/SherRao/Website/issues/62)) ([1c1b04d](https://github.com/SherRao/Website/commit/1c1b04d5385a36ea85703b0eadc6174c33fe29d2))
* founder and off hours content updates ([#63](https://github.com/SherRao/Website/issues/63)) ([fe03709](https://github.com/SherRao/Website/commit/fe03709bac9351f0e3e9c0c16b239ddc327b2962))


### Continuous Integration

* restrict CI workflow GITHUB_TOKEN to read-only contents ([#60](https://github.com/SherRao/Website/issues/60)) ([6af21c5](https://github.com/SherRao/Website/commit/6af21c582d7673cc5761e942c123317d9a687466))

## [0.7.0](https://github.com/SherRao/Website/compare/v0.6.0...v0.7.0) (2026-10-27)


### Features

* smooth page scrolling with Lenis and snap panels in JavaScript ([#54](https://github.com/SherRao/Website/issues/54)) ([3246d91](https://github.com/SherRao/Website/commit/3246d915093154aeda4e06640c4e5c018e76fc3c))


### Documentation

* **resume:** add LaTeX source and name direct customers in Mappedin bullet ([#57](https://github.com/SherRao/Website/issues/57)) ([f227bcd](https://github.com/SherRao/Website/commit/f227bcdaff6a295374594f700e7c578ceec69b05))


### Miscellaneous Chores

* replace ESLint and Prettier with Oxlint and Oxfmt ([#58](https://github.com/SherRao/Website/issues/58)) ([b6f553a](https://github.com/SherRao/Website/commit/b6f553a04b19735c8005e8700a304b60edfdaac6))


### Continuous Integration

* **release:** include docs commits in release-please changelog ([#59](https://github.com/SherRao/Website/issues/59)) ([e7615f6](https://github.com/SherRao/Website/commit/e7615f61692ede55921445c648f298c3dbf33e1e))

## [0.6.0](https://github.com/SherRao/Website/compare/v0.5.0...v0.6.0) (2026-10-26)


### Features

* add the day job panel and split jobs, side projects and founded orgs ([#51](https://github.com/SherRao/Website/issues/51)) ([3dca983](https://github.com/SherRao/Website/commit/3dca9831fcc85faf984a453f6962c1164ad4b813))


### Miscellaneous Chores

* **deps:** bump fast-uri from 3.1.8 to 3.1.9 ([#49](https://github.com/SherRao/Website/issues/49)) ([4058505](https://github.com/SherRao/Website/commit/405850519a27be0fb26bee56cc2275c2703a4af3))
* enforce formatting, linting, and conventional commits with Husky ([#52](https://github.com/SherRao/Website/issues/52)) ([851f033](https://github.com/SherRao/Website/commit/851f03318e555939360ddc2e2d7f17823fdb46ac))

## [0.5.0](https://github.com/SherRao/Website/compare/v0.4.0...v0.5.0) (2026-10-24)


### Features

* redesign the site for phones ([#44](https://github.com/SherRao/Website/issues/44)) ([04d34e0](https://github.com/SherRao/Website/commit/04d34e03b5bda549abcf82c8f6972bdcbc23b94b))


### Bug Fixes

* even out padding in hero glance bar ([#31](https://github.com/SherRao/Website/issues/31)) ([e4d3759](https://github.com/SherRao/Website/commit/e4d375996c6a6277671a66bc43c80e24b63b4c2a))
* keep the phone cover from scrolling sideways and taps from snapping drifting strips ([#47](https://github.com/SherRao/Website/issues/47)) ([7fafece](https://github.com/SherRao/Website/commit/7fafecee2fa0c9a3de04e68cac7e1ebe1f439827))


### Miscellaneous Chores

* add paseo worktree setup config ([#48](https://github.com/SherRao/Website/issues/48)) ([054e5b4](https://github.com/SherRao/Website/commit/054e5b49ef53b4c2190d2807cb2be0d19c1dcc8b))
* **deps:** bump @commitlint/cli from 21.2.3 to 21.2.4 ([#40](https://github.com/SherRao/Website/issues/40)) ([7f783ee](https://github.com/SherRao/Website/commit/7f783ee6a09a526b1b6ce9199b8f11e7330c94e5))
* **deps:** bump @commitlint/config-conventional from 21.2.3 to 21.2.4 ([#39](https://github.com/SherRao/Website/issues/39)) ([8afbd75](https://github.com/SherRao/Website/commit/8afbd75d8b9c59868131a223eeff40b9b1ed5d20))
* **deps:** bump eslint from 10.12.0 to 10.13.0 ([#41](https://github.com/SherRao/Website/issues/41)) ([abffec8](https://github.com/SherRao/Website/commit/abffec8bcc576f38b1454b3faf54c754f53143c3))
* **deps:** bump eslint-config-next from 16.4.1 to 16.4.2 ([#43](https://github.com/SherRao/Website/issues/43)) ([53a55b9](https://github.com/SherRao/Website/commit/53a55b9507146b23dc69ae4e85a56ccda7e478b9))
* **deps:** bump next from 16.4.1 to 16.4.2 ([#42](https://github.com/SherRao/Website/issues/42)) ([26000ca](https://github.com/SherRao/Website/commit/26000caa83ad04261d653d833038ccda11d4cc2c))


### Continuous Integration

* create dependabot.yml ([#33](https://github.com/SherRao/Website/issues/33)) ([9ca5ea2](https://github.com/SherRao/Website/commit/9ca5ea245a0707d553669baee99464b6883016a7))
* **deps:** bump actions/checkout from 4 to 7 ([#35](https://github.com/SherRao/Website/issues/35)) ([87081d1](https://github.com/SherRao/Website/commit/87081d104ddc2e0155e13e8d46cef58a5b398593))
* **deps:** bump actions/setup-node from 4 to 7 in /.github/actions/setup ([#38](https://github.com/SherRao/Website/issues/38)) ([fb7333b](https://github.com/SherRao/Website/commit/fb7333bf33d9f8046d9ec3de3e0c922f0f705413))
* **deps:** bump actions/upload-artifact from 4 to 7 ([#36](https://github.com/SherRao/Website/issues/36)) ([309cd31](https://github.com/SherRao/Website/commit/309cd31016c55bd1d1725e5f46bc56f89372f839))
* **deps:** bump googleapis/release-please-action from 4 to 5 ([#34](https://github.com/SherRao/Website/issues/34)) ([c3e37d6](https://github.com/SherRao/Website/commit/c3e37d6da3f688a7740e14edca5f062c5d262bd5))
* **deps:** bump pnpm/action-setup from 4 to 6 in /.github/actions/setup ([#37](https://github.com/SherRao/Website/issues/37)) ([18f10b6](https://github.com/SherRao/Website/commit/18f10b64545f878e4325923557db1018fc89c018))
* include Dependabot bumps in release-please changelog ([#46](https://github.com/SherRao/Website/issues/46)) ([47f1d13](https://github.com/SherRao/Website/commit/47f1d13601b9bc35c4e6205c35faabb0a5b66111))

## [0.4.0](https://github.com/SherRao/Website/compare/v0.3.0...v0.4.0) (2026-10-24)


### Features

* add resume CTA ([#29](https://github.com/SherRao/Website/issues/29)) ([67c18db](https://github.com/SherRao/Website/commit/67c18db0e9ef4bc76fe8df307430ebfb725904ab))

## [0.3.0](https://github.com/SherRao/Website/compare/v0.2.0...v0.3.0) (2026-10-24)


### Features

* add Mappedin role to resume ([7f7c61b](https://github.com/SherRao/Website/commit/7f7c61b359d137d93a29d3b381b4b2c8dbb75096))

## [0.2.0](https://github.com/SherRao/Website/compare/v0.1.0...v0.2.0) (2026-10-22)


### Features

* add stage-cue loader on first load ([234245f](https://github.com/SherRao/Website/commit/234245f879be977ff00d587c72d166a63feab1ac))


### Bug Fixes

* **content:** lowercase the stage panel text ([6ef1ada](https://github.com/SherRao/Website/commit/6ef1ada16f31015e28ee3edcd8a75281d2de6787))
* **content:** set mappedin dates to mar 2026 to nov 2026 ([5af2b9c](https://github.com/SherRao/Website/commit/5af2b9c73da26f84b65c05132ef23b0b82e208ac))
* **letterboxd:** fall back to stored films in the api route ([cb045b7](https://github.com/SherRao/Website/commit/cb045b72a92d7285fc5b122ad8d550dd55e6d74d))
* **motion:** skip the chapter title fade with reduced motion ([26e99fc](https://github.com/SherRao/Website/commit/26e99fcb8ee1d6ca74c1941236520b2464d79fc8))
