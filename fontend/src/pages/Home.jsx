import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

function Home() {
  useEffect(() => {
    const token = Cookies.get('user');
    console.log('Token:', token);
  }, []);

  return (
    <div>
      <p>Current Token: {Cookies.get('user')}</p>
    </div>
  );
}

export default Home;
