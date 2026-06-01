import { a6 as sanitize_props, ae as spread_props, ac as slot, P as head, D as ensure_array_like, F as escape_html, k as attr_class, ag as stringify } from "../../chunks/renderer.js";
import { B as Button, C as Card } from "../../chunks/Card.js";
import { S as Sparkles } from "../../chunks/sparkles.js";
import { I as Icon } from "../../chunks/Icon.js";
import { S as Shield_check } from "../../chunks/shield-check.js";
function Arrow_right($$renderer, $$props) {
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
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "m12 5 7 7-7 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
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
function Brain_circuit($$renderer, $$props) {
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
        "d": "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
      }
    ],
    ["path", { "d": "M9 13a4.5 4.5 0 0 0 3-4" }],
    ["path", { "d": "M6.003 5.125A3 3 0 0 0 6.401 6.5" }],
    ["path", { "d": "M3.477 10.896a4 4 0 0 1 .585-.396" }],
    ["path", { "d": "M6 18a4 4 0 0 1-1.967-.516" }],
    ["path", { "d": "M12 13h4" }],
    ["path", { "d": "M12 18h6a2 2 0 0 1 2 2v1" }],
    ["path", { "d": "M12 8h8" }],
    ["path", { "d": "M16 8V5a2 2 0 0 1 2-2" }],
    ["circle", { "cx": "16", "cy": "13", "r": ".5" }],
    ["circle", { "cx": "18", "cy": "3", "r": ".5" }],
    ["circle", { "cx": "20", "cy": "21", "r": ".5" }],
    ["circle", { "cx": "20", "cy": "8", "r": ".5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "brain-circuit" },
    $$sanitized_props,
    {
      /**
       * @component @name BrainCircuit
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNWEzIDMgMCAxIDAtNS45OTcuMTI1IDQgNCAwIDAgMC0yLjUyNiA1Ljc3IDQgNCAwIDAgMCAuNTU2IDYuNTg4QTQgNCAwIDEgMCAxMiAxOFoiIC8+CiAgPHBhdGggZD0iTTkgMTNhNC41IDQuNSAwIDAgMCAzLTQiIC8+CiAgPHBhdGggZD0iTTYuMDAzIDUuMTI1QTMgMyAwIDAgMCA2LjQwMSA2LjUiIC8+CiAgPHBhdGggZD0iTTMuNDc3IDEwLjg5NmE0IDQgMCAwIDEgLjU4NS0uMzk2IiAvPgogIDxwYXRoIGQ9Ik02IDE4YTQgNCAwIDAgMS0xLjk2Ny0uNTE2IiAvPgogIDxwYXRoIGQ9Ik0xMiAxM2g0IiAvPgogIDxwYXRoIGQ9Ik0xMiAxOGg2YTIgMiAwIDAgMSAyIDJ2MSIgLz4KICA8cGF0aCBkPSJNMTIgOGg4IiAvPgogIDxwYXRoIGQ9Ik0xNiA4VjVhMiAyIDAgMCAxIDItMiIgLz4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjEzIiByPSIuNSIgLz4KICA8Y2lyY2xlIGN4PSIxOCIgY3k9IjMiIHI9Ii41IiAvPgogIDxjaXJjbGUgY3g9IjIwIiBjeT0iMjEiIHI9Ii41IiAvPgogIDxjaXJjbGUgY3g9IjIwIiBjeT0iOCIgcj0iLjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/brain-circuit
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
function Layers($$renderer, $$props) {
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
        "d": "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
      }
    ],
    [
      "path",
      {
        "d": "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
      }
    ],
    [
      "path",
      {
        "d": "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layers" },
    $$sanitized_props,
    {
      /**
       * @component @name Layers
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuODMgMi4xOGEyIDIgMCAwIDAtMS42NiAwTDIuNiA2LjA4YTEgMSAwIDAgMCAwIDEuODNsOC41OCAzLjkxYTIgMiAwIDAgMCAxLjY2IDBsOC41OC0zLjlhMSAxIDAgMCAwIDAtMS44M3oiIC8+CiAgPHBhdGggZD0iTTIgMTJhMSAxIDAgMCAwIC41OC45MWw4LjYgMy45MWEyIDIgMCAwIDAgMS42NSAwbDguNTgtMy45QTEgMSAwIDAgMCAyMiAxMiIgLz4KICA8cGF0aCBkPSJNMiAxN2ExIDEgMCAwIDAgLjU4LjkxbDguNiAzLjkxYTIgMiAwIDAgMCAxLjY1IDBsOC41OC0zLjlBMSAxIDAgMCAwIDIyIDE3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/layers
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
function Trending_down($$renderer, $$props) {
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
    ["polyline", { "points": "22 17 13.5 8.5 8.5 13.5 2 7" }],
    ["polyline", { "points": "16 17 22 17 22 11" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trending-down" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cG9seWxpbmUgcG9pbnRzPSIyMiAxNyAxMy41IDguNSA4LjUgMTMuNSAyIDciIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgMTcgMjIgMTcgMjIgMTEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trending-down
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
function Zap($$renderer, $$props) {
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
        "d": "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "zap" },
    $$sanitized_props,
    {
      /**
       * @component @name Zap
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxNGExIDEgMCAwIDEtLjc4LTEuNjNsOS45LTEwLjJhLjUuNSAwIDAgMSAuODYuNDZsLTEuOTIgNi4wMkExIDEgMCAwIDAgMTMgMTBoN2ExIDEgMCAwIDEgLjc4IDEuNjNsLTkuOSAxMC4yYS41LjUgMCAwIDEtLjg2LS40NmwxLjkyLTYuMDJBMSAxIDAgMCAwIDExIDE0eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/zap
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
function _page($$renderer) {
  head("1uha8ag", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Bancat — Evaluación crediticia con Deep Learning</title>`);
    });
  });
  $$renderer.push(`<section class="relative overflow-hidden"><div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-soft),_transparent_50%)] -z-10"></div> <div class="container-page py-20 md:py-28 lg:py-32"><div class="max-w-3xl"><span class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-3.5 py-1 text-xs font-semibold text-accent-foreground mb-6">`);
  Sparkles($$renderer, { size: 14 });
  $$renderer.push(`<!----> Powered by una red neuronal entrenada sobre 5.000 perfiles</span> <h1 class="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">Crédito justo,<br/> <span class="text-primary">decisión transparente.</span></h1> <p class="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">Bancat evalúa tu perfil financiero con una red neuronal explicable.
                Una sola predicción alimenta todas las decisiones — monto, tasa,
                producto recomendado y qué cambiar para mejorar.</p> <div class="mt-10 flex flex-wrap items-center gap-3">`);
  Button($$renderer, {
    href: "/credito",
    size: "lg",
    children: ($$renderer2) => {
      $$renderer2.push(`<!---->Solicitar crédito `);
      Arrow_right($$renderer2, { size: 18 });
      $$renderer2.push(`<!---->`);
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----> `);
  Button($$renderer, {
    href: "#como-funciona",
    variant: "outline",
    size: "lg",
    children: ($$renderer2) => {
      $$renderer2.push(`<!---->Cómo funciona`);
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----></div></div> <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border"><!--[-->`);
  const each_array = ensure_array_like([
    { valor: "0.958", label: "AUC-ROC del modelo" },
    { valor: "89.6%", label: "Accuracy en validación" },
    { valor: "< 100ms", label: "Tiempo de inferencia" },
    { valor: "10", label: "Features evaluadas" }
  ]);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let stat = each_array[$$index];
    $$renderer.push(`<div class="bg-card p-5"><div class="text-2xl md:text-3xl font-bold tabular text-primary">${escape_html(stat.valor)}</div> <div class="text-xs text-muted-foreground mt-1">${escape_html(stat.label)}</div></div>`);
  }
  $$renderer.push(`<!--]--></div></div></section> <section id="como-funciona" class="container-page py-16 md:py-24"><div class="max-w-2xl mb-12"><p class="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Cómo funciona</p> <h2 class="text-3xl md:text-4xl font-semibold">Una sola predicción, múltiples decisiones de negocio.</h2></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-5"><!--[-->`);
  const each_array_1 = ensure_array_like([
    {
      Icon: Brain_circuit,
      titulo: "Modelo explicable",
      desc: "Red neuronal con BatchNorm + Dropout entrenada sobre 5.000 perfiles. Cada decisión viene acompañada de una explicación SHAP feature-por-feature."
    },
    {
      Icon: Layers,
      titulo: "Decisiones derivadas",
      desc: "Una probabilidad alimenta todo: nivel de riesgo, monto máximo, tasa sugerida, producto recomendado y elegibilidad por requisitos de perfil."
    },
    {
      Icon: Trending_down,
      titulo: "¿Qué debo mejorar?",
      desc: "Si tu solicitud es rechazada, el sistema simula cambios concretos en tu perfil y te muestra exactamente qué necesitas para que cambie la decisión."
    }
  ]);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let servicio = each_array_1[$$index_1];
    Card($$renderer, {
      class: "hover:border-primary/30 transition-all duration-200 group",
      elevated: true,
      children: ($$renderer2) => {
        $$renderer2.push(`<div class="flex flex-col gap-4"><div class="flex h-11 w-11 items-center justify-center rounded-md bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">`);
        servicio.Icon($$renderer2, { size: 22 });
        $$renderer2.push(`<!----></div> <h3 class="text-lg font-semibold">${escape_html(servicio.titulo)}</h3> <p class="text-sm text-muted-foreground leading-relaxed">${escape_html(servicio.desc)}</p></div>`);
      }
    });
  }
  $$renderer.push(`<!--]--></div></section> <section class="container-page py-16 md:py-24"><div class="grid md:grid-cols-2 gap-12 items-center"><div><p class="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Productos</p> <h2 class="text-3xl md:text-4xl font-semibold mb-4">4 productos, calibrados por perfil de riesgo.</h2> <p class="text-muted-foreground leading-relaxed mb-6">Hipoteca para perfiles sólidos, préstamo para riesgo moderado,
                tarjeta de crédito hasta riesgo alto, y débito siempre disponible.
                El sistema valida el nivel de riesgo y los umbrales de perfil
                (historial, ingresos, ratio deuda) antes de aprobar.</p> `);
  Button($$renderer, {
    href: "/credito",
    children: ($$renderer2) => {
      $$renderer2.push(`<!---->Ver mi elegibilidad `);
      Arrow_right($$renderer2, { size: 16 });
      $$renderer2.push(`<!---->`);
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----></div> <div class="grid grid-cols-2 gap-3"><!--[-->`);
  const each_array_2 = ensure_array_like([
    {
      nombre: "Hipoteca",
      desc: "Riesgo Bajo",
      tone: "bg-primary text-primary-foreground"
    },
    {
      nombre: "Préstamo",
      desc: "Riesgo ≤ Moderado",
      tone: "bg-primary-soft text-accent-foreground"
    },
    {
      nombre: "Crédito",
      desc: "Riesgo ≤ Alto",
      tone: "bg-warning-soft text-warning"
    },
    {
      nombre: "Débito",
      desc: "Todos los perfiles",
      tone: "bg-muted text-foreground"
    }
  ]);
  for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
    let producto = each_array_2[i];
    $$renderer.push(`<div${attr_class(`rounded-lg border border-border p-5 transition-transform hover:-translate-y-0.5 ${i % 2 === 1 ? "mt-6" : ""}`)}><div${attr_class(`text-xs font-semibold ${stringify(producto.tone)} inline-block px-2 py-0.5 rounded-xs mb-3`)}>${escape_html(producto.desc)}</div> <p class="font-semibold">${escape_html(producto.nombre)}</p></div>`);
  }
  $$renderer.push(`<!--]--></div></div></section> <section class="container-page py-16"><div class="rounded-xl bg-gradient-to-br from-primary to-primary-hover text-primary-foreground p-10 md:p-14 relative overflow-hidden"><div class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div> <div class="relative max-w-2xl flex flex-col gap-5">`);
  Zap($$renderer, { size: 32 });
  $$renderer.push(`<!----> <h2 class="text-3xl md:text-4xl font-semibold">Evalúa tu perfil en menos de un minuto.</h2> <p class="text-white/90 text-lg">Sin compromiso, sin impacto en tu historial. Solo un análisis
                instantáneo con explicación detallada.</p> <div class="flex flex-wrap gap-3 mt-2"><a href="/credito" class="inline-flex items-center gap-2 h-12 px-6 rounded-md bg-white text-primary font-semibold hover:bg-white/90 transition-colors">Comenzar evaluación `);
  Arrow_right($$renderer, { size: 18 });
  $$renderer.push(`<!----></a> <a href="/credito" class="inline-flex items-center gap-2 h-12 px-6 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors">`);
  Shield_check($$renderer, { size: 18 });
  $$renderer.push(`<!----> Solo simular</a></div></div></div></section>`);
}
export {
  _page as default
};
