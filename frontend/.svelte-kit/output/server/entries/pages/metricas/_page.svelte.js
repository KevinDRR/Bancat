import { k as attr_class, ag as stringify, P as head, af as store_get, D as ensure_array_like, aj as unsubscribe_stores } from "../../../chunks/renderer.js";
import { g as goto } from "../../../chunks/client.js";
import { s as sesion } from "../../../chunks/session.js";
import { C as Card, B as Button } from "../../../chunks/Card.js";
import { L as Lock } from "../../../chunks/lock.js";
function Skeleton($$renderer, $$props) {
  let { class: className = "", height = "h-4", width = "w-full" } = $$props;
  $$renderer.push(`<div${attr_class(`skeleton ${stringify(height)} ${stringify(width)} ${stringify(className)}`)} aria-hidden="true"></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    head("j7zdv9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Métricas del modelo — Bancat</title>`);
      });
    });
    $$renderer2.push(`<section class="container-page py-10 md:py-14">`);
    if (!store_get($$store_subs ??= {}, "$sesion", sesion).cargando && !store_get($$store_subs ??= {}, "$sesion", sesion).admin) {
      $$renderer2.push("<!--[0-->");
      Card($$renderer2, {
        elevated: true,
        class: "max-w-md mx-auto text-center",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex flex-col items-center gap-4"><div class="flex h-12 w-12 items-center justify-center rounded-md bg-warning-soft text-warning">`);
          Lock($$renderer3, { size: 24 });
          $$renderer3.push(`<!----></div> <div><h2 class="text-lg font-semibold">Acceso restringido</h2> <p class="text-sm text-muted-foreground mt-1">Esta sección requiere credenciales de administrador.</p></div> `);
          Button($$renderer3, {
            onclick: () => goto(),
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Iniciar sesión`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<header class="mb-8 flex items-end justify-between flex-wrap gap-4"><div><p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Dashboard</p> <h1 class="text-3xl md:text-4xl font-semibold">Cartera y desempeño del modelo</h1> <p class="text-muted-foreground mt-2">Analítica de los clientes almacenados y evaluación del modelo de scoring.</p></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></header> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"><!--[-->`);
        const each_array_1 = ensure_array_like(Array(6));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          each_array_1[$$index_1];
          Card($$renderer2, {
            class: "!p-5",
            children: ($$renderer3) => {
              Skeleton($$renderer3, { height: "h-3", width: "w-1/2" });
              $$renderer3.push(`<!----> `);
              Skeleton($$renderer3, { height: "h-8", width: "w-2/3", class: "mt-3" });
              $$renderer3.push(`<!---->`);
            }
          });
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></section>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
