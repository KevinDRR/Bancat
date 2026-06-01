import { k as attr_class, j as attr, F as escape_html, ag as stringify, l as attributes, m as bind_props } from "./renderer.js";
function Field($$renderer, $$props) {
  let {
    label,
    hint,
    error,
    required = false,
    for: forId,
    class: className = "",
    children
  } = $$props;
  $$renderer.push(`<div${attr_class(`flex flex-col gap-1.5 ${stringify(className)}`)}><label${attr("for", forId)} class="text-sm font-medium text-foreground">${escape_html(label)} `);
  if (required) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<span class="text-danger ml-0.5" aria-hidden="true">*</span>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></label> `);
  children($$renderer);
  $$renderer.push(`<!----> `);
  if (error) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<p class="text-xs text-danger flex items-center gap-1.5 mt-0.5" role="alert"><span aria-hidden="true">!</span> ${escape_html(error)}</p>`);
  } else if (hint) {
    $$renderer.push("<!--[1-->");
    $$renderer.push(`<p class="text-xs text-muted-foreground">${escape_html(hint)}</p>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function Input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = void 0,
      invalid = false,
      class: className = "",
      type = "text",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    const borderClass = invalid ? "border-danger" : "border-input";
    if (type === "number") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<input${attributes(
        {
          type: "number",
          value,
          class: `h-11 w-full rounded-md border bg-card px-3.5 text-sm placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${borderClass} ${stringify(className)}`,
          "aria-invalid": invalid,
          ...rest
        },
        void 0,
        void 0,
        void 0,
        4
      )}/>`);
    } else if (type === "email") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<input${attributes(
        {
          type: "email",
          value,
          class: `h-11 w-full rounded-md border bg-card px-3.5 text-sm placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${borderClass} ${stringify(className)}`,
          "aria-invalid": invalid,
          ...rest
        },
        void 0,
        void 0,
        void 0,
        4
      )}/>`);
    } else if (type === "password") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<input${attributes(
        {
          type: "password",
          value,
          class: `h-11 w-full rounded-md border bg-card px-3.5 text-sm placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${borderClass} ${stringify(className)}`,
          "aria-invalid": invalid,
          ...rest
        },
        void 0,
        void 0,
        void 0,
        4
      )}/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<input${attributes(
        {
          type: "text",
          value,
          class: `h-11 w-full rounded-md border bg-card px-3.5 text-sm placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${borderClass} ${stringify(className)}`,
          "aria-invalid": invalid,
          ...rest
        },
        void 0,
        void 0,
        void 0,
        4
      )}/>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value });
  });
}
export {
  Field as F,
  Input as I
};
