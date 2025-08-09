declare module 'next/link' {
  import React from 'react';
  type LinkProps = {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    children: React.ReactNode;
    className?: string;
  };
  const Link: React.FC<LinkProps>;
  export default Link;
}