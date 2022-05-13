import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

console.log(process.env.EMAIL_HOST)

const defaultHead = `
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title></title>
            <!--[if (mso 16)]>
                <style type="text/css">
                    a {text-decoration: none;}
                </style>
            <![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        </head>
     `

const defaultHeader = `<h1>Next-Base</h1>`

export function sendAccountVerificationEmail(user, token) {
    return new Promise((resolve, reject) => {
        const tokenLink = `${process.env.FRONT_URL}/auth/account-validation/${token.token}`;
        const htmlBody = `
        <table class="es-content" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
            <tbody>
                <tr>
                    <td class="esd-stripe" align="center">
                        <table  cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td class="esd-container-frame" width="560"  align="center">
                                        <table  cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-block-text es-m-txt-c es-p10b" align="left">
                                                        <h1 style="font-size: 20px;color:#28357C;text-align:center">Validez votre adresse email</h1>
                                                        <p>Bonjour ${user.username && user.username !== '' ? user.username : user.email}</p>
                                                        <p>Pour activer votre compte, nous vous invitons à cliquer sur le lien ci-dessous:</p>
                                                        <p><a style="word-break: break-all;" href="${tokenLink}">${tokenLink}</a></p>
                                                    </td> 
                                                </tr>
                                                <tr style="border-collapse:collapse"> 
                                                    <td align="center" class="es-m-txt-c" style="padding-top:40px;padding-bottom:40px"> 
                                                        <span class="msohide es-button-border" style="border-style:solid;border-color:#1B2A2F;background-color:#28357C;border-width:0px;display:inline-block;border-radius:100px;width:auto;mso-hide:all"><a href="${tokenLink}" class="es-button msohide" target="_blank" style="mso-style-priority:100 !important;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#28357C;border-width:25px 40px 25px 40px;display:inline-block;background-color:#28357C;border-radius:100px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:600;font-style:normal;line-height:22px;width:auto;text-align:center;mso-hide:all;border-left-width:40px;border-right-width:40px">Confirmer mon compte</a></span> 
                                                    </td> 
                                                </tr>
                                                <tr>
                                                    <td align="left" class="esd-block-text es-p40b">
                                                        <p style="font-family: arial, 'helvetica neue', helvetica, sans-serif;">Bien cordialement,</p>
                                                        <p style="font-family: arial, 'helvetica neue', helvetica, sans-serif;">Next-Base</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        `;
        const emailSubject = 'Next-Base - Confirmation de l\'adresse email';
        const emailPlainText = 'Next-Base - Confirmation de l\'adresse email';
        sendEmail(user.email, [], [], emailSubject, emailPlainText, htmlBody, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });
}

export function sendResetPasswordEmail(user, token) {
    return new Promise((resolve, reject) => {
        const tokenLink = `${process.env.FRONT_URL}/auth/reset-password/${token.token}`;
        const htmlBody = `
        <table class="es-content" cellspacing="0" cellpadding="0" align="center" bgcolor="#ffffff">
            <tbody>
                <tr>
                    <td class="esd-stripe" align="center">
                        <table  cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td class="esd-container-frame" width="560"  align="center">
                                        <table  cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-block-text es-m-txt-c es-p10b" align="left">
                                                        <h1 style="font-size: 20px; color: #27357c">Votre mot de passe réinitialisé</h1>
                                                        <p>Bonjour ${user.username && user.username !== '' ? user.username : user.email},</p>
                                                        <p>La réinitialisation de votre mot de passe a été déclenchée depuis la fonction "Mot de passe oublié".</p>
                                                        <p>Veuillez mettre à jour votre de mot de passe en cliquant sur le lien suivant :</p>
                                                        <p>Attention ! Ce lien expire au bout de 2 heures.</p>
                                                    <td/>
                                                </tr>  
                                                <tr style="border-collapse:collapse"> 
                                                    <td align="center" class="es-m-txt-c" style="padding-top:40px;padding-bottom:40px"> 
                                                        <span class="msohide es-button-border" style="border-style:solid;border-color:#1B2A2F;background-color:#28357C;border-width:0px;display:inline-block;border-radius:100px;width:auto;mso-hide:all"><a href="${tokenLink}" class="es-button msohide" target="_blank" style="mso-style-priority:100 !important;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;border-style:solid;border-color:#28357C;border-width:25px 40px 25px 40px;display:inline-block;background-color:#28357C;border-radius:100px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:600;font-style:normal;line-height:22px;width:auto;text-align:center;mso-hide:all;border-left-width:40px;border-right-width:40px">Réinitialiser Mot de Passe</a></span> 
                                                    </td> 
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <p><a style="word-break: break-all;" href="${tokenLink}">${tokenLink}</a></p>
                                                        <p>Si vous n'êtes pas à l'origine de cette action ou que vous n'en aviez pas été informé, veuillez ignorer cet e-mail.</p>
                                                        <p>Bien cordialement.</p>
                                                        <p>Next-Base</p>
                                                    </td>
                                                </tr>
                                                
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        `;
        const emailSubject = 'Next-Base - Réinitialisation de votre mot de passe';
        const emailPlainText = 'Next-Base - Réinitialisation de votre mot de passe';
        sendEmail(user.email, [], [], emailSubject, emailPlainText, htmlBody, (err, response) => {
            if (err) return reject(err);
            resolve(response);
        });
    });
}

/**
 * 
 * @param {string} to 
 * @param {string[]} cc 
 * @param {string[]} bcc 
 * @param {string} subject 
 * @param {string} plainText 
 * @param {string} htmlBody 
 * @param {function} callback 
 * @returns {void}
 */
export function sendEmail(to, cc, bcc, subject, plainText, htmlBody, callback) {

    const mailOptions = {
        from: `"Next-Base - Ne pas répondre" <${process.env.EMAIL_USER}>`,
        to,
        cc,
        bcc,
        subject,
        text: plainText,
        html: ''
    };

    mailOptions.html = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html>
            ${defaultHead}
            <body style="font-family: sans-serif;">
                <div class="es-wrapper-color">
                    <!--[if gte mso 9]>
                        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                            <v:fill type="tile" color="#f6f6f6"></v:fill>
                        </v:background>
                    <![endif]-->
                    <table class="es-wrapper"  cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr>
                                <td class="esd-email-paddings" >
                                    ${defaultHeader}
                                    <br>
                                    <br>
                                    <br>
                                    <br>
                                    ${htmlBody}
                                    <br>
                                    <br>
                                    <br>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    `;

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error occurred. ' + err.message);
            console.log(err);
            callback(err, info);
            return process.exit(1);
        }
        callback(null, info);
    });
}
