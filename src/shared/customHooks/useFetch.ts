import { useState, useEffect } from 'react';

type FetchOptions = RequestInit; 


function useFetch(url: string,dep:any[], options?: FetchOptions) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true; 

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error: unknown) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: (error as Error).message || 'Unpredictable error',
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, options, ...dep]); 

  return state;
}

export default useFetch;