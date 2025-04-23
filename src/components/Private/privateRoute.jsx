import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

function PrivateRoute({ children }) {
  const user = useSelector((state) => state.login.user || state.user.user);
  return user ? children : <Navigate to="/signin" />;
}

PrivateRoute.propTypes = {
  children: propTypes.node.isRequired,
};

export default PrivateRoute;
