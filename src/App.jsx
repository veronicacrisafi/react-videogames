//Usa BrowserRouter come contenitore della navigazione lato client.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ItemDetailsPage from './pages/ItemDetailsPage'
import ItemsListPage from './pages/ItemsListPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<ItemsListPage />} />
          <Route path="items/:id" element={<ItemDetailsPage />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
