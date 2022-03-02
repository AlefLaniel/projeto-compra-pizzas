const mailer = require("nodemailer");

module.exports = (detailsp, subtotal, desconto, total, email, nome, telefone, rua, numerocasa, complemento, cep) => {
    const smtpTransport = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        secure: true, //SSL/TLS
        auth: {
            user: 'alefdevlaniel@gmail.com',
            pass: 'Kinha2594'
        }
    })

    const mensagem = `Detalhes do Pedido: \n 
    Detalhes - ${detailsp} \n Subtotal - ${subtotal} \n Desconto - ${desconto} \n Total = ${total} \n 
    Dados do Usuario: \n 
    Nome - ${nome} \n E-mail - ${email} \n Celular - ${telefone} \n 
    Endereço do Cliente: \n
    Rua - ${rua} \n Nº ${numerocasa} Complemento - ${complemento} \n CEP - ${cep}`
    
    
    const mail = {
        from: "Pizza Dev<alefdevlaniel@gmail.com>",
        to: "alefdevlaniel@gmail.com",
        subject: `❤️ Aqui está o manual que vai fazer você virar a chave da sua vida! ❤️`,
        html: { path: './obrigado.html' },
        attachments: mensagem
    }
    /*
    if(anexo){
        console.log(anexo);
        mail.attachments = [];
        mail.attachments.push({
            filename: anexo.originalname,
            content: anexo.buffer
        })
    }
    */
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mail)
            .then(response => {
                smtpTransport.close();
                console.log("SMTP resposta:", response);
                return resolve(response);
            })
            .catch(error => {
                console.log("SMTP error:", error);
                smtpTransport.close();
                return reject(error);
                
                console.log(error);
            });
    })
}