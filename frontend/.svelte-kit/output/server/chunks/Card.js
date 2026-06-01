import { l as attributes, q as clsx, k as attr_class, ag as stringify } from "./renderer.js";
function Button($$renderer, $$props) {
  let {
    variant = "primary",
    size = "md",
    href,
    loading = false,
    disabled,
    class: className = "",
    children,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  const VARIANTS = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
    secondary: "bg-card text-foreground border border-border hover:bg-muted",
    ghost: "text-foreground hover:bg-muted",
    outline: "border border-primary text-primary hover:bg-primary-soft",
    danger: "bg-danger text-white hover:opacity-90"
  };
  const SIZES = {
    sm: "h-9 px-3.5 text-sm rounded-sm gap-1.5",
    md: "h-11 px-5 text-sm rounded-md gap-2",
    lg: "h-12 px-6 text-base rounded-md gap-2"
  };
  const base = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-[0.98]";
  const classes = `${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  if (href) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<a${attributes({ href, class: clsx(classes), ...rest })}>`);
    children($$renderer);
    $$renderer.push(`<!----></a>`);
  } else {
    $$renderer.push("<!--[-1-->");
    $$renderer.push(`<button${attributes({
      class: clsx(classes),
      disabled: disabled || loading,
      ...rest
    })}>`);
    if (loading) {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`<span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true"></span>`);
    } else {
      $$renderer.push("<!--[-1-->");
    }
    $$renderer.push(`<!--]--> `);
    children($$renderer);
    $$renderer.push(`<!----></button>`);
  }
  $$renderer.push(`<!--]-->`);
}
function Card($$renderer, $$props) {
  let {
    class: className = "",
    padded = true,
    elevated = false,
    children
  } = $$props;
  const elev = elevated ? "shadow-md" : "shadow-sm";
  const pad = padded ? "p-6" : "";
  $$renderer.push(`<div${attr_class(`bg-card text-card-foreground border border-border rounded-lg transition-shadow ${elev} ${pad} ${stringify(className)}`)}>`);
  children($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  Button as B,
  Card as C
};
