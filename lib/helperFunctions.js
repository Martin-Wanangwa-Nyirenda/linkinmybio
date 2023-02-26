
export function getNameFromEmail(email){
    return (email.substring(0, email.lastIndexOf("@")));
}

export function createShareURL(uid){
    let domain = window.location.host;
    return (domain + "/posts/" + uid)
}