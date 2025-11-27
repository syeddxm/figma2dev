export const generateCSSFile = (
  css: Record<string, Map<string, string | Object>>
): string => {
  let cssContent = "";

  const fonts = new Set<string>();

  for (const [property, classMap] of Object.entries(css)) {
    if (classMap.size === 0) continue;

    for (const [className, value] of classMap.entries()) {
      if (typeof value === "string") {
        cssContent += `.${className} {\n  ${property}: ${value};\n}\n\n`;
      } else if (typeof value === "object" && value !== null) {
        cssContent += `.${className} {\n`;
        for (const [prop, val] of Object.entries(value)) {
          cssContent += `  ${prop}: ${val};\n`;

          if (prop === "font-family") {
            fonts.add(val as string);
          }
        }
        cssContent += `}\n\n`;
      }
    }
  }

  const fontImports = Array.from(fonts)
    .map(
      (font) =>
        `@import url('https://fonts.googleapis.com/css2?family=${font.replace(
          /\s+/g,
          "+"
        )}:wght@100;200;300;400;500;600;700;800;900&display=swap');`
    )
    .join("\n");

  return fontImports ? `${fontImports}\n\n${cssContent}` : cssContent;
}
