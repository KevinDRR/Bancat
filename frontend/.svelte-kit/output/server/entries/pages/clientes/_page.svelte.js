import { a6 as sanitize_props, ae as spread_props, ac as slot, P as head, af as store_get, j as attr, aj as unsubscribe_stores, x as derived, F as escape_html, D as ensure_array_like, ag as stringify, k as attr_class } from "../../../chunks/renderer.js";
import { g as goto } from "../../../chunks/client.js";
import { s as sesion } from "../../../chunks/session.js";
import { B as Badge, S as Search, c as colorPorNivel, f as formatCOP, T as Trash_2 } from "../../../chunks/Badge.js";
import { C as Card, B as Button } from "../../../chunks/Card.js";
import { F as Field, I as Input } from "../../../chunks/Input.js";
import { t as toasts } from "../../../chunks/Toast.js";
import { L as Lock } from "../../../chunks/lock.js";
import { U as Users } from "../../../chunks/users.js";
import { I as Icon } from "../../../chunks/Icon.js";
class ApiError extends Error {
  constructor(message, status, detalle) {
    super(message);
    this.status = status;
    this.detalle = detalle;
    this.name = "ApiError";
  }
}
async function request(method, url, body, init = {}) {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : void 0,
    body: body ? JSON.stringify(body) : void 0,
    ...init
  });
  if (!res.ok) {
    let detalle = null;
    try {
      detalle = await res.json();
    } catch {
    }
    const detail = detalle && typeof detalle === "object" && "detail" in detalle ? detalle.detail : null;
    const msg = typeof detail === "string" ? detail : `Error ${res.status}: ${res.statusText}`;
    throw new ApiError(msg, res.status, detalle);
  }
  if (res.status === 204) return void 0;
  return await res.json();
}
const api = {
  buscarCliente: (datos) => request(
    "POST",
    "/api/buscar-cliente",
    datos
  ),
  solicitarCredito: (cliente) => request("POST", "/api/solicitar-credito", cliente),
  solicitarCreditoExistente: (datos) => request(
    "POST",
    "/api/solicitar-credito-existente",
    datos
  ),
  evaluar: (datos) => request("POST", "/api/evaluar", datos),
  queMejorar: (datos) => request("POST", "/api/que-mejorar", datos),
  listarClientes: (incluirArchivados = false) => request(
    "GET",
    `/api/clientes${incluirArchivados ? "?incluir_archivados=true" : ""}`
  ),
  estadisticasClientes: () => request("GET", "/api/clientes/estadisticas"),
  obtenerCliente: (id) => request("GET", `/api/clientes/${id}`),
  actualizarCliente: (id, datos) => request("PUT", `/api/clientes/${id}`, datos),
  // Eliminación en dos fases: 1er intento archiva, 2do borra definitivo + reindexa ids.
  eliminarCliente: (id) => request(
    "DELETE",
    `/api/clientes/${id}`
  ),
  restaurarCliente: (id) => request("POST", `/api/clientes/${id}/restaurar`),
  metricas: () => request("GET", "/api/modelo/metricas"),
  infoModelo: () => request("GET", "/api/modelo/info"),
  login: (datos) => request("POST", "/api/login", datos),
  logout: () => request("POST", "/api/logout"),
  sesion: () => request("GET", "/api/sesion")
};
function Archive_restore($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    [
      "rect",
      { "width": "20", "height": "5", "x": "2", "y": "3", "rx": "1" }
    ],
    ["path", { "d": "M4 8v11a2 2 0 0 0 2 2h2" }],
    ["path", { "d": "M20 8v11a2 2 0 0 1-2 2h-2" }],
    ["path", { "d": "m9 15 3-3 3 3" }],
    ["path", { "d": "M12 12v9" }]
  ];
  Icon($$renderer, spread_props([
    { name: "archive-restore" },
    $$sanitized_props,
    {
      /**
       * @component @name ArchiveRestore
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iNSIgeD0iMiIgeT0iMyIgcng9IjEiIC8+CiAgPHBhdGggZD0iTTQgOHYxMWEyIDIgMCAwIDAgMiAyaDIiIC8+CiAgPHBhdGggZD0iTTIwIDh2MTFhMiAyIDAgMCAxLTIgMmgtMiIgLz4KICA8cGF0aCBkPSJtOSAxNSAzLTMgMyAzIiAvPgogIDxwYXRoIGQ9Ik0xMiAxMnY5IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/archive-restore
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Archive($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    [
      "rect",
      { "width": "20", "height": "5", "x": "2", "y": "3", "rx": "1" }
    ],
    ["path", { "d": "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
    ["path", { "d": "M10 12h4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "archive" },
    $$sanitized_props,
    {
      /**
       * @component @name Archive
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iNSIgeD0iMiIgeT0iMyIgcng9IjEiIC8+CiAgPHBhdGggZD0iTTQgOHYxMWEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOCIgLz4KICA8cGF0aCBkPSJNMTAgMTJoNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/archive
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Pencil($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ],
    ["path", { "d": "m15 5 4 4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "pencil" },
    $$sanitized_props,
    {
      /**
       * @component @name Pencil
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/pencil
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Refresh_cw($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
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
   */
  const iconNode = [
    [
      "path",
      { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }
    ],
    ["path", { "d": "M21 3v5h-5" }],
    [
      "path",
      { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }
    ],
    ["path", { "d": "M8 16H3v5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "refresh-cw" },
    $$sanitized_props,
    {
      /**
       * @component @name RefreshCw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let clientes = [];
    let cargando = true;
    let incluirArchivados = true;
    let idBuscar = void 0;
    let resaltadoId = null;
    async function refrescar() {
      cargando = true;
      try {
        clientes = await api.listarClientes(incluirArchivados);
      } catch (err) {
        toasts.danger(err instanceof ApiError ? err.message : "No se pudo cargar la lista");
      } finally {
        cargando = false;
      }
    }
    async function buscarPorId() {
      if (!idBuscar) {
        toasts.info("Escribe un id para buscar");
        return;
      }
      try {
        const c = await api.obtenerCliente(idBuscar);
        if (!clientes.some((x) => x.id === c.id)) {
          if (c.archivado && !incluirArchivados) incluirArchivados = true;
          await refrescar();
        }
        resaltadoId = c.id;
        toasts.success(`Cliente #${c.id}: ${c.nombre}`);
        setTimeout(
          () => {
            document.getElementById(`cliente-fila-${c.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          },
          50
        );
      } catch (err) {
        resaltadoId = null;
        toasts.danger(err instanceof ApiError ? err.message : `No existe el cliente #${idBuscar}`);
      }
    }
    let activos = derived(() => clientes.filter((c) => !c.archivado).length);
    let archivadosCount = derived(() => clientes.filter((c) => c.archivado).length);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1uf6cn0", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Gestión de clientes — Bancat</title>`);
        });
      });
      $$renderer3.push(`<section class="container-page py-10 md:py-14">`);
      if (!store_get($$store_subs ??= {}, "$sesion", sesion).cargando && !store_get($$store_subs ??= {}, "$sesion", sesion).admin) {
        $$renderer3.push("<!--[0-->");
        Card($$renderer3, {
          elevated: true,
          class: "max-w-md mx-auto text-center",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex flex-col items-center gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-md bg-warning-soft text-warning">`);
            Lock($$renderer4, { size: 24 });
            $$renderer4.push(`<!----></div> <div><h2 class="text-lg font-semibold">Acceso restringido</h2> <p class="text-sm text-muted-foreground mt-1">Esta sección requiere credenciales de administrador.</p></div> `);
            Button($$renderer4, {
              onclick: () => goto(),
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Iniciar sesión`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<header class="mb-8 flex items-end justify-between flex-wrap gap-4"><div><p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Administración</p> <h1 class="text-3xl md:text-4xl font-semibold flex items-center gap-3">`);
        Users($$renderer3, { size: 30, class: "text-primary" });
        $$renderer3.push(`<!----> Gestión de clientes</h1> <p class="text-muted-foreground mt-2">Buscar, editar, archivar y eliminar registros. La eliminación es en dos
                    pasos: primero archiva, y un segundo intento borra definitivamente.</p></div> <div class="flex gap-2">`);
        Badge($$renderer3, {
          tone: "success",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(activos())} activos`);
          }
        });
        $$renderer3.push(`<!----> `);
        if (archivadosCount() > 0) {
          $$renderer3.push("<!--[0-->");
          Badge($$renderer3, {
            tone: "neutral",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(archivadosCount())} archivados`);
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div></header> `);
        Card($$renderer3, {
          class: "mb-6",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex flex-wrap items-end gap-4"><div class="flex items-end gap-2">`);
            Field($$renderer4, {
              label: "Buscar por ID",
              for: "id-buscar",
              class: "w-40",
              children: ($$renderer5) => {
                Input($$renderer5, {
                  id: "id-buscar",
                  type: "number",
                  min: 1,
                  placeholder: "Ej: 5",
                  onkeydown: (e) => e.key === "Enter" && buscarPorId(),
                  get value() {
                    return idBuscar;
                  },
                  set value($$value) {
                    idBuscar = $$value;
                    $$settled = false;
                  }
                });
              }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              onclick: buscarPorId,
              children: ($$renderer5) => {
                Search($$renderer5, { size: 16 });
                $$renderer5.push(`<!----> Buscar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div> <label class="flex items-center gap-2 text-sm cursor-pointer ml-auto select-none"><input type="checkbox"${attr("checked", incluirArchivados, true)} class="size-4 accent-primary"/> Mostrar archivados</label> `);
            Button($$renderer4, {
              variant: "outline",
              onclick: refrescar,
              children: ($$renderer5) => {
                Refresh_cw($$renderer5, { size: 15 });
                $$renderer5.push(`<!----> Refrescar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div>`);
          }
        });
        $$renderer3.push(`<!----> `);
        Card($$renderer3, {
          children: ($$renderer4) => {
            if (cargando) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<p class="text-sm text-muted-foreground py-8 text-center">Cargando…</p>`);
            } else if (clientes.length === 0) {
              $$renderer4.push("<!--[1-->");
              $$renderer4.push(`<p class="text-sm text-muted-foreground py-8 text-center">No hay clientes registrados todavía.</p>`);
            } else {
              $$renderer4.push("<!--[-1-->");
              $$renderer4.push(`<div class="overflow-x-auto -mx-6 px-6"><table class="w-full text-sm"><thead><tr class="text-xs uppercase tracking-wider text-muted-foreground border-b border-border"><th class="text-left font-medium pb-2.5 pr-3">ID</th><th class="text-left font-medium pb-2.5 pr-3">Cliente</th><th class="text-left font-medium pb-2.5 pr-3">Nivel</th><th class="text-right font-medium pb-2.5 pr-3">Ingresos</th><th class="text-right font-medium pb-2.5 pr-3">Monto máx.</th><th class="text-left font-medium pb-2.5 pr-3">Estado</th><th class="text-right font-medium pb-2.5">Acciones</th></tr></thead><tbody><!--[-->`);
              const each_array = ensure_array_like(clientes);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let c = each_array[$$index];
                $$renderer4.push(`<tr${attr("id", `cliente-fila-${stringify(c.id)}`)}${attr_class(`border-b border-border last:border-0 transition-colors ${resaltadoId === c.id ? "bg-primary-soft/50" : ""} ${c.archivado ? "opacity-60" : ""}`)}><td class="py-3 pr-3 tabular font-mono text-muted-foreground">#${escape_html(c.id)}</td><td class="py-3 pr-3"><p class="font-medium">${escape_html(c.nombre)}</p> <p class="text-xs text-muted-foreground">${escape_html(c.correo)}</p></td><td class="py-3 pr-3">`);
                Badge($$renderer4, {
                  tone: colorPorNivel(c.nivel_riesgo),
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(c.nivel_riesgo)}`);
                  }
                });
                $$renderer4.push(`<!----></td><td class="py-3 pr-3 text-right tabular">${escape_html(formatCOP(c.ingresos))}</td><td class="py-3 pr-3 text-right tabular">${escape_html(c.monto_maximo > 0 ? formatCOP(c.monto_maximo) : "—")}</td><td class="py-3 pr-3">`);
                if (c.archivado) {
                  $$renderer4.push("<!--[0-->");
                  Badge($$renderer4, {
                    tone: "neutral",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!---->Archivado`);
                    }
                  });
                } else if (c.credito_aprobado) {
                  $$renderer4.push("<!--[1-->");
                  Badge($$renderer4, {
                    tone: "success",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!---->Aprobado`);
                    }
                  });
                } else {
                  $$renderer4.push("<!--[-1-->");
                  Badge($$renderer4, {
                    tone: "danger",
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!---->Rechazado`);
                    }
                  });
                }
                $$renderer4.push(`<!--]--></td><td class="py-3 text-right whitespace-nowrap"><div class="inline-flex items-center gap-1"><button class="p-1.5 rounded-xs text-muted-foreground hover:text-primary hover:bg-primary-soft transition-colors" aria-label="Editar" title="Editar">`);
                Pencil($$renderer4, { size: 15 });
                $$renderer4.push(`<!----></button> `);
                if (c.archivado) {
                  $$renderer4.push("<!--[0-->");
                  $$renderer4.push(`<button class="p-1.5 rounded-xs text-muted-foreground hover:text-success hover:bg-success-soft transition-colors" aria-label="Restaurar" title="Restaurar">`);
                  Archive_restore($$renderer4, { size: 15 });
                  $$renderer4.push(`<!----></button> <button class="p-1.5 rounded-xs text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors" aria-label="Eliminar definitivamente" title="Eliminar definitivamente">`);
                  Trash_2($$renderer4, { size: 15 });
                  $$renderer4.push(`<!----></button>`);
                } else {
                  $$renderer4.push("<!--[-1-->");
                  $$renderer4.push(`<button class="p-1.5 rounded-xs text-muted-foreground hover:text-warning hover:bg-warning-soft transition-colors" aria-label="Archivar" title="Archivar">`);
                  Archive($$renderer4, { size: 15 });
                  $$renderer4.push(`<!----></button>`);
                }
                $$renderer4.push(`<!--]--></div></td></tr>`);
              }
              $$renderer4.push(`<!--]--></tbody></table></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          }
        });
        $$renderer3.push(`<!---->`);
      }
      $$renderer3.push(`<!--]--></section> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
