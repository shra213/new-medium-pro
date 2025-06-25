import emailjs from "emailjs-com";

export function sendOtp(email, otp) {
  const templateParams = {
    to_email: email,
    message: `Your OTP is: ${otp}`,
  };

  emailjs
    .send(
      "your_service_id",
      "your_template_id",
      templateParams,
      "your_user_id_or_public_key"
    )
    .then((res) => {
      console.log("Email sent!", res);
    })
    .catch((err) => {
      console.error("Email failed:", err);
    });
}
