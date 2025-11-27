import { useState } from "react";
import { CodePreview } from "./CodePreview";
import { PreviewIframe } from "./PreviewIframe";

interface ResultsDisplayProps {
  html: string;
  componentHtml: string;
  css: string;
  htmlFilename: string;
  cssFilename: string;
}

type TabOptions = "code" | "preview";

export const ResultsDisplay = ({
  html,
  css,
  htmlFilename,
  cssFilename,
  componentHtml,
}: ResultsDisplayProps) => {
  const [tab, setTab] = useState<TabOptions>("code");

  const toggleTab = () => {
    if (tab === "code") {
      setTab("preview");
      return;
    }
    setTab("code");
  };

  const handleDownloadBoth = () => {
    const htmlLink = document.createElement("a");
    htmlLink.href = `/download?file=${htmlFilename}`;
    htmlLink.download = htmlFilename;
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);

    setTimeout(() => {
      const cssLink = document.createElement("a");
      cssLink.href = `/download?file=${cssFilename}`;
      cssLink.download = cssFilename;
      document.body.appendChild(cssLink);
      cssLink.click();
      document.body.removeChild(cssLink);
    }, 100);
  };

  return (
    <>
      <p>Files generated!</p>
      <div className="files-buttons">
        <button onClick={handleDownloadBoth}>Download Both Files</button>
        <button onClick={toggleTab}>
          {tab === "code" ? "Preview Output" : "View Html and CSS"}
        </button>
      </div>
      {tab === "code" && <CodePreview html={html} css={css} />}
      {tab === "preview" && <PreviewIframe html={componentHtml} css={css} />}
    </>
  );
};
