const { WaterfallDialog, ComponentDialog  } = require('botbuilder-dialogs');
const { OtpSendDialog4, OTP_SEND_DIALOG4 } = require('./otpSendDialog4');
const { OtpValidateDialog4, OTP_VALIDATE_DIALOG4} = require('./otpValidateDialog4');

const OTP_BASE_DIALOG4 = 'OTP_DIALOG4';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class OtpBaseDialog4 extends ComponentDialog {
    constructor() {
        super(OTP_BASE_DIALOG4);

        this.addDialog(new OtpSendDialog4());
        this.addDialog(new OtpValidateDialog4());        
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.validateReceivedOtpStep.bind(this),
            this.validateOtp.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async validateReceivedOtpStep(stepContext) {
        stepContext.values.mobileNumber = stepContext.options.mobileNumber;
        stepContext.values.emailAddress = stepContext.options.emailAddress;
        stepContext.values.name = stepContext.options.fbFName;
        stepContext.values.typeOTP = stepContext.options.typeOTP;
        return await stepContext.beginDialog(OTP_SEND_DIALOG4, stepContext.values);
    }

    async validateOtp(stepContext) {
        stepContext.values.otp = stepContext.result.otp;
        stepContext.values.reference = stepContext.result.reference;
        return await stepContext.beginDialog(OTP_VALIDATE_DIALOG4, stepContext.values);
    }

    async endStep(stepContext) {
        return await stepContext.endDialog();   
    }

}

module.exports.OtpBaseDialog4 = OtpBaseDialog4;
module.exports.OTP_BASE_DIALOG4 = OTP_BASE_DIALOG4;
