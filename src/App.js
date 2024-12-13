import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddCountryForm from './AddCountryForm';
import AddCategoryForm from './AddCategoryForm';
import MovieForm from './MovieForm';
import MovieAdmin from './MovieAdmin';  // Import the MovieAdmin component
import MovieUser from './MovieUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add-country" element={<AddCountryForm />} />
        <Route path="/add-category" element={<AddCategoryForm />} />
        <Route path="/add-movie" element={<MovieForm />} />
        <Route path="/movie-admin" element={<MovieAdmin />} />
        <Route path="/users" element={<MovieUser />} />
      </Routes>
    </Router>
  );
}

export default App;