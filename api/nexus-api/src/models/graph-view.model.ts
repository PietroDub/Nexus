export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export class GraphView {
  id: string;
  graphId: string;
  name: string;
  isDefault: boolean;
  viewport: Viewport;
  filters: Record<string, unknown>;
  createdBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
