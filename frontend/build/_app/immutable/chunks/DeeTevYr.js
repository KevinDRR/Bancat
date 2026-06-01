import{d as m,a as d,j as I,s as T}from"./BhmobxBm.js";import{I as h,g as v,c as M,e as j,d as O}from"./BLPMFNMk.js";import{ag as _,aR as P,aO as k,bn as S,Z as y,aj as p,b6 as q,aV as g,be as A,aa as E}from"./CqjsPOPo.js";import{l as b,a as x,s as R,b as V}from"./21zz6uhk.js";import{C as Z}from"./DvFhVLC8.js";function B(e,s){const o=b(s,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.475.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const a=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m15 9-6 6"}],["path",{d:"m9 9 6 6"}]];h(e,x({name:"circle-x"},()=>o,{get iconNode(){return a},children:(t,i)=>{var r=m(),n=_(r);v(n,s,"default",{}),d(t,r)},$$slots:{default:!0}}))}function D(e,s){const o=b(s,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.475.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const a=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]];h(e,x({name:"info"},()=>o,{get iconNode(){return a},children:(t,i)=>{var r=m(),n=_(r);v(n,s,"default",{}),d(t,r)},$$slots:{default:!0}}))}function F(e,s){const o=b(s,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.475.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */const a=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]];h(e,x({name:"triangle-alert"},()=>o,{get iconNode(){return a},children:(t,i)=>{var r=m(),n=_(r);v(n,s,"default",{}),d(t,r)},$$slots:{default:!0}}))}const $=S([]);let G=1;const c={subscribe:$.subscribe,push:(e,s="info",o=3500)=>{const a=G++;$.update(t=>[...t,{id:a,mensaje:e,tone:s}]),setTimeout(()=>{$.update(t=>t.filter(i=>i.id!==a))},o)},success:e=>c.push(e,"success"),danger:e=>c.push(e,"danger"),info:e=>c.push(e,"info"),warning:e=>c.push(e,"warning")};var H=I('<div><!> <p class="text-sm text-foreground flex-1"> </p></div>'),J=I('<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none" role="region" aria-label="Notificaciones" aria-live="polite"></div>');function X(e,s){P(s,!1);const o=()=>V(c,"$toasts",a),[a,t]=R(),i={success:Z,danger:B,info:D,warning:F},r={success:"border-success/30 bg-card text-success",danger:"border-danger/30 bg-card text-danger",info:"border-info/30 bg-card text-info",warning:"border-warning/30 bg-card text-warning"};M();var n=J();j(n,5,o,f=>f.id,(f,u)=>{const z=E(()=>i[p(u).tone]);var l=H(),w=y(l);p(z)(w,{size:18,class:"shrink-0 mt-0.5"});var N=q(w,2),C=y(N,!0);g(N),g(l),A(()=>{O(l,1,`pointer-events-auto flex items-start gap-3 rounded-md border bg-card p-3.5 shadow-lg animate-(--animate-slide-up) ${r[p(u).tone]??""}`),T(C,p(u).mensaje)}),d(f,l)}),g(n),d(e,n),k(),t()}export{B as C,X as T,c as t};
