import { Node } from "@figma/rest-api-spec";
import { useFigmaNode, FigmaNodeProps } from "~/hooks/useFigmaNode";

type RectangleNode = Extract<Node, { type: "RECTANGLE" }>;

export const FigmaRectangle: React.FC<FigmaNodeProps<RectangleNode>> = ({ 
  node, 
  parent 
}) => {
  const { className, cssGenerator } = useFigmaNode(node, parent);

  const rectangleClasses = [className];
  
  if (node.fills) {
    rectangleClasses.push(cssGenerator?.addColorFromFill(node.fills));
  }
  if (node.cornerRadius) {
    rectangleClasses.push(cssGenerator.addCornerRadius(node.cornerRadius));
  }
  if (node.absoluteBoundingBox) {
    rectangleClasses.push(
      cssGenerator.addDimensions(
        node.absoluteBoundingBox.width,
        node.absoluteBoundingBox.height
      )
    );
  }

  return <div className={`figma-rectangle ${rectangleClasses.join(" ")}`} />;
};
