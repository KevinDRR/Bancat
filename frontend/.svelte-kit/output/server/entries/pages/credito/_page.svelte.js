import { a6 as sanitize_props, ae as spread_props, ac as slot, k as attr_class, D as ensure_array_like, j as attr, F as escape_html, ag as stringify, P as head, af as store_get, aj as unsubscribe_stores } from "../../../chunks/renderer.js";
import { C as Card, B as Button } from "../../../chunks/Card.js";
import { F as Field, I as Input } from "../../../chunks/Input.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { S as Search, B as Badge, c as colorPorNivel, f as formatCOP, T as Trash_2 } from "../../../chunks/Badge.js";
import "../../../chunks/Toast.js";
import { s as sesion } from "../../../chunks/session.js";
import { S as Sparkles } from "../../../chunks/sparkles.js";
function Check($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$renderer, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      /**
       * @component @name Check
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
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
function Stepper($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { pasos, actual, class: className = "" } = $$props;
    $$renderer2.push(`<div${attr_class(`flex items-start gap-2 ${stringify(className)}`)} aria-label="Progreso del flujo"><!--[-->`);
    const each_array = ensure_array_like(pasos);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let paso = each_array[i];
      const completado = i < actual;
      const activo = i === actual;
      $$renderer2.push(`<div class="flex flex-1 flex-col items-center min-w-0"><div class="flex items-center w-full">`);
      if (i > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class(`h-0.5 flex-1 transition-colors duration-300 ${completado || activo ? "bg-primary" : "bg-border"}`)}></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="flex-1"></div>`);
      }
      $$renderer2.push(`<!--]--> <div${attr_class(`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${completado ? "bg-primary text-primary-foreground" : activo ? "bg-primary text-primary-foreground ring-4 ring-primary/15" : "bg-muted text-muted-foreground"}`)}${attr("aria-current", activo ? "step" : void 0)}>`);
      if (completado) {
        $$renderer2.push("<!--[0-->");
        Check($$renderer2, { size: 16, strokeWidth: 3 });
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`${escape_html(i + 1)}`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (i < pasos.length - 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class(`h-0.5 flex-1 transition-colors duration-300 ${completado ? "bg-primary" : "bg-border"}`)}></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="flex-1"></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="mt-2 text-center"><p${attr_class(`text-xs font-semibold ${activo || completado ? "text-foreground" : "text-muted-foreground"}`)}>${escape_html(paso.titulo)}</p> `);
      if (paso.descripcion) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="hidden sm:block text-[11px] text-muted-foreground mt-0.5">${escape_html(paso.descripcion)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
const PRODUCTOS_CATALOGO = [
  {
    clave: "hipoteca",
    nombre: "Hipoteca",
    descripcion: "Crédito hipotecario para vivienda con plazo largo",
    requisito: "Riesgo Bajo · ingresos ≥ $4M · ratio deuda ≤ 30%",
    icono: "home"
  },
  {
    clave: "prestamo",
    nombre: "Préstamo",
    descripcion: "Préstamo de libre inversión con cuotas mensuales",
    requisito: "Riesgo ≤ Moderado · ingresos ≥ $1.5M",
    icono: "banknote"
  },
  {
    clave: "credito",
    nombre: "Tarjeta de Crédito",
    descripcion: "Tarjeta de crédito rotativo con cupo y tasa anual",
    requisito: "Riesgo ≤ Alto · historial ≥ 0.70",
    icono: "credit-card"
  },
  {
    clave: "debito",
    nombre: "Cuenta de Débito",
    descripcion: "Cuenta de ahorro y disponibilidad inmediata",
    requisito: "Disponible para todos los perfiles",
    icono: "wallet"
  }
];
Object.fromEntries(
  PRODUCTOS_CATALOGO.map((p) => [p.clave, p])
);
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let paso = 0;
    let cargando = false;
    let nombre = "";
    let correo = "";
    let solicitudes = [];
    const PASOS = [
      { titulo: "Identificación", descripcion: "Nombre y correo" },
      { titulo: "Perfil financiero", descripcion: "Datos económicos" },
      { titulo: "Producto", descripcion: "Qué quieres" },
      { titulo: "Resultado", descripcion: "Decisión y detalle" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1ywtkod", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Solicitar crédito — Bancat</title>`);
        });
      });
      $$renderer3.push(`<section class="container-page py-10 md:py-14"><header class="mb-8"><p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Solicitud de crédito</p> <h1 class="text-3xl md:text-4xl font-semibold">Evaluación instantánea de tu perfil</h1></header> `);
      Stepper($$renderer3, { pasos: PASOS, actual: paso, class: "mb-10" });
      $$renderer3.push(`<!----> <div class="grid lg:grid-cols-[1fr_360px] gap-6 items-start"><div class="min-w-0">`);
      {
        $$renderer3.push("<!--[0-->");
        Card($$renderer3, {
          elevated: true,
          class: "animate-(--animate-slide-up)",
          children: ($$renderer4) => {
            $$renderer4.push(`<form class="flex flex-col gap-5"><div><h2 class="text-xl font-semibold mb-1">¿Eres cliente nuevo o existente?</h2> <p class="text-sm text-muted-foreground">Buscamos por nombre y correo. Si ya estás registrado,
                                precargaremos tus datos.</p></div> <div class="grid sm:grid-cols-2 gap-4">`);
            Field($$renderer4, {
              label: "Nombre completo",
              for: "nombre",
              required: true,
              children: ($$renderer5) => {
                Input($$renderer5, {
                  id: "nombre",
                  placeholder: "Maria González",
                  minlength: 3,
                  required: true,
                  get value() {
                    return nombre;
                  },
                  set value($$value) {
                    nombre = $$value;
                    $$settled = false;
                  }
                });
              }
            });
            $$renderer4.push(`<!----> `);
            Field($$renderer4, {
              label: "Correo electrónico",
              for: "correo",
              required: true,
              children: ($$renderer5) => {
                Input($$renderer5, {
                  id: "correo",
                  type: "email",
                  placeholder: "maria@ejemplo.com",
                  required: true,
                  get value() {
                    return correo;
                  },
                  set value($$value) {
                    correo = $$value;
                    $$settled = false;
                  }
                });
              }
            });
            $$renderer4.push(`<!----></div> <div class="flex justify-end">`);
            Button($$renderer4, {
              type: "submit",
              loading: cargando,
              children: ($$renderer5) => {
                Search($$renderer5, { size: 16 });
                $$renderer5.push(`<!----> Continuar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></div></form>`);
          }
        });
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$sesion", sesion).admin && solicitudes.length > 0) {
        $$renderer3.push("<!--[0-->");
        Card($$renderer3, {
          class: "mt-8",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex items-center justify-between mb-4"><h3 class="font-semibold">Solicitudes recientes</h3> `);
            Badge($$renderer4, {
              tone: "neutral",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html(solicitudes.length)}`);
              }
            });
            $$renderer4.push(`<!----></div> <div class="overflow-x-auto -mx-6 px-6"><table class="w-full text-sm"><thead><tr class="text-xs uppercase tracking-wider text-muted-foreground border-b border-border"><th class="text-left font-medium pb-2.5 pr-3">Cliente</th><th class="text-left font-medium pb-2.5 pr-3">Nivel</th><th class="text-right font-medium pb-2.5 pr-3">Riesgo</th><th class="text-right font-medium pb-2.5 pr-3">Monto máx.</th><th class="text-left font-medium pb-2.5 pr-3">Decisión</th><th class="pb-2.5"></th></tr></thead><tbody><!--[-->`);
            const each_array_2 = ensure_array_like(solicitudes);
            for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
              let s = each_array_2[$$index_2];
              $$renderer4.push(`<tr class="border-b border-border last:border-0"><td class="py-3 pr-3"><p class="font-medium">${escape_html(s.nombre)}</p> <p class="text-xs text-muted-foreground">${escape_html(s.correo)}</p></td><td class="py-3 pr-3">`);
              Badge($$renderer4, {
                tone: colorPorNivel(s.nivel_riesgo),
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(s.nivel_riesgo)}`);
                }
              });
              $$renderer4.push(`<!----></td><td class="py-3 pr-3 text-right tabular">${escape_html(s.riesgo_porcentaje.toFixed(1))}%</td><td class="py-3 pr-3 text-right tabular">${escape_html(s.monto_maximo > 0 ? formatCOP(s.monto_maximo) : "—")}</td><td class="py-3 pr-3">`);
              if (s.credito_aprobado) {
                $$renderer4.push("<!--[0-->");
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
              $$renderer4.push(`<!--]--></td><td class="py-3 text-right"><button class="p-1.5 rounded-xs text-muted-foreground hover:text-danger hover:bg-danger-soft transition-colors" aria-label="Eliminar">`);
              Trash_2($$renderer4, { size: 14 });
              $$renderer4.push(`<!----></button></td></tr>`);
            }
            $$renderer4.push(`<!--]--></tbody></table></div>`);
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <aside class="lg:sticky lg:top-24">`);
      Card($$renderer3, {
        elevated: true,
        class: "!p-5",
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="flex items-center gap-2 mb-1">`);
          Sparkles($$renderer4, { size: 16, class: "text-primary" });
          $$renderer4.push(`<!----> <p class="text-xs font-semibold text-primary uppercase tracking-wider">Simulador en vivo</p></div> <p class="text-xs text-muted-foreground mb-4">Recalcula al cambiar cualquier campo</p> `);
          {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div class="text-sm text-muted-foreground italic">Completa la identificación para empezar a simular.</div>`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!----></aside></div></section>`);
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
