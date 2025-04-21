import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { loginUser } from '../../store/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import classes from './SignIn.module.scss';

function SignIn() {
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ mode: 'onBlur' });

  const { error, status } = useSelector((state) => state.login);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      reset();
    }
  }, [status, reset]);

  return (
    <div className={classes.signin}>
      <form className={classes.signForm} onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In </h2>
        <label htmlFor="emailAddress">Email address</label>
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
            borderColor: errors?.emailAddress || error?.email ? 'red' : '',
            borderWidth: errors?.emailAddress || error?.email ? '1px' : '',
          }}
        />
        <div className={classes.error}>
          {errors?.emailAddress && (
            <p style={{ color: 'red' }}>
              {errors?.emailAddress.message || 'Error'}
            </p>
          )}
          {error?.email && <p style={{ color: 'red' }}>{error?.email}</p>}
        </div>

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          {...register('password', { required: 'This field is required' })}
          style={{
            borderColor: errors?.password || error?.password ? 'red' : '',
            borderWidth: errors?.password || error?.password ? '1px' : '',
          }}
        />
        <div className={classes.error}>
          {errors?.password && (
            <p style={{ color: 'red' }}>
              {errors?.password.message || 'Error'}
            </p>
          )}
          {error?.password && <p style={{ color: 'red' }}>{error?.password}</p>}
        </div>

        {/* Submit button */}
        <button>Login</button>

        <p>
          Don’t have an account?{' '}
          <Link to="/signup" className={classes.sign}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
