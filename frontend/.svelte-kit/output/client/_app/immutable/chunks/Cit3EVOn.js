import{f as F,d as I,a as v,j as x}from"./BhmobxBm.js";import{I as T,g as z,a as A,b as O,h as Q}from"./BLPMFNMk.js";import{b3 as S,a2 as Z,at as C,aV as q,b2 as E,a3 as G,ag as w,aR as P,aO as V,Z as J,b9 as D,aQ as K,bk as U,aj as u,a_ as y,bf as W}from"./CqjsPOPo.js";import{l as j,a as k,p as f,r as B}from"./21zz6uhk.js";import{b as X}from"./CzX62ugc.js";let $=null;function Y(){var e,t;if($===null){var r=G("select");r.innerHTML=F("<option><span>t</span></option>"),$=((t=(e=r.firstChild)==null?void 0:e.firstChild)==null?void 0:t.nodeType)===1}return $}function ee(r,e){var t=C;Y()||(S(!1),r.textContent="",r.append(Z("")));try{e()}finally{t&&(C?q(r):(S(!0),E(r)))}}function ce(r,e){const t=j(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const i=[["circle",{cx:"11",cy:"11",r:"8"}],["path",{d:"m21 21-4.3-4.3"}]];T(r,k({name:"search"},()=>t,{get iconNode(){return i},children:(l,p)=>{var s=I(),n=w(s);z(n,e,"default",{}),v(l,s)},$$slots:{default:!0}}))}function de(r,e){const t=j(e,["children","$$slots","$$events","$$legacy"]);/**
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
 */const i=[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]];T(r,k({name:"trash-2"},()=>t,{get iconNode(){return i},children:(l,p)=>{var s=I(),n=w(s);z(n,e,"default",{}),v(l,s)},$$slots:{default:!0}}))}var te=x("<!>",1),ae=x("<select><!></select>");function ue(r,e){P(e,!0);let t=f(e,"value",15),i=f(e,"invalid",3,!1),l=f(e,"class",3,""),p=B(e,["$$slots","$$events","$$legacy","value","invalid","class","children"]);const s=i()?"border-danger":"border-input";var n=ae();A(n,()=>({class:`h-11 w-full rounded-md border bg-card px-3.5 text-sm transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%235b6b62%27><path d=%27M5.25 7.5L10 12.25 14.75 7.5z%27/></svg>")] bg-no-repeat bg-[right_0.75rem_center] pr-10 ${s} ${l()??""}`,"aria-invalid":i(),...p})),ee(n,()=>{var b=J(n),h=te(),c=w(h);Q(c,()=>e.children),v(b,h)}),O(n,t),v(r,n),V()}var re=x("<input/>");function fe(r,e){P(e,!0);let t=f(e,"value",15,0),i=f(e,"invalid",3,!1),l=f(e,"class",3,""),p=B(e,["$$slots","$$events","$$legacy","value","invalid","class"]);function s(a){return a==null||!isFinite(a)?"":Math.trunc(a).toString().replace(/\B(?=(\d{3})+(?!\d))/g,"'")}function n(a){const o=a.replace(/\D/g,"");return o===""?0:parseInt(o,10)}function b(a){return(a.match(/\d/g)??[]).length}function h(a,o){if(o<=0)return 0;let m=0;for(let d=0;d<a.length;d++)if(/\d/.test(a[d])&&m++,m===o)return d+1;return a.length}let c=D(void 0),g=D(K(t()?s(t()):""));U(()=>{n(u(g))!==t()&&y(g,t()?s(t()):"",!0)});function H(a){const o=a.currentTarget,m=o.selectionStart??o.value.length,d=b(o.value.slice(0,m)),M=n(o.value),R=o.value.replace(/\D/g,"");t(M),y(g,R===""?"":s(M),!0),W().then(()=>{if(!u(c))return;const N=h(u(g),d);u(c).setSelectionRange(N,N)})}const L=i()?"border-danger":"border-input";var _=re();A(_,()=>({type:"text",inputmode:"numeric",value:u(g),oninput:H,class:`h-11 w-full rounded-md border bg-card px-3.5 text-sm tabular placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${L} ${l()??""}`,"aria-invalid":i(),...p}),void 0,void 0,void 0,void 0,!0),X(_,a=>y(c,a),()=>u(c)),v(r,_),V()}export{fe as M,ce as S,de as T,ue as a};
