const { WaterfallDialog, ComponentDialog  } = require('botbuilder-dialogs');
const { OtpSendDialog2, OTP_SEND_DIALOG2 } = require('./otpSendDialog2');
const { OtpValidateDialog2, OTP_VALIDATE_DIALOG2} = require('./otpValidateDialog2');

const OTP_BASE_DIALOG2 = 'OTP_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class OtpBaseDialog2 extends ComponentDialog {
    constructor() {
        super(OTP_BASE_DIALOG2);

        this.addDialog(new OtpSendDialog2());
        this.addDialog(new OtpValidateDialog2());        
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.validateReceivedOtpStep.bind(this),
            this.validateOtp.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async validateReceivedOtpStep(stepContext) {
        console.log('\n\nBase dialog: ' + JSON.stringify(stepContext.options));
        stepContext.values.mobileNumber = stepContext.options.mobileNo;
        stepContext.values.emailAddress = stepContext.options.emailAddress;
        stepContext.values.msgChoice = stepContext.options.msgChoice;
        stepContext.values.numberOTP = 1;
        stepContext.values.name = stepContext.options.fbFirstName;
        return await stepContext.beginDialog(OTP_SEND_DIALOG2, stepContext.values);
    }

    async validateOtp(stepContext) {
        stepContext.values.otp = stepContext.result;
        return await stepContext.beginDialog(OTP_VALIDATE_DIALOG2, stepContext.values.otp);
    }

    async endStep(stepContext) {
        return await stepContext.endDialog();   
    }
}

module.exports.OtpBaseDialog2 = OtpBaseDialog2;
module.exports.OTP_BASE_DIALOG2 = OTP_BASE_DIALOG2;