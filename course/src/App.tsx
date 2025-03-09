import React from 'react';
import Content from './Content';
import { courseParts, CoursePart } from './courseParts';

const TotalExercises = ({ courseParts }: { courseParts: CoursePart[] }) => {
  const totalExerciseCount = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );
  return <h2>Number of exercises {totalExerciseCount}</h2>;
};

const App = () => {
  return (
    <div>
      <h1>Course Parts</h1>
      <Content courseParts={courseParts} />
      <TotalExercises courseParts={courseParts} />
    </div>
  );
};

export default App;
