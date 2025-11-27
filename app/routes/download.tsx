import type { LoaderFunctionArgs } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filename = url.searchParams.get("file");

  if (!filename) {
    throw new Response("No file specified", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "temp", filename);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");

    await fs.unlink(filePath);

    return new Response(fileContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    throw new Response("File not found", { status: 404 });
  }
}
