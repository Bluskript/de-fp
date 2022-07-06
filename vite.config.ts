import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import { VitePluginFonts } from "vite-plugin-fonts";
import inlineCssModules from "vite-plugin-inline-css-modules";
import solidPlugin from "vite-plugin-solid";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig({
  plugins: [
    solidPlugin(),
    WindiCSS({
      scan: {
        fileExtensions: ["html", "js", "ts", "jsx", "tsx"],
      },
    }),
    VitePluginFonts({
      google: {
        families: ["Roboto"],
      },
    }),
    inlineCssModules(),
    Icons({ compiler: "solid" }),
  ],
  resolve: {
    alias: {
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  define: {
    "process.env": process.env ?? {},
  },
  build: {
    target: "esnext",
    rollupOptions: {
      plugins: [nodePolyfills({ crypto: true })],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
    },
  },
});
