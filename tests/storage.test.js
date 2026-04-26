import { getPlants, savePlants } from "../js/storage.js";

beforeEach(() => localStorage.clear());

describe("Storage Module", () => {
  test("returns empty array when storage is empty", () => {
    expect(getPlants()).toEqual([]);
  });

  test("saves and retrieves plants correctly", () => {
    const mockPlants = [{ id: "1", name: "Test" }];
    savePlants(mockPlants);
    expect(getPlants()).toEqual(mockPlants);
  });

  test("overwrites existing data on save", () => {
    savePlants([{ id: "1" }]);
    savePlants([{ id: "2" }]);
    expect(getPlants()).toHaveLength(1);
  });
});
