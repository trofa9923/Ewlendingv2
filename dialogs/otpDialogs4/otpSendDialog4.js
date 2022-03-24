var request = require('request');
const { WaterfallDialog, ConfirmPrompt, ComponentDialog, ChoicePrompt, ChoiceFactory, ListStyle } = require('botbuilder-dialogs');
const { ChannelServiceRoutes } = require('botbuilder');

WATERFALL_DIALOG = 'WATERFALL_DIALOG';
OTP_SEND_DIALOG4 = 'OTP_SEND_DIALOG4';
CONFIRMATION_DIALOG = 'CONFIRMATION_DIALOG';
CHOICE_PROMPT = 'CHOICE_PROMPT';

class OtpSendDialog4 extends ComponentDialog {
    constructor() {
        super(OTP_SEND_DIALOG4);

        this.addDialog(new ConfirmPrompt(CONFIRMATION_DIALOG));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.sendOtpStep.bind(this),
            this.validateStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async sendOtpStep(stepContext) {
        stepContext.values.mobileNumber= stepContext.options.mobileNumber;
        stepContext.values.emailAddress = stepContext.options.emailAddress;
        stepContext.values.name = stepContext.options.name;
        stepContext.values.typeOTP = stepContext.options.typeOTP;
        stepContext.values.otp = this.generateOTP();
        console.log(`stepContext.values.otp: ${ stepContext.values.otp}`);
        console.log(`stepContext.values.mobileNumber: ${ stepContext.values.mobileNumber}`);
        stepContext.values.reference = "REF-" + Math.floor(Math.random() * (9999999 - 1000000) + 1000000);


        

        if(stepContext.values.typeOTP  == "MOBILE") {
            await stepContext.context.sendActivity("I will now send OTP to your mobile number.");
            var queryDone = "No";

            let q1 = this.flowOTP(stepContext.values.otp, stepContext.values.mobileNumber, stepContext.values.reference);

            q1.then(function(res) {
                queryDone = "Yes";
            }, function(err){
                queryDone = "Yes";
            })

            while(queryDone == "No") {
                await stepContext.context.sendActivity({type: 'typing'});
            }
        }
        else {
            await stepContext.context.sendActivity("I will now send OTP to your email address. Please check spam folder, the OTP might be sent there.");
            var queryDone = "No";

            let q2 = this.flowEmailOTP(stepContext.values.otp, stepContext.values.emailAddress, stepContext.values.name, stepContext.values.reference);

            q2.then(function(res) {
                queryDone = "Yes";
            }, function(err){
                queryDone = "Yes";
            })

            while(queryDone == "No") {
                await stepContext.context.sendActivity({type: 'typing'});
            }
        }
        
        //return await stepContext.prompt(CONFIRMATION_DIALOG, 'Have you received your one-time password (OTP)? If you have not received it within one minute, click resend.', ['Yes', 'No']);
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Have you received your one-time password (OTP)? If you have not received it within one minute, click No, resend it.',
            choices: ChoiceFactory.toChoices(['Yes, I got it', 'No, resend it']),
            style: ListStyle.suggestedAction
        });
    }

    async validateStep(stepContext) {
        if(stepContext.result.value == "Yes, I got it") {
            return await stepContext.endDialog(stepContext.values);
        }
        else {
            await stepContext.context.sendActivity("I will generate and send a new OTP for you.");
            return await stepContext.replaceDialog(OTP_SEND_DIALOG4, stepContext.values);
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

    flowEmailOTP(otp, emailAddress, name, reference) {
      
        var options =
        {
            //LOGIC APP : CARDSBOT_SEND_EMAIL_OTP
            url: 'https://prod-17.southeastasia.logic.azure.com:443/workflows/b42b00824c534f1688a7ab6aa38a4c05/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=w8I7hsCtTbzD8S748qYMIvUcN5v8F4NPSBPV7pQkLuc',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify
            ({

                "OTP" : otp,
                "EMAIL": emailAddress,
                "NAME": name,
                "ReferenceNumber" : reference
                
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

    flowOTP(otp, mobileNumber, reference) {
        // Todo
        console.log(`In flowOTP, otp is ${otp}`);

        var options =
        {
            //LOGIC APP : CARDSBOT_SEND_OTP
            url: 'https://prod-08.southeastasia.logic.azure.com:443/workflows/a477cfe7bfac4cf2b48881a49fe4a6cc/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nCZNCkgFNJYrRhay2-hQyaIWk8cQL_NKB2GVcnldstU',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify
            ({

                "OTP" : otp,
                "mobilenumber": mobileNumber,
                "ReferenceNumber" : reference
                
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

module.exports.OtpSendDialog4 = OtpSendDialog4;
module.exports.OTP_SEND_DIALOG4 = OTP_SEND_DIALOG4;
