import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { registerUser } from '../../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import classes from './SignUp.module.scss';

function SignUp() {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({ mode: 'onBlur' });

  const { error, status } = useSelector((state) => state.user);

  const password = watch('password');

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      reset();
    }
  }, [status, reset]);

  return (
    <div className={classes.signup}>
      <form className={classes.formSign} onSubmit={handleSubmit(onSubmit)}>
        <h2>Create new account</h2>

        <label htmlFor="userName">User name</label>
        <input
          type="text"
          id="username"
          placeholder="User name"
          {...register('userName', {
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
            borderColor: errors?.userName || error?.username ? 'red' : '',
            borderWidth: errors?.userName || error?.username ? '1px' : '',
          }}
        />
        <div className={classes.error}>
          {errors?.userName && (
            <p style={{ color: 'red' }}>
              {errors?.userName.message || 'Error'}
            </p>
          )}
          {error?.username && <p style={{ color: 'red' }}>{error?.username}</p>}
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
            borderWidth: errors?.email || error?.email ? '1px' : '',
          }}
        />
        <div className={classes.error}>
          {errors?.email && (
            <p style={{ color: 'red' }}>{errors?.email.message || 'Error'}</p>
          )}
          {error?.email && <p style={{ color: 'red' }}>{error?.email}</p>}
        </div>

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 6,
              message: 'Your password needs to be at least 6 characters.',
            },
            maxLength: {
              value: 40,
              message: 'Maximum number of characters is 40',
            },
          })}
        />
        <div className={classes.error}>
          {errors?.password && (
            <p style={{ color: 'red' }}>
              {errors?.password.message || 'Error'}
            </p>
          )}
        </div>

        <label htmlFor="repeatPassword">Repeat Password</label>
        <input
          type="password"
          id="repeatPassword"
          placeholder="Repeat Password"
          {...register('repeatPassword', {
            required: 'This field is required',
            minLength: {
              value: 6,
              message: 'Your password needs to be at least 6 characters.',
            },
            maxLength: {
              value: 40,
              message: 'Maximum number of characters is 40',
            },
            validate: {
              matches: (value) =>
                value === password || 'Passwords do not match',
            },
          })}
        />
        <div className={classes.error}>
          {errors?.repeatPassword && (
            <p style={{ color: 'red' }}>
              {errors?.repeatPassword.message || 'Error'}
            </p>
          )}
        </div>

        <div className={classes.checkbox}>
          <label htmlFor="agree">
            <input type="checkbox" id="checkbox" name="checkbox" required />I
            agree to the processing of my personal information
          </label>
        </div>

        <button className={classes.button} disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading...' : 'Create'}
        </button>

        <p>
          Already have an account?{' '}
          <Link to="/signin" className={classes.sign}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
