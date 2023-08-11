class Colors {
  static copy (color) {
    return Colors.buildColor(color.hsl.h, color.hsl.s, color.hsl.l)
  }

  static buildColor (h, s, l) {
    const hsl = { h, s, l }
    const rgb = Colors.hslToRGB(hsl)
    const hex = Colors.rgbToHex(rgb)
    const grayscale = Math.round((0.2126 * rgb.r) + (0.7152 * rgb.g) + (0.0722 * rgb.b))

    return { hex, rgb, hsl, grayscale }
  }

  static randomColor () {
    const hsl = Colors.randomHSL()

    return Colors.buildColor(hsl.h, hsl.s, hsl.l)
  }

  static randomHSL () {
    const h = Math.round(Math.random() * 359)
    const s = Math.round(Math.random() * 100)
    const l = Math.round(Math.random() * 100)

    return { h, s, l }
  }

  static hslToRGB (hsl) {
    const h = hsl.h
    const s = hsl.s / 100
    const l = hsl.l / 100

    const c = (1 - Math.abs((2 * l) - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - (c / 2)

    let r = 0
    let g = 0
    let b = 0

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c
    } else {
      r = c; g = 0; b = x
    }

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return { r, g, b }
  }

  static rgbToHex (rgb) {
    const r = rgb.r
    const g = rgb.g
    const b = rgb.b

    let h = r.toString(16).toUpperCase()
    let e = g.toString(16).toUpperCase()
    let x = b.toString(16).toUpperCase()

    if (h.length !== 2) { h = `0${h}` }
    if (e.length !== 2) { e = `0${e}` }
    if (x.length !== 2) { x = `0${x}` }

    return `#${h}${e}${x}`
  }

  static darkenColor (color, darkness) {
    let l = Number(color.hsl.l) - Number(darkness)
    l = l > 0 ? l : 0

    return Colors.buildColor(color.hsl.h, color.hsl.s, l)
  }

  static lightenColor (color, lightness) {
    let l = Number(color.hsl.l) + Number(lightness)
    l = l < 100 ? l : 100

    return Colors.buildColor(color.hsl.h, color.hsl.s, l)
  }

  static desaturateColor (color, saturation) {
    let s = Number(color.hsl.s) - Number(saturation)
    s = s > 0 ? s : 0

    return Colors.buildColor(color.hsl.h, s, color.hsl.l)
  }

  static saturateColor (color, saturation) {
    let s = Number(color.hsl.s) + Number(saturation)
    s = s < 100 ? s : 100

    return Colors.buildColor(color.hsl.h, s, color.hsl.l)
  }

  static hueColor (color, hue) {
    let h = Number(color.hsl.h) + Number(hue)
    h %= 360
    h = h < 0 ? 360 + h : h

    return Colors.buildColor(h, color.hsl.s, color.hsl.l)
  }

  static darkenHSL (hsl, darkness) {
    let darkHSL = hsl.trim().replaceAll(' ', '')
    darkHSL = darkHSL.match(/hsl\(([\d]{1,3}),([\d]{1,3})%,([\d]{1,3})%\)/i)

    if (darkHSL === null || darkHSL.length !== 4) {
      return hsl
    }

    const h = Number(darkHSL[1])
    const s = Number(darkHSL[2])
    let l = Number(darkHSL[3])

    l -= darkness
    l = l > 0 ? l : 0

    return `hsl(${h}, ${s}%, ${l}%)`
  }

  static formatHSL (color) {
    return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
  }

  static formatRGB (color) {
    return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
  }

  static formatTextColor (color) {
    return color.grayscale > 150 ? Colors.formatHSL(Colors.black()) : Colors.formatHSL(Colors.white())
  }

  static white () {
    return Colors.buildColor(0, 0, 100)
  }

  static black () {
    return Colors.buildColor(0, 0, 0)
  }

  static harmonies (color) {
    return new Map([
      ['complementary', this.complementary(color)],
      ['splitComplementary', this.splitComplementary(color)],
      ['analogous', this.analogous(color)],
      ['triadic', this.triadic(color)],
      ['tetradic', this.tetradic(color)],
      ['square', this.square(color)]
    ])
  }

  static complementary (color) {
    return [Colors.copy(color), Colors.hueColor(color, 180)]
  }

  static splitComplementary (color) {
    return [Colors.copy(color), Colors.hueColor(color, 150), Colors.hueColor(color, 210)]
  }

  static analogous (color) {
    return [Colors.copy(color), Colors.hueColor(color, 30), Colors.hueColor(color, 330)]
  }

  static triadic (color) {
    return [Colors.copy(color), Colors.hueColor(color, 120), Colors.hueColor(color, 240)]
  }

  static tetradic (color) {
    return [Colors.hueColor(color, 30), Colors.hueColor(color, 150), Colors.hueColor(color, 300), Colors.hueColor(color, 330)]
  }

  static square (color) {
    return [Colors.copy(color), Colors.hueColor(color, 90), Colors.hueColor(color, 180), Colors.hueColor(color, 270)]
  }
}

export { Colors }
