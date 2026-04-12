import { generateId } from "./utils.js";

// создать новое растение
export function createPlant(data) {
  return {
    id: generateId(),
    name: data.name,
    image: data.image,
    type: data.type,
    plantedDate: data.plantedDate,
    lastWatered: data.lastWatered,
    wateringFrequency: Number(data.wateringFrequency),
    description: data.description,
  };
}
