export type AccessibilityRule = {
  id: string;
  title: string;
  url: string;
  status: "passed" | "failed" | "review" | "inapplicable";
  nodes: { target: string; detail: string }[];
};
export type AccessibilityRun = {
  theme: string;
  width: number;
  rules: AccessibilityRule[];
  textSizes: number[];
  error?: string;
};
export type AccessibilityReport = {
  generatedAt: string;
  fingerprint: string;
  engine: string;
  components: Record<string, AccessibilityRun[]>;
};
