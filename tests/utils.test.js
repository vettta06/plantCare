import { generateId, getLocalDateTime } from "../js/utils.js";

describe("Utility Functions", () => {
  test("generates unique numeric string IDs", async () => {
    const id1 = generateId();
    await new Promise((r) => setTimeout(r, 10));
    const id2 = generateId();

    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe("string");
  });

  test("returns local datetime in ISO format without seconds", () => {
    const dateStr = getLocalDateTime();
    expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});
