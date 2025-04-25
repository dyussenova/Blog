import { NavLink, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutUserSlice } from '../../store/userSlice';
import { logout as logoutLoginSlice } from '../../store/loginSlice';
import classes from './Layout.module.scss';
import defaultAvatar from '../../assets/Rectangle 1.png';

function Layout() {
  const dispatch = useDispatch();

  const loginUser = useSelector((state) => state.login.user);

  const user = useSelector((state) => state.user.user);

  const currentUser = loginUser || user;

  const handleLogout = () => {
    dispatch(logoutLoginSlice());

    dispatch(logoutUserSlice());
  };

  return (
    <>
      <header className={classes.header}>
        <div className={classes.header__conteiner}>
          <div className={classes.title}>
            <NavLink to="/" className={classes.title__header}>
              Realworld Blog
            </NavLink>
          </div>
          <div className={classes.sign}>
            {currentUser ? (
              <div className={classes.userProfile}>
                <NavLink to="createart" className={classes.createArticle}>
                  Create article
                </NavLink>
                <NavLink to="editprof" className={classes.edit}>
                  <span className={classes.username}>
                    {currentUser.username}
                  </span>
                  <img
                    src={currentUser.image || defaultAvatar}
                    alt="User Avatar"
                    className={classes.avatar}
                    onError={(e) => (e.target.src = defaultAvatar)}
                  />
                </NavLink>
                <button onClick={handleLogout} className={classes.logoutButton}>
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/signin" className={classes.sign__signin}>
                  Sign in
                </NavLink>
                <NavLink to="/signup" className={classes.sign__signup}>
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}

export default Layout;
