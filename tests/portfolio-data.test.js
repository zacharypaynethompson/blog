import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, "..", "src", "_data", "portfolio.json");

describe("portfolio.json", () => {
  const raw = readFileSync(dataPath, "utf-8");

  it("parses as valid JSON", () => {
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  const data = JSON.parse(raw);

  it("has a categories array", () => {
    expect(Array.isArray(data.categories)).toBe(true);
  });

  it("every category has id, name and a projects array", () => {
    for (const category of data.categories) {
      expect(typeof category.id).toBe("string");
      expect(category.id.length).toBeGreaterThan(0);
      expect(typeof category.name).toBe("string");
      expect(category.name.length).toBeGreaterThan(0);
      expect(Array.isArray(category.projects)).toBe(true);
    }
  });

  it("has unique category ids", () => {
    const ids = data.categories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every project has a non-empty title and description", () => {
    for (const category of data.categories) {
      for (const project of category.projects) {
        expect(typeof project.title).toBe("string");
        expect(project.title.trim().length).toBeGreaterThan(0);
        expect(typeof project.description).toBe("string");
        expect(project.description.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every link (when present) has a label and a url", () => {
    for (const category of data.categories) {
      for (const project of category.projects) {
        if (project.links == null) continue;
        expect(Array.isArray(project.links)).toBe(true);
        for (const link of project.links) {
          expect(typeof link.label).toBe("string");
          expect(link.label.trim().length).toBeGreaterThan(0);
          expect(typeof link.url).toBe("string");
          expect(link.url.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});
