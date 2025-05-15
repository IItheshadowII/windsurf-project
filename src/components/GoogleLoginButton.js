import React, { useRef, useEffect } from 'react';

export default function GoogleLoginButton({ onToken }) {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: (response) => onToken(response.credential)
      });
      window.google.accounts.id.renderButton(
        googleBtnRef.current,
        { theme: 'outline', size: 'large', width: 300 }
      );
    }
  }, [onToken]);

  return <div ref={googleBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />;
}
