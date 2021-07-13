const nodemailer=require('nodemailer')
function enviar(to,subject,text){
    let transporter= nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'',//colocar su correo electronico
            pass:'' //colocar su clave
        }
        
    })
    let mailOptions={
        from:'mframirezfuentes@gmail.com',
        to,
        subject,
        text,
    }
    transporter.sendMail(mailOptions,(err,data)=>{
        if(err){
            console.log(err)
        }
        if(data){
            console.log(data)
        }
    })
}
 module.exports=enviar
 
