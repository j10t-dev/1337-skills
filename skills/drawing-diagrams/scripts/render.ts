import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { PeleError, render, type RenderOptions, type TextMeasurer } from "pele";

/** Renders the Mermaid file named in args to a blueprint SVG beside it, prints the SVG's absolute path and returns the exit code. */
export async function main(args: string[]): Promise<number> {
  try {
    const request = parseRequest(args);
    const source = await readText(request.diagram);
    const extraCss = await Promise.all(request.css.map(readText));
    const themeCss = await Bun.file(new URL("./theme.css", import.meta.url)).text();
    const svg = renderOrDiagnose(request.diagram, source, themeCss, extraCss);
    const output = svgPathFor(request.diagram);
    await writeText(output, svg);
    console.log(output);
    return EXIT.success;
  } catch (error) {
    if (!(error instanceof CommandFailure)) throw error;
    console.error(error.message);
    return error.exitCode;
  }
}

function parseRequest(args: string[]): RenderRequest {
  const { values, positionals } = parseCommandLine(args);
  const [diagram, ...others] = positionals;
  if (diagram === undefined) throw usageFailure("No diagram file given.");
  if (others.length > 0) throw usageFailure(`Give one diagram file; got ${positionals.length}.`);
  return { diagram, css: values.css ?? [] };
}

function parseCommandLine(args: string[]) {
  try {
    return parseArgs({ args, options: { css: { type: "string", multiple: true } }, allowPositionals: true, strict: true });
  } catch (error) {
    if (!isParseArgsError(error)) throw error;
    throw usageFailure(error.message);
  }
}

async function readText(file: string): Promise<string> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (!isFileSystemError(error)) throw error;
    throw fileFailure("read", file, error);
  }
}

function renderOrDiagnose(file: string, source: string, themeCss: string, extraCss: readonly string[]): string {
  try {
    return renderThemedSvg(source, themeCss, extraCss);
  } catch (error) {
    if (!(error instanceof PeleError)) throw error;
    throw new CommandFailure(EXIT.peleError, peleDiagnostic(file, error));
  }
}

/** The diagram as a standalone blueprint SVG: leading <style> with themeCss then extraCss, then paper and grid. Throws PeleError. */
export function renderThemedSvg(source: string, themeCss: string, extraCss: readonly string[]): string {
  const { svg } = render(source, RENDER_OPTIONS);
  const opening = SVG_OPENING_TAG.exec(svg)?.[0];
  if (opening === undefined) throw new Error("Pele returned markup that does not start with an <svg> tag.");
  const style = `<style><![CDATA[\n${[themeCss, ...extraCss].join("\n")}\n]]></style>`;
  return opening + style + PAPER + svg.slice(opening.length);
}

function svgPathFor(diagram: string): string {
  const { dir, name } = path.parse(path.resolve(diagram));
  return path.join(dir, `${name}.svg`);
}

async function writeText(file: string, text: string): Promise<void> {
  try {
    await writeFile(file, text);
  } catch (error) {
    if (!isFileSystemError(error)) throw error;
    throw fileFailure("write", file, error);
  }
}

function peleDiagnostic(file: string, error: PeleError): string {
  const message = withoutFullStop(error.message);
  switch (error.code) {
    case "limit":
      return `Pele could not render ${file} (limit): ${message}. Split the diagram or remove detail, then run render again.`;
    case "unsupported-diagram":
      return `Pele could not render ${file} (unsupported-diagram): ${message}. Use a diagram type Pele supports; see https://pele.run.`;
    case "syntax":
    case "semantic":
      return error.line > 0
        ? locatedDiagnostic(file, error)
        : `Pele could not render ${file} (${error.code}): ${message}. Fix the Mermaid and run render again.`;
  }
}

function locatedDiagnostic(file: string, error: PeleError): string {
  const firstLine = error.message.split("\n")[0] ?? "";
  return [
    `Pele could not render ${file} at line ${error.line}, column ${error.column} (${error.code}): ${firstLine}`,
    error.snippet,
    "Fix the Mermaid at that line and run render again.",
  ].join("\n");
}

function withoutFullStop(text: string): string {
  return text.replace(/\.$/, "");
}

function usageFailure(problem: string): CommandFailure {
  return new CommandFailure(EXIT.cannotRun, `${problem}\n${USAGE}`);
}

function fileFailure(operation: "read" | "write", file: string, error: Error): CommandFailure {
  return new CommandFailure(EXIT.cannotRun, `render could not ${operation} ${file}: ${error.message}. Check the path and run render again.`);
}

function isParseArgsError(error: unknown): error is TypeError {
  return error instanceof TypeError && "code" in error && typeof error.code === "string" && error.code.startsWith("ERR_PARSE_ARGS_");
}

function isFileSystemError(error: unknown): error is Error {
  return error instanceof Error && "code" in error && typeof error.code === "string";
}

/** An expected failure that ends the command with its own exit code and message. */
class CommandFailure extends Error {
  readonly exitCode: number;

  constructor(exitCode: number, message: string) {
    super(message);
    this.exitCode = exitCode;
  }
}

type RenderRequest = { diagram: string; css: string[] };

const EXIT = { success: 0, cannotRun: 2, peleError: 3 } as const;

const USAGE = "Usage: render <diagram.mmd> [--css <file.css>]...";

/** JetBrains Mono advances 0.6 em per character; double-width characters are undersized. */
const monospaceMeasurer: TextMeasurer = { width: (text, size) => [...text].length * size * 0.6 };

const RENDER_OPTIONS = {
  fontFamily: '"JetBrains Mono", monospace',
  measurer: monospaceMeasurer,
  padding: 16,
  limit: 1_000_000,
  outputLimit: 8_000_000,
  maxEdges: 10_000,
} satisfies RenderOptions;

const SVG_OPENING_TAG = /^<svg\b[^>]*>/;

const PAPER =
  '<rect width="100%" height="100%" fill="url(#blueprint-grid)"/>' +
  '<defs><pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">' +
  '<rect width="20" height="20" fill="var(--blueprint-paper)"/>' +
  '<path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--blueprint-grid)"/>' +
  "</pattern></defs>";

if (import.meta.main) process.exitCode = await main(Bun.argv.slice(2));
