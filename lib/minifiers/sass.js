import { compileString } from "sass";

export default function minify(source) {
  return compileString(source, { style: "compressed" }).css;
};
