const { ComponentDialog, WaterfallDialog, NumberPrompt } = require('botbuilder-dialogs')

OTP_VALIDATE_DIALOG2 = 'OTP_VALIDATE_DIALOG2';
WATERFALL_DIALOG = 'WATERFALL_DIALOG';
NUMBER_PROMPT = 'NUMBER_PROMPT';

class OtpValidateDialog2 extends ComponentDialog {
    constructor() {
        super(OTP_VALIDATE_DIALOG2);

        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.otpValidator));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.validateOtpStep.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async validateOtpStep(stepContext) {
        console.log(`In validateOtpStep, One Time Password is ${ stepContext.options }`);
        const otpValidPrompts = { prompt: 'Please enter your OTP.', 
                                    retryPrompt: 'You have entered a wrong One-Time Password. Please try again.', validations: stepContext.options};

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

module.exports.OtpValidateDialog2 = OtpValidateDialog2;
module.exports.OTP_VALIDATE_DIALOG2 = OTP_VALIDATE_DIALOG2;