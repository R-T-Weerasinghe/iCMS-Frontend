export interface AlertItem {
  id: string;
  product?: string;
  alerttype?: string;
  min_val?: number;
  max_val?: number;
}

export interface Thresholds {
  alert_type: string;
  min_val: number;
  max_val: number;
  sm_id: string;
  id: string;
}

export interface Campaign {
  id: string;
  description?: string;
  company?: string;
  s_score?: number;
  color?: string;
}