import { useMutation } from '@tanstack/react-query';
import { signIn } from '@/services/iam/auth.service';
import type { SignInRequest, SignInResponse } from '@/core/dtos/auth.dto';

type LoginVars = SignInRequest;
type LoginResult = SignInResponse;

export function useLogin() {
  const mutationFn = (vars: LoginVars) => signIn(vars.email, vars.password) as Promise<LoginResult>;
  return useMutation<LoginResult, Error, LoginVars>({ mutationFn });
}
