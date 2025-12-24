// app/timelines/data/timelines.ts
export type TimelineEra =
  | "Ancient"
  | "Medieval"
  | "Colonial"
  | "Modern";

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  era: TimelineEra;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "nile",
    year: "3000 BCE",
    title: "Ancient Nile Civilizations",
    description:
      "Early Egyptian kingdoms and Nubian societies establish complex political systems.",
    era: "Ancient",
  },
  {
    id: "mali",
    year: "1235 CE",
    title: "Mali Empire",
    description:
      "Mansa Musa expands Mali into a global center of wealth, learning, and trade.",
    era: "Medieval",
  },
  {
    id: "scramble",
    year: "1885",
    title: "Scramble for Africa",
    description:
      "European powers partition Africa during the Berlin Conference.",
    era: "Colonial",
  },
];
