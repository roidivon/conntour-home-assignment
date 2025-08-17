export type ImageData = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  launch_date: string;
  status: string;
  type: string;
  confidence: number;
};

export type SearchResult = {
  content: Search[];
  total_count: number;
};

export type Search = {
  id: string;
  query: string;
  last_used: string;
};
