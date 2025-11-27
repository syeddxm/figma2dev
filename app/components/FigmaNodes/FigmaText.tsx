import { TextNode } from "@figma/rest-api-spec";
import { useFigmaNode, FigmaNodeProps } from "~/hooks/useFigmaNode";

export const FigmaText: React.FC<FigmaNodeProps<TextNode>> = ({ 
  node, 
  parent 
}) => {
  const { className, cssGenerator } = useFigmaNode(node, parent);
  const textClasses = [className];
  
  if (node.style) {
    textClasses.push(cssGenerator.addFontStyle(node.style));
  }
  if (node.fills) {
    textClasses.push(cssGenerator.addTextColorFromFill(node.fills));
  }

  return (
    <p className={`figma-text ${textClasses.join(" ")}`}>
      {node.characters}
    </p>
  );
};
