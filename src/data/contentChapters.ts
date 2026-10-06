export const cinematicChapters = [
  { id: "brand", label: "Início", scene: "core" },
  { id: "services", label: "Serviços", scene: "network" },
  { id: "trust", label: "Base", scene: "stability" },
  { id: "pricing", label: "Planos", scene: "pricing" },
  { id: "contact", label: "Contato", scene: "contact" },
] as const;

export type CinematicChapterId = (typeof cinematicChapters)[number]["id"];
export type CinematicSceneKey = (typeof cinematicChapters)[number]["scene"];
