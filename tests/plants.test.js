import { createPlant } from "../js/plants.js";

describe("Plant Creation", () => {
  test("creates plant with correct properties and generated ID", () => {
    const data = { name: "Cactus", type: "succulent", wateringFrequency: "24" };
    const plant = createPlant(data);
    expect(plant.id).toBeDefined();
    expect(plant.name).toBe("Cactus");
    expect(plant.wateringFrequency).toBe(24);
  });

  test("sets default lastWatered to current time if not provided", () => {
    const plant = createPlant({ name: "Fern", type: "leafy" });
    expect(plant.lastWatered).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  });

  test("handles missing optional fields gracefully", () => {
    const plant = createPlant({ name: "Rose", type: "flowering" });
    expect(plant.description).toBeUndefined();
    expect(plant.image).toBeUndefined();
  });
});
