import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Camera from './camera/Camera';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Camera />}></Route>
    </Routes>
  );
}

export default App;
