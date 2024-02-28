interface emailTemplatetype{
    name:string;
    token:string;
    id:string;
}

export const resetPasswordEmailTemplate = ({name,token,id}:emailTemplatetype)=>`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Email</title>
</head>
<body>
    <p>Hello, ${name}</p>
    <p>You have requested to reset your password. Please click the link below to reset your password:</p>
    <a href="https://example.com/reset-password?resetToken=${token}&id=${id}">Reset Password</a>
    <p>If you did not request this password reset, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The Example Team</p>
</body>
</html>`;