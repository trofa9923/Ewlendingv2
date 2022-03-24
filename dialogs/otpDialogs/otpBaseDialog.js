const { WaterfallDialog, ComponentDialog  } = require('botbuilder-dialogs');
const { OtpSendDialog, OTP_SEND_DIALOG } = require('./otpSendDialog');
const { OtpValidateDialog, OTP_VALIDATE_DIALOG} = require('./otpValidateDialog');

const OTP_BASE_DIALOG = 'OTP_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class OtpBaseDialog extends ComponentDialog {
    constructor() {
        super(OTP_BASE_DIALOG);

        this.addDialog(new OtpSendDialog());
        this.addDialog(new OtpValidateDialog());        
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.validateReceivedOtpStep.bind(this),
            this.validateOtp.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async validateReceivedOtpStep(stepContext) {
        stepContext.values.mobileNumber
            = stepContext.options.mobile ? stepContext.options.mobile : stepContext.options.mobileNumber;
        return await stepContext.beginDialog(OTP_SEND_DIALOG, stepContext.values);
    }

    async validateOtp(stepContext) {
        stepContext.values.otp = stepContext.result;
        return await stepContext.beginDialog(OTP_VALIDATE_DIALOG, stepContext.values.otp);
    }

    async endStep(stepContext) {
        return await stepContext.endDialog();   
    }

}

module.exports.OtpBaseDialog = OtpBaseDialog;
module.exports.OTP_BASE_DIALOG = OTP_BASE_DIALOG;
