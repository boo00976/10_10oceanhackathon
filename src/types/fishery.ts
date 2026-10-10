export interface FishPriceRecord {
  id: string;
  trade_date: string;
  market_id: string;
  market_name: string;
  fish_id: string;
  fish_name: string;
  category: string;
  high_price: number;
  mid_price: number;
  low_price: number;
  avg_price: number;
  trade_volume: number;
  anomaly_score: number;
  anomaly_flag: 'NORMAL' | 'HIGH_SURGE' | 'SHARP_DROP' | 'VOLUME_SPIKE';
}

export interface FishSpecies {
  id: string;
  name: string;
  rawNames: string[];
  category: string;
  seasonality: string;
  esg_status: string;
  fao_code?: string;
  scientific_name?: string;
  gear_type?: string;
  keelung_relevance?: string;
}

export interface MarketInfo {
  id: string;
  name: string;
  region: string;
  is_pilot: boolean;
}

export interface AnnualProductionItem {
  county: string;
  year: string;
  fishery_type: string;
  production_mt: number;
  production_val_million: number;
  fisher_households: number;
  fisher_population: number;
  main_species: string[];
  highlights: string;
}

export interface FishermenAssociation {
  id: string;
  name: string;
  county: string;
  address: string;
  members: number;
  boats: number;
  services: string[];
}

export interface DataQualityReport {
  raw_vs_standardized: {
    raw: {
      total_records: number;
      missing_price_rate: string;
      date_parse_failure_rate: string;
      duplicate_records_rate: string;
      name_inconsistency_rate: string;
      api_timeout_rate: string;
    };
    standardized: {
      total_records: number;
      missing_price_rate: string;
      date_parse_failure_rate: string;
      duplicate_records_rate: string;
      name_inconsistency_rate: string;
      api_timeout_rate: string;
    };
  };
  experiments: Array<{
    code: string;
    title: string;
    baseline: string;
    treatment: string;
    eval_metric: string;
    raw_score: string;
    cleaned_score: string;
    conclusion: string;
  }>;
}
