// vite.config.ts
import vue from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.21_@types+node@20.19.37_sass@1.97.3_terser@5.46.0__vue@3.5.30_typescript@5.9.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.21_@types+node@20.19.37_sass@1.97.3_terser@5.46.0__vue@3.5.30_typescript@5.9.3_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { loadEnv, defineConfig } from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.37_sass@1.97.3_terser@5.46.0/node_modules/vite/dist/node/index.js";
import AutoImport from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1_vue@3.5.30_typescript@5.9.3___rollup@4.59.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.29.0_rollup@4.59.0_vue@3.5.30_typescript@5.9.3_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.29.0_rollup@4.59.0_vue@3.5.30_typescript@5.9.3_/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/unplugin-icons@0.18.5_@vue+compiler-sfc@3.5.30/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/unplugin-icons@0.18.5_@vue+compiler-sfc@3.5.30/node_modules/unplugin-icons/dist/resolver.js";
import { createSvgIconsPlugin } from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.21_@types+node@20.19.37_sass@1.97.3_terser@5.46.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import mockDevServerPlugin from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/vite-plugin-mock-dev-server@1.9.3_bufferutil@4.1.0_esbuild@0.21.5_rollup@4.59.0_utf-8-validat_ewkfoi6ayamubrs45n5mhrwwhi/node_modules/vite-plugin-mock-dev-server/dist/index.js";
import UnoCSS from "file:///C:/Users/user/Desktop/ZF/project/Vue3_TICBCS2026/node_modules/.pnpm/unocss@0.58.9_postcss@8.5.8_rollup@4.59.0_vite@5.4.21_@types+node@20.19.37_sass@1.97.3_terser@5.46.0_/node_modules/unocss/dist/vite.mjs";
import { resolve } from "path";

// package.json
var name = "vue3-organ";
var version = "2.9.3";
var dependencies = {
  "@ckeditor/ckeditor5-vue": "^6.0.0",
  "@element-plus/icons-vue": "^2.3.2",
  "@vueuse/core": "^10.9.0",
  "animate.css": "^4.1.1",
  axios: "^1.6.8",
  ckeditor5: "^42.0.0",
  echarts: "^5.5.0",
  "element-plus": "^2.7.4",
  "html5-qrcode": "^2.3.8",
  "js-base64": "^3.7.8",
  "lodash-es": "^4.17.21",
  net: "^1.0.2",
  nprogress: "^0.2.0",
  "path-browserify": "^1.0.1",
  "path-to-regexp": "^6.2.2",
  pinia: "^2.1.7",
  "sockjs-client": "1.6.1",
  sortablejs: "^1.15.2",
  stompjs: "^2.3.3",
  vue: "^3.4.21",
  "vue-email-editor": "^2.1.4",
  "vue-i18n": "9.9.1",
  "vue-router": "^4.3.0",
  xlsx: "^0.18.5"
};
var devDependencies = {
  "@commitlint/cli": "^18.6.1",
  "@commitlint/config-conventional": "^18.6.3",
  "@iconify-json/ep": "^1.1.15",
  "@types/lodash": "^4.17.0",
  "@types/node": "^20.12.7",
  "@types/nprogress": "^0.2.3",
  "@types/path-browserify": "^1.0.2",
  "@types/sockjs-client": "^1.5.4",
  "@types/sortablejs": "^1.15.8",
  "@types/stompjs": "^2.3.9",
  "@typescript-eslint/eslint-plugin": "^7.6.0",
  "@typescript-eslint/parser": "^7.6.0",
  "@vitejs/plugin-vue": "^5.0.4",
  "@vitejs/plugin-vue-jsx": "^3.1.0",
  autoprefixer: "^10.4.19",
  commitizen: "^4.3.0",
  "cz-git": "^1.9.1",
  eslint: "^8.57.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-import": "^2.29.1",
  "eslint-plugin-prettier": "^5.1.3",
  "eslint-plugin-vue": "^9.25.0",
  "fast-glob": "^3.3.2",
  husky: "^9.0.11",
  "lint-staged": "^15.2.2",
  postcss: "^8.4.38",
  "postcss-html": "^1.6.0",
  "postcss-scss": "^4.0.9",
  prettier: "^3.2.5",
  sass: "^1.75.0",
  stylelint: "^16.3.1",
  "stylelint-config-html": "^1.1.0",
  "stylelint-config-recess-order": "^4.6.0",
  "stylelint-config-recommended-scss": "^14.0.0",
  "stylelint-config-recommended-vue": "^1.5.0",
  "stylelint-config-standard": "^36.0.0",
  terser: "^5.30.3",
  typescript: "^5.4.5",
  unocss: "^0.58.9",
  "unplugin-auto-import": "^0.17.5",
  "unplugin-icons": "^0.18.5",
  "unplugin-vue-components": "^0.26.0",
  vite: "^5.2.8",
  "vite-plugin-mock-dev-server": "^1.5.0",
  "vite-plugin-svg-icons": "^2.0.1",
  "vue-tsc": "^2.0.13"
};
var engines = {
  node: ">=18.0.0"
};

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\user\\Desktop\\ZF\\project\\Vue3_TICBCS2026";
var __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now()
};
var pathSrc = resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    //基礎路徑,預設為/,如果需要放在Nginx內的子目錄這邊也要進行設置
    base: "/background",
    resolve: {
      alias: {
        "@": pathSrc
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          api: "modern-compiler",
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `
        }
      }
    },
    server: {
      // 允许IP访问
      host: "0.0.0.0",
      allowedHosts: [
        "d4cd-1-168-51-184.ngrok-free.app"
        // 將報錯的域名填入這裡
      ],
      // 应用端口 (默認:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        /** 代理前缀为 /dev-api 的请求  */
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          // 接口地址
          target: env.VITE_APP_API_URL,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), "")
        },
        [env.VITE_MINIO_API]: {
          changeOrigin: true,
          // Minio接口地址
          target: env.VITE_MINIO_API_URL,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_MINIO_API), "")
        }
      }
    },
    plugins: [
      vue(),
      // jsx、tsx语法支持
      vueJsx(),
      // MOCK 服务
      env.VITE_MOCK_DEV_SERVER === "true" ? mockDevServerPlugin() : null,
      UnoCSS({
        hmrTopLevelAwait: false
      }),
      // 自动导入参考： https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({})
        ],
        eslintrc: {
          // 是否自动生成 eslint 规则，建议生成之后設置 false
          enabled: false,
          // 指定自动导入函数 eslint 规则的文件
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        },
        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/typings/auto-imports.d.ts",
      }),
      //unplugin-vue-components 
      /**
       * 
       * unplugin-vue-components 是一個 Vue.js 生態系統的 Vite 插件，它提供了一種簡單的方式來自動掃描和註冊 Vue 組件，
       * 使其成為全局組件，從而讓你在整個應用程式中都能夠使用這些組件。
       * 具體來說，在 Vite 專案中使用 unplugin-vue-components，它可以幫助你：
       * 
       * 1.自動掃描組件: 通過設置適當的目錄或模式，它可以自動從指定的目錄中掃描 Vue 組件。
       * 2.註冊全局組件: 掃描到的組件將被自動註冊為全局組件，這樣你就無需在每個單獨的組件中進行手動的引入和註冊，而是可以直接在任何地方使用這些組件。
       * 3.動態載入: 在需要時動態地載入和註冊組件，從而使得你的應用程式可以更靈活地管理組件的使用。
       * 4.總的來說，unplugin-vue-components 能夠節省開發者的時間，提高開發效率，同時也能夠幫助保持代碼的整潔和一致性，使得在 Vue.js 應用程式中管理和使用組件變得更加容易。
       * 
       */
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
            enabledCollections: ["ep"]
          })
        ],
        // 指定自定义组件位置(默認:src/components),這邊正是引入了
        //dirs: ["src/components", "src/**/components"],
        //dirs 配置項是用於指定要掃描的目錄的相對路徑或匹配模式。
        //當使用像 unplugin-vue-components 這樣的工具時，dirs 配置項用於告訴它去哪裡尋找 Vue 組件，並將它們自動註冊為全局組件。
        //這邊要注意,像是這樣寫, 是在src的任意目錄下的/components的 index.vue喔, 不是就不會登入成全局組件
        dirs: ["src/**/components"],
        // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/typings/components.d.ts",
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹,這裡的pathSrc 就是 src
        iconDirs: [resolve(pathSrc, "assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]"
      })
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "sortablejs",
        "path-to-regexp",
        "echarts",
        "@wangeditor/editor",
        "@wangeditor/editor-for-vue",
        "vue-i18n",
        "path-browserify",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/rate/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/notification/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/statistic/style/css",
        "element-plus/es/components/watermark/style/css",
        "element-plus/es/components/config-provider/style/css",
        "element-plus/es/components/text/style/css",
        "element-plus/es/components/drawer/style/css",
        "element-plus/es/components/color-picker/style/css"
      ]
    },
    // 构建配置
    build: {
      chunkSizeWarningLimit: 2e3,
      // 消除打包大小超过500kb警告
      minify: "terser",
      // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: false,
          // 生产环境去除 console
          drop_debugger: true
          // 生产环境去除 debugger
        },
        format: {
          comments: false
          // 删除注释
        }
      },
      rollupOptions: {
        output: {
          // manualChunks: {
          //   "vue-i18n": ["vue-i18n"],
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          }
        }
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdXNlclxcXFxEZXNrdG9wXFxcXFpGXFxcXHByb2plY3RcXFxcVnVlM19USUNCQ1MyMDI2XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1c2VyXFxcXERlc2t0b3BcXFxcWkZcXFxccHJvamVjdFxcXFxWdWUzX1RJQ0JDUzIwMjZcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3VzZXIvRGVza3RvcC9aRi9wcm9qZWN0L1Z1ZTNfVElDQkNTMjAyNi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI7XHJcbmltcG9ydCB7IFVzZXJDb25maWcsIENvbmZpZ0VudiwgbG9hZEVudiwgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbmltcG9ydCBJY29ucyBmcm9tIFwidW5wbHVnaW4taWNvbnMvdml0ZVwiO1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tIFwidW5wbHVnaW4taWNvbnMvcmVzb2x2ZXJcIjtcclxuXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xyXG5pbXBvcnQgbW9ja0RldlNlcnZlclBsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tbW9jay1kZXYtc2VydmVyXCI7XHJcblxyXG5pbXBvcnQgVW5vQ1NTIGZyb20gXCJ1bm9jc3Mvdml0ZVwiO1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHtcclxuICBuYW1lLFxyXG4gIHZlcnNpb24sXHJcbiAgZW5naW5lcyxcclxuICBkZXBlbmRlbmNpZXMsXHJcbiAgZGV2RGVwZW5kZW5jaWVzLFxyXG59IGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xyXG5cclxuLyoqIFx1NUU3M1x1NTNGMFx1NzY4NFx1NTQwRFx1NzlGMFx1MzAwMVx1NzI0OFx1NjcyQ1x1MzAwMVx1OEZEMFx1ODg0Q1x1NjI0MFx1OTcwMFx1NzY4NGBub2RlYFx1NzI0OFx1NjcyQ1x1MzAwMVx1NEY5RFx1OEQ1Nlx1MzAwMVx1Njc4NFx1NUVGQVx1NjVGNlx1OTVGNFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NjNEMFx1NzkzQSAqL1xyXG5jb25zdCBfX0FQUF9JTkZPX18gPSB7XHJcbiAgcGtnOiB7IG5hbWUsIHZlcnNpb24sIGVuZ2luZXMsIGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzIH0sXHJcbiAgYnVpbGRUaW1lc3RhbXA6IERhdGUubm93KCksXHJcbn07XHJcblxyXG5jb25zdCBwYXRoU3JjID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xyXG4vLyAgaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZ1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpO1xyXG4gIHJldHVybiB7XHJcbiAgICAvL1x1NTdGQVx1NzkwRVx1OERFRlx1NUY5MSxcdTk4MTBcdThBMkRcdTcwQkEvLFx1NTk4Mlx1Njc5Q1x1OTcwMFx1ODk4MVx1NjUzRVx1NTcyOE5naW54XHU1MTY3XHU3Njg0XHU1QjUwXHU3NkVFXHU5MzA0XHU5MDE5XHU5MDhBXHU0RTVGXHU4OTgxXHU5MDMyXHU4ODRDXHU4QTJEXHU3RjZFXHJcbiAgICBiYXNlOiBcIi9iYWNrZ3JvdW5kXCIsXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHBhdGhTcmMsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgY3NzOiB7XHJcbiAgICAgIC8vIENTUyBcdTk4ODRcdTU5MDRcdTc0MDZcdTU2NjhcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIC8vIFx1NUI5QVx1NEU0OVx1NTE2OFx1NUM0MCBTQ1NTIFx1NTNEOFx1OTFDRlxyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcicsXHJcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXHJcbiAgICAgICAgICAgIEB1c2UgXCJAL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XHJcbiAgICAgICAgICBgLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIC8vIFx1NTE0MVx1OEJCOElQXHU4QkJGXHU5NUVFXHJcbiAgICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxyXG4gICAgICBhbGxvd2VkSG9zdHM6IFtcclxuICAgICAgICAnZDRjZC0xLTE2OC01MS0xODQubmdyb2stZnJlZS5hcHAnIC8vIFx1NUMwN1x1NTgzMVx1OTMyRlx1NzY4NFx1NTdERlx1NTQwRFx1NTg2Qlx1NTE2NVx1OTAxOVx1ODhFMVxyXG4gICAgICBdLFxyXG4gICAgICAvLyBcdTVFOTRcdTc1MjhcdTdBRUZcdTUzRTMgKFx1OUVEOFx1OEE4RDozMDAwKVxyXG4gICAgICBwb3J0OiBOdW1iZXIoZW52LlZJVEVfQVBQX1BPUlQpLFxyXG4gICAgICAvLyBcdThGRDBcdTg4NENcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcdTZENEZcdTg5QzhcdTU2NjhcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAvKiogXHU0RUUzXHU3NDA2XHU1MjREXHU3RjAwXHU0RTNBIC9kZXYtYXBpIFx1NzY4NFx1OEJGN1x1NkM0MiAgKi9cclxuICAgICAgICBbZW52LlZJVEVfQVBQX0JBU0VfQVBJXToge1xyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgLy8gXHU2M0E1XHU1M0UzXHU1NzMwXHU1NzQwXHJcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQUF9BUElfVVJMLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+XHJcbiAgICAgICAgICAgIHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKFwiXlwiICsgZW52LlZJVEVfQVBQX0JBU0VfQVBJKSwgXCJcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbZW52LlZJVEVfTUlOSU9fQVBJXToge1xyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgLy8gTWluaW9cdTYzQTVcdTUzRTNcdTU3MzBcdTU3NDBcclxuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfTUlOSU9fQVBJX1VSTCxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxyXG4gICAgICAgICAgICBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChcIl5cIiArIGVudi5WSVRFX01JTklPX0FQSSksIFwiXCIpLFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICAvLyBqc3hcdTMwMDF0c3hcdThCRURcdTZDRDVcdTY1MkZcdTYzMDFcclxuICAgICAgdnVlSnN4KCksXHJcbiAgICAgIC8vIE1PQ0sgXHU2NzBEXHU1MkExXHJcbiAgICAgIGVudi5WSVRFX01PQ0tfREVWX1NFUlZFUiA9PT0gXCJ0cnVlXCIgPyBtb2NrRGV2U2VydmVyUGx1Z2luKCkgOiBudWxsLFxyXG4gICAgICBVbm9DU1Moe1xyXG4gICAgICAgIGhtclRvcExldmVsQXdhaXQ6IGZhbHNlLFxyXG4gICAgICB9KSxcclxuICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1M0MyXHU4MDAzXHVGRjFBIGh0dHBzOi8vZ2l0aHViLmNvbS9zeHp6L2VsZW1lbnQtcGx1cy1iZXN0LXByYWN0aWNlcy9ibG9iL21haW4vdml0ZS5jb25maWcudHNcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcclxuICAgICAgICBpbXBvcnRzOiBbXCJ2dWVcIiwgXCJAdnVldXNlL2NvcmVcIiwgXCJwaW5pYVwiLCBcInZ1ZS1yb3V0ZXJcIiwgXCJ2dWUtaTE4blwiXSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKFx1NUUyNlx1NjgzN1x1NUYwRilcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgSWNvbnNSZXNvbHZlcih7fSksXHJcbiAgICAgICAgXSxcclxuICAgICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgICAgLy8gXHU2NjJGXHU1NDI2XHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwIGVzbGludCBcdTg5QzRcdTUyMTlcdUZGMENcdTVFRkFcdThCQUVcdTc1MUZcdTYyMTBcdTRFNEJcdTU0MEVcdThBMkRcdTdGNkUgZmFsc2VcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1MUZEXHU2NTcwIGVzbGludCBcdTg5QzRcdTUyMTlcdTc2ODRcdTY1ODdcdTRFRjZcclxuICAgICAgICAgIGZpbGVwYXRoOiBcIi4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25cIixcclxuICAgICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBcdTY2MkZcdTU0MjZcdTU3MjggdnVlIFx1NkEyMVx1Njc3Rlx1NEUyRFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVxyXG4gICAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxyXG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTFGRFx1NjU3MFRTXHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0IChmYWxzZTpcdTUxNzNcdTk1RURcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTApXHJcbiAgICAgICAgZHRzOiBmYWxzZSxcclxuICAgICAgICAvLyBkdHM6IFwic3JjL3R5cGluZ3MvYXV0by1pbXBvcnRzLmQudHNcIixcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvL3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzIFxyXG4gICAgICAvKipcclxuICAgICAgICogXHJcbiAgICAgICAqIHVucGx1Z2luLXZ1ZS1jb21wb25lbnRzIFx1NjYyRlx1NEUwMFx1NTAwQiBWdWUuanMgXHU3NTFGXHU2MTRCXHU3Q0ZCXHU3RDcxXHU3Njg0IFZpdGUgXHU2M0QyXHU0RUY2XHVGRjBDXHU1QjgzXHU2M0QwXHU0RjlCXHU0RTg2XHU0RTAwXHU3QTJFXHU3QzIxXHU1NUFFXHU3Njg0XHU2NUI5XHU1RjBGXHU0Rjg2XHU4MUVBXHU1MkQ1XHU2MzgzXHU2M0NGXHU1NDhDXHU4QTNCXHU1MThBIFZ1ZSBcdTdENDRcdTRFRjZcdUZGMENcclxuICAgICAgICogXHU0RjdGXHU1MTc2XHU2MjEwXHU3MEJBXHU1MTY4XHU1QzQwXHU3RDQ0XHU0RUY2XHVGRjBDXHU1RjlFXHU4MDBDXHU4QjkzXHU0RjYwXHU1NzI4XHU2NTc0XHU1MDBCXHU2MUM5XHU3NTI4XHU3QTBCXHU1RjBGXHU0RTJEXHU5MEZEXHU4MEZEXHU1OTIwXHU0RjdGXHU3NTI4XHU5MDE5XHU0RTlCXHU3RDQ0XHU0RUY2XHUzMDAyXHJcbiAgICAgICAqIFx1NTE3N1x1OUFENFx1NEY4Nlx1OEFBQVx1RkYwQ1x1NTcyOCBWaXRlIFx1NUMwOFx1Njg0OFx1NEUyRFx1NEY3Rlx1NzUyOCB1bnBsdWdpbi12dWUtY29tcG9uZW50c1x1RkYwQ1x1NUI4M1x1NTNFRlx1NEVFNVx1NUU2Qlx1NTJBOVx1NEY2MFx1RkYxQVxyXG4gICAgICAgKiBcclxuICAgICAgICogMS5cdTgxRUFcdTUyRDVcdTYzODNcdTYzQ0ZcdTdENDRcdTRFRjY6IFx1OTAxQVx1OTA0RVx1OEEyRFx1N0Y2RVx1OTA2OVx1NzU3Nlx1NzY4NFx1NzZFRVx1OTMwNFx1NjIxNlx1NkEyMVx1NUYwRlx1RkYwQ1x1NUI4M1x1NTNFRlx1NEVFNVx1ODFFQVx1NTJENVx1NUY5RVx1NjMwN1x1NUI5QVx1NzY4NFx1NzZFRVx1OTMwNFx1NEUyRFx1NjM4M1x1NjNDRiBWdWUgXHU3RDQ0XHU0RUY2XHUzMDAyXHJcbiAgICAgICAqIDIuXHU4QTNCXHU1MThBXHU1MTY4XHU1QzQwXHU3RDQ0XHU0RUY2OiBcdTYzODNcdTYzQ0ZcdTUyMzBcdTc2ODRcdTdENDRcdTRFRjZcdTVDMDdcdTg4QUJcdTgxRUFcdTUyRDVcdThBM0JcdTUxOEFcdTcwQkFcdTUxNjhcdTVDNDBcdTdENDRcdTRFRjZcdUZGMENcdTkwMTlcdTZBMjNcdTRGNjBcdTVDMzFcdTcxMjFcdTk3MDBcdTU3MjhcdTZCQ0ZcdTUwMEJcdTU1QUVcdTczNjhcdTc2ODRcdTdENDRcdTRFRjZcdTRFMkRcdTkwMzJcdTg4NENcdTYyNEJcdTUyRDVcdTc2ODRcdTVGMTVcdTUxNjVcdTU0OENcdThBM0JcdTUxOEFcdUZGMENcdTgwMENcdTY2MkZcdTUzRUZcdTRFRTVcdTc2RjRcdTYzQTVcdTU3MjhcdTRFRkJcdTRGNTVcdTU3MzBcdTY1QjlcdTRGN0ZcdTc1MjhcdTkwMTlcdTRFOUJcdTdENDRcdTRFRjZcdTMwMDJcclxuICAgICAgICogMy5cdTUyRDVcdTYxNEJcdThGMDlcdTUxNjU6IFx1NTcyOFx1OTcwMFx1ODk4MVx1NjY0Mlx1NTJENVx1NjE0Qlx1NTczMFx1OEYwOVx1NTE2NVx1NTQ4Q1x1OEEzQlx1NTE4QVx1N0Q0NFx1NEVGNlx1RkYwQ1x1NUY5RVx1ODAwQ1x1NEY3Rlx1NUY5N1x1NEY2MFx1NzY4NFx1NjFDOVx1NzUyOFx1N0EwQlx1NUYwRlx1NTNFRlx1NEVFNVx1NjZGNFx1OTc0OFx1NkQzQlx1NTczMFx1N0JBMVx1NzQwNlx1N0Q0NFx1NEVGNlx1NzY4NFx1NEY3Rlx1NzUyOFx1MzAwMlxyXG4gICAgICAgKiA0Llx1N0UzRFx1NzY4NFx1NEY4Nlx1OEFBQVx1RkYwQ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzIFx1ODBGRFx1NTkyMFx1N0JDMFx1NzcwMVx1OTU4Qlx1NzY3Q1x1ODAwNVx1NzY4NFx1NjY0Mlx1OTU5M1x1RkYwQ1x1NjNEMFx1OUFEOFx1OTU4Qlx1NzY3Q1x1NjU0OFx1NzM4N1x1RkYwQ1x1NTQwQ1x1NjY0Mlx1NEU1Rlx1ODBGRFx1NTkyMFx1NUU2Qlx1NTJBOVx1NEZERFx1NjMwMVx1NEVFM1x1NzhCQ1x1NzY4NFx1NjU3NFx1NkY1NFx1NTQ4Q1x1NEUwMFx1ODFGNFx1NjAyN1x1RkYwQ1x1NEY3Rlx1NUY5N1x1NTcyOCBWdWUuanMgXHU2MUM5XHU3NTI4XHU3QTBCXHU1RjBGXHU0RTJEXHU3QkExXHU3NDA2XHU1NDhDXHU0RjdGXHU3NTI4XHU3RDQ0XHU0RUY2XHU4QjhBXHU1Rjk3XHU2NkY0XHU1MkEwXHU1QkI5XHU2NjEzXHUzMDAyXHJcbiAgICAgICAqIFxyXG4gICAgICAgKi9cclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcigpLFxyXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgLy8gZWxlbWVudC1wbHVzXHU1NkZFXHU2ODA3XHU1RTkzXHVGRjBDXHU1MTc2XHU0RUQ2XHU1NkZFXHU2ODA3XHU1RTkzIGh0dHBzOi8vaWNvbi1zZXRzLmljb25pZnkuZGVzaWduL1xyXG4gICAgICAgICAgICBlbmFibGVkQ29sbGVjdGlvbnM6IFtcImVwXCJdLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgXSxcclxuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTgxRUFcdTVCOUFcdTRFNDlcdTdFQzRcdTRFRjZcdTRGNERcdTdGNkUoXHU5RUQ4XHU4QThEOnNyYy9jb21wb25lbnRzKSxcdTkwMTlcdTkwOEFcdTZCNjNcdTY2MkZcdTVGMTVcdTUxNjVcdTRFODZcclxuICAgICAgICAvL2RpcnM6IFtcInNyYy9jb21wb25lbnRzXCIsIFwic3JjLyoqL2NvbXBvbmVudHNcIl0sXHJcbiAgICAgICAgLy9kaXJzIFx1OTE0RFx1N0Y2RVx1OTgwNVx1NjYyRlx1NzUyOFx1NjVCQ1x1NjMwN1x1NUI5QVx1ODk4MVx1NjM4M1x1NjNDRlx1NzY4NFx1NzZFRVx1OTMwNFx1NzY4NFx1NzZGOFx1NUMwRFx1OERFRlx1NUY5MVx1NjIxNlx1NTMzOVx1OTE0RFx1NkEyMVx1NUYwRlx1MzAwMlxyXG4gICAgICAgIC8vXHU3NTc2XHU0RjdGXHU3NTI4XHU1MENGIHVucGx1Z2luLXZ1ZS1jb21wb25lbnRzIFx1OTAxOVx1NkEyM1x1NzY4NFx1NURFNVx1NTE3N1x1NjY0Mlx1RkYwQ2RpcnMgXHU5MTREXHU3RjZFXHU5ODA1XHU3NTI4XHU2NUJDXHU1NDRBXHU4QTM0XHU1QjgzXHU1M0JCXHU1NEVBXHU4OEUxXHU1QzBCXHU2MjdFIFZ1ZSBcdTdENDRcdTRFRjZcdUZGMENcdTRFMjZcdTVDMDdcdTVCODNcdTUwMTFcdTgxRUFcdTUyRDVcdThBM0JcdTUxOEFcdTcwQkFcdTUxNjhcdTVDNDBcdTdENDRcdTRFRjZcdTMwMDJcclxuICAgICAgICAvL1x1OTAxOVx1OTA4QVx1ODk4MVx1NkNFOFx1NjEwRixcdTUwQ0ZcdTY2MkZcdTkwMTlcdTZBMjNcdTVCRUIsIFx1NjYyRlx1NTcyOHNyY1x1NzY4NFx1NEVGQlx1NjEwRlx1NzZFRVx1OTMwNFx1NEUwQlx1NzY4NC9jb21wb25lbnRzXHU3Njg0IGluZGV4LnZ1ZVx1NTU5NCwgXHU0RTBEXHU2NjJGXHU1QzMxXHU0RTBEXHU2NzAzXHU3NjdCXHU1MTY1XHU2MjEwXHU1MTY4XHU1QzQwXHU3RDQ0XHU0RUY2XHJcbiAgICAgICAgZGlyczogW1wic3JjLyoqL2NvbXBvbmVudHNcIixdLFxyXG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1N0VDNFx1NEVGNlRTXHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0IChmYWxzZTpcdTUxNzNcdTk1RURcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTApXHJcbiAgICAgICAgZHRzOiBmYWxzZSxcclxuICAgICAgICAvLyBkdHM6IFwic3JjL3R5cGluZ3MvY29tcG9uZW50cy5kLnRzXCIsXHJcbiAgICAgIH0pLFxyXG4gICAgICBJY29ucyh7XHJcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1Qjg5XHU4OEM1XHU1NkZFXHU2ODA3XHU1RTkzXHJcbiAgICAgICAgYXV0b0luc3RhbGw6IHRydWUsXHJcbiAgICAgIH0pLFxyXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU5NzAwXHU4OTgxXHU3RjEzXHU1QjU4XHU3Njg0XHU1NkZFXHU2ODA3XHU2NTg3XHU0RUY2XHU1OTM5LFx1OTAxOVx1ODhFMVx1NzY4NHBhdGhTcmMgXHU1QzMxXHU2NjJGIHNyY1xyXG4gICAgICAgIGljb25EaXJzOiBbcmVzb2x2ZShwYXRoU3JjLCBcImFzc2V0cy9pY29uc1wiKV0sXHJcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBc3ltYm9sSWRcdTY4M0NcdTVGMEZcclxuICAgICAgICBzeW1ib2xJZDogXCJpY29uLVtkaXJdLVtuYW1lXVwiLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcbiAgICAvLyBcdTk4ODRcdTUyQTBcdThGN0RcdTk4NzlcdTc2RUVcdTVGQzVcdTk3MDBcdTc2ODRcdTdFQzRcdTRFRjZcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgXCJ2dWVcIixcclxuICAgICAgICBcInZ1ZS1yb3V0ZXJcIixcclxuICAgICAgICBcInBpbmlhXCIsXHJcbiAgICAgICAgXCJheGlvc1wiLFxyXG4gICAgICAgIFwiQHZ1ZXVzZS9jb3JlXCIsXHJcbiAgICAgICAgXCJzb3J0YWJsZWpzXCIsXHJcbiAgICAgICAgXCJwYXRoLXRvLXJlZ2V4cFwiLFxyXG4gICAgICAgIFwiZWNoYXJ0c1wiLFxyXG4gICAgICAgIFwiQHdhbmdlZGl0b3IvZWRpdG9yXCIsXHJcbiAgICAgICAgXCJAd2FuZ2VkaXRvci9lZGl0b3ItZm9yLXZ1ZVwiLFxyXG4gICAgICAgIFwidnVlLWkxOG5cIixcclxuICAgICAgICBcInBhdGgtYnJvd3NlcmlmeVwiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZm9ybS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Zvcm0taXRlbS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2J1dHRvbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2lucHV0L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW5wdXQtbnVtYmVyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3dpdGNoL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdXBsb2FkL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbWVudS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ljb24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yb3cvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWcvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kaWFsb2cvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9sb2FkaW5nL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcmFkaW8vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1ncm91cC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3BvcG92ZXIvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zY3JvbGxiYXIvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90b29sdGlwL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJvcGRvd24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi1tZW51L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJvcGRvd24taXRlbS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3N1Yi1tZW51L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbWVudS1pdGVtL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZGl2aWRlci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NhcmQvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9saW5rL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnJlYWRjcnVtYi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2JyZWFkY3J1bWItaXRlbS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYmxlL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdHJlZS1zZWxlY3Qvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWJsZS1jb2x1bW4vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zZWxlY3Qvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9vcHRpb24vc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9wYWdpbmF0aW9uL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdHJlZS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2FsZXJ0L3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcmFkaW8tYnV0dG9uL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2hlY2tib3gtZ3JvdXAvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYnMvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90YWItcGFuZS9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3JhdGUvc3R5bGUvY3NzXCIsXHJcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kYXRlLXBpY2tlci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2ltYWdlL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3RhdGlzdGljL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvd2F0ZXJtYXJrL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29uZmlnLXByb3ZpZGVyL3N0eWxlL2Nzc1wiLFxyXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGV4dC9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RyYXdlci9zdHlsZS9jc3NcIixcclxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NvbG9yLXBpY2tlci9zdHlsZS9jc3NcIixcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgICAvLyBcdTY3ODRcdTVFRkFcdTkxNERcdTdGNkVcclxuICAgIGJ1aWxkOiB7XHJcblxyXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwMDAsIC8vIFx1NkQ4OFx1OTY2NFx1NjI1M1x1NTMwNVx1NTkyN1x1NUMwRlx1OEQ4NVx1OEZDNzUwMGtiXHU4QjY2XHU1NDRBXHJcbiAgICAgIG1pbmlmeTogXCJ0ZXJzZXJcIiwgLy8gVml0ZSAyLjYueCBcdTRFRTVcdTRFMEFcdTk3MDBcdTg5ODFcdTkxNERcdTdGNkUgbWluaWZ5OiBcInRlcnNlclwiLCB0ZXJzZXJPcHRpb25zIFx1NjI0RFx1ODBGRFx1NzUxRlx1NjU0OFxyXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgIGtlZXBfaW5maW5pdHk6IHRydWUsIC8vIFx1OTYzMlx1NkI2MiBJbmZpbml0eSBcdTg4QUJcdTUzOEJcdTdGMjlcdTYyMTAgMS8wXHVGRjBDXHU4RkQ5XHU1M0VGXHU4MEZEXHU0RjFBXHU1QkZDXHU4MUY0IENocm9tZSBcdTRFMEFcdTc2ODRcdTYwMjdcdTgwRkRcdTk1RUVcdTk4OThcclxuICAgICAgICAgIGRyb3BfY29uc29sZTogZmFsc2UsIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTNCQlx1OTY2NCBjb25zb2xlXHJcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLCAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzQkJcdTk2NjQgZGVidWdnZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZvcm1hdDoge1xyXG4gICAgICAgICAgY29tbWVudHM6IGZhbHNlLCAvLyBcdTUyMjBcdTk2NjRcdTZDRThcdTkxQ0FcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAvLyBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgIC8vICAgXCJ2dWUtaTE4blwiOiBbXCJ2dWUtaTE4blwiXSxcclxuICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICAvLyBcdTc1MjhcdTRFOEVcdTRFQ0VcdTUxNjVcdTUzRTNcdTcwQjlcdTUyMUJcdTVFRkFcdTc2ODRcdTU3NTdcdTc2ODRcdTYyNTNcdTUzMDVcdThGOTNcdTUxRkFcdTY4M0NcdTVGMEZbbmFtZV1cdTg4NjhcdTc5M0FcdTY1ODdcdTRFRjZcdTU0MEQsW2hhc2hdXHU4ODY4XHU3OTNBXHU4QkU1XHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5aGFzaFx1NTAzQ1xyXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwianMvW25hbWVdLltoYXNoXS5qc1wiLFxyXG4gICAgICAgICAgLy8gXHU3NTI4XHU0RThFXHU1NDdEXHU1NDBEXHU0RUUzXHU3ODAxXHU2MkM2XHU1MjA2XHU2NUY2XHU1MjFCXHU1RUZBXHU3Njg0XHU1MTcxXHU0RUFCXHU1NzU3XHU3Njg0XHU4RjkzXHU1MUZBXHU1NDdEXHU1NDBEXHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogXCJqcy9bbmFtZV0uW2hhc2hdLmpzXCIsXHJcbiAgICAgICAgICAvLyBcdTc1MjhcdTRFOEVcdThGOTNcdTUxRkFcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTc2ODRcdTU0N0RcdTU0MERcdUZGMENbZXh0XVx1ODg2OFx1NzkzQVx1NjU4N1x1NEVGNlx1NjI2OVx1NUM1NVx1NTQwRFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm86IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gYXNzZXRJbmZvLm5hbWUuc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgICAgICBsZXQgZXh0VHlwZSA9IGluZm9baW5mby5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1x1NjU4N1x1NEVGNlx1NEZFMVx1NjA2RicsIGFzc2V0SW5mby5uYW1lKVxyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgL1xcLihtcDR8d2VibXxvZ2d8bXAzfHdhdnxmbGFjfGFhYykoXFw/LiopPyQvaS50ZXN0KGFzc2V0SW5mby5uYW1lKVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICBleHRUeXBlID0gXCJtZWRpYVwiO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9cXC4ocG5nfGpwZT9nfGdpZnxzdmcpKFxcPy4qKT8kLy50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xyXG4gICAgICAgICAgICAgIGV4dFR5cGUgPSBcImltZ1wiO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9cXC4od29mZjI/fGVvdHx0dGZ8b3RmKShcXD8uKik/JC9pLnRlc3QoYXNzZXRJbmZvLm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgZXh0VHlwZSA9IFwiZm9udHNcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYCR7ZXh0VHlwZX0vW25hbWVdLltoYXNoXS5bZXh0XWA7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIF9fQVBQX0lORk9fXzogSlNPTi5zdHJpbmdpZnkoX19BUFBfSU5GT19fKSxcclxuICAgIH0sXHJcbiAgfTtcclxufSk7XHJcbiIsICJ7XHJcbiAgXCJuYW1lXCI6IFwidnVlMy1vcmdhblwiLFxyXG4gIFwidmVyc2lvblwiOiBcIjIuOS4zXCIsXHJcbiAgXCJwcml2YXRlXCI6IHRydWUsXHJcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwicHJlaW5zdGFsbFwiOiBcIm5weCBvbmx5LWFsbG93IHBucG1cIixcclxuICAgIFwiZGV2XCI6IFwidml0ZSBzZXJ2ZSAtLW1vZGUgZGV2ZWxvcG1lbnRcIixcclxuICAgIFwiYnVpbGQ6cHJvZFwiOiBcInZpdGUgYnVpbGQgLS1tb2RlIHByb2R1Y3Rpb24gJiYgdnVlLXRzYyAtLW5vRW1pdFwiLFxyXG4gICAgXCJwcmVwYXJlXCI6IFwiaHVza3lcIixcclxuICAgIFwibGludDplc2xpbnRcIjogXCJlc2xpbnQgIC0tZml4IC0tZXh0IC50cywuanMsLnZ1ZSAuL3NyYyBcIixcclxuICAgIFwibGludDpwcmV0dGllclwiOiBcInByZXR0aWVyIC0td3JpdGUgXFxcIioqLyoue2pzLGNqcyx0cyxqc29uLHRzeCxjc3MsbGVzcyxzY3NzLHZ1ZSxodG1sLG1kfVxcXCJcIixcclxuICAgIFwibGludDpzdHlsZWxpbnRcIjogXCJzdHlsZWxpbnQgIFxcXCIqKi8qLntjc3Msc2Nzcyx2dWV9XFxcIiAtLWZpeFwiLFxyXG4gICAgXCJsaW50OmxpbnQtc3RhZ2VkXCI6IFwibGludC1zdGFnZWRcIixcclxuICAgIFwiY29tbWl0XCI6IFwiZ2l0LWN6XCJcclxuICB9LFxyXG4gIFwiY29uZmlnXCI6IHtcclxuICAgIFwiY29tbWl0aXplblwiOiB7XHJcbiAgICAgIFwicGF0aFwiOiBcIm5vZGVfbW9kdWxlcy9jei1naXRcIlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJsaW50LXN0YWdlZFwiOiB7XHJcbiAgICBcIioue2pzLHRzfVwiOiBbXHJcbiAgICAgIFwiZXNsaW50IC0tZml4XCIsXHJcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiXHJcbiAgICBdLFxyXG4gICAgXCIqLntjanMsanNvbn1cIjogW1xyXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIlxyXG4gICAgXSxcclxuICAgIFwiKi57dnVlLGh0bWx9XCI6IFtcclxuICAgICAgXCJlc2xpbnQgLS1maXhcIixcclxuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCIsXHJcbiAgICAgIFwic3R5bGVsaW50IC0tZml4XCJcclxuICAgIF0sXHJcbiAgICBcIioue3Njc3MsY3NzfVwiOiBbXHJcbiAgICAgIFwic3R5bGVsaW50IC0tZml4XCIsXHJcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiXHJcbiAgICBdLFxyXG4gICAgXCIqLm1kXCI6IFtcclxuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCJcclxuICAgIF1cclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGNrZWRpdG9yL2NrZWRpdG9yNS12dWVcIjogXCJeNi4wLjBcIixcclxuICAgIFwiQGVsZW1lbnQtcGx1cy9pY29ucy12dWVcIjogXCJeMi4zLjJcIixcclxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjkuMFwiLFxyXG4gICAgXCJhbmltYXRlLmNzc1wiOiBcIl40LjEuMVwiLFxyXG4gICAgXCJheGlvc1wiOiBcIl4xLjYuOFwiLFxyXG4gICAgXCJja2VkaXRvcjVcIjogXCJeNDIuMC4wXCIsXHJcbiAgICBcImVjaGFydHNcIjogXCJeNS41LjBcIixcclxuICAgIFwiZWxlbWVudC1wbHVzXCI6IFwiXjIuNy40XCIsXHJcbiAgICBcImh0bWw1LXFyY29kZVwiOiBcIl4yLjMuOFwiLFxyXG4gICAgXCJqcy1iYXNlNjRcIjogXCJeMy43LjhcIixcclxuICAgIFwibG9kYXNoLWVzXCI6IFwiXjQuMTcuMjFcIixcclxuICAgIFwibmV0XCI6IFwiXjEuMC4yXCIsXHJcbiAgICBcIm5wcm9ncmVzc1wiOiBcIl4wLjIuMFwiLFxyXG4gICAgXCJwYXRoLWJyb3dzZXJpZnlcIjogXCJeMS4wLjFcIixcclxuICAgIFwicGF0aC10by1yZWdleHBcIjogXCJeNi4yLjJcIixcclxuICAgIFwicGluaWFcIjogXCJeMi4xLjdcIixcclxuICAgIFwic29ja2pzLWNsaWVudFwiOiBcIjEuNi4xXCIsXHJcbiAgICBcInNvcnRhYmxlanNcIjogXCJeMS4xNS4yXCIsXHJcbiAgICBcInN0b21wanNcIjogXCJeMi4zLjNcIixcclxuICAgIFwidnVlXCI6IFwiXjMuNC4yMVwiLFxyXG4gICAgXCJ2dWUtZW1haWwtZWRpdG9yXCI6IFwiXjIuMS40XCIsXHJcbiAgICBcInZ1ZS1pMThuXCI6IFwiOS45LjFcIixcclxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjMuMFwiLFxyXG4gICAgXCJ4bHN4XCI6IFwiXjAuMTguNVwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBjb21taXRsaW50L2NsaVwiOiBcIl4xOC42LjFcIixcclxuICAgIFwiQGNvbW1pdGxpbnQvY29uZmlnLWNvbnZlbnRpb25hbFwiOiBcIl4xOC42LjNcIixcclxuICAgIFwiQGljb25pZnktanNvbi9lcFwiOiBcIl4xLjEuMTVcIixcclxuICAgIFwiQHR5cGVzL2xvZGFzaFwiOiBcIl40LjE3LjBcIixcclxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMjAuMTIuN1wiLFxyXG4gICAgXCJAdHlwZXMvbnByb2dyZXNzXCI6IFwiXjAuMi4zXCIsXHJcbiAgICBcIkB0eXBlcy9wYXRoLWJyb3dzZXJpZnlcIjogXCJeMS4wLjJcIixcclxuICAgIFwiQHR5cGVzL3NvY2tqcy1jbGllbnRcIjogXCJeMS41LjRcIixcclxuICAgIFwiQHR5cGVzL3NvcnRhYmxlanNcIjogXCJeMS4xNS44XCIsXHJcbiAgICBcIkB0eXBlcy9zdG9tcGpzXCI6IFwiXjIuMy45XCIsXHJcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjcuNi4wXCIsXHJcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNy42LjBcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiXjUuMC40XCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZS1qc3hcIjogXCJeMy4xLjBcIixcclxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTlcIixcclxuICAgIFwiY29tbWl0aXplblwiOiBcIl40LjMuMFwiLFxyXG4gICAgXCJjei1naXRcIjogXCJeMS45LjFcIixcclxuICAgIFwiZXNsaW50XCI6IFwiXjguNTcuMFwiLFxyXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMS4wXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjkuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjUuMS4zXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tdnVlXCI6IFwiXjkuMjUuMFwiLFxyXG4gICAgXCJmYXN0LWdsb2JcIjogXCJeMy4zLjJcIixcclxuICAgIFwiaHVza3lcIjogXCJeOS4wLjExXCIsXHJcbiAgICBcImxpbnQtc3RhZ2VkXCI6IFwiXjE1LjIuMlwiLFxyXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC4zOFwiLFxyXG4gICAgXCJwb3N0Y3NzLWh0bWxcIjogXCJeMS42LjBcIixcclxuICAgIFwicG9zdGNzcy1zY3NzXCI6IFwiXjQuMC45XCIsXHJcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMi41XCIsXHJcbiAgICBcInNhc3NcIjogXCJeMS43NS4wXCIsXHJcbiAgICBcInN0eWxlbGludFwiOiBcIl4xNi4zLjFcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1odG1sXCI6IFwiXjEuMS4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctcmVjZXNzLW9yZGVyXCI6IFwiXjQuNi4wXCIsXHJcbiAgICBcInN0eWxlbGludC1jb25maWctcmVjb21tZW5kZWQtc2Nzc1wiOiBcIl4xNC4wLjBcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC12dWVcIjogXCJeMS41LjBcIixcclxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1zdGFuZGFyZFwiOiBcIl4zNi4wLjBcIixcclxuICAgIFwidGVyc2VyXCI6IFwiXjUuMzAuM1wiLFxyXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuNC41XCIsXHJcbiAgICBcInVub2Nzc1wiOiBcIl4wLjU4LjlcIixcclxuICAgIFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xNy41XCIsXHJcbiAgICBcInVucGx1Z2luLWljb25zXCI6IFwiXjAuMTguNVwiLFxyXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIl4wLjI2LjBcIixcclxuICAgIFwidml0ZVwiOiBcIl41LjIuOFwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1tb2NrLWRldi1zZXJ2ZXJcIjogXCJeMS41LjBcIixcclxuICAgIFwidml0ZS1wbHVnaW4tc3ZnLWljb25zXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcInZ1ZS10c2NcIjogXCJeMi4wLjEzXCJcclxuICB9LFxyXG4gIFwicmVwb3NpdG9yeVwiOiBcImh0dHBzOi8vZ2l0ZWUuY29tL3lvdWxhaW9yZy92dWUzLWVsZW1lbnQtYWRtaW4uZ2l0XCIsXHJcbiAgXCJhdXRob3JcIjogXCJaRlwiLFxyXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxyXG4gIFwiZW5naW5lc1wiOiB7XHJcbiAg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
