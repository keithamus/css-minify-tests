import { transform, browserslistToTargets } from "lightningcss";

const targets = browserslistToTargets([
  "last 1 Chrome version",
  "last 1 Firefox version",
  "last 1 Safari version",
]);

export default function minify(source) {
  const { code } = transform({
    filename: "test.css",
    code: Buffer.from(source),
    minify: true,
    targets,
  });
  return new TextDecoder().decode(code);
}
