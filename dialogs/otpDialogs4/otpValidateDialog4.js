const { ComponentDialog, WaterfallDialog, NumberPrompt } = require('botbuilder-dialogs')

OTP_VALIDATE_DIALOG4 = 'OTP_VALIDATE_DIALOG4';
WATERFALL_DIALOG = 'WATERFALL_DIALOG';
NUMBER_PROMPT = 'NUMBER_PROMPT';

class OtpValidateDialog4 extends ComponentDialog {
    constructor() {
        super(OTP_VALIDATE_DIALOG4);

        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.otpValidator));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.validateOtpStep.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async validateOtpStep(stepContext) {
        console.log("\n\rSTEP.OPTIONS" + JSON.stringify(stepContext.options));
        console.log(`In validateOtpStep, One Time Password is ${ stepContext.options.otp }`);
        const otpValidPrompts = { prompt: 'Please enter your 6-digit one-time password.', 
                                    retryPrompt: 'You have entered a wrong OTP. If you have requested a resend of the OTP, please make sure to key in the OTP associated with the reference number ' + stepContext.options.reference + '.', validations: stepContext.options.otp};

        return await stepContext.prompt(NUMBER_PROMPT, otpValidPrompts);
    }

    async otpValidator(promptContext) {

        console.log(`In otpValidator, One Time Password is ${ promptContext.options.validations }`);

        return promptContext.recognized.succeeded && promptContext.options.validations == promptContext.recognized.value;
    }

    async endStep(stepContext) {
        return await stepContext.endDialog();
    }
}

module.exports.OtpValidateDialog4 = OtpValidateDialog4;
module.exports.OTP_VALIDATE_DIALOG4 = OTP_VALIDATE_DIALOG4;
