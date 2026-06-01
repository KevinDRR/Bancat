import { a6 as sanitize_props, ae as spread_props, ac as slot, P as head, F as escape_html } from "../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { C as Card, B as Button } from "../../../chunks/Card.js";
import { F as Field, I as Input } from "../../../chunks/Input.js";
import "../../../chunks/Toast.js";
import { S as Shield_check } from "../../../chunks/shield-check.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { L as Lock } from "../../../chunks/lock.js";
function User($$renderer, $$props) {
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
    ["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "12", "cy": "7", "r": "4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "user" },
    $$sanitized_props,
    {
      /**
       * @component @name User
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
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
    let usuario = "";
    let password = "";
    let cargando = false;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1x05zx6", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Acceso admin — Bancat</title>`);
        });
      });
      $$renderer3.push(`<section class="container-page py-16 md:py-24"><div class="max-w-md mx-auto"><div class="text-center mb-8"><div class="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground mb-4 shadow-md">`);
      Shield_check($$renderer3, { size: 24 });
      $$renderer3.push(`<!----></div> <h1 class="text-2xl font-semibold">Acceso administrador</h1> <p class="text-sm text-muted-foreground mt-2">Solo el administrador puede ver las métricas internas del modelo.</p></div> `);
      Card($$renderer3, {
        elevated: true,
        children: ($$renderer4) => {
          $$renderer4.push(`<form class="flex flex-col gap-5">`);
          Field($$renderer4, {
            label: "Usuario",
            for: "usuario",
            required: true,
            children: ($$renderer5) => {
              $$renderer5.push(`<div class="relative">`);
              User($$renderer5, {
                size: 16,
                class: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              });
              $$renderer5.push(`<!----> `);
              Input($$renderer5, {
                id: "usuario",
                placeholder: "admin",
                autocomplete: "username",
                required: true,
                class: "pl-10",
                get value() {
                  return usuario;
                },
                set value($$value) {
                  usuario = $$value;
                  $$settled = false;
                }
              });
              $$renderer5.push(`<!----></div>`);
            }
          });
          $$renderer4.push(`<!----> `);
          Field($$renderer4, {
            label: "Contraseña",
            for: "password",
            required: true,
            children: ($$renderer5) => {
              $$renderer5.push(`<div class="relative">`);
              Lock($$renderer5, {
                size: 16,
                class: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              });
              $$renderer5.push(`<!----> `);
              Input($$renderer5, {
                id: "password",
                type: "password",
                placeholder: "••••••••",
                autocomplete: "current-password",
                required: true,
                class: "pl-10",
                get value() {
                  return password;
                },
                set value($$value) {
                  password = $$value;
                  $$settled = false;
                }
              });
              $$renderer5.push(`<!----></div>`);
            }
          });
          $$renderer4.push(`<!----> `);
          {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--> `);
          Button($$renderer4, {
            type: "submit",
            loading: cargando,
            size: "lg",
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->${escape_html("Iniciar sesión")}`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></form>`);
        }
      });
      $$renderer3.push(`<!----> <p class="text-center text-xs text-muted-foreground mt-6 font-mono">Credenciales demo: admin / admin123</p></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
