import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const steps = [
  { label: 'User login', slug: 'sign-in' },
  { label: 'Shipping Address', slug: 'shipping-address' },
  { label: 'Payment Method', slug: 'payment-method' },
  { label: 'Place Order', slug: 'place-order' },
] as const;

type CheckoutStepsProps = {
  current: (typeof steps)[number]['slug'];
};

const CheckoutSteps = ({
  current = 'shipping-address',
}: CheckoutStepsProps) => {
  return (
    <div className="flex-between mb-10 flex-col space-y-2 space-x-2 md:flex-row">
      {steps.map((step) => (
        <React.Fragment key={step.label}>
          <div
            className={cn(
              'w-56 rounded-full p-2 text-center text-sm',
              step.slug === current && 'bg-secondary'
            )}
          >
            {step.slug === 'sign-in' ? (
              <>{step.label}</>
            ) : (
              <Link href={step.slug}>{step.label}</Link>
            )}
          </div>
          {step.label !== 'Place Order' && (
            <hr className="mx-2 w-16 border-t border-gray-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
