// Groups pieces by year, oldest to newest — "Undated" pieces (no year set)
// go last. Shared by the /timeline page and the homepage timeline panel.
export function groupPiecesByYear(pieces) {
  const byYear = {};
  for (const p of pieces) {
    const year = p.year || "Undated";
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(p);
  }

  const years = Object.keys(byYear).sort((a, b) => {
    if (a === "Undated") return 1;
    if (b === "Undated") return -1;
    return parseInt(a, 10) - parseInt(b, 10);
  });

  return { years, byYear };
}

// Anchor id for a year's section on /timeline.
export function yearAnchor(year) {
  return `year-${String(year).toLowerCase()}`;
}
