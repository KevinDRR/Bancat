import{bn as p,ag as u}from"./CqjsPOPo.js";import{d as f,a as m}from"./BhmobxBm.js";import{I as g,g as T}from"./BLPMFNMk.js";import{l as $,a as h}from"./21zz6uhk.js";class E extends Error{constructor(i,s,n){super(i),this.status=s,this.detalle=n,this.name="ApiError"}}async function e(a,i,s,n={}){const t=await fetch(i,{method:a,credentials:"include",headers:s?{"Content-Type":"application/json"}:void 0,body:s?JSON.stringify(s):void 0,...n});if(!t.ok){let r=null;try{r=await t.json()}catch{}const o=r&&typeof r=="object"&&"detail"in r?r.detail:null,c=typeof o=="string"?o:`Error ${t.status}: ${t.statusText}`;throw new E(c,t.status,r)}if(t.status!==204)return await t.json()}const d={buscarCliente:a=>e("POST","/api/buscar-cliente",a),solicitarCredito:a=>e("POST","/api/solicitar-credito",a),solicitarCreditoExistente:a=>e("POST","/api/solicitar-credito-existente",a),evaluar:a=>e("POST","/api/evaluar",a),queMejorar:a=>e("POST","/api/que-mejorar",a),listarClientes:(a=!1)=>e("GET",`/api/clientes${a?"?incluir_archivados=true":""}`),estadisticasClientes:()=>e("GET","/api/clientes/estadisticas"),obtenerCliente:a=>e("GET",`/api/clientes/${a}`),actualizarCliente:(a,i)=>e("PUT",`/api/clientes/${a}`,i),eliminarCliente:a=>e("DELETE",`/api/clientes/${a}`),restaurarCliente:a=>e("POST",`/api/clientes/${a}/restaurar`),metricas:()=>e("GET","/api/modelo/metricas"),infoModelo:()=>e("GET","/api/modelo/info"),login:a=>e("POST","/api/login",a),logout:()=>e("POST","/api/logout"),sesion:()=>e("GET","/api/sesion")},l=p({admin:!1,cargando:!0});async function v(){try{const a=await d.sesion();l.set({admin:a.admin,cargando:!1})}catch{l.set({admin:!1,cargando:!1})}}async function O(){try{await d.logout()}finally{l.set({admin:!1,cargando:!1})}}function w(a,i){const s=$(i,["children","$$slots","$$events","$$legacy"]);/**
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
 */const n=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m9 12 2 2 4-4"}]];g(a,h({name:"circle-check"},()=>s,{get iconNode(){return n},children:(t,r)=>{var o=f(),c=u(o);T(c,i,"default",{}),m(t,o)},$$slots:{default:!0}}))}export{E as A,w as C,d as a,O as b,v as c,l as s};
