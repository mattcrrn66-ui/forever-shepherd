export type TokenWatchRow = {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  status: "upcoming" | "launched";
  score: number;
  risk_level: "low" | "medium" | "high";
  hype_level: "quiet" | "warming_up" | "hot";
  pumpfun_url: string | null;
  dex_url: string | null;
  website_url: string | null;
  x_url: string | null;
  created_at: string;
};
