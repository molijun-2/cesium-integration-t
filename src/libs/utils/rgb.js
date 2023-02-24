

const rgbaStringToStruct = function (val) {
  let rgba = val?.match(/(\d(\.\d+)?)+/g)
  if (!rgba) {
    rgba = ['0', '0', '0', '0']
  }
  const r = parseFloat(rgba[0])
  const g = parseFloat(rgba[1])
  const b = parseFloat(rgba[2])
  const a = parseFloat(rgba[3])
  return {
    red: r,
    green: g,
    blue: b,
    alpha: a,
  }
}

export { rgbaStringToStruct }
