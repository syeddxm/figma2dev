interface PreviewIframeProps {
  html: string;
  css: string;
}

export const PreviewIframe = ({ html, css }: PreviewIframeProps) => {
  const getPreviewHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
  };

  return (
    <div className="preview-iframe-container">
      <iframe
        srcDoc={getPreviewHtml()}
        title="Preview"
        className="preview-iframe"
        sandbox="allow-same-origin"
      />
    </div>
  );
};
