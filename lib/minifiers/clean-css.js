import CleanCSS from "clean-css";

const instance = new CleanCSS({ level: 2, inline: false });

export default function minify(source) {
  const result = instance.minify(source);
  if (result.errors?.length) {
    throw new Error(result.errors.join("\n"));
  }
  return result.styles;
}
