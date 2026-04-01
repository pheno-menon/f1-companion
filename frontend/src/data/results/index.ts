const modules = import.meta.glob("./*.json", { eager: true });

export const resultsMap = Object.fromEntries(
  Object.entries(modules).map(([path, data]: any) => {
    const name = path.split("/").pop().replace(".json", "");
    return [name, data.default];
  })
);