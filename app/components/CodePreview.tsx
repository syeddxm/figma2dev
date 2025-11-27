interface CodePreviewProps {
  html: string;
  css: string;
}

export const CodePreview = ({ html, css }: CodePreviewProps) => {
  return (
    <div>
      <div className="results-container">
        <div className="preview-container">
          <h3>HTML Preview:</h3>
          <pre className="preview-code">
            <code className="scroll-code">{html}</code>
          </pre>
        </div>

        <div className="preview-container">
          <h3>CSS Preview:</h3>
          <pre className="preview-code">
            <code className="scroll-code">{css}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
