import type { DocumentNode } from "@figma/rest-api-spec";
import { FigmaFrame } from "./FigmaFrame";
import { convertNameToClass } from "~/utils/figmaUtils";
import { useContext } from "react";
import { CssGeneratorContext } from "~/lib/CSSGeneratorContext";

export const FigmaDocument: React.FC<{ document: DocumentNode }> = ({
  document,
}) => {
  const cssGenerator = useContext(CssGeneratorContext);
  const firstCanvas = document.children[0];

  cssGenerator?.addDocumentContainer();

  return (
    <div
      className={`figma-document ${convertNameToClass(
        firstCanvas.name
      )} ${cssGenerator?.addBackgroundColor(firstCanvas.backgroundColor)}`}
    >
      {firstCanvas.children.map(
        (node, index) =>
          node.type === "FRAME" && <FigmaFrame key={index} node={node} />
      )}
    </div>
  );
};
