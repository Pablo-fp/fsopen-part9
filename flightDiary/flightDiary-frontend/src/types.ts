export interface DiaryEntry {
  id: number;
  date: string;
  weather: 'rainy' | 'sunny' | 'windy' | 'cloudy';
  visibility: 'poor' | 'good';
}
