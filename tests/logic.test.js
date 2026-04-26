describe("Plant Care Logic", () => {
  // Эмуляция функции isNeedWater из controls.js для тестирования
  const isNeedWater = (plant) => {
    const baseDate = plant.lastWatered || plant.plantedDate;
    if (!baseDate) return true;
    const last = new Date(baseDate);
    const now = new Date();
    const diffHours = (now - last) / (1000 * 60 * 60);
    const freq = Number(plant.wateringFrequency) || 1;
    const percent = 100 - (diffHours / freq) * 100;
    return percent <= 30;
  };

  test("identifies plant needing water when time exceeds frequency", () => {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

    const plant = {
      name: "Thirsty Plant",
      lastWatered: twoDaysAgo,
      wateringFrequency: 24, // Поливать раз в сутки
    };

    expect(isNeedWater(plant)).toBe(true);
  });

  test("identifies healthy plant when recently watered", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

    const plant = {
      name: "Happy Plant",
      lastWatered: oneHourAgo,
      wateringFrequency: 24,
    };

    expect(isNeedWater(plant)).toBe(false);
  });

  test("filters plants by search term case-insensitively", () => {
    const plants = [{ name: "Monstera" }, { name: "Fern" }, { name: "Cactus" }];

    const term = "mon";
    const filtered = plants.filter((p) => p.name.toLowerCase().includes(term));

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe("Monstera");
  });

  test("returns empty array for non-matching search", () => {
    const plants = [{ name: "Rose" }];
    const filtered = plants.filter((p) =>
      p.name.toLowerCase().includes("orchid"),
    );
    expect(filtered).toHaveLength(0);
  });
});
