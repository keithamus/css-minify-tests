import { transform } from 'esbuild';

export default async function minify (source) {
  const { code } = await transform(source, {
    loader: 'css',
    minify: true,
    target: [
      'chrome149',
      'firefox151',
      'safari26'
    ]
  });
  return code;
}
