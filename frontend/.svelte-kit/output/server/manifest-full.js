export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.SklrDYep.js",app:"_app/immutable/entry/app.0TAgnMXa.js",imports:["_app/immutable/entry/start.SklrDYep.js","_app/immutable/chunks/C3hLewYs.js","_app/immutable/chunks/CqjsPOPo.js","_app/immutable/chunks/CWpbwPHF.js","_app/immutable/entry/app.0TAgnMXa.js","_app/immutable/chunks/CqjsPOPo.js","_app/immutable/chunks/BhmobxBm.js","_app/immutable/chunks/CWpbwPHF.js","_app/immutable/chunks/21zz6uhk.js","_app/immutable/chunks/Cj44Tssi.js","_app/immutable/chunks/CzX62ugc.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/clientes",
				pattern: /^\/clientes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/credito",
				pattern: /^\/credito\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/metricas",
				pattern: /^\/metricas\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
