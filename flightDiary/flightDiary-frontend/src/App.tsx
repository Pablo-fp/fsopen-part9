import { useState, useEffect } from 'react';
import axios from 'axios';

import { DiaryEntry, Weather, Visibility } from './types';
import diaryService from './services/diaries';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null); // New state for error messages

  useEffect(() => {
    void axios.get<void>(`http://localhost:3000/ping`);

    const fetchDiaries = async () => {
      const diaries = await diaryService.getAll();
      setDiaries(diaries);
    };
    void fetchDiaries();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Reset error state before attempting to create a new entry

    const newDiaryEntry = {
      date,
      weather,
      visibility,
      comment
    };

    try {
      // Send the new entry to the backend
      const createdEntry = await diaryService.create(newDiaryEntry);

      // Update the state with the new entry
      setDiaries([...diaries, createdEntry]);

      // Reset the form fields
      setDate('');
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Good);
      setComment('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Narrow down the error to AxiosError and extract the error message
        setError(
          error.response?.data ||
            'An error occurred while creating the diary entry.'
        );
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Flight visibility</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Weather:</label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value as Weather)}
          >
            {Object.values(Weather).map((weatherOption) => (
              <option key={weatherOption} value={weatherOption}>
                {weatherOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Visibility:</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
          >
            {Object.values(Visibility).map((visibilityOption) => (
              <option key={visibilityOption} value={visibilityOption}>
                {visibilityOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Comment:</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button type="submit">Add Entry</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weather</th>
            <th>Visibility</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {diaries.map((diary) => (
            <tr key={diary.id}>
              <td>{diary.date}</td>
              <td>{diary.weather}</td>
              <td>{diary.visibility}</td>
              <td>{diary.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
