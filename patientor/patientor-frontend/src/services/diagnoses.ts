import axios from 'axios';
import { Diagnosis } from '../types';
import { apiBaseUrl } from '../constants';

const getByCode = async (code: string): Promise<Diagnosis | null> => {
  try {
    const response = await axios.get<Diagnosis>(
      `${apiBaseUrl}/diagnoses/${code}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnosis:', error);
    return null; // Or throw the error if you want to handle it in the component
  }
};

const getAll = async (): Promise<Diagnosis[]> => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

export default { getByCode, getAll };
