# Specify Design Token Format

This generated document describes the format of the supported design tokens and their aliasing capabilities.
## Token types

### string
Shape:
```
"string" or "hexadecimalColorString"
```

### number
Shape:
```
"number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
```

### boolean
Shape:
```
"boolean"
```

### null
Shape:
```
"null"
```

### array
Shape:
```
"array"
```

### object
Shape:
```
"object"
```

### integerNumber
Shape:
```
"integerNumber" or "positiveIntegerNumber"
```

### zeroToOneNumber
Shape:
```
"zeroToOneNumber"
```

### arcDegreeNumber
Shape:
```
"arcDegreeNumber"
```

### rgbColorNumber
Shape:
```
"rgbColorNumber"
```

### positiveNumber
Shape:
```
"positiveNumber" or "zeroToOneNumber" or "positiveIntegerNumber"
```

### positiveIntegerNumber
Shape:
```
"positiveIntegerNumber"
```

### percentageNumber
Shape:
```
"percentageNumber"
```

### hexadecimalColorString
Shape:
```
"hexadecimalColorString"
```

### bitmap
Shape:
```
"bitmap" or {
  url: "string",
  format: "bitmapFormat",
  width: "positiveIntegerNumber",
  height: "positiveIntegerNumber",
  variationLabel: "string"
}
```

### bitmapFormat
Shape:
```
"bitmapFormat"
```

### blur
Shape:
```
"blur" or "dimension" or {
  unit: "dimensionUnit",
  value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
}
```

### border
Shape:
```
"border" or {
  color: "color",
  style: "borderStyle",
  width: "dimension",
  rectangleCornerRadii: "radii" or ["radius"] or ["radius", "radius"] or ["radius", "radius", "radius"] or ["radius", "radius", "radius", "radius"]
}
```

### borderStyle
Shape:
```
"borderStyle"
```

### borderStyleLineCap
Shape:
```
"borderStyleLineCap"
```

### breakpoint
Shape:
```
"breakpoint" or "dimension" or {
  unit: "dimensionUnit",
  value: "number"
}
```

### color
Shape:
```
"color" or {
  model: literal("hex"),
  hex: "hexadecimalColorString",
  alpha: "zeroToOneNumber" or "opacity"
} or {
  model: literal("rgb"),
  red: "rgbColorNumber",
  green: "rgbColorNumber",
  blue: "rgbColorNumber",
  alpha: "zeroToOneNumber" or "opacity"
} or {
  model: literal("hsl"),
  hue: "arcDegreeNumber",
  saturation: "percentageNumber",
  lightness: "percentageNumber",
  alpha: "zeroToOneNumber" or "opacity"
} or {
  model: literal("hsb"),
  hue: "arcDegreeNumber",
  saturation: "percentageNumber",
  brightness: "percentageNumber",
  alpha: "zeroToOneNumber" or "opacity"
} or {
  model: literal("lch"),
  lightness: "percentageNumber",
  chroma: "positiveNumber",
  hue: "arcDegreeNumber",
  alpha: "zeroToOneNumber" or "opacity"
} or {
  model: literal("lab"),
  lightness: "percentageNumber",
  aAxis: "number",
  bAxis: "number",
  alpha: "zeroToOneNumber" or "opacity"
}
```

### cubicBezier
Shape:
```
"cubicBezier"
```

### dimension
Shape:
```
"dimension" or {
  unit: "dimensionUnit",
  value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
}
```

### dimensionUnit
Shape:
```
"dimensionUnit"
```

### duration
Shape:
```
"duration" or {
  value: "positiveNumber",
  unit: "durationUnit"
}
```

### durationUnit
Shape:
```
"durationUnit"
```

### font
Shape:
```
"font" or {
  family: "fontFamily",
  postScriptName: "string",
  weight: "fontWeight",
  style: "fontStyle",
  files: Array<{
    url: "string",
    format: "fontFormat",
    provider: literal("external") or literal("Specify") or literal("Google Fonts") or literal("Adobe Fonts")
  }>
}
```

### fontFamily
Shape:
```
"fontFamily"
```

### fontFeature
Shape:
```
"fontFeature"
```

### fontFeatures
Shape:
```
"fontFeatures" or Array<"fontFeature">
```

### fontFormat
Shape:
```
"fontFormat"
```

### fontStyle
Shape:
```
"fontStyle"
```

### fontWeight
Shape:
```
"fontWeight"
```

### gradient
Shape:
```
"gradient" or {
  type: literal("linear"),
  angle: "arcDegreeNumber",
  colorStops: Array<{
    color: "color" or {
      model: literal("hex"),
      hex: "hexadecimalColorString",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("rgb"),
      red: "rgbColorNumber",
      green: "rgbColorNumber",
      blue: "rgbColorNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsl"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      lightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsb"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      brightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lch"),
      lightness: "percentageNumber",
      chroma: "positiveNumber",
      hue: "arcDegreeNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lab"),
      lightness: "percentageNumber",
      aAxis: "number",
      bAxis: "number",
      alpha: "zeroToOneNumber" or "opacity"
    },
    position: "zeroToOneNumber"
  }>
} or {
  type: literal("radial"),
  position: "string",
  colorStops: Array<{
    color: "color" or {
      model: literal("hex"),
      hex: "hexadecimalColorString",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("rgb"),
      red: "rgbColorNumber",
      green: "rgbColorNumber",
      blue: "rgbColorNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsl"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      lightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsb"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      brightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lch"),
      lightness: "percentageNumber",
      chroma: "positiveNumber",
      hue: "arcDegreeNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lab"),
      lightness: "percentageNumber",
      aAxis: "number",
      bAxis: "number",
      alpha: "zeroToOneNumber" or "opacity"
    },
    position: "zeroToOneNumber"
  }>
} or {
  type: literal("conic"),
  angle: "arcDegreeNumber",
  position: "string",
  colorStops: Array<{
    color: "color" or {
      model: literal("hex"),
      hex: "hexadecimalColorString",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("rgb"),
      red: "rgbColorNumber",
      green: "rgbColorNumber",
      blue: "rgbColorNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsl"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      lightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsb"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      brightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lch"),
      lightness: "percentageNumber",
      chroma: "positiveNumber",
      hue: "arcDegreeNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lab"),
      lightness: "percentageNumber",
      aAxis: "number",
      bAxis: "number",
      alpha: "zeroToOneNumber" or "opacity"
    },
    position: "zeroToOneNumber"
  }>
}
```

### gradients
Shape:
```
"gradients" or Array<"gradient" or {
  type: literal("linear"),
  angle: "arcDegreeNumber",
  colorStops: Array<{
    color: "color" or {
      model: literal("hex"),
      hex: "hexadecimalColorString",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("rgb"),
      red: "rgbColorNumber",
      green: "rgbColorNumber",
      blue: "rgbColorNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsl"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      lightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsb"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      brightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lch"),
      lightness: "percentageNumber",
      chroma: "positiveNumber",
      hue: "arcDegreeNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lab"),
      lightness: "percentageNumber",
      aAxis: "number",
      bAxis: "number",
      alpha: "zeroToOneNumber" or "opacity"
    },
    position: "zeroToOneNumber"
  }>
} or {
  type: literal("radial"),
  position: "string",
  colorStops: Array<{
    color: "color" or {
      model: literal("hex"),
      hex: "hexadecimalColorString",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("rgb"),
      red: "rgbColorNumber",
      green: "rgbColorNumber",
      blue: "rgbColorNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsl"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      lightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsb"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      brightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lch"),
      lightness: "percentageNumber",
      chroma: "positiveNumber",
      hue: "arcDegreeNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lab"),
      lightness: "percentageNumber",
      aAxis: "number",
      bAxis: "number",
      alpha: "zeroToOneNumber" or "opacity"
    },
    position: "zeroToOneNumber"
  }>
} or {
  type: literal("conic"),
  angle: "arcDegreeNumber",
  position: "string",
  colorStops: Array<{
    color: "color" or {
      model: literal("hex"),
      hex: "hexadecimalColorString",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("rgb"),
      red: "rgbColorNumber",
      green: "rgbColorNumber",
      blue: "rgbColorNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsl"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      lightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("hsb"),
      hue: "arcDegreeNumber",
      saturation: "percentageNumber",
      brightness: "percentageNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lch"),
      lightness: "percentageNumber",
      chroma: "positiveNumber",
      hue: "arcDegreeNumber",
      alpha: "zeroToOneNumber" or "opacity"
    } or {
      model: literal("lab"),
      lightness: "percentageNumber",
      aAxis: "number",
      bAxis: "number",
      alpha: "zeroToOneNumber" or "opacity"
    },
    position: "zeroToOneNumber"
  }>
}>
```

### opacity
Shape:
```
"opacity" or "zeroToOneNumber"
```

### radii
Shape:
```
"radii" or ["radius"] or ["radius", "radius"] or ["radius", "radius", "radius"] or ["radius", "radius", "radius", "radius"]
```

### radius
Shape:
```
"radius" or "dimension" or {
  unit: "dimensionUnit",
  value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
}
```

### shadow
Shape:
```
"shadow" or {
  color: "color" or {
    model: literal("hex"),
    hex: "hexadecimalColorString",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("rgb"),
    red: "rgbColorNumber",
    green: "rgbColorNumber",
    blue: "rgbColorNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("hsl"),
    hue: "arcDegreeNumber",
    saturation: "percentageNumber",
    lightness: "percentageNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("hsb"),
    hue: "arcDegreeNumber",
    saturation: "percentageNumber",
    brightness: "percentageNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("lch"),
    lightness: "percentageNumber",
    chroma: "positiveNumber",
    hue: "arcDegreeNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("lab"),
    lightness: "percentageNumber",
    aAxis: "number",
    bAxis: "number",
    alpha: "zeroToOneNumber" or "opacity"
  },
  offsetX: "dimension",
  offsetY: "dimension",
  blurRadius: "blur" or "radius" or "dimension",
  spreadRadius: "blur" or "radius" or "dimension",
  type: "shadowType"
}
```

### shadows
Shape:
```
"shadows" or Array<"shadow" or {
  color: "color" or {
    model: literal("hex"),
    hex: "hexadecimalColorString",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("rgb"),
    red: "rgbColorNumber",
    green: "rgbColorNumber",
    blue: "rgbColorNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("hsl"),
    hue: "arcDegreeNumber",
    saturation: "percentageNumber",
    lightness: "percentageNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("hsb"),
    hue: "arcDegreeNumber",
    saturation: "percentageNumber",
    brightness: "percentageNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("lch"),
    lightness: "percentageNumber",
    chroma: "positiveNumber",
    hue: "arcDegreeNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("lab"),
    lightness: "percentageNumber",
    aAxis: "number",
    bAxis: "number",
    alpha: "zeroToOneNumber" or "opacity"
  },
  offsetX: "dimension",
  offsetY: "dimension",
  blurRadius: "blur" or "radius" or "dimension",
  spreadRadius: "blur" or "radius" or "dimension",
  type: "shadowType"
}>
```

### shadowType
Shape:
```
"shadowType"
```

### spacing
Shape:
```
"spacing" or "dimension" or {
  unit: "dimensionUnit",
  value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
}
```

### spacings
Shape:
```
"spacings" or ["spacing"] or ["spacing", "spacing"] or ["spacing", "spacing", "spacing"] or ["spacing", "spacing", "spacing", "spacing"]
```

### stepsTimingFunction
Shape:
```
"stepsTimingFunction" or {
  stepsCount: "positiveIntegerNumber",
  jumpTerm: literal("start") or literal("end") or literal("jump-start") or literal("jump-end") or literal("jump-none") or literal("jump-both")
}
```

### textAlignHorizontal
Shape:
```
"textAlignHorizontal"
```

### textAlignVertical
Shape:
```
"textAlignVertical"
```

### textDecoration
Shape:
```
"textDecoration"
```

### textStyle
Shape:
```
"textStyle" or {
  font: "font" or {
    family: "fontFamily",
    postScriptName: "string",
    weight: "fontWeight",
    style: "fontStyle",
    files: Array<{
      url: "string",
      format: "fontFormat",
      provider: literal("external") or literal("Specify") or literal("Google Fonts") or literal("Adobe Fonts")
    }>
  },
  fontSize: "dimension" or {
    unit: "dimensionUnit",
    value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
  },
  color: "color" or {
    model: literal("hex"),
    hex: "hexadecimalColorString",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("rgb"),
    red: "rgbColorNumber",
    green: "rgbColorNumber",
    blue: "rgbColorNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("hsl"),
    hue: "arcDegreeNumber",
    saturation: "percentageNumber",
    lightness: "percentageNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("hsb"),
    hue: "arcDegreeNumber",
    saturation: "percentageNumber",
    brightness: "percentageNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("lch"),
    lightness: "percentageNumber",
    chroma: "positiveNumber",
    hue: "arcDegreeNumber",
    alpha: "zeroToOneNumber" or "opacity"
  } or {
    model: literal("lab"),
    lightness: "percentageNumber",
    aAxis: "number",
    bAxis: "number",
    alpha: "zeroToOneNumber" or "opacity"
  },
  fontFeatures: "fontFeatures" or Array<"fontFeature">,
  lineHeight: "dimension",
  letterSpacing: "dimension" or {
    unit: "dimensionUnit",
    value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
  } or "spacing" or "dimension" or {
    unit: "dimensionUnit",
    value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
  },
  paragraphSpacing: "dimension" or "spacing",
  textAlignHorizontal: "textAlignHorizontal",
  textAlignVertical: "textAlignVertical",
  textDecoration: "textDecoration",
  textIndent: "dimension" or {
    unit: "dimensionUnit",
    value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
  } or "spacing" or "dimension" or {
    unit: "dimensionUnit",
    value: "number" or "arcDegreeNumber" or "integerNumber" or "percentageNumber" or "positiveIntegerNumber" or "positiveNumber" or "rgbColorNumber" or "zeroToOneNumber"
  },
  textTransform: "textTransform"
}
```

### textTransform
Shape:
```
"textTransform"
```

### transition
Shape:
```
"transition" or {
  duration: "duration",
  delay: "duration",
  timingFunction: "cubicBezier" or "stepsTimingFunction"
}
```

### vector
Shape:
```
"vector" or {
  url: "string",
  format: "vectorFormat",
  variationLabel: "string"
}
```

### vectorFormat
Shape:
```
"vectorFormat"
```

### zIndex
Shape:
```
"zIndex" or "positiveIntegerNumber"
```
