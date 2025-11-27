import { FrameNode } from "@figma/rest-api-spec";
import { useFigmaNode, FigmaNodeProps } from "~/hooks/useFigmaNode";
import { renderFigmaNode } from "~/lib/FigmaNodeRenderer";

export const FigmaFrame: React.FC<FigmaNodeProps<FrameNode>> = ({
  node,
  parent,
}) => {
  const { className, cssGenerator } = useFigmaNode(node, parent);

  const frameClasses = [className];

  if (node.fills) {
    frameClasses.push(cssGenerator?.addColorFromFill(node.fills));
  }
  if (node.cornerRadius || node.rectangleCornerRadii) {
    frameClasses.push(
      cssGenerator?.addCornerRadius(
        node.cornerRadius,
        node.rectangleCornerRadii
      )
    );
  }
  if (node.clipsContent) {
    frameClasses.push(cssGenerator.addClipsContent(node.clipsContent));
  }

  const hasAutoLayout = node.layoutMode && node.layoutMode !== "NONE";

  if (hasAutoLayout) {
    if (
      node.paddingLeft ||
      node.paddingTop ||
      node.paddingRight ||
      node.paddingBottom
    ) {
      frameClasses.push(
        cssGenerator.addPadding(
          node.paddingLeft,
          node.paddingTop,
          node.paddingRight,
          node.paddingBottom
        )
      );
    }

    frameClasses.push(cssGenerator.addFlex(node.layoutMode));

    if (node.layoutWrap) {
      frameClasses.push(cssGenerator.addWrap(node.layoutWrap));
    }
    if (node.itemSpacing) {
      frameClasses.push(cssGenerator.addItemSpacing(node.itemSpacing));
    }
    if (node.primaryAxisAlignItems || node.counterAxisAlignItems) {
      frameClasses.push(
        cssGenerator.addAlignment(
          node.primaryAxisAlignItems,
          node.counterAxisAlignItems
        )
      );
    }
  }

  if (!hasAutoLayout && node.children && node.children.length > 0) {
    frameClasses.push(cssGenerator.addPosition("relative"));
  }

  const children = node.children.map((child, childIndex) =>
    renderFigmaNode(child, childIndex, node.children, node)
  );

  return (
    <div className={`figma-frame ${frameClasses.join(" ")}`}>{children}</div>
  );
};
