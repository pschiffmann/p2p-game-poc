// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  optimize: {
    entrypoints: ["main.js"],
    bundle: true,
    minify: true,
    target: "es2020",
    treeshake: true,
    sourcemap: false,
  },
  mount: {
    public: {
      url: "/",
      static: true,
    },
    dist: {
      url: "/",
    },
  },
  devOptions: {
    hmr: false,
    secure: true,
  },
  buildOptions: {
    out: "qvs-copy-tool",
    baseUrl: "./",
  },
};
