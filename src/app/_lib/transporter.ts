import nodemailer from 'nodemailer'
export const transporter=nodemailer.createTransport({
service:'Gmail',
host: 'smtp.gmail.com',
port: 587,
secure: false,
auth:{
    user:`${process.env.DOSSIER_EMAIL}`,
    pass:`${process.env.DOSSIER_PASS}`
}
})