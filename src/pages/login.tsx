import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();

  const [loginMutation, { data, loading, error }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION);

  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        email,
        password,
      },
    });
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Login</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            ref={register({ required: "이메일을 입력하여 주세요." })}
            required
            type="email"
            name="email"
            placeholder="email"
            className="bg-gray-100 shadow-inner focus:outline-none border-2 focus:border-opacity-50 focus:border-green-600 mb-3 py-3 px-5 rounded-lg"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            ref={register({
              required: "비밀번호를 입력하여 주세요.",
              minLength: 10,
            })}
            required
            type="password"
            name="password"
            placeholder="password"
            className="bg-gray-100 shadow-inner focus:outline-none border-2 focus:border-opacity-50 focus:border-green-600 py-3 px-5 rounded-lg"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage={"최소 10글자 이상이 필요합니다."} />
          )}
          <button className="py-3 px-5 bg-gray-800 text-white mt-3 text-lg rounded-lg focus:outline-none hover:opacity-90">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};
