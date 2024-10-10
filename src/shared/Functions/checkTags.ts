function checkTags(input: string): boolean {
    const stack: string[] = [];
    const allowedTags = ['a', 'i', 'strong', 'code'];
    const tagPattern = /<\/?(a|i|strong|code|script)>/g;
    
    let match: RegExpExecArray | null;

    while ((match = tagPattern.exec(input)) !== null) {
        const tag = match[0];
        const tagName = match[1];

        if (!allowedTags.includes(tagName)) {
            return false; 
        }

        if (tag.startsWith('</')) {
            if (stack.length === 0 || stack.pop() !== tagName) {
                return false; 
            }
        } else {
            stack.push(tagName);
        }
    }
    
    if (stack.length === 0){
        return true
    }else {
        return false
    }
}


export default checkTags

