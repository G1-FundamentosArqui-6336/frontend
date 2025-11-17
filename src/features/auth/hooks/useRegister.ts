import { useMutation } from '@tanstack/react-query';
import { signUp } from '@/services/iam/auth.service';
import type { SignUpRequest, SignUpResponse } from '@/core/dtos/auth.dto';

export function useRegister() {
  const mutationFn = (payload: SignUpRequest) => signUp(payload) as Promise<SignUpResponse>;
  return useMutation<SignUpResponse, Error, SignUpRequest>({ mutationFn });
}
