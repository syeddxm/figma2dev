import { GetFileResponse } from "@figma/rest-api-spec";
import mockResponse from "~/mockResponse.json";
import { BASE_FIGMA } from "~/utils/constants";

export const getFigmaFile = async (token: string, file: string): Promise<GetFileResponse> => {
  if (!token) throw new Error("Missing access token");
  if (!file) throw new Error("Missing file");

  if (token === "demo" && file === "demo") {
    return mockResponse as GetFileResponse;
  }

  try {
    const headers = new Headers();
    headers.append("X-Figma-Token", token);
    const response = await fetch(`${BASE_FIGMA}/v1/files/${file}`, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Figma API error response:", errorText);
      throw new Error(`Figma API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json() as GetFileResponse;
  } catch (error) {
    console.error("Error fetching from Figma API:", error);
    throw error;
  }
};
