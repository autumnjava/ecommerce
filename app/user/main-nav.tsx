'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const links = [
    { title: 'Profile', url: '/user/profile' },
    { title: 'Orders', url: '/user/orders' },
  ];

  const pathname = usePathname();

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          href={link.url}
          key={link.url}
          className={cn(
            'hover:text-primary text-sm font-medium transition-colors',
            !pathname.includes(link.url) && 'text-muted-foreground'
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
