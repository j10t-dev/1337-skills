import { afterEach, describe, expect, test } from "bun:test";
import { chmod, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const RENDER = path.join(import.meta.dir, "render");
const USAGE = "Usage: render <diagram.mmd> [--css <file.css>]...";

const tempDirs: string[] = [];
const lockedDirs: string[] = [];
afterEach(async () => {
  for (const dir of lockedDirs.splice(0)) await chmod(dir, 0o755);
  for (const dir of tempDirs.splice(0)) await rm(dir, { recursive: true, force: true });
});

describe("render", () => {
  describe("writing the SVG", () => {
    test("GIVEN a flowchart file WHEN it is rendered THEN the SVG is written beside it and its absolute path is printed", async () => {
      const { dir, file } = await diagramFile("flowchart LR\n  a[Cart] --> b[Paid]\n");

      const result = await runRender([file]);

      expect(result).toEqual({ exitCode: 0, stdout: `${path.join(dir, "diagram.svg")}\n`, stderr: "" });
      expect((await readdir(dir)).sort()).toEqual(["diagram.mmd", "diagram.svg"]);
    });

    test("GIVEN a rendered diagram WHEN its SVG is read THEN the theme style, the paper rect and the grid pattern lead it in that order with no CSS background", async () => {
      const { file } = await diagramFile("flowchart LR\n  a[Cart] --> b[Paid]\n");

      await runRender([file]);
      const svg = await readFile(path.join(path.dirname(file), "diagram.svg"), "utf8");

      const style = svg.indexOf("<style><![CDATA[");
      const paper = svg.indexOf('<rect width="100%" height="100%" fill="url(#blueprint-grid)"/>');
      const grid = svg.indexOf('<pattern id="blueprint-grid"');
      expect(svg.startsWith("<svg ")).toBe(true);
      expect(style).toBeGreaterThan(0);
      expect(paper).toBeGreaterThan(style);
      expect(grid).toBeGreaterThan(paper);
      expect(svg).toContain("--pele-fg: #e8f1ff;");
      expect(svg).not.toMatch(/background\s*:/);
    });

    test("GIVEN an extra CSS file WHEN the diagram is rendered with --css THEN its rules follow the theme", async () => {
      const { dir, file } = await diagramFile("flowchart LR\n  a[Cart]\n");
      const extra = path.join(dir, "extra.css");
      await writeFile(extra, ".pele .hot rect { fill: red; }\n");

      await runRender([file, "--css", extra]);
      const svg = await readFile(path.join(dir, "diagram.svg"), "utf8");

      expect(svg.indexOf(".pele .hot rect { fill: red; }")).toBeGreaterThan(svg.indexOf("--pele-fg: #e8f1ff;"));
    });

    test.each([
      ["x.mmd", "x.svg"],
      ["notes", "notes.svg"],
      ["a.b.mmd", "a.b.svg"],
    ])("GIVEN an input named %s WHEN it is rendered THEN the SVG is named %s", async (input, output) => {
      const { dir, file } = await diagramFile("flowchart LR\n  a[Cart]\n", input);

      const result = await runRender([file]);

      expect(result.stdout).toBe(`${path.join(dir, output)}\n`);
    });
  });

  describe("label sizes", () => {
    test.each([
      ["a", "illicit lily", 12],
      ["b", "ïlïçït ïlï", 10],
      ["c", "il il<br/>illicit illicit", 15],
    ])("GIVEN node %s labelled %p WHEN it is rendered THEN its box is at least 0.6 em per code point of its longest line", async (id, label, longestLine) => {
      const { dir, file } = await diagramFile(`flowchart LR\n  ${id}["${label}"]\n`);

      await runRender([file]);
      const svg = await readFile(path.join(dir, "diagram.svg"), "utf8");

      expect(nodeWidth(svg, id)).toBeGreaterThanOrEqual(0.6 * 16 * longestLine);
    });
  });

  describe("Mermaid errors", () => {
    test("GIVEN a syntax error WHEN the diagram is rendered THEN it exits 3 with the location, the snippet and advice, and writes no SVG", async () => {
      const { dir, file } = await diagramFile("flowchart LR\n  A -->> ((\n");

      const result = await runRender([file]);

      expect(result).toEqual({
        exitCode: 3,
        stdout: "",
        stderr: `Pele could not render ${file} at line 2, column 8 (syntax): Parse error on line 2:\n  A -->> ((\n-------^\nFix the Mermaid at that line and run render again.\n`,
      });
      expect(await readdir(dir)).toEqual(["diagram.mmd"]);
    });

    test.each([
      ["an unsupported diagram", "zenuml\n  A.b()", "(unsupported-diagram): No diagram type detected for the given text. Use a diagram type Pele supports; see https://pele.run."],
      ["a semantic error with no location", "timeline\n : orphan", "(semantic): An event needs a time period before it. Fix the Mermaid and run render again."],
      ["more than 10,000 edges", `flowchart LR\n${Array.from({ length: 10_001 }, (_, i) => `  n${i} --> n${i + 1}`).join("\n")}\n`, "(limit): Edge limit exceeded. The limit is 10000. Split the diagram or remove detail, then run render again."],
    ])("GIVEN %s WHEN the diagram is rendered THEN it exits 3 with a message that has no location, and writes no SVG", async (_case, source, tail) => {
      const { dir, file } = await diagramFile(source);

      const result = await runRender([file]);

      expect(result).toEqual({ exitCode: 3, stdout: "", stderr: `Pele could not render ${file} ${tail}\n` });
      expect(await readdir(dir)).toEqual(["diagram.mmd"]);
    });
  });

  describe("command failures", () => {
    test.each([
      ["no arguments", [], "No diagram file given."],
      ["two diagram files", ["a.mmd", "b.mmd"], "Give one diagram file; got 2."],
    ])("GIVEN %s WHEN render runs THEN it exits 2 with the problem and the usage", async (_case, args, problem) => {
      const result = await runRender(args);

      expect(result).toEqual({ exitCode: 2, stdout: "", stderr: `${problem}\n${USAGE}\n` });
    });

    test.each([
      ["an unknown option", ["--foo"], "Unknown option '--foo'"],
      ["--css with no value", ["--css"], "Option '--css <value>' argument missing"],
    ])("GIVEN %s WHEN render runs THEN it exits 2 with the parser's problem and the usage", async (_case, extraArgs, problemStart) => {
      const { file } = await diagramFile("flowchart LR\n  a[Cart]\n");

      const result = await runRender([file, ...extraArgs]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr.startsWith(problemStart)).toBe(true);
      expect(result.stderr.endsWith(`\n${USAGE}\n`)).toBe(true);
    });

    test("GIVEN a missing diagram file WHEN render runs THEN it exits 2 naming the file it could not read", async () => {
      const dir = await tempDir();
      const missing = path.join(dir, "absent.mmd");

      const result = await runRender([missing]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr.startsWith(`render could not read ${missing}: `)).toBe(true);
      expect(result.stderr.endsWith(". Check the path and run render again.\n")).toBe(true);
    });

    test("GIVEN a missing CSS file WHEN render runs THEN it exits 2 naming the CSS file and writes no SVG", async () => {
      const { dir, file } = await diagramFile("flowchart LR\n  a[Cart]\n");
      const missing = path.join(dir, "absent.css");

      const result = await runRender([file, "--css", missing]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr.startsWith(`render could not read ${missing}: `)).toBe(true);
      expect(result.stderr.endsWith(". Check the path and run render again.\n")).toBe(true);
      expect(await readdir(dir)).toEqual(["diagram.mmd"]);
    });

    test("GIVEN a read-only folder WHEN render runs THEN it exits 2 naming the SVG it could not write", async () => {
      const { dir, file } = await diagramFile("flowchart LR\n  a[Cart]\n");
      await chmod(dir, 0o555);
      lockedDirs.push(dir);

      const result = await runRender([file]);

      expect(result.exitCode).toBe(2);
      expect(result.stderr.startsWith(`render could not write ${path.join(dir, "diagram.svg")}: `)).toBe(true);
      expect(result.stderr.endsWith(". Check the path and run render again.\n")).toBe(true);
    });
  });
});

async function runRender(args: string[]): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const child = Bun.spawn([RENDER, ...args], { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { exitCode, stdout, stderr };
}

async function diagramFile(source: string, name = "diagram.mmd"): Promise<{ dir: string; file: string }> {
  const dir = await tempDir();
  const file = path.join(dir, name);
  await writeFile(file, source);
  return { dir, file };
}

function nodeWidth(svg: string, id: string): number {
  const match = new RegExp(`<g class="pele-node[^"]*" data-id="${id}"[^>]*><rect[^>]*?\\bwidth="([\\d.]+)"`).exec(svg);
  if (match?.[1] === undefined) throw new Error(`No node ${id} in the SVG.`);
  return Number(match[1]);
}

async function tempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "render-test-"));
  tempDirs.push(dir);
  return dir;
}
