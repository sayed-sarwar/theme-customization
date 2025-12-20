export type ViewType = 'list' | 'grid' | 'kanban';

export interface DataViewProps<T> {
  data: T[];
  columns: any[];
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
}

export interface ViewConfig {
  list: {
    showPagination: boolean;
    pageSize: number;
  };
  grid: {
    columns: number;
    cardHeight: string;
  };
  kanban: {
    statusField: string;
    columns: string[];
  };
}