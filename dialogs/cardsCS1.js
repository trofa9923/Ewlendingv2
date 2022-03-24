// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const request = require('request');


const { CardFactory, MessageFactory } = require('botbuilder');
const { ActivityTypes, ActionTypes } = require('botbuilder');
const {
    ComponentDialog,
    WaterfallDialog,
    ConfirmPrompt,
    TextPrompt,
    ChoicePrompt,
    ListStyle,
    ChoiceFactory
} = require('botbuilder-dialogs');

const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const CARDSAQUI1_WATERFALL_DIALOG = 'CARDSAQUI1_WATERFALL_DIALOG';
const { CardsUser1 } = require('./helperDialogs/CardsUser1');

const { CardsCS2, CARDS_CS2 } = require('./cardsCS2');
const { CardsCS3, CARDS_CS3 } = require('./cardsCS3');
const { CardsCS4, CARDS_CS4 } = require('./cardsCS4');

const CARDS_CS1 = 'CARDS_CS1';

// List of months
const MONTHS_ARR = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

// List of days
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

class CardsCS1 extends ComponentDialog {
    constructor() {
        super(CARDS_CS1);

        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new TextPrompt(EMAIL_PROMPT, this.checkEmail));
        this.addDialog(new CardsCS2(CARDS_CS2));
        this.addDialog(new CardsCS4(CARDS_CS4));
        this.addDialog(new CardsCS3(CARDS_CS3));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new WaterfallDialog(CARDSAQUI1_WATERFALL_DIALOG, [
            this.welcomeStep.bind(this),
            this.applyConfirmation.bind(this)
        ]));

        this.initialDialogId = CARDSAQUI1_WATERFALL_DIALOG;
    }

    async checkEmail(promptContext) {
        return promptContext.recognized.succeeded && emailIsValid(promptContext.recognized.value);
    }

    async welcomeStep(step) {
        step.values.regularUser = new CardsUser1();
        step.values.regularUser.fbPsid = step.options.psid;
        step.values.regularUser.fbFirstName = step.options.fbFirstName;

        var queryDone = "No";

        let checking = checkPsid(step.values.regularUser.fbPsid, "checkPsid");

        checking.then(function (res) {
            if (typeof res.Table1 == 'undefined') {
                queryDone = "Yes";
            }
            else {
                step.values.regularUser = res.Table1[0]
                queryDone = "Yes";
            }
        }, function (err) {
            queryDone = "Yes";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        console.log("PSID " + step.values.regularUser.fbPsid + " of mobile "
            + step.values.regularUser.mobile);

        console.log("\nSTATUS: " + step.values.regularUser.status);

        if (step.values.regularUser.status) {
            let curr = new Date();
            let dateF = new Date(step.values.regularUser.followUpDate);
            step.values.regularUser.followupstr = DAYS_OF_WEEK[dateF.getDay()] + ", "
                + MONTHS_ARR[dateF.getMonth()] + " " + dateF.getDate() + ", " + dateF.getFullYear();

            console.log('\n\n FOLLOW-UP DATE: ' + step.values.regularUser.followupstr);

            // status is pending
            if (step.values.regularUser.status == "PENDING"
                || step.values.regularUser.status == "CANCEL_REQUIREMENTS_SUBMITTED"
                || step.values.regularUser.status == "PENDING_DQ") {
                if(curr > dateF ) {
                    await step.context.sendActivity("Please forgive the delay. We are encountering \
                        delays in evaluating your application because of quarantine restrictions. \
                        Rest assured that we are working on your application. We will advise you \
                        when there is movement in your application status. In the meantime, if you \
                        have any questions, please click this link - \
                        www.ewlend.com/feedback".replace(/\s\s+/g, ' ').trim());
                    return await step.endDialog();
                }

                await step.context.sendActivity("Thank you. We will provide feedback on or before " 
                    + step.values.regularUser.followupstr + ". We will advise you once your card application has been \
                    approved. In the meantime, we have sent an SMS with a link that you can use anytime to \
                    monitor the status of your application. You can also click FOLLOW UP in the chatbox."
                    .replace(/\s\s+/g, ' '));

                await step.context.sendActivity("If you have any questions, please click this link - \
                    www.ewlend.com/feedback. Thank you and goodbye!".replace(/\s\s+/g, ' '));
                    
                return await step.endDialog();
            }
    
            // status is disqualified
            else if (step.values.regularUser.status == "DISQUALIFIED"
                || step.values.regularUser.status == "DECLINED") {
                await step.context.sendActivity("Thank you for your EastWest Credit Cards. We \
                    regret to inform you that after a thorough evaluation, we will be unable to \
                    issue you a credit card at this time. We hope to be of service to you in the \
                    future.".replace(/\s\s+/g, ' ').trim());
                return await step.endDialog();
            }

            else if (step.values.regularUser.status == "NEED_KYC2"
                    || step.values.regularUser.status == "GOV_ID2"
                    || step.values.regularUser.status == "SIGNATURE2"
                    || step.values.regularUser.status == "PROMOTIONS2"
                    || step.values.regularUser.status == "TERMS2"
                    || step.values.regularUser.status == "INCOME2"
                    || step.values.regularUser.status == "VIDEO2") {
                return await step.beginDialog(CARDS_CS3, step.values.regularUser);
            }

            else if (step.values.regularUser.status == "NEED_INCOME"
                    || step.values.regularUser.status == "GOV_ID3"
                    || step.values.regularUser.status == "SIGNATURE3"
                    || step.values.regularUser.status == "PROMOTIONS3"
                    || step.values.regularUser.status == "TERMS3"
                    || step.values.regularUser.status == "INCOME3"
                    || step.values.regularUser.status == "ITR3"
                    || step.values.regularUser.status == "VIDEO3") {
                return await step.beginDialog(CARDS_CS4, step.values.regularUser);
            }

            // status is approved
            else if (step.values.regularUser.status == "APPROVED") {
                await step.context.sendActivity("Your credit card is ready for delivery. Your card \
                    will be delivered on or before ".replace(/\s\s+/g, ' ') + step.values.regularUser.followupstr + 
                    ". If you wish to follow up on your credit card, you may call our 24 hour customer \
                    service hotline at (+632) 8888-1700.".replace(/\s\s+/g, ' ').trim());
                return await step.endDialog();
            }

            // C_FORM_SUBMITTED_1 - company ID
            // NEED_GOV_NUM - TIN or GSIS/SSS
            else if (step.values.regularUser.status == "VERIFIED_MOBILE_NUMBER"
                ||step.values.regularUser.status == "C_FORM_SUBMITTED_1"
                || step.values.regularUser.status == "NEED_GOVNUM") {
                return await step.beginDialog(CARDS_CS2, step.values.regularUser);
            }

            // goes to cardsCS5.js when status is set to cancelled.
            else if (step.values.regularUser.status == "CANCELLED") {
                const dpCard3 = CardFactory.heroCard(
                    'Your application has been cancelled. Please click the RESOLVE button below.',
                    null,
                    CardFactory.actions([
                        {
                            type: ActionTypes.PostBack,
                            title: 'Resolve',
                            value: 'resolveProceedCS-' + step.values.regularUser.mobile
                        }
                    ])
                );
                await step.context.sendActivity({ attachments: [dpCard3] });
                return await step.endDialog();
            }

            // re-apply if expired
            else if (step.values.regularUser.status == "EXPIRED") {
                await step.context.sendActivity("Your aplication validity has expired. You need to \
                    try applying again.".replace(/\s\s+/g, ' ').trim());
                return await step.next();
            }

            else {
                return await step.beginDialog(CARDS_CS2, step.values.regularUser);
            }
        }
        else {
            return await step.beginDialog(CARDS_CS2, step.values.regularUser);
        }
    }

    async applyConfirmation(step) {
        if(step.values.regularUser.status == "EXPIRED") {
            return await step.beginDialog(CARDS_CS2, step.values.regularUser);
        }

        return await step.endDialog();
    }
}

//check if email is valid
function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function checkPsid(fbPsid, query) {
    var options =
    {
        url: 'https://prod-12.southeastasia.logic.azure.com:443/workflows/217f12eeff944a97b7ed2e37a444d030/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3vS_4KEYtIsv0DKO6J0JpzI0LpCGcBTFbEhB1lNCi4',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
            ({
                "fbPsid": fbPsid,
                "query": query
            })
    };

    return new Promise(function (resolve, reject) {
        request.post(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }
            else {
                reject(error);
            }
        })
    })

}

module.exports.CardsCS1 = CardsCS1;
module.exports.CARDS_CS1 = CARDS_CS1;