import nodemailer,{Transporter} from 'nodemailer';

interface EmailOptions {
    to:string;
    subject?:string;
    text?:string;
    html?:string;
}


class EmailService {
    private transporter:Transporter
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'neupaneutsav.2001@gmail.com',
                pass:'Commando@123'
            }
        })
    }

    async sendEmail(options:EmailOptions):Promise<void>{
        try {
            const mailOptions = {
                from:'neupaneutsav.2001@gmail.com',
                to:options.to,
                subject:options.subject,
                text:options.text,
                html:options.html
            }
        await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.error("Error sending email:",error)
            throw new Error("Failed to send email");
        }
    } 
}

export default EmailService