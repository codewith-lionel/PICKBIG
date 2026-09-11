import fs from "node:fs/promises";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { AppError } from "../../utils/errors.js";

export async function parseResumeFile(filePath: string, mimeType: string): Promise<string> {
  const buffer = await fs.readFile(filePath);

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new AppError(400, "Unsupported resume format");
}
