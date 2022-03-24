const { WaterfallDialog, ComponentDialog  } = require('botbuilder-dialogs');
const { OtpSendDialog3, OTP_SEND_DIALOG3 } = require('./otpSendDialog3');
const { OtpValidateDialog3, OTP_VALIDATE_DIALOG3} = require('./otpValidateDialog3');

const OTP_BASE_DIALOG3 = 'OTP_DIALOG3';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class OtpBaseDialog3 extends ComponentDialog {
    constructor() {
        super(OTP_BASE_DIALOG3);

        this.addDialog(new OtpSendDialog3());
        this.addDialog(new OtpValidateDialog3());        
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.validateReceivedOtpStep.bind(this),
            this.validateOtp.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async validateReceivedOtpStep(stepContext) {
        stepContext.values.mobileNumber = stepContext.options.mobileNumber;
        stepContext.values.emailAddress = stepContext.options.email;
        stepContext.values.name = stepContext.options.fbFirstName;
        return await stepContext.beginDialog(OTP_SEND_DIALOG3, stepContext.values);
    }

    async validateOtp(stepContext) {
        stepContext.values.otp = stepContext.result;
        return await stepContext.beginDialog(OTP_VALIDATE_DIALOG3, stepContext.values.otp);
    }

    async endStep(stepContext) {
        return await stepContext.endDialog();   
    }

}

module.exports.OtpBaseDialog3 = OtpBaseDialog3;
module.exports.OTP_BASE_DIALOG3 = OTP_BASE_DIALOG3;
