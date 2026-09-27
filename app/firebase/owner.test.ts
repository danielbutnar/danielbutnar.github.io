import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OWNER_EMAIL } from "./owner";

describe("owner", () => {
  it("is the same account in the app and in firestore.rules", () => {
    const rules = readFileSync("firestore.rules", "utf8");
    const match = rules.match(/request\.auth\.token\.email == "([^"]+)"/);
    expect(match?.[1]).toBe(OWNER_EMAIL);
  });
});
