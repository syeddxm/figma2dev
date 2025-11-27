import { useContext } from "react";
import { Node, HasLayoutTrait, MinimalStrokesTrait } from "@figma/rest-api-spec";
import { CssGeneratorContext } from "~/lib/CSSGeneratorContext";
import { convertNameToClass } from "~/utils/figmaUtils";
import { CSSGenerator } from "~/lib/CSSGenerator";

export interface FigmaNodeProps<T extends Node = Node> {
  node: T;
  index?: number;
  siblings?: Node[];
  parent?: {
    absoluteBoundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
    layoutMode?: string;
  };
}

export interface UseNodeStylesResult {
  className: string;
  cssGenerator: CSSGenerator;
}

export function useFigmaNode<T extends Node>(
  node: T,
  parent?: FigmaNodeProps<T>["parent"]
): UseNodeStylesResult {
  const cssGenerator = useContext(CssGeneratorContext);

  const classNames = [convertNameToClass(node.name)];

  const addCommonClasses = () => {
    if ("opacity" in node && node.opacity) {
      classNames.push(cssGenerator?.addOpacity(node.opacity));
    }

    if (
      "minWidth" in node ||
      "maxWidth" in node ||
      "minHeight" in node ||
      "maxHeight" in node
    ) {
      const minMaxNode = node as Node & HasLayoutTrait;
      classNames.push(
        cssGenerator?.addMinMaxWidthHeight(
          minMaxNode.minWidth,
          minMaxNode.maxWidth,
          minMaxNode.minHeight,
          minMaxNode.maxHeight
        )
      );
    }

    if ("strokes" in node && node.strokes) {
      const strokeNode = node as Node & MinimalStrokesTrait;
      classNames.push(
        cssGenerator?.addStrokes(strokeNode.strokes, strokeNode.strokeWeight)
      );
    }
  };

  const addLayoutSizing = () => {
    if (
      "layoutSizingHorizontal" in node &&
      node.layoutSizingHorizontal !== "FIXED"
    ) {
      const layoutNode = node as Node & HasLayoutTrait;
      classNames.push(
        cssGenerator.addSizingHorizontal(layoutNode.layoutSizingHorizontal)
      );
    } else if (
      "absoluteBoundingBox" in node &&
      node.absoluteBoundingBox?.width
    ) {
      classNames.push(
        cssGenerator.addDimensions(node.absoluteBoundingBox.width, undefined)
      );
    }

    if (
      "layoutSizingVertical" in node &&
      node.layoutSizingVertical !== "FIXED"
    ) {
      const layoutNode = node as Node & HasLayoutTrait;
      classNames.push(
        cssGenerator.addSizingVertical(layoutNode.layoutSizingVertical)
      );
    } else if (
      "absoluteBoundingBox" in node &&
      node.absoluteBoundingBox?.height
    ) {
      classNames.push(
        cssGenerator.addDimensions(undefined, node.absoluteBoundingBox.height)
      );
    }
  };

  const addAbsolutePositioning = () => {
    if (
      !parent?.absoluteBoundingBox ||
      !("absoluteBoundingBox" in node) ||
      !node.absoluteBoundingBox
    ) {
      return;
    }

    const parentHasLayout =
      parent &&
      "layoutMode" in parent &&
      parent.layoutMode &&
      parent.layoutMode !== "NONE";

    if (!parentHasLayout) {
      const left = node.absoluteBoundingBox.x - parent.absoluteBoundingBox.x;
      const top = node.absoluteBoundingBox.y - parent.absoluteBoundingBox.y;
      classNames.push(cssGenerator.addAbsolutePosition(left, top));
    }
  };

  addCommonClasses();
  addLayoutSizing();
  addAbsolutePositioning();

  return {
    className: classNames.join(" "),
    cssGenerator,
  };
}
