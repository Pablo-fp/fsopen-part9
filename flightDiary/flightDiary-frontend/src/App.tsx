import { useState, useEffect } from 'react';
import axios from 'axios';

import { DiaryEntry } from './types';
import { apiBaseUrl } from './constants';
import diaryService from './services/diaries';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchDiaries = async () => {
      const diaries = await diaryService.getAll();
      setDiaries(diaries);
    };
    void fetchDiaries();
  }, []);

  return (
    <div>
      <h1>Flight visibility</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weather</th>
            <th>Visibility</th>
          </tr>
        </thead>
        <tbody>
          {diaries.map((diary) => (
            <tr key={diary.id}>
              <td>{diary.date}</td>
              <td>{diary.weather}</td>
              <td>{diary.visibility}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
