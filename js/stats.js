export function renderStats(plants) {
  const total = plants.length;

  let needWater = 0;
  let healthy = 0;

  let types = {
    leafy: 0,
    flowering: 0,
    succulent: 0,
  };

  let good = 0;
  let attention = 0;
  let critical = 0;

  plants.forEach((p) => {
    const percent = getWaterPercent(p);
    if (percent <= 30) needWater++;
    else healthy++;
    if (types[p.type] !== undefined) {
      types[p.type]++;
    }
    if (percent > 60) good++;
    else if (percent > 30) attention++;
    else critical++;
  });

  const totalSafe = total || 1;

  // карточки
  document.getElementById("totalPlants").textContent = total;
  document.getElementById("needWater").textContent = needWater;
  document.getElementById("healthyPlants").textContent = healthy;

  // типы
  document.getElementById("leafyCount").textContent = types.leafy;
  document.getElementById("floweringCount").textContent = types.flowering;
  document.getElementById("succulentCount").textContent = types.succulent;

  document.querySelector(".chart-bar__fill--leafy").style.width =
    (types.leafy / totalSafe) * 100 + "%";

  document.querySelector(".chart-bar__fill--flowering").style.width =
    (types.flowering / totalSafe) * 100 + "%";

  document.querySelector(".chart-bar__fill--succulent").style.width =
    (types.succulent / totalSafe) * 100 + "%";

  // вода
  document.getElementById("allGoodCount").textContent = good;
  document.getElementById("attentionCount").textContent = attention;
  document.getElementById("criticalCount").textContent = critical;

  document.querySelector(".chart-bar__fill--good").style.width =
    (good / totalSafe) * 100 + "%";

  document.querySelector(".chart-bar__fill--attention").style.width =
    (attention / totalSafe) * 100 + "%";

  document.querySelector(".chart-bar__fill--critical").style.width =
    (critical / totalSafe) * 100 + "%";
}

function getWaterPercent(plant) {
  const baseDate = plant.lastWatered || plant.plantedDate;
  if (!baseDate) return 100;
  const last = new Date(baseDate);
  const now = new Date();
  if (isNaN(last.getTime())) return 100;
  const diffHours = (now - last) / (1000 * 60 * 60);
  const freq = Number(plant.wateringFrequency) || 1;
  let percent = 100 - (diffHours / freq) * 100;
  return Math.min(100, Math.max(0, Math.round(percent)));
}
