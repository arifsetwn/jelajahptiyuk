export type LocationCategory = "pti_fkip" | "landmark_ums";
export type CampusArea = "kampus_1" | "kampus_2" | "edutorium";

export type LocationKind =
  | "bookstore"
  | "academic-blue"
  | "academic-yellow"
  | "academic-red"
  | "siti-walidah"
  | "edutorium"
  | "mosque-modern"
  | "library"
  | "lakeside"
  | "auditorium"
  | "mosque-classic";

export interface CampusLocation {
  id: string;
  slug: string;
  title: string;
  mapLabel: string;
  category: LocationCategory;
  campusArea: CampusArea;
  kind: LocationKind;
  position: [number, number, number];
  rotation?: number;
  accent: string;
  shortDescription: string;
  primaryFunction: string;
  interestingFact: string;
  photos?: string[];
  link?: string;
}

export type CameraMode = "follow" | "overview";
export type GraphicsQuality = "light" | "detail";
