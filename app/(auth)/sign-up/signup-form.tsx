'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpUser } from '@/lib/actions/user.actions';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? 'Submitting...' : 'Sign up'}
      </Button>
    );
  };
  return (
    <form className="space-y-6" action={action}>
        <input type="hidden" name='callbackUrl' value={callbackUrl} />
      <div>
        <Label htmlFor="email">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
        ></Input>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
        ></Input>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="password"
          defaultValue={signUpDefaultValues.password}
        ></Input>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="confirmPassword"
          defaultValue={signUpDefaultValues.confirmPassword}
        ></Input>
      </div>
      <div>
        <SignUpButton />
      </div>

      {data && !data.success && (
        <div className="text-destructive text-center">{data.message}</div>
      )}

      <div className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" target="_self" className="link">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
