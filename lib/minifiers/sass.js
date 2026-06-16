import { compileString } from 'sass';

export default function minify (source) {
  const options = {
    style: 'compressed',
    alertColor: false
  };
  return compileString(source, options).css;
}
