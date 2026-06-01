import{d as L,a as l,g as X,j as b,s as Y,h as ee}from"../chunks/BhmobxBm.js";import{a as ae}from"../chunks/CWpbwPHF.js";import{ag as $,aR as D,aO as O,Z as o,aV as n,aL as y,b6 as g,aj as t,be as te,bj as j}from"../chunks/CqjsPOPo.js";import{I as U,g as V,e as re,s as se,d as oe,i as ne,h as ie}from"../chunks/BLPMFNMk.js";import{s as de,b as ce,c as le}from"../chunks/DvFhVLC8.js";import{l as W,a as F,i as k,s as me,b as T}from"../chunks/21zz6uhk.js";import{a as fe,g as pe}from"../chunks/C3hLewYs.js";import{t as ve,T as ue}from"../chunks/DeeTevYr.js";import{B as ge,C as be}from"../chunks/CJgyKi0u.js";import{U as he}from"../chunks/AccH1VyZ.js";import{S as xe}from"../chunks/CFBLhKry.js";const _e=!1,ye=!1,Ke=Object.freeze(Object.defineProperty({__proto__:null,prerender:ye,ssr:_e},Symbol.toStringTag,{value:"Module"})),$e=()=>{const a=fe;return{page:{subscribe:a.page.subscribe},navigating:{subscribe:a.navigating.subscribe},updated:a.updated}},ze={subscribe(a){return $e().page.subscribe(a)}};function Se(a,r){const m=W(r,["children","$$slots","$$events","$$legacy"]);/**
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
 */const i=[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"}],["polyline",{points:"10 17 15 12 10 7"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12"}]];U(a,F({name:"log-in"},()=>m,{get iconNode(){return i},children:(d,v)=>{var c=L(),p=$(c);V(p,r,"default",{}),l(d,c)},$$slots:{default:!0}}))}function we(a,r){const m=W(r,["children","$$slots","$$events","$$legacy"]);/**
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
 */const i=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}],["polyline",{points:"16 17 21 12 16 7"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12"}]];U(a,F({name:"log-out"},()=>m,{get iconNode(){return i},children:(d,v)=>{var c=L(),p=$(c);V(p,r,"default",{}),l(d,c)},$$slots:{default:!0}}))}var je=b("<a><!> </a>"),ke=b('<div class="h-9 w-24 skeleton ml-2"></div>'),Le=b('<span class="ml-2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-primary-soft text-accent-foreground text-xs font-semibold"><!> Admin</span> <button class="flex items-center gap-1.5 px-3.5 h-9 rounded-sm text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors"><!> Cerrar sesión</button>',1),Ne=b('<a href="/login" class="flex items-center gap-1.5 px-3.5 h-9 rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><!> Acceso admin</a>'),Pe=b('<nav class="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md backdrop-saturate-150"><div class="container-page flex h-16 items-center justify-between"><a href="/" class="flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary transition-colors"><span class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm"><!></span> Bancat</a> <div class="flex items-center gap-1"><!> <div class="ml-2 h-6 w-px bg-border"></div> <!></div></div></nav>');function Ae(a,r){D(r,!0);const m=()=>T(ze,"$page",d),i=()=>T(de,"$sesion",d),[d,v]=me(),c=[{href:"/",label:"Inicio"},{href:"/credito",label:"Solicitar crédito"},{href:"/clientes",label:"Clientes",admin:!0},{href:"/metricas",label:"Dashboard",admin:!0}];async function p(){await ce(),ve.success("Sesión cerrada"),await pe("/")}let N=j(()=>m().url.pathname),P=j(()=>i().admin);var z=Pe(),A=o(z),S=o(A),B=o(S),H=o(B);ge(H,{size:18,strokeWidth:2.5}),n(B),y(),n(S);var C=g(S,2),I=o(C);re(I,17,()=>c,ne,(s,e)=>{var f=L(),w=$(f);{var h=x=>{const E=j(()=>t(e).href==="/"?t(N)==="/":t(N).startsWith(t(e).href));var _=je(),M=o(_);{var G=u=>{he(u,{size:15})},J=u=>{be(u,{size:15})};k(M,u=>{t(e).href==="/clientes"?u(G):t(e).admin&&u(J,1)})}var Q=g(M);n(_),te(()=>{se(_,"href",t(e).href),oe(_,1,`flex items-center gap-1.5 px-3.5 h-9 rounded-sm text-sm font-medium transition-colors ${t(E)?"text-primary bg-primary-soft":"text-muted-foreground hover:text-foreground hover:bg-muted"}`),Y(Q,` ${t(e).label??""}`)}),l(x,_)};k(w,x=>{(!t(e).admin||t(P))&&x(h)})}l(s,f)});var K=g(I,4);{var R=s=>{var e=ke();l(s,e)},Z=s=>{var e=Le(),f=$(e),w=o(f);xe(w,{size:12}),y(),n(f);var h=g(f,2),x=o(h);we(x,{size:15}),y(),n(h),ee("click",h,p),l(s,e)},q=s=>{var e=Ne(),f=o(e);Se(f,{size:15}),y(),n(e),l(s,e)};k(K,s=>{i().cargando?s(R):t(P)?s(Z,1):s(q,-1)})}n(C),n(A),n(z),l(a,z),O(),v()}X(["click"]);var Be=b('<div class="flex flex-col min-h-screen"><!> <main class="flex-1 animate-(--animate-fade-in)"><!></main> <footer class="border-t border-border bg-card mt-12"><div class="container-page py-6 flex items-center justify-between text-xs text-muted-foreground"><p>© Bancat — Demo académica de evaluación crediticia con Deep Learning</p> <p class="font-mono">FastAPI · PyTorch · SvelteKit</p></div></footer></div> <!>',1);function Re(a,r){D(r,!0),ae(()=>{le()});var m=Be(),i=$(m),d=o(i);Ae(d,{});var v=g(d,2),c=o(v);ie(c,()=>r.children),n(v),y(2),n(i);var p=g(i,2);ue(p,{}),l(a,m),O()}export{Re as component,Ke as universal};
