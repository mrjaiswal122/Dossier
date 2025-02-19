import nodemailer from 'nodemailer'
export const transporter=nodemailer.createTransport({
service:'Gmail',

auth:{
    user:`${process.env.DOSSIER_EMAIL}`,
    pass:`${process.env.DOSSIER_PASS}`
}
})