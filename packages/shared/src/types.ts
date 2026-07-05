export interface Widget {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly source: string;
  readonly updatedAt: string;
}

export interface NewWidget {
  readonly title: string;
  readonly value: string;
  readonly source: string;
}

export interface EnvironmentStatus {
  readonly name: string;
  readonly present: boolean;
}

export interface WidgetStore {
  list(): Promise<Widget[]>;
  add(input: NewWidget): Promise<Widget>;
  replace(widgets: readonly Widget[]): Promise<Widget[]>;
}
