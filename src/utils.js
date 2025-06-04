export const getDistance = (a, b) =>
  Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);

export const getCenter = (a, b) => ({
  x: (a.clientX + b.clientX) / 2,
  y: (a.clientY + b.clientY) / 2,
});