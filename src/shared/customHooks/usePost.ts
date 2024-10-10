import { useState } from 'react';

const usePost = (url:String) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOk,setIsOk] = useState<null|boolean>(null) 

    const postData = async (body:any, options = {}) => {
        setLoading(true);
        setError(null); 

        try {
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers, 
                },
                body: JSON.stringify(body), 
                ...options, 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setIsOk(response.ok)            
            const result = await response.json();
            setData(result); 
        } catch (err) {
            setError(err.message); 
        } finally {
            setLoading(false); 
        }
    };

    return { isOk,data, loading, error, postData };
};

export default usePost;