class Colors {
  static equal(color01, color02) {
    return color01.hsl.h === color02.hsl.h && color01.hsl.s === color02.hsl.s && color01.hsl.l === color02.hsl.l
  }

  static notEqual(color01, color02) {
    return !Colors.equal(color01, color02)
  }

  static copy(color) {
    return Colors.buildHSL(color.hsl.h, color.hsl.s, color.hsl.l)
  }

  static createHex(hex) {
    hex = hex.trim().replace('#', '').toUpperCase()
    hex = hex.match(/^[A-F\d]{6}$/)

    return hex !== null ? Colors.buildHex(`#${hex[0]}`) : null
  }

  static createRGB(r, g, b) {
    r = Number(r.trim())
    g = Number(g.trim())
    b = Number(b.trim())

    const rgb = r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255

    return rgb ? Colors.buildRGB(r, g, b) : null
  }

  static createHSL(h, s, l) {
    h = Number(h.trim()) % 360
    s = Number(s.trim())
    l = Number(l.trim())

    const hsl = h >= 0 && h < 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100

    return hsl ? Colors.buildHSL(h, s, l) : null
  }

  static createHSV(h, s, v) {
    h = Number(h.trim()) % 360
    s = Number(s.trim())
    v = Number(v.trim())

    const hsv = h >= 0 && h < 360 && s >= 0 && s <= 100 && v >= 0 && v <= 100

    return hsv ? Colors.buildHSV(h, s, v) : null
  }

  static createCMYK(c, m, y, k) {
    c = Number(c.trim())
    m = Number(m.trim())
    y = Number(y.trim())
    k = Number(k.trim())

    const cmyk = c >= 0 && c <= 100 && m >= 0 && m <= 100 && y >= 0 && y <= 100 && k >= 0 && k <= 100

    return cmyk ? Colors.buildCMYK(c, m, y, k) : null
  }

  static buildHex(hex) {
    const rgb = Colors.hexToRGB(hex)
    const hsl = Colors.rgbToHSL(rgb)
    const hsv = Colors.rgbToHSV(rgb)
    const cmyk = Colors.rgbToCMYK(rgb)

    return Colors.build(hex, rgb, hsl, hsv, cmyk)
  }

  static buildRGB(r, g, b) {
    const rgb = { r, g, b }
    const hsl = Colors.rgbToHSL(rgb)
    const hex = Colors.rgbToHex(rgb)
    const hsv = Colors.rgbToHSV(rgb)
    const cmyk = Colors.rgbToCMYK(rgb)

    return Colors.build(hex, rgb, hsl, hsv, cmyk)
  }

  static buildHSL(h, s, l) {
    const rgb = Colors.hslToRGB({ h, s, l })
    const hex = Colors.rgbToHex(rgb)
    const hsl = Colors.rgbToHSL(rgb)
    const hsv = Colors.rgbToHSV(rgb)
    const cmyk = Colors.rgbToCMYK(rgb)

    return Colors.build(hex, rgb, hsl, hsv, cmyk)
  }

  static buildHSV(h, s, v) {
    const rgb = Colors.hsvToRGB({ h, s, v })
    const hex = Colors.rgbToHex(rgb)
    const hsl = Colors.rgbToHSL(rgb)
    const hsv = Colors.rgbToHSV(rgb)
    const cmyk = Colors.rgbToCMYK(rgb)

    return Colors.build(hex, rgb, hsl, hsv, cmyk)
  }

  static buildCMYK(c, m, y, k) {
    const rgb = Colors.cmykToRGB({ c, m, y, k })
    const hex = Colors.rgbToHex(rgb)
    const hsl = Colors.rgbToHSL(rgb)
    const hsv = Colors.rgbToHSV(rgb)
    const cmyk = Colors.rgbToCMYK(rgb)

    return Colors.build(hex, rgb, hsl, hsv, cmyk)
  }

  static build(hex, rgb, hsl, hsv, cmyk) {
    let r = rgb.r / 255
    let g = rgb.g / 255
    let b = rgb.b / 255

    r = r <= 0.03928 ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4)
    g = g <= 0.03928 ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4)
    b = b <= 0.03928 ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4)

    const relative = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)
    const grayscale = Number(Number(relative * 100).toFixed(2))
    const contrast = Number(Number((relative + 0.05) / (0 + 0.05)).toFixed(2))

    const formattedHex = hex
    const formattedRGB = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const formattedHSL = `hsl(${Number(hsl.h).toFixed(0)}\u00b0, ${Number(hsl.s).toFixed(0)}%, ${Number(hsl.l).toFixed(0)}%)`
    const formattedHSV = `hsv(${Number(hsv.h).toFixed(0)}\u00b0, ${Number(hsv.s).toFixed(0)}%, ${Number(hsv.v).toFixed(0)}%)`
    const formattedCMYK = `cmyk(${Number(cmyk.c).toFixed(0)}%, ${Number(cmyk.m).toFixed(0)}%, ${Number(cmyk.y).toFixed(0)}%, ${Number(cmyk.k).toFixed(0)}%)`
    // const formattedHSL = `hsl(${Number(hsl.h).toFixed(2)}\u00b0, ${Number(hsl.s).toFixed(2)}%, ${Number(hsl.l).toFixed(2)}%)`
    // const formattedHSV = `hsv(${Number(hsv.h).toFixed(2)}\u00b0, ${Number(hsv.s).toFixed(2)}%, ${Number(hsv.v).toFixed(2)}%)`
    // const formattedCMYK = `cmyk(${Number(cmyk.c).toFixed(2)}%, ${Number(cmyk.m).toFixed(2)}%, ${Number(cmyk.y).toFixed(2)}%, ${Number(cmyk.k).toFixed(2)}%)`
    const formattedText = grayscale > 50 ? '#000000' : '#FFFFFF'

    return { hex, rgb, hsl, hsv, cmyk, grayscale, contrast, formattedHex, formattedRGB, formattedHSL, formattedHSV, formattedCMYK, formattedText }
  }

  static random() {
    const r = Math.round(Math.random() * 255)
    const g = Math.round(Math.random() * 255)
    const b = Math.round(Math.random() * 255)

    return Colors.buildRGB(r, g, b)
  }

  static randomGrayscaleRange(grayscaleMin, grayscaleMax) {
    let gMin = grayscaleMin >= 0 ? grayscaleMin : 0
    let gMax = grayscaleMax <= 255 ? grayscaleMax : 255

    let r = Math.round(Math.random() * 255)
    let g = Math.round(Math.random() * 255)
    let b = Math.round(Math.random() * 255)
    let color = Colors.buildRGB(r, g, b)
    while (color.grayscale < gMin || color.grayscale > gMax) {
      r = Math.round(Math.random() * 255)
      g = Math.round(Math.random() * 255)
      b = Math.round(Math.random() * 255)
      color = Colors.buildRGB(r, g, b)
    }

    return color
  }

  static hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5), 16)

    return { r, g, b }
  }

  static rgbToHex(rgb) {
    const r = Number(rgb.r)
    const g = Number(rgb.g)
    const b = Number(rgb.b)

    let h = r.toString(16).toUpperCase()
    let e = g.toString(16).toUpperCase()
    let x = b.toString(16).toUpperCase()

    if (h.length !== 2) { h = `0${h}` }
    if (e.length !== 2) { e = `0${e}` }
    if (x.length !== 2) { x = `0${x}` }

    return `#${h}${e}${x}`
  }

  static hslToRGB(hsl) {
    const h = Number(hsl.h)
    const s = Number(hsl.s / 100)
    const l = Number(hsl.l / 100)

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

  static rgbToHSL(rgb) {
    const r = Number(rgb.r) / 255
    const g = Number(rgb.g) / 255
    const b = Number(rgb.b) / 255

    const cMax = Math.max(r, g, b)
    const cMin = Math.min(r, g, b)
    const delta = cMax - cMin

    let h = 0
    let s = 0
    let l = 0
    if (delta > 0) {
      if (cMax === r) {
        h = (((g - b) / delta) % 6) * 60
      } else if (cMax === g) {
        h = (((b - r) / delta) + 2) * 60
      } else {
        h = (((r - g) / delta) + 4) * 60
      }
    }
    l = (cMax + cMin) / 2
    if (l > 0 && l < 1) {
      s = delta / (1 - Math.abs((2 * l) - 1))
    }

    h = Math.round(h * 100) / 100
    h = h < 0 ? 360 + h : h
    s = Math.round(s * 10000) / 100
    l = Math.round(l * 10000) / 100

    h = Number(Number(h).toFixed(2))
    s = Number(Number(s).toFixed(2))
    l = Number(Number(l).toFixed(2))

    return { h, s, l }
  }

  static hsvToRGB(hsv) {
    const h = Number(hsv.h)
    const s = Number(hsv.s / 100)
    const v = Number(hsv.v / 100)

    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

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

  static rgbToHSV(rgb) {
    const r = Number(rgb.r) / 255
    const g = Number(rgb.g) / 255
    const b = Number(rgb.b) / 255

    const cMax = Math.max(r, g, b)
    const cMin = Math.min(r, g, b)
    const delta = cMax - cMin

    let h = 0
    let s = cMax === 0 ? 0 : delta / cMax
    let v = cMax
    if (delta > 0) {
      if (cMax === r) {
        h = (((g - b) / delta) % 6) * 60
      } else if (cMax === g) {
        h = (((b - r) / delta) + 2) * 60
      } else {
        h = (((r - g) / delta) + 4) * 60
      }
    }

    h = Math.round(h * 100) / 100
    h = h < 0 ? 360 + h : h
    s = Math.round(s * 10000) / 100
    v = Math.round(v * 10000) / 100

    h = Number(Number(h).toFixed(2))
    s = Number(Number(s).toFixed(2))
    v = Number(Number(v).toFixed(2))

    return { h, s, v }
  }

  static cmykToRGB(cmyk) {
    const r = Math.round((1 - cmyk.c) * (1 - cmyk.k) * 255)
    const g = Math.round((1 - cmyk.m) * (1 - cmyk.k) * 255)
    const b = Math.round((1 - cmyk.y) * (1 - cmyk.k) * 255)

    return { r, g, b }
  }

  static rgbToCMYK(rgb) {
    const r = Number(rgb.r) / 255
    const g = Number(rgb.g) / 255
    const b = Number(rgb.b) / 255

    let c = 0
    let m = 0
    let y = 0
    let k = 1 - Math.max(r, g, b)
    if (k < 1) {
      c = (1 - r - k) / (1 - k)
      m = (1 - g - k) / (1 - k)
      y = (1 - b - k) / (1 - k)
    }

    c = Math.round(c * 10000) / 100
    m = Math.round(m * 10000) / 100
    y = Math.round(y * 10000) / 100
    k = Math.round(k * 10000) / 100

    c = Number(Number(c).toFixed(2))
    m = Number(Number(m).toFixed(2))
    y = Number(Number(y).toFixed(2))
    k = Number(Number(k).toFixed(2))

    return { c, m, y, k }
  }

  static hue(color, value) {
    let h = Number(color.hsl.h) + Number(value)
    h %= 360
    h = h < 0 ? 360 + h : h

    return Colors.buildHSL(h, color.hsl.s, color.hsl.l)
  }

  static saturation(color, value) {
    let s = Number(color.hsl.s) + Number(value)
    s = s <= 100 ? s : 100
    s = s >= 0 ? s : 0

    return Colors.buildHSL(color.hsl.h, s, color.hsl.l)
  }

  static lightness(color, value) {
    let l = Number(color.hsl.l) + Number(value)
    l = l <= 100 ? l : 100
    l = l >= 0 ? l : 0

    return Colors.buildHSL(color.hsl.h, color.hsl.s, l)
  }

  static hues(color, degrees, value) {
    const colors = [Colors.copy(color)]

    const huesToCreate = Math.round(degrees / value)
    while (colors.length < huesToCreate / 2) {
      colors.push(Colors.hue(colors[colors.length - 1], value))
    }

    colors.reverse()
    while (colors.length < huesToCreate) {
      colors.push(Colors.hue(colors[colors.length - 1], -value))
    }

    return colors
  }

  static saturations(color, value) {
    const colors = [Colors.copy(color)]

    while (colors[colors.length - 1].hsl.s < 100) {
      colors.push(Colors.saturation(colors[colors.length - 1], value))
    }

    colors.reverse()
    while (colors[colors.length - 1].hsl.s > 0) {
      colors.push(Colors.saturation(colors[colors.length - 1], -value))
    }

    return colors
  }

  static lightnesses(color, value) {
    const colors = [Colors.copy(color)]

    while (colors[colors.length - 1].hsl.l < 100) {
      colors.push(Colors.lightness(colors[colors.length - 1], value))
    }

    colors.reverse()
    while (colors[colors.length - 1].hsl.l > 0) {
      colors.push(Colors.lightness(colors[colors.length - 1], -value))
    }

    return colors
  }

  static complementary(color) {
    return [Colors.copy(color), Colors.hue(color, 180)]
  }

  static splitComplementary(color) {
    return [Colors.copy(color), Colors.hue(color, 150), Colors.hue(color, 210)]
  }

  static analogous(color) {
    return [Colors.copy(color), Colors.hue(color, 30), Colors.hue(color, 330)]
  }

  static triadic(color) {
    return [Colors.copy(color), Colors.hue(color, 120), Colors.hue(color, 240)]
  }

  static tetradic(color) {
    return [Colors.hue(color, 30), Colors.hue(color, 150), Colors.hue(color, 300), Colors.hue(color, 330)]
  }

  static square(color) {
    return [Colors.copy(color), Colors.hue(color, 90), Colors.hue(color, 180), Colors.hue(color, 270)]
  }

  static paletteA(color) {
    return [
      Colors.copy(color),
      Colors.buildHSL(color.hsl.h, (Number(color.hsl.s) + Number(33)) % Number(100), color.hsl.l),
      Colors.buildHSL(color.hsl.h, (Number(color.hsl.s) + Number(67)) % Number(100), color.hsl.l),
      Colors.buildHSL(color.hsl.h, color.hsl.s, (Number(color.hsl.l) + Number(15)) % Number(100)),
      Colors.buildHSL(color.hsl.h, color.hsl.s, (Number(color.hsl.l) + Number(30)) % Number(100)),
    ]
  }

  static gradient(color01, color02) {
    return [Colors.copy(color01), Colors.copy(color02)]
  }
}

export { Colors }