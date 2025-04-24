import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { updateProfile, resetEditStatus } from '../../store/editSlice';
import { setUser } from '../../store/loginSlice';
import classes from './EditProfile.module.scss';
import Error from '../../error/error';

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.edit);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        avatar: user.image || '',
        password: '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (status === 'succeeded') {
      dispatch(setUser(user));
      dispatch(resetEditStatus());
      navigate('/');
    }
  }, [status, user, dispatch, navigate]);

  const onSubmit = (data) => {
    dispatch(updateProfile(data));
  };

  return (
    <div className={classes.editprof}>
      <form className={classes.editform} onSubmit={handleSubmit(onSubmit)}>
        <h2>Edit Profile</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          {...register('username', {
            required: 'This field is required',
            minLength: {
              value: 3,
              message: 'Minimum number of characters is 3',
            },
            maxLength: {
              value: 20,
              message: 'Maximum number of characters is 20',
            },
          })}
          style={{
            borderColor: errors?.username || error?.username ? 'red' : '',
          }}
        />
        <div className={classes.error}>
          {errors?.username && (
            <p style={{ color: 'red' }}>{errors.username.message}</p>
          )}
          {error?.username && <p style={{ color: 'red' }}>{error.username}</p>}
        </div>

        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          placeholder="Email address"
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /^[a-z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Please enter a valid email address',
            },
          })}
          style={{
            borderColor: errors?.email || error?.email ? 'red' : '',
          }}
        />
        <div className={classes.error}>
          {errors?.email && (
            <p style={{ color: 'red' }}>{errors.email.message}</p>
          )}
          {error?.email && <p style={{ color: 'red' }}>{error.email}</p>}
        </div>

        <label htmlFor="password">New password</label>
        <input
          type="password"
          id="password"
          placeholder="New password"
          {...register('password', {
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
            maxLength: {
              value: 40,
              message: 'Maximum number of characters is 40',
            },
          })}
        />
        <div className={classes.error}>
          {errors?.password && (
            <p style={{ color: 'red' }}>{errors.password.message}</p>
          )}
        </div>

        <label htmlFor="avatar">Avatar image (URL)</label>
        <input
          type="text"
          id="avatar"
          placeholder="Avatar image"
          {...register('avatar', {
            required: 'This field is required',
            pattern: {
              value: /^https?:\/\/.+$/,
              message: 'Please enter a valid URL',
            },
          })}
          style={{
            borderColor: errors?.avatar || error?.image ? 'red' : '',
          }}
        />
        <div className={classes.error}>
          {errors?.avatar && (
            <p style={{ color: 'red' }}>{errors.avatar.message}</p>
          )}
          {error?.image && <p style={{ color: 'red' }}>{error.image}</p>}
        </div>

        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Saving...' : 'Save'}
        </button>

        {error?.general && <Error message={error?.general} />}
      </form>
    </div>
  );
}

export default EditProfile;
