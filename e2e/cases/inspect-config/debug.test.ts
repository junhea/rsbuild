import path from 'node:path';
import { fse } from '@rsbuild/shared';
import { expect, test } from '@playwright/test';
import { build, dev, gotoPage } from '@e2e/helper';

const getRsbuildConfig = (dist: string) =>
  path.resolve(__dirname, `./${dist}/rsbuild.config.mjs`);
const getBundlerConfig = (dist: string) =>
  path.resolve(
    __dirname,
    `./${dist}/${process.env.PROVIDE_TYPE || 'rspack'}.config.web.mjs`,
  );

test('should generate config files when build (with DEBUG)', async () => {
  process.env.DEBUG = 'rsbuild';
  const distRoot = 'dist-1';

  await build({
    cwd: __dirname,
    rsbuildConfig: {
      output: {
        distPath: {
          root: distRoot,
        },
        cleanDistPath: true,
      },
    },
  });

  expect(fse.existsSync(getRsbuildConfig(distRoot))).toBeTruthy();
  expect(fse.existsSync(getBundlerConfig(distRoot))).toBeTruthy();

  delete process.env.DEBUG;
});

test('should generate config files when dev (with DEBUG)', async ({ page }) => {
  process.env.DEBUG = 'rsbuild';
  const distRoot = 'dist-2';

  const rsbuild = await dev({
    cwd: __dirname,
    rsbuildConfig: {
      output: {
        distPath: {
          root: distRoot,
        },
        cleanDistPath: true,
      },
    },
  });

  const res = await gotoPage(page, rsbuild);

  expect(res?.status()).toBe(200);

  expect(fse.existsSync(getRsbuildConfig(distRoot))).toBeTruthy();
  expect(fse.existsSync(getBundlerConfig(distRoot))).toBeTruthy();

  delete process.env.DEBUG;

  await rsbuild.close();
});
