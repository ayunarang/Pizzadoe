function send_otp(otp) {
    return `
<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification Email</title>
    </head>
    <body>
    <div style="padding:2.2rem; background-color: #F9F9F9; max-width: 800px; text-align: center;" class="outer-container">
        <div style="background-color: white; padding:1.5rem; margin: 2.2rem;" class="mail-content-container">
            <p style="font-size: 1.2rem; margin-bottom: 1rem; font-weight: 500; text-align:left" class="username">Hey,</p>
            <p style="font-size: 1rem; text-align:left" class="mail-content">Looks like you forgot the password for your account on Pizzadoe. Before we begin, we kindly ask you to verify your account. Please refer to the OTP given below to access your account:</p>
            <p style="font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0;" class="otp">${otp}</p>
            <hr style="width:100%;" class="hr">
            <p style="margin: 1.2rem 1 rem 1rem 1rem; font-size: 0.8rem" class="extra-info">This OTP is valid for 10 minutes. If you did not request this OTP, please ignore this email.</p>
        </div>
        <div style="font-size: 0.7rem; font-weight: 400; color: #B8C4CB;" class="last-content">Sent by Pizzadoe</div>
    </div>
    </body>
    </html>`;
}

module.exports = send_otp;