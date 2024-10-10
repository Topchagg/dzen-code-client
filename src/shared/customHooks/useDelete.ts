import { useState } from 'react';

const useDelete = (url:string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [success, setSuccess] = useState(false);

    const deleteItem = async (id:string,jwt:string) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        console.log(jwt)
        try {
            const response = await fetch(`${url}${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
            const timer =setTimeout(() => {
                setError(false)
            }, 3000);
            
            clearTimeout(timer)
        } finally {
            setLoading(false);
        }
    };

    return { deleteItem, loading, error, success };
};

export default useDelete;