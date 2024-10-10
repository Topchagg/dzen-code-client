function safeAdd(a:number, b:number,c:number) {
    const numA = isNaN(a) ? 0 : Number(a);
    const numB = isNaN(b) ? 0 : Number(b);
    const numC = isNaN(c) ? 0 : Number(c);

    return numA + numB+numC;
}

export default safeAdd