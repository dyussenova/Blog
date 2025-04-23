import List from './components/List/List';
import Layout from './components/Layout';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Article from './components/Article';
import CreateArticle from './components/CreateArticle';
import Error from './error/error';
import Spinner from './spinner/spinner';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import EditProfile from './components/EditProfile/EditProfile';

function App() {
  const error = useSelector((state) => state.list.error);
  const status = useSelector((state) => state.list.status);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<List />} />
          <Route path=":slug" element={<Article />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="editprof" element={<EditProfile />} />
          <Route path="createart" element={<CreateArticle />} />
          <Route path="edit/:slug" element={<CreateArticle />} />
          <Route path="/Blog" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <div>
        {status === 'loading' && <Spinner />}
        {error && <Error />}
      </div>
    </>
  );
}

export default App;
