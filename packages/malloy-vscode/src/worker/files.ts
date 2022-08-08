import { URLReader } from "@malloydata/malloy";
import * as fs from "fs/promises";

export async function fetchFile(uri: string): Promise<string> {
  return await fs.readFile(uri.replace(/^file:\/\//, ""), "utf-8");
}

export class WorkerURLReader implements URLReader {
  async readURL(url: URL): Promise<string> {
    return fetchFile(url.toString());
  }
}
