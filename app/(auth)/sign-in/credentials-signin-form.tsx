'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? 'Signing in...' : 'Sign in'}
      </Button>
    );
  };
  return (
    <form className="space-y-6" action={action}>
        <input type="hidden" name='callbackUrl' value={callbackUrl} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
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
          defaultValue={signInDefaultValues.password}
        ></Input>
      </div>
      <div>
        <SignInButton />
      </div>

      {data && !data.success && (
        <div className="text-destructive text-center">{data.message}</div>
      )}

      {JSON.stringify(data)}

      <div className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" target="_self" className="link">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
