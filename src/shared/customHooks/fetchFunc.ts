const fetchData = async (body,url,method,options) => {
    try {
        const response = await fetch(url,{
            'method': method,
            body: JSON.stringify({...body}),
            options: {...options}
        })
        const data = (await response).json()
        return data
    }catch {
        
    }
    }