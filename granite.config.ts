import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'yes-or-no',
  brand: {
    displayName: 'YES / NO',
    primaryColor: '#3182F6',
    icon: '', // 콘솔에 등록한 아이콘 이미지 주소 (Phase 0에서 확정)
  },
  web: {
    host: 'localhost',
    port: 5174,
    commands: {
      dev: 'vite',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
