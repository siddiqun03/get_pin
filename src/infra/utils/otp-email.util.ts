const mailOptions = (to, otp, login, password) => ({
  from: '"Get-Pin Team" <your-email@gmail.com>',
  to,
  subject: 'Your OTP Code for Secure Access',
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Righteous&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">   
    <title>Your OTP Code</title>
</head>
<body style="font-family: 'Roboto', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #007bff; padding: 10px; text-align: center;">
            <p style="font-family: Righteous;font-size: 40px;letter-spacing: -2px;margin: 0;color: #fff;">Getpin</p>
        </div>
        <div style="padding: 20px;text-align: center;">
            <h2 style="color: #333;">Hi ${to},</h2>
            <p style="color: #555; font-size: 14px;">You requested a one-time password (OTP) for secure access to your upcoming meeting.<br>Your <span style="color: blueviolet;font-size: 16px"><b><u>OTP</u></b></span> is:</p>
            <p style="font-size: 20px; color: #fff; font-weight: bold;padding: 8px;border-radius: 10px;background: rgb(89,40,87);background: linear-gradient(90deg, rgba(89,40,87,0.7) 36%, rgba(59,0,255,0.7) 70%);">${otp}</p>
            <p style="color: #555; font-size: 14px;font-weight: bolder">(This OTP is valid for the next <span style="color: blueviolet;font-size: 16px"><b><u>59</u></b></span> seconds.)</p>
            <hr>
            <p style="color: #555; font-size: 14px;">You requested a <span style="color: blueviolet;"><b><u>Login</u></b></span> for secure access to your upcoming site.<br>Your <span style="color: blueviolet;font-size: 16px"><b><u>Login</u></b></span> is:</p>
            <p style="font-size: 20px; color: #fff; font-weight: bold;padding: 8px;border-radius: 10px;background: rgb(89,40,87);background: linear-gradient(90deg, rgba(89,40,87,0.7) 36%, rgba(59,0,255,0.7) 70%);">${login}</p>
            <hr>
            <p style="color: #555; font-size: 14px;">You requested a <span style="color: blueviolet;"><b><u>Password</u></b></span> for secure access to your upcoming site.<br>Your <span style="color: blueviolet;font-size: 16px"><b><u>Password</u></b></span> is:</p>
            <p style="font-size: 20px; color: #fff; font-weight: bold;padding: 8px;border-radius: 10px;background: rgb(114,53,113);background: linear-gradient(90deg, rgba(89,40,87,0.7) 36%, rgba(59,0,255,0.7) 70%);">${password}</p>
            <p style="color: #555; font-size: 14px;">If you did not request this code, please ignore this email.</p>
            <p style="color: #555; font-size: 14px;">For any assistance, contact our support team at uzgetter@gmail.com.</p>
        </div>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px;">"Get-Pin 📌" Team | <a href="#" style="color: #007bff; text-decoration: none;">Privacy Policy</a> | <a href="#" style="color: #007bff; text-decoration: none;">Contact Us</a></p>
        </div>
    </div>
</body>
</html>`,
});

export default mailOptions;