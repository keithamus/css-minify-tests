import postcss from "postcss";
import cssnano from "cssnano";

const processor = postcss([cssnano]);

export default async function minify(source) {
  const result = await processor.process(source, { from: undefined });
  return result.css;
}
