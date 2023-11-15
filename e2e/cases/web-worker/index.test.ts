import path from 'path';
import { expect, test } from '@playwright/test';
import { build } from '@scripts/shared';

test('should build web-worker target correctly', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    target: 'web-worker',
  });
  const files = await rsbuild.unwrapOutputJSON();
  const filenames = Object.keys(files);
  const jsFiles = filenames.filter((item) => item.endsWith('.js'));

  expect(jsFiles.length).toEqual(1);
  expect(jsFiles[0].includes('index')).toBeTruthy();
});

test('should build web-worker target with dynamicImport correctly', async () => {
  const rsbuild = await build({
    cwd: __dirname,
    target: 'web-worker',
    rsbuildConfig: {
      source: {
        entries: { index: path.resolve(__dirname, './src/index2.js') },
      },
    },
  });
  const files = await rsbuild.unwrapOutputJSON();
  const filenames = Object.keys(files);
  const jsFiles = filenames.filter((item) => item.endsWith('.js'));

  expect(jsFiles.length).toEqual(1);
  expect(jsFiles[0].includes('index')).toBeTruthy();
});
