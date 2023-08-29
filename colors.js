class Colors {
  static equal (color01, color02) {
    return color01.hsl.h === color02.hsl.h && color01.hsl.s === color02.hsl.s && color01.hsl.l === color02.hsl.l
  }

  static notEqual (color01, color02) {
    return color01.hsl.h !== color02.hsl.h || color01.hsl.s !== color02.hsl.s || color01.hsl.l !== color02.hsl.l
  }

  static copy (color) {
    return Colors.buildHSL(color.hsl.h, color.hsl.s, color.hsl.l)
  }

  static createHex (hex) {
    hex = hex.trim().replace('#', '').toUpperCase()
    hex = hex.match(/^[A-F\d]{6}$/)

    return hex !== null ? Colors.buildHex(`#${hex[0]}`) : null
  }

  static createRGB (r, g, b) {
    r = Number(r.trim())
    g = Number(g.trim())
    b = Number(b.trim())

    const rgb = r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255

    return rgb ? Colors.buildRGB(r, g, b) : null
  }

  static createHSL (h, s, l) {
    h = Number(h.trim())
    s = Number(s.trim())
    l = Number(l.trim())

    const hsl = h >= 0 && h <= 359 && s >= 0 && s <= 100 && l >= 0 && l <= 100

    return hsl ? Colors.buildHSL(h, s, l) : null
  }

  static buildHex (hex) {
    const rgb = Colors.hexToRGB(hex)
    const hsl = Colors.rgbToHSL(rgb)

    return Colors.build(hex, rgb, hsl)
  }

  static buildRGB (r, g, b) {
    const rgb = { r, g, b }
    const hsl = Colors.rgbToHSL(rgb)
    const hex = Colors.rgbToHex(rgb)

    return Colors.build(hex, rgb, hsl)
  }

  static buildHSL (h, s, l) {
    const hsl = { h, s, l }
    const rgb = Colors.hslToRGB(hsl)
    const hex = Colors.rgbToHex(rgb)

    return Colors.build(hex, rgb, hsl)
  }

  static build (hex, rgb, hsl) {
    const grayscale = Math.round((0.2126 * rgb.r) + (0.7152 * rgb.g) + (0.0722 * rgb.b))

    const formattedHex = hex
    const formattedRGB = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const formattedHSL = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    const formattedText = grayscale > 150 ? '000000' : 'FFFFFF'

    return { hex, rgb, hsl, grayscale, formattedHex, formattedRGB, formattedHSL, formattedText }
  }

  static random () {
    const h = Math.round(Math.random() * 359)
    const s = Math.round(Math.random() * 100)
    const l = Math.round(Math.random() * 100)

    return Colors.buildHSL(h, s, l)
  }

  static hexToRGB (hex) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5), 16)

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

  static rgbToHSL (rgb) {
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

    h = Math.round(h)
    h = h < 0 ? 360 + h : h
    s = Math.round(s * 100)
    l = Math.round(l * 100)

    return { h, s, l }
  }

  static hue (color, value) {
    let h = Number(color.hsl.h) + Number(value)
    h %= 360
    h = h < 0 ? 360 + h : h

    return Colors.buildHSL(h, color.hsl.s, color.hsl.l)
  }

  static saturation (color, value) {
    let s = Number(color.hsl.s) + Number(value)
    s = s <= 100 ? s : 100
    s = s >= 0 ? s : 0

    return Colors.buildHSL(color.hsl.h, s, color.hsl.l)
  }

  static lightness (color, value) {
    let l = Number(color.hsl.l) + Number(value)
    l = l <= 100 ? l : 100
    l = l >= 0 ? l : 0

    return Colors.buildHSL(color.hsl.h, color.hsl.s, l)
  }

  static hues (color, degrees, value) {
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

  static saturations (color, value) {
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

  static lightnesses (color, value) {
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

  static complementary (color) {
    return [Colors.copy(color), Colors.hue(color, 180)]
  }

  static splitComplementary (color) {
    return [Colors.copy(color), Colors.hue(color, 150), Colors.hue(color, 210)]
  }

  static analogous (color) {
    return [Colors.copy(color), Colors.hue(color, 30), Colors.hue(color, 330)]
  }

  static triadic (color) {
    return [Colors.copy(color), Colors.hue(color, 120), Colors.hue(color, 240)]
  }

  static tetradic (color) {
    return [Colors.hue(color, 30), Colors.hue(color, 150), Colors.hue(color, 300), Colors.hue(color, 330)]
  }

  static square (color) {
    return [Colors.copy(color), Colors.hue(color, 90), Colors.hue(color, 180), Colors.hue(color, 270)]
  }
}

export { Colors }
