import { describe, expect, test } from "vitest";

import { parseBoolean, parseNonEmptyString, parseNullableBoolean, parseString } from "../../../src/utils/parse";

describe("Parse utils tests", () => {
  test("parseBoolean parses boolean correctly", () => {
    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("false")).toBe(false);
  });

  test("parseBoolean throws error when invalid", () => {
    expect(() => parseBoolean("invalid")).toThrowError();
  });

  test("parseNullableBoolean parses boolean correctly", () => {
    expect(parseNullableBoolean("true")).toBe(true);
    expect(parseNullableBoolean("false")).toBe(false);
    expect(parseNullableBoolean(undefined)).toBe(null);
  });

  test("parseNullableBoolean throws error when invalid", () => {
    expect(() => parseNullableBoolean("invalid")).toThrowError();
  });

  test("parseString parses string correctly", () => {
    expect(parseString("test")).toBe("test");
  });

  test("parseString parses undefined correctly", () => {
    expect(parseString(undefined)).toBe("");
  });

  test("parseNonEmptyString parses non-empty string correctly", () => {
    expect(parseNonEmptyString("test")).toBe("test");
  });

  test("parseNonEmptyString throws error when empty", () => {
    expect(() => parseNonEmptyString("")).toThrowError();
    expect(() => parseNonEmptyString(undefined)).toThrowError();
  });
});
