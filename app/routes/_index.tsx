import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import jsbeautify from "js-beautify";
import fs from "fs/promises";
import path from "path";
import { FigmaDocument } from "~/components/FigmaNodes/FigmaDocument";
import { getFigmaFile } from "~/.server/get-figma";
import { CssGeneratorContext } from "~/lib/CSSGeneratorContext";
import { CSSGenerator } from "~/lib/CSSGenerator";
import { generateCSSFile } from "~/.server/css-to-file";
import { FigmaInputForm } from "~/components/FigmaInputForm";
import { ErrorDisplay } from "~/components/ErrorDisplay";
import { ResultsDisplay } from "~/components/ResultsDisplay";
import { generateRandomId } from "~/utils/figmaUtils";

const cleanTempFiles = async () => {
  try {
    const tempDir = path.join(process.cwd(), "temp");
    const files = await fs.readdir(tempDir);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);

      if (stats.mtimeMs < oneHourAgo) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {}
};

export const loader = async () => {
  await cleanTempFiles();
  return {};
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const token = formData.get("token") as string;
  const fileKey = formData.get("fileKey") as string;

  try {
    const figmaFile = await getFigmaFile(token, fileKey);

    const cssGenerator = new CSSGenerator();

    const componentHtml = jsbeautify.html_beautify(
      renderToString(
        <CssGeneratorContext.Provider value={cssGenerator}>
          <FigmaDocument document={figmaFile.document} />
        </CssGeneratorContext.Provider>
      )
    );

    const cssContent = generateCSSFile(cssGenerator.getCss());

    const randomId = generateRandomId();
    const baseFilename = `syed_raza_${randomId}`;
    const htmlFilename = `${baseFilename}.html`;
    const cssFilename = `${baseFilename}.css`;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Figma Export</title>
  <link rel="stylesheet" href="${cssFilename}">
</head>
<body>
  ${componentHtml}
</body>
</html>`;

    const cssWithReset = `${cssContent}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}

p {
  margin: 0;
  padding: 0;
}
`;

    const tempDir = path.join(process.cwd(), "temp");

    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(path.join(tempDir, htmlFilename), fullHtml);
    await fs.writeFile(path.join(tempDir, cssFilename), cssWithReset);

    return json({
      success: true,
      htmlFilename,
      cssFilename,
      html: fullHtml,
      css: cssWithReset,
      componentHtml
    });
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

const Root = () => {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container">
      <FigmaInputForm />

      {actionData &&
        "error" in actionData &&
        (() => {
          const errorData = actionData as { error: string };
          return <ErrorDisplay error={errorData.error} />;
        })()}

      {actionData &&
        "html" in actionData &&
        (() => {
          return (
            <ResultsDisplay
              html={actionData.html}
              css={actionData.css}
              htmlFilename={actionData.htmlFilename}
              cssFilename={actionData.cssFilename}
              componentHtml={actionData.componentHtml}
            />
          );
        })()}
    </div>
  );
};

export default Root;
