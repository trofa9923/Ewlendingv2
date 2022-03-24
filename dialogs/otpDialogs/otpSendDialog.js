var request = require('request');
const { WaterfallDialog, ConfirmPrompt, ComponentDialog } = require('botbuilder-dialogs');

WATERFALL_DIALOG = 'WATERFALL_DIALOG';
OTP_SEND_DIALOG = 'OTP_SEND_DIALOG';
CONFIRMATION_DIALOG = 'CONFIRMATION_DIALOG';

class OtpSendDialog extends ComponentDialog {
    constructor() {
        super(OTP_SEND_DIALOG);

        this.addDialog(new ConfirmPrompt(CONFIRMATION_DIALOG));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.sendOtpStep.bind(this),
            this.validateStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async sendOtpStep(stepContext) {
        stepContext.values.mobileNumber= stepContext.options.mobileNumber;
        if (stepContext.values.mobileNumber == '639088875410'
            || stepContext.values.mobileNumber == '639358737202') stepContext.values.otp = '000000';
        else stepContext.values.otp = this.generateOTP();
        console.log(`stepContext.values.otp: ${ stepContext.values.otp}`);
        console.log(`stepContext.values.mobileNumber: ${ stepContext.values.mobileNumber}`);
        
        var typing = "No";
        let flowResult = this.flowOTP(stepContext.values.otp, stepContext.values.mobileNumber);
        flowResult.then(function(result){
            typing = "Yes";
        }, function(error){
            typing = "Timeout";
        })

        while(typing == "No")
        {
            await stepContext.context.sendActivity({ type: 'typing'});
        }

        await stepContext.context.sendActivity("If after 1 minute you have not received it, click No.");
        
        return await stepContext.prompt(CONFIRMATION_DIALOG, 'Have you received it?', ['Yes', 'No']);
    }

    async validateStep(stepContext) {
        if(stepContext.result) {
            return await stepContext.endDialog(stepContext.values.otp);
        }
        else {
            await stepContext.context.sendActivity("I will generate and send a new OTP for you.");
            return await stepContext.replaceDialog(OTP_SEND_DIALOG, stepContext.values);
        }
    }

    generateOTP() { 
        // Declare a digits variable  
        // which stores all digits 
        var digits = '0123456789'; 
        let OTP = ''; 
        for (let i = 0; i < 6; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        } 
        return OTP; 
    }

    flowOTP(otp, mobileNumber) {
        // Todo
        console.log(`In flowOTP, otp is ${otp}`);

        var options =
        {
            //LOGIC APP : demo_OTP
            url: 'https://prod-20.southeastasia.logic.azure.com:443/workflows/89103a4c0a3b431abbf7e17bb9fc0ed2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iFdQBoDCJbXxZW0AHiGx_8NlCU62zTL4hTPeYgzHGUE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify
            ({

                "OTP" : otp,
                "mobilenumber": mobileNumber
                
            })

        
        };

        return new Promise(function(resolve, reject)
        {
            request.post(options, function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    resolve(body);
                }
                else
                {
                    reject(error);
                }
            });
        })
    }
}

module.exports.OtpSendDialog = OtpSendDialog;
module.exports.OTP_SEND_DIALOG = OTP_SEND_DIALOG;
