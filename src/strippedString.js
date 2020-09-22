export default function (originalString) {
  return originalString.replace(/(<([^>]+)>)/gi, "");
}
