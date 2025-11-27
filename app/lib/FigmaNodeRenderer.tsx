import { Node } from "@figma/rest-api-spec";
import { FigmaFrame } from "~/components/FigmaNodes/FigmaFrame";
import { FigmaText } from "~/components/FigmaNodes/FigmaText";
import { FigmaRectangle } from "~/components/FigmaNodes/FigmaRectangle";
import { FigmaNodeProps } from "~/hooks/useFigmaNode";

export function renderFigmaNode(
  node: Node,
  index: number,
  siblings: Node[],
  parent: FigmaNodeProps['parent']
) {
  switch (node.type) {
    case "FRAME":
      return (
        <FigmaFrame
          key={index}
          node={node}
          index={index}
          siblings={siblings}
          parent={parent}
        />
      );
    case "TEXT":
      return (
        <FigmaText
          key={index}
          node={node}
          index={index}
          siblings={siblings}
          parent={parent}
        />
      );
    case "RECTANGLE":
      return (
        <FigmaRectangle
          key={index}
          node={node}
          index={index}
          siblings={siblings}
          parent={parent}
        />
      );
    default:
      return null;
  }
}