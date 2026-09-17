export type Farm = {
  id: string;
  name: string;
  location?: string;
};

export type Field = {
  id: string;
  farmId: string;
  name: string;
  crop?: string;
  areaHa?: number;
};

export const demoFarm: Farm = {
  id: "farm-demo",
  name: "Demo-Hof"
};

export const demoFields: Field[] = [
  { id: "field-1", farmId: "farm-demo", name: "Nordacker", crop: "Winterweizen", areaHa: 4.2 },
  { id: "field-2", farmId: "farm-demo", name: "Südwiese", crop: "Grünland", areaHa: 2.8 }
];
