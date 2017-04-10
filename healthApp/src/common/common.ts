export function yyyymmdd(dateNum){
    let date = new Date(dateNum);
    let yyyy = date.getFullYear();
    let mm:any = date.getMonth()+1;
    let dd:any = date.getDate();
    
    return yyyy+(mm<10?'0'+mm:mm)+(dd<10?'0'+dd:dd);
}

export function presentToast(toastCtrl, msg, position, duration) {
    //top, middle, bottom
    let toast = toastCtrl.create({
        message: msg,
        position: position,
        duration: duration || 3000
    });
    toast.present();
}

export function defaultImg(target){
    target.img = 'icon';
}