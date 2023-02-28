import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { basename } from "path";
import fg from "fast-glob";

function createPackageAlias() {
  const packageDirs = fg.sync("src/packages/*", {
    onlyDirectories: true,
    absolute: true,
  });

  return packageDirs.reduce((aliasObj, dir) => {
    const packageName = basename(dir);
    aliasObj[packageName] = dir;
    return aliasObj;
  }, {} as any);
}

const alias = createPackageAlias();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "my-react",
    }),
  ],
  resolve: {
    alias,
  },
});
