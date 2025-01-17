import React, { useState } from "react";
import { NavigateFunction, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from 'lucide-react'

import Navbar from '../../components/layout/Navbar'
import { useLogin, useFetchUserData } from "../../hooks/user";


export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  
  const login = useLogin();
  const fetchUserData = useFetchUserData();
  let navigate: NavigateFunction = useNavigate();
  const location = useLocation();


  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: {
    username: string;
    password: string;
  } = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = async (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;

    setMessage("");
    setLoading(true);

    try {
      await login({username: username, password: password});
      await fetchUserData();
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo);
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }

    // login({username: username, password: password}).then(
    //   () => {
    //     fetchUserData;
    //     const redirectTo = location.state?.from?.pathname || "/";
    //     console.log('redirectTo:', redirectTo);
    //     navigate(redirectTo);
    //   },
    //   (error) => {
    //     const resMessage =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();

    //     setLoading(false);
    //     setMessage(resMessage);
    //   }
    // );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center ${
                isSignIn ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'
              }`}
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                !isSignIn ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'
              }`}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
              <Form>
                <div className="mb-4">
                  <label htmlFor="username" className="block mb-2 text-sm font-medium">
                    {isSignIn ? 'Username' : 'Email'}
                  </label>
                  <Field
                    name="username"
                    type="text"
                    id="username"
                    className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder={isSignIn ? 'Username' : 'Email'}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    {isSignIn && (
                      <a href="#" className="text-sm text-purple-400 hover:underline">
                        Forgot Password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 mt-4 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : isSignIn ? 'Sign In' : 'Sign Up'}
                </button>
                {message && (
                  <div className="mt-4 text-sm text-red-500">
                    <p>{message}</p>
                  </div>
                )}
              </Form>
          </Formik>
          {isSignIn && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">License not activated yet?</p>
              <a href="#" className="text-sm text-purple-400 hover:underline">
                Activate
              </a>
            </div>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Powered by FramerAuth</p>
          </div>
        </div>

      {/* <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage
                name="username"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik> */}
        {/* <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center ${
                isSignIn ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'
              }`}
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                !isSignIn ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'
              }`}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                {isSignIn && (
                  <a href="#" className="text-sm text-purple-400 hover:underline">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          {isSignIn && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">License not activated yet?</p>
              <a href="#" className="text-sm text-purple-400 hover:underline">
                Activate
              </a>
            </div>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Powered by FramerAuth</p>
          </div>
        </div> */}
      </div>
    </div>
  )
}

