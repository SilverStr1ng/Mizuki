// vite.config.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///D:/Nothing/Blog/mizuki/Mizuki/node_modules/.pnpm/vite@5.2.11_@types+node@24._8c99ee905ee8dff9615721e9f00edff3/node_modules/vite/dist/node/index.js";
import dts from "file:///D:/Nothing/Blog/mizuki/Mizuki/node_modules/.pnpm/vite-plugin-dts@3.9.1_@type_3201c373adc3080611f82afbba66f9e3/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "oh-my-live2d",
  version: "0.19.3-patch.2",
  description: "live2d component for web. \u770B\u677F\u5A18\u7EC4\u4EF6, \u652F\u6301 model2\u3001model3\u3001model4 (Forked for SPA support)",
  keywords: [
    "Live2D",
    "cubism2",
    "cubism5",
    "Live2D Component",
    "SPA"
  ],
  homepage: "https://github.com/SilverStr1ng/oh-my-live2d#readme",
  bugs: "https://github.com/SilverStr1ng/oh-my-live2d/issues",
  repository: {
    type: "git",
    url: "git+https://github.com/SilverStr1ng/oh-my-live2d.git",
    directory: "packages/oh-my-live2d"
  },
  license: "MIT",
  author: {
    name: "hacxy",
    email: "hacxy.js@outlook.com",
    url: "https://github.com/hacxy"
  },
  type: "module",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js"
    }
  },
  main: "./dist/index.min.js",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  files: [
    "dist"
  ],
  scripts: {
    build: "tsc && vite build",
    dev: "vite build --watch",
    demo: "vite serve demo",
    "demo:umd": "vite"
  },
  devDependencies: {
    "compare-versions": "^6.1.0",
    csstype: "^3.1.3",
    "pixi-live2d-display": "0.4.0",
    "pixi.js": "6.5.10",
    tianjie: "^0.0.12",
    vite: "5.2.11",
    "vite-plugin-dts": "^3.9.1",
    typescript: "^5.0.0"
  }
};

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/Nothing/Blog/mizuki/Mizuki/libs/oh-my-live2d/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  define: {
    __VERSION__: JSON.stringify(package_default.version)
  },
  build: {
    emptyOutDir: true,
    lib: {
      name: "OML2D",
      formats: ["es", "umd"],
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: (format) => `index.${format === "umd" ? "min.js" : "js"}`
    },
    target: "es6"
    // copyPublicDir: false
    // rollupOptions: {
    //   output: {
    //     chunkFileNames: 'oml2d.app.js'
    //   }
    // }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  plugins: [dts()]
  // plugins: [
  //   cp({
  //     targets: [{ src: './dist/index.min.js', dest: '../../tests/vite-app/public' }]
  //   })
  // ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcTm90aGluZ1xcXFxCbG9nXFxcXG1penVraVxcXFxNaXp1a2lcXFxcbGlic1xcXFxvaC1teS1saXZlMmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXE5vdGhpbmdcXFxcQmxvZ1xcXFxtaXp1a2lcXFxcTWl6dWtpXFxcXGxpYnNcXFxcb2gtbXktbGl2ZTJkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Ob3RoaW5nL0Jsb2cvbWl6dWtpL01penVraS9saWJzL29oLW15LWxpdmUyZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnO1xyXG5cclxuaW1wb3J0IHByb2plY3QgZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xyXG5cclxuLy8gY29uc3QgeyBPTUxfRU5WIH0gPSBwcm9jZXNzLmVudjtcclxuXHJcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XHJcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgZGVmaW5lOiB7XHJcbiAgICBfX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkocHJvamVjdC52ZXJzaW9uKVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIG5hbWU6ICdPTUwyRCcsXHJcbiAgICAgIGZvcm1hdHM6IFsnZXMnLCAndW1kJ10sXHJcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvaW5kZXgudHMnKSxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBpbmRleC4ke2Zvcm1hdCA9PT0gJ3VtZCcgPyAnbWluLmpzJyA6ICdqcyd9YFxyXG4gICAgfSxcclxuICAgIHRhcmdldDogJ2VzNidcclxuICAgIC8vIGNvcHlQdWJsaWNEaXI6IGZhbHNlXHJcbiAgICAvLyByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAvLyAgIG91dHB1dDoge1xyXG4gICAgLy8gICAgIGNodW5rRmlsZU5hbWVzOiAnb21sMmQuYXBwLmpzJ1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9XHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbZHRzKCldXHJcbiAgLy8gcGx1Z2luczogW1xyXG4gIC8vICAgY3Aoe1xyXG4gIC8vICAgICB0YXJnZXRzOiBbeyBzcmM6ICcuL2Rpc3QvaW5kZXgubWluLmpzJywgZGVzdDogJy4uLy4uL3Rlc3RzL3ZpdGUtYXBwL3B1YmxpYycgfV1cclxuICAvLyAgIH0pXHJcbiAgLy8gXVxyXG59KTtcclxuIiwgIntcclxuICBcIm5hbWVcIjogXCJvaC1teS1saXZlMmRcIixcclxuICBcInZlcnNpb25cIjogXCIwLjE5LjMtcGF0Y2guMlwiLFxyXG4gIFwiZGVzY3JpcHRpb25cIjogXCJsaXZlMmQgY29tcG9uZW50IGZvciB3ZWIuIFx1NzcwQlx1Njc3Rlx1NUExOFx1N0VDNFx1NEVGNiwgXHU2NTJGXHU2MzAxIG1vZGVsMlx1MzAwMW1vZGVsM1x1MzAwMW1vZGVsNCAoRm9ya2VkIGZvciBTUEEgc3VwcG9ydClcIixcclxuICBcImtleXdvcmRzXCI6IFtcclxuICAgIFwiTGl2ZTJEXCIsXHJcbiAgICBcImN1YmlzbTJcIixcclxuICAgIFwiY3ViaXNtNVwiLFxyXG4gICAgXCJMaXZlMkQgQ29tcG9uZW50XCIsXHJcbiAgICBcIlNQQVwiXHJcbiAgXSxcclxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1NpbHZlclN0cjFuZy9vaC1teS1saXZlMmQjcmVhZG1lXCIsXHJcbiAgXCJidWdzXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL1NpbHZlclN0cjFuZy9vaC1teS1saXZlMmQvaXNzdWVzXCIsXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwidHlwZVwiOiBcImdpdFwiLFxyXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL1NpbHZlclN0cjFuZy9vaC1teS1saXZlMmQuZ2l0XCIsXHJcbiAgICBcImRpcmVjdG9yeVwiOiBcInBhY2thZ2VzL29oLW15LWxpdmUyZFwiXHJcbiAgfSxcclxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcclxuICBcImF1dGhvclwiOiB7XHJcbiAgICBcIm5hbWVcIjogXCJoYWN4eVwiLFxyXG4gICAgXCJlbWFpbFwiOiBcImhhY3h5LmpzQG91dGxvb2suY29tXCIsXHJcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9oYWN4eVwiXHJcbiAgfSxcclxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcclxuICBcImV4cG9ydHNcIjoge1xyXG4gICAgXCIuXCI6IHtcclxuICAgICAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9pbmRleC5kLnRzXCIsXHJcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2luZGV4LmpzXCJcclxuICAgIH1cclxuICB9LFxyXG4gIFwibWFpblwiOiBcIi4vZGlzdC9pbmRleC5taW4uanNcIixcclxuICBcIm1vZHVsZVwiOiBcIi4vZGlzdC9pbmRleC5qc1wiLFxyXG4gIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxyXG4gIFwiZmlsZXNcIjogW1xyXG4gICAgXCJkaXN0XCJcclxuICBdLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImJ1aWxkXCI6IFwidHNjICYmIHZpdGUgYnVpbGRcIixcclxuICAgIFwiZGV2XCI6IFwidml0ZSBidWlsZCAtLXdhdGNoXCIsXHJcbiAgICBcImRlbW9cIjogXCJ2aXRlIHNlcnZlIGRlbW9cIixcclxuICAgIFwiZGVtbzp1bWRcIjogXCJ2aXRlXCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiY29tcGFyZS12ZXJzaW9uc1wiOiBcIl42LjEuMFwiLFxyXG4gICAgXCJjc3N0eXBlXCI6IFwiXjMuMS4zXCIsXHJcbiAgICBcInBpeGktbGl2ZTJkLWRpc3BsYXlcIjogXCIwLjQuMFwiLFxyXG4gICAgXCJwaXhpLmpzXCI6IFwiNi41LjEwXCIsXHJcbiAgICBcInRpYW5qaWVcIjogXCJeMC4wLjEyXCIsXHJcbiAgICBcInZpdGVcIjogXCI1LjIuMTFcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZHRzXCI6IFwiXjMuOS4xXCIsXHJcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4wLjBcIlxyXG4gIH1cclxufSJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlUsT0FBTyxVQUFVO0FBQzlWLFNBQVMscUJBQXFCO0FBRTlCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUzs7O0FDSmhCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixVQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxVQUFZO0FBQUEsRUFDWixNQUFRO0FBQUEsRUFDUixZQUFjO0FBQUEsSUFDWixNQUFRO0FBQUEsSUFDUixLQUFPO0FBQUEsSUFDUCxXQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0EsU0FBVztBQUFBLEVBQ1gsUUFBVTtBQUFBLElBQ1IsTUFBUTtBQUFBLElBQ1IsT0FBUztBQUFBLElBQ1QsS0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxJQUNULEtBQUs7QUFBQSxNQUNILE9BQVM7QUFBQSxNQUNULFFBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBUTtBQUFBLEVBQ1IsUUFBVTtBQUFBLEVBQ1YsT0FBUztBQUFBLEVBQ1QsT0FBUztBQUFBLElBQ1A7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFXO0FBQUEsSUFDVCxPQUFTO0FBQUEsSUFDVCxLQUFPO0FBQUEsSUFDUCxNQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIsb0JBQW9CO0FBQUEsSUFDcEIsU0FBVztBQUFBLElBQ1gsdUJBQXVCO0FBQUEsSUFDdkIsV0FBVztBQUFBLElBQ1gsU0FBVztBQUFBLElBQ1gsTUFBUTtBQUFBLElBQ1IsbUJBQW1CO0FBQUEsSUFDbkIsWUFBYztBQUFBLEVBQ2hCO0FBQ0Y7OztBRHJEbU4sSUFBTSwyQ0FBMkM7QUFVcFEsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLEtBQUssUUFBUSxVQUFVO0FBRXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLGFBQWEsS0FBSyxVQUFVLGdCQUFRLE9BQU87QUFBQSxFQUM3QztBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsS0FBSztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLE1BQ3JCLE9BQU8sS0FBSyxRQUFRLFdBQVcsZ0JBQWdCO0FBQUEsTUFDL0MsVUFBVSxDQUFDLFdBQVcsU0FBUyxXQUFXLFFBQVEsV0FBVyxJQUFJO0FBQUEsSUFDbkU7QUFBQSxJQUNBLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9WO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxXQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTWpCLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
