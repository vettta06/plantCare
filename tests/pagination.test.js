describe("Pagination Algorithm", () => {
  const itemsPerPage = 5;

  test("calculates correct total pages for exact division", () => {
    const totalItems = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    expect(totalPages).toBe(2);
  });

  test("calculates correct total pages with remainder", () => {
    const totalItems = 12;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    expect(totalPages).toBe(3);
  });

  test("extracts correct slice for first page", () => {
    const data = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentPage = 1;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const slice = data.slice(start, end);
    expect(slice).toEqual([1, 2, 3, 4, 5]);
  });

  test("extracts correct slice for middle page", () => {
    const data = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentPage = 2;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const slice = data.slice(start, end);
    expect(slice).toEqual([6, 7, 8, 9, 10]);
  });

  test("extracts correct slice for last partial page", () => {
    const data = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentPage = 3;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const slice = data.slice(start, end);
    expect(slice).toEqual([11, 12]);
  });

  test("handles empty dataset gracefully", () => {
    const data = [];
    const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
    expect(totalPages).toBe(1);
  });
});
