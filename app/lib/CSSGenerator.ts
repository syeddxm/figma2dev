import type {
  RGB,
  RGBA,
  Paint,
  FrameNode,
  TextNode,
} from "@figma/rest-api-spec";
import { generateRandomId } from "~/utils/figmaUtils";

export class CSSGenerator {
  private css: Record<string, Map<string, string | Object>> = {
    background: new Map(),
    border: new Map(),
    "border-radius": new Map(),
    opacity: new Map(),
    overflow: new Map(),
    "min-width": new Map(),
    "max-width": new Map(),
    "min-height": new Map(),
    "max-height": new Map(),
    flex: new Map(),
    "flex-wrap": new Map(),
    padding: new Map(),
    width: new Map(),
    height: new Map(),
    gap: new Map(),
    textStyle: new Map(),
    color: new Map(),
    position: new Map(),
    left: new Map(),
    top: new Map(),
  };

  private colorToClassMap: Map<string, string> = new Map();
  private textStyleToClassMap: Map<string, string> = new Map();
  private gradientToClassMap: Map<string, string> = new Map();
  private borderToClassMap: Map<string, string> = new Map();
  private radiusToClassMap: Map<string, string> = new Map();

  private getOrCreateClass = (
    map: Map<string, string>,
    key: string,
    prefix: string
  ): string => {
    let className = map.get(key);
    if (!className) {
      const random = generateRandomId();
      className = `${prefix}-${random}`;
      map.set(key, className);
    }
    return className;
  };

  private getColorAsString = (color: RGBA | RGB) => {
    const alpha = (color as RGBA).a;
    if (alpha === undefined || alpha === 1) {
      return `rgb(${Math.round(color.r * 255)}, ${Math.round(
        color.g * 255
      )}, ${Math.round(color.b * 255)})`;
    } else {
      return `rgba(${Math.round(color.r * 255)}, ${Math.round(
        color.g * 255
      )}, ${Math.round(color.b * 255)}, ${alpha})`;
    }
  };

  private getColorKey = (color: RGBA | RGB): string => {
    const alpha = (color as RGBA).a ?? 1;
    return `${Math.round(color.r * 255)}-${Math.round(
      color.g * 255
    )}-${Math.round(color.b * 255)}-${alpha}`;
  };

  addBackgroundColor = (color: RGBA | RGB) => {
    const colorKey = this.getColorKey(color);
    const className = this.getOrCreateClass(
      this.colorToClassMap,
      colorKey,
      "bg-color"
    );
    this.css["background"].set(className, this.getColorAsString(color));
    return className;
  };

  addColorFromFill = (fillPaints: Paint[]) => {
    let className: string = "";
    fillPaints.forEach((fillPaint) => {
      if (fillPaint.type === "SOLID") {
        className = this.addBackgroundColor(fillPaint.color);
      }
      if (fillPaint.type === "GRADIENT_LINEAR") {
        className = this.addGradient(fillPaint);
      }
    });
    return className;
  };

  addGradient = (paint: any) => {
    const stops = paint.gradientStops
      .map((stop: any) => {
        const color = this.getColorAsString(stop.color);
        return `${color} ${stop.position * 100}%`;
      })
      .join(", ");

    const gradient = `linear-gradient(135deg, ${stops})`;
    const className = this.getOrCreateClass(
      this.gradientToClassMap,
      gradient,
      "gradient"
    );
    this.css["background"].set(className, gradient);
    return className;
  };

  addTextColorFromFill = (fillPaints: Paint[]) => {
    const classNames: string[] = [];
    if (fillPaints) {
      fillPaints.forEach((fillPaint) => {
        if (fillPaint.type === "SOLID") {
          const colorKey = this.getColorKey(fillPaint.color);
          const className = this.getOrCreateClass(
            this.colorToClassMap,
            colorKey,
            "color"
          );

          classNames.push(className);
          this.css["color"].set(
            className,
            this.getColorAsString(fillPaint.color)
          );

          if (fillPaint.opacity !== undefined && fillPaint.opacity < 1) {
            const opacityClassName = this.addOpacity(fillPaint.opacity);
            classNames.push(opacityClassName);
          }
        }
      });
    }
    return classNames.join(" ");
  };

  addStrokes = (strokes: FrameNode["strokes"], strokeWeight: number = 1) => {
    const classNames: string[] = [];
    strokes?.forEach((stroke) => {
      if (stroke.type === "SOLID") {
        const colorKey = this.getColorKey(stroke.color);
        const color = this.getColorAsString(stroke.color);
        const borderKey = `${strokeWeight}-${colorKey}`;

        let className = this.borderToClassMap.get(borderKey);
        if (!className) {
          const colorClassName = this.getOrCreateClass(
            this.colorToClassMap,
            colorKey,
            "color"
          );

          const colorId = colorClassName.replace("color-", "");
          className = `border-w-${strokeWeight}px-c-${colorId}`;
          this.borderToClassMap.set(borderKey, className);
          this.css.border.set(className, `${strokeWeight}px solid ${color}`);
        }
        classNames.push(className);
      }
    });
    return classNames.join(" ");
  };

  addCornerRadius = (
    cornerRadius?: number,
    rectangleCornerRadii?: number[]
  ) => {
    let radiusKey: string;
    let radiusValue: string;
    let className: string;

    if (cornerRadius !== undefined) {
      radiusKey = `${cornerRadius}`;
      radiusValue = `${cornerRadius}px`;
      className = `border-radius-${cornerRadius}px`;
      this.radiusToClassMap.set(radiusKey, className);
    } else if (rectangleCornerRadii) {
      radiusKey = rectangleCornerRadii.join("-");
      radiusValue = rectangleCornerRadii
        .map((radius) => `${radius}px`)
        .join(" ");

      className = this.getOrCreateClass(
        this.radiusToClassMap,
        radiusKey,
        "border-radius"
      );
    } else {
      return "";
    }

    this.css["border-radius"].set(className, radiusValue);
    return className;
  };

  addOpacity = (opacity?: number) => {
    if (!opacity || opacity === 1) return "";

    const opacityValue = Math.round(opacity * 100) / 100;
    const classNameValue = opacityValue.toString().replace(".", "-");
    const className = `opacity-${classNameValue}`;
    this.css["opacity"].set(className, `${opacityValue}`);
    return className;
  };

  addMinMaxWidthHeight = (
    minWidth?: number,
    maxWidth?: number,
    minHeight?: number,
    maxHeight?: number
  ) => {
    const classNames: string[] = [];
    if (minWidth) {
      let className = `min-w-${minWidth}px`;
      classNames.push(className);
      this.css["min-width"].set(className, `${minWidth}px`);
    }

    if (maxWidth) {
      let className = `max-w-${maxWidth}px`;
      classNames.push(className);
      this.css["max-width"].set(className, `${maxWidth}px`);
    }

    if (minHeight) {
      let className = `min-h-${minHeight}px`;
      classNames.push(className);
      this.css["min-height"].set(className, `${minHeight}px`);
    }

    if (maxHeight) {
      let className = `max-h-${maxHeight}px`;
      classNames.push(className);
      this.css["max-height"].set(className, `${maxHeight}px`);
    }
    return classNames.join(" ");
  };

  addClipsContent = (clipsContent: boolean) => {
    if (clipsContent) {
      const className = `overflow-hidden`;
      this.css["overflow"].set(className, "hidden");
      return className;
    }
    return "";
  };

  addPadding = (
    paddingLeft: number = 0,
    paddingTop: number = 0,
    paddingRight: number = 0,
    paddingBottom: number = 0
  ) => {
    let className = `padding-`;
    const paddings = [paddingTop, paddingRight, paddingBottom, paddingLeft];
    const paddingsStr = paddings.map((padding) => `${padding}px`);

    className += paddingsStr.join("-");
    const style = paddingsStr.join(" ");

    this.css["padding"].set(className, style);
    return className;
  };

  addFlex = (layoutMode: FrameNode["layoutMode"]) => {
    let className = `flex-`;
    let style: Record<string, string> = {
      display: "flex",
    };

    if (layoutMode === "HORIZONTAL") {
      className += "horizontal";
      style["flex-direction"] = "row";
    }
    if (layoutMode === "VERTICAL") {
      className += "vertical";
      style["flex-direction"] = "column";
    }

    this.css["flex"].set(className, style);
    return className;
  };

  addWrap = (layoutWrap: FrameNode["layoutWrap"]) => {
    let className = `flex-wrap-`;
    let style = "";
    if (layoutWrap === "WRAP") {
      className += "wrap";
      style = "wrap";
    }
    if (layoutWrap === "NO_WRAP") {
      className += "nowrap";
      style = "nowrap";
    }
    this.css["flex-wrap"].set(className, style);
    return className;
  };

  addSizingHorizontal = (
    layoutSizingHorizontal: FrameNode["layoutSizingHorizontal"]
  ) => {
    let className = "width-";
    if (layoutSizingHorizontal === "FILL") {
      className += "full";
      this.css["width"].set(className, "100%");
    }
    if (layoutSizingHorizontal === "HUG") {
      className += "fit-content";
      this.css["width"].set(className, "fit-content");
    }
    return className;
  };

  addSizingVertical = (
    layoutSizingVertical: FrameNode["layoutSizingVertical"]
  ) => {
    let className = "height-";
    if (layoutSizingVertical === "FILL") {
      className += "full";
      this.css["height"].set(className, "100%");
    }
    if (layoutSizingVertical === "HUG") {
      className += "fit-content";
      this.css["height"].set(className, "fit-content");
    }
    return className;
  };

  addItemSpacing = (itemSpacing: FrameNode["itemSpacing"]) => {
    let className = "spacing-";
    if (itemSpacing) {
      className += `${itemSpacing}px`;
      this.css["gap"].set(className, `${itemSpacing}px`);
    }
    return className;
  };

  addFontStyle = (textStyle: TextNode["style"]) => {
    const styleKey = JSON.stringify(textStyle);
    const className = this.getOrCreateClass(
      this.textStyleToClassMap,
      styleKey,
      "text"
    );

    if (!this.css["textStyle"].has(className)) {
      const style: Record<string, string> = {};

      if (textStyle.fontFamily) style["font-family"] = textStyle.fontFamily;
      if (textStyle.fontWeight)
        style["font-weight"] = `${textStyle.fontWeight}`;
      if (textStyle.fontSize) style["font-size"] = `${textStyle.fontSize}px`;
      if (textStyle.textAlignHorizontal) {
        let textAlign = textStyle.textAlignHorizontal.toLowerCase();
        if (textAlign === "justified") textAlign = "justify";
        style["text-align"] = textAlign;
      }
      if (textStyle.letterSpacing)
        style["letter-spacing"] = `${textStyle.letterSpacing}px`;
      if (textStyle.lineHeightUnit === "FONT_SIZE_%") {
        style["line-height"] = `${textStyle.lineHeightPercentFontSize}%`;
      }
      if (textStyle.lineHeightUnit === "INTRINSIC_%") {
        style["line-height"] = `${textStyle.lineHeightPercent}%`;
      }
      if (textStyle.lineHeightUnit === "PIXELS") {
        style["line-height"] = `${textStyle.lineHeightPx}px`;
      }

      this.css["textStyle"].set(className, style);
    }

    return className;
  };

  addDimensions = (width?: number, height?: number) => {
    const classNames: string[] = [];

    if (width) {
      const className = `width-${Math.round(width)}px`;
      classNames.push(className);
      this.css["width"].set(className, `${Math.round(width)}px`);
    }

    if (height) {
      const className = `height-${Math.round(height)}px`;
      classNames.push(className);
      this.css["height"].set(className, `${Math.round(height)}px`);
    }

    return classNames.join(" ");
  };

  addAlignment = (
    primaryAxisAlignItems?: FrameNode["primaryAxisAlignItems"],
    counterAxisAlignItems?: FrameNode["counterAxisAlignItems"]
  ) => {
    const classNames: string[] = [];

    if (primaryAxisAlignItems) {
      const className = `justify-${primaryAxisAlignItems.toLowerCase()}`;
      classNames.push(className);

      let justifyContent = "";
      if (primaryAxisAlignItems === "MIN") justifyContent = "flex-start";
      if (primaryAxisAlignItems === "CENTER") justifyContent = "center";
      if (primaryAxisAlignItems === "MAX") justifyContent = "flex-end";
      if (primaryAxisAlignItems === "SPACE_BETWEEN")
        justifyContent = "space-between";

      if (!this.css["flex"].has(className)) {
        this.css["flex"].set(className, { "justify-content": justifyContent });
      }
    }

    if (counterAxisAlignItems) {
      const className = `align-${counterAxisAlignItems.toLowerCase()}`;
      classNames.push(className);

      let alignItems = "";
      if (counterAxisAlignItems === "MIN") alignItems = "flex-start";
      if (counterAxisAlignItems === "CENTER") alignItems = "center";
      if (counterAxisAlignItems === "MAX") alignItems = "flex-end";

      if (!this.css["flex"].has(className)) {
        this.css["flex"].set(className, { "align-items": alignItems });
      }
    }

    return classNames.join(" ");
  };

  addPosition = (position: "relative" | "absolute") => {
    const className = `pos-${position}`;
    this.css["position"].set(className, position);
    return className;
  };

  addAbsolutePosition = (left: number, top: number) => {
    const roundedLeft = Math.round(left * 100) / 100;
    const roundedTop = Math.round(top * 100) / 100;

    const posClass = "pos-absolute";
    this.css["position"].set(posClass, "absolute");

    const leftClass = `left-${roundedLeft}px`;
    this.css["left"].set(leftClass, `${roundedLeft}px`);

    const topClass = `top-${roundedTop}px`;
    this.css["top"].set(topClass, `${roundedTop}px`);

    return `${posClass} ${leftClass} ${topClass}`;
  };

  addDocumentContainer = () => {
    const className = "figma-document";

    this.css["flex"].set(className, {
      display: "flex",
      "justify-content": "center",
    });

    this.css["width"].set(className, "100vw");
    this.css["height"].set(className, "100vh");

    return className;
  };

  getCss = () => {
    return this.css;
  };
}
