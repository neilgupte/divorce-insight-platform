
export interface Company {
  id: number;
  name: string;
  industry: string;
  dateOnboarded: string;
  modules: string[];
  status: "active" | "suspended";
}
