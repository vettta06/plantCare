import { generateId, getLocalDateTime } from "./utils.js";


// создать новое растение
export function createPlant(data) {
  return {
    id: generateId(),
    name: data.name,
    image: data.image,
    type: data.type,
    plantedDate: data.plantedDate,
    lastWatered: data.lastWatered || getLocalDateTime(),
    wateringFrequency: Number(data.wateringFrequency) || 1,
    description: data.description,
  };
}
