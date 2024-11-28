import otpGenerator from "otp-generator";

const OTPGenerator = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
    digits: true
});

export default OTPGenerator;