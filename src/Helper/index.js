export function getStarEmail(email) {
    let result = email.indexOf("@") - 3;
    let middleEmail = email.split('@')[0].slice(3, result);
    let str = '';
    for (let i = 0; i < middleEmail.length; i++) {
        str += '*'
    }
    return email.replace(middleEmail, str);
}

export function generateRandomColor(){
    let letters = '0123456789ABCDEF';
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}