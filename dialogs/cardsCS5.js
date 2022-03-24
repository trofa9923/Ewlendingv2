// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var request = require('request');
const moment = require('moment-business-days');
const d = new Date(); //date object javaScript
const currentDate = String(d.getDate()).padStart(2, '0') + "/"
    + String(d.getMonth() + 1).padStart(2, '0') + "/" + String(d.getFullYear());
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');

const { ActivityTypes, MessageFactory, BotStatePropertyAccessor } = require('botbuilder');
const {
    AttachmentPrompt,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');

//form matters
const { CardFactory } = require('botbuilder');
const { OtpBaseDialog3, OTP_BASE_DIALOG3 } = require('./otpDialogs3/otpBaseDialog3');
const VIDEO_PROMPT = 'VIDEO_PROMPT';
const ITR_PROMPT = 'ITR_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const IS_CARDED_PROMPT = 'IS_CARDED_PROMPT';
const CHOOSE_DOCUMENT_TYPE = 'CHOOSE_DOCUMENT_TYPE';
const CARDS_CS5 = 'CARDS_CS5';

// List of months
const MONTHS_ARR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 
    'Oct', 'Nov', 'Dec'];

// List of days
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];

// List of declined codes
const CODES_ARR = ['99', '3R', '3S', '3P', '3Q', '3H', '68', '65', 'UD', 'UX', 'HF', 'HD', 'GC',
    'UU','2V']

const { CardsUser1 } = require('./helperDialogs/CardsUser1');

//main Class with waterfall dialog
class CardsCS5 extends CancelAndHelpDialog {
    constructor() {
        super(CARDS_CS5);
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ChoicePrompt(CHOOSE_DOCUMENT_TYPE));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new ConfirmPrompt(IS_CARDED_PROMPT));
        this.addDialog(new OtpBaseDialog3());
        this.addDialog(new AttachmentPrompt(ITR_PROMPT, this.itrValidator));
        this.addDialog(new AttachmentPrompt(VIDEO_PROMPT, this.videoValidator));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.willSendOTPStep.bind(this),
            this.showInfoCancelled.bind(this),
            this.getCancelledData.bind(this),
            this.handleForm.bind(this),
            this.getInfo2.bind(this),
            this.getCancelledData2.bind(this),
            this.handleForm2.bind(this),
            this.askBack.bind(this),
            this.handleIDBack.bind(this),
            this.backToMessenger.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    // validates image
    async itrValidator(promptContext) {
        if (promptContext.recognized.succeeded) {
            var attachments = promptContext.recognized.value;
            var validImages = [];

            attachments.forEach(attachment => {
                if (attachment.contentType === 'image/jpeg' || attachment.contentType === 'image/png'
                    || attachment.contentType === 'image/jpg' || attachment.contentType === 'application/pdf') {
                    validImages.push(attachment);
                }
            });

            promptContext.recognized.value = validImages;

            // If none of the attachments are valid images, the retry prompt should be sent.
            return !!validImages.length;
        }
        else {
            await promptContext.context.sendActivity('No attachments received. Please attach an image/pdf file.');
            return false;
        }
    }

    // validates video
    async videoValidator(promptContext) {
        //for back end cheking
        console.log("\n\r Message Type:" + promptContext.context._activity.type);
        console.log("\n\r Message:" + JSON.stringify(promptContext.context._activity.channelData.message));
        /***************************/
        if (promptContext.recognized.succeeded) {
            var attachments = promptContext.recognized.value;
            var validImages = [];

            attachments.forEach(attachment => {
                if (attachment.contentType === 'video/mp4'
                    || attachment.contentType === 'video/x-msvideo'
                    || attachment.contentType === 'video/mpeg'
                    || attachment.contentType === 'video/3gpp'
                    || attachment.contentType === 'video/3gpp2') {
                    validImages.push(attachment);
                }
            });

            promptContext.recognized.value = validImages;

            // If none of the attachments are valid videos, the retry prompt should be sent.
            return !!validImages.length;
        }
        else {
            await promptContext.context.sendActivity('No attachments received. Please attach a video file.');
            return false;
        }
    }

    async willSendOTPStep(step) {
        step.values.userProfile = new CardsUser1();
        step.values.userProfile.mobileNumber = step.options.mobileNumber;
        step.values.userProfile.fbFirstName = step.options.fbFirstName;
        let d = new Date();
        let currentDate = String(d.getDate()).padStart(2, '0') + "/" + String(d.getMonth() + 1)
            .padStart(2, '0') + "/" + String(d.getFullYear());

        var queryDone = "No";

        let s1 = checkData(step.values.userProfile.mobileNumber, "checkData");

        s1.then(function (res) {
            if (typeof res.Table1 == 'undefined') {
                step.values.userProfile.access = "No";
            }
            else {
                step.values.userProfile.access = "Yes";
                step.values.userProfile.status = res.Table1[0].status;
                step.values.userProfile.cancellationReason = res.Table1[0].cancellationReason;
                step.values.userProfile.cancellationReasonTXT = res.Table1[0].cancellationReasonTXT;
                step.values.userProfile.fileNames = res.Table1[0].UPLOADED_FILE;
                step.values.userProfile.responseInfo = "" + res.Table1[0].cancelInfoSubmitted;
            }
            queryDone = "Yes";
        }, function (err) {
            queryDone = "Timeout";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        if (step.values.userProfile.access == "No") {
            await step.context.sendActivity("I'm sorry but you are not allowed to access this facility");
            return await step.endDialog();
        }

        step.values.userProfile.followupDate = moment(currentDate, 'DD/MM/YYYY').businessAdd(15)._d;
        var fDate = new Date(step.values.userProfile.followupDate);
        step.values.userProfile.followupDate = String(fDate.getMonth() + 1).padStart(2, '0') + "/" 
            + String(fDate.getDate()).padStart(2, '0') + "/" + fDate.getFullYear();

        return await step.next();
    }

    async showInfoCancelled(step) {
        for(let x in CODES_ARR){
            if(step.values.userProfile.cancellationReason.includes(CODES_ARR[x])){
                await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                    Thank you for your EastWest Singapore Airlines KrisFlyer Mastercard application. \
                    We regret to inform you that after a thorough evaluation, we will be unable to \
                    issue you a credit card at this time. You may try again after 6 months. We hope \
                    to be of service to you in the future.".replace(/\s\s+/g, ' ').trim());
                return await step.endDialog();
            }
        }
        if (step.values.userProfile.cancellationReason.includes("58")
            || step.values.userProfile.cancellationReason.includes("53")
            || step.values.userProfile.cancellationReason.includes("5A")
            || step.values.userProfile.cancellationReason.includes("5E")
            || step.values.userProfile.cancellationReason.includes("5F")
            || step.values.userProfile.cancellationReason.includes("5G")) {
          
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                I’m sorry to inform you that your application was cancelled because we are unable \
                to verify your employment through the office landline number you provided."
                .replace(/\s\s+/g, ' ').trim());
            return await step.endDialog();
        }
        else if (step.values.userProfile.cancellationReason.includes("7B")) {
            await step.context.sendActivity("We are unable to validate the principal credit card \
                issued by another bank that you submitted. Please submit a valid credit card #."
                .replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("4G")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ".  \
                Please be advised that for us to be able to process your application, you need \
                to upload the latest Statement of Account (SOA) of the principal credit card that \
                you submitted.".replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("4M")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                The specimen signatures you submitted are unacceptable.".replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("EE")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that we were not able to verify your employment details at the \
                employment telephone number that you submitted.".replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("4J")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that for us to be able to process your application, you need to \
                submit a verifiable video.".replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("4U06")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that we noted a discrepancy in the company address, home address, \
                and permanent address that you submitted.".replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("4U07")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that we noted a discrepancy in the company name that you \
                provided.".replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("4U04")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that we noted a discrepancy in your Mother's Maiden Name that you \
                provided.".replace(/\s\s+/g, ' ').trim());
        }
        else if (step.values.userProfile.cancellationReason.includes("4U08")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that we noted a discrepancy in the Job Title that you \
                submitted.".replace(/\s\s+/g, ' ').trim());
        }
        return await step.next();
    }

    async getCancelledData(step) {
        if (step.values.userProfile.cancellationReason.includes("7B")) {
            step.values.userProfile.cancelledResult = "INFO";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("7B", "");
            const textPrompt = { prompt: 'Kindly provide your Primary Credit Card number:' };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        if (step.values.userProfile.cancellationReason.includes("4G")) {
            step.values.userProfile.cancelledResult = "DOC";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4G", "");
            var promptOptions = {
                prompt: 'Please take a picture of your SOA and hit send.',
                retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        if (step.values.userProfile.cancellationReason.includes("4M")) {
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4M", "");
            step.values.userProfile.cancelledResult = "DOC";
            var promptOptions = {
                prompt: 'The signatures should match your signature in the ID that you submitted. \
                    Please take a picture of 3 specimen signatures on a single sheet of paper and \
                    hit send.'.replace(/\s\s+/g, ' ').trim(),
                retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        if (step.values.userProfile.cancellationReason.includes("EE")) {
            step.values.userProfile.cancelledResult = "INFO";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("EE", "");
            const textPrompt = { prompt: 'Kindly provide the correct or another office number in \
            this format (include area code) 02 8888 1700.'.replace(/\s\s+/g, ' ').trim() };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        if (step.values.userProfile.cancellationReason.includes("4J")) {
            step.values.userProfile.cancelledResult = "DOC";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4J", "");
            var promptOptions = {
                prompt: 'My name is [complete name] born on (date of birth) and I am applying for \
                EastWest Singapore Airlines KrisFlyer Mastercards application'.replace(/\s\s+/g, ' ').trim() ,
                retryPrompt: 'The attachment must be a video file.'
            };
            return await step.prompt(VIDEO_PROMPT, promptOptions);
        }
        if (step.values.userProfile.cancellationReason.includes("4U06")) {
            step.values.userProfile.cancelledResult = "INFO";
            const textPrompt = { prompt: 'Kindly provide your complete Company Address now.' };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        if (step.values.userProfile.cancellationReason.includes("4U07")) {
            step.values.userProfile.cancelledResult = "INFO";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4U07", "");
            const textPrompt = { prompt: 'Please provide the correct and complete name by \
                which your employer is known.'.replace(/\s\s+/g, ' ').trim() };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        if (step.values.userProfile.cancellationReason.includes("4U04")) {
            step.values.userProfile.cancelledResult = "INFO";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4U04", "");
            const textPrompt = { prompt: 'Please provide the correct and complete info about \
                your Mother\'s Maiden Name.'.replace(/\s\s+/g, ' ').trim()};
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        if (step.values.userProfile.cancellationReason.includes("4U08")) {
            step.values.userProfile.cancelledResult = "INFO";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4U08", "");
            const textPrompt = { prompt: 'Please provide the complete and correct title of your job.' };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        return await step.next();
    }

    async handleForm(step) {
        if (step.values.userProfile.cancelledResult == "INFO") {
            if (step.values.userProfile.cancellationReason.includes("4U06")) {
                step.values.userProfile.responseInfo = step.values.userProfile.responseInfo 
                    ? step.values.userProfile.responseInfo + " OFFICE:" + step.result
                    : "OFFICE:" + step.result;

                step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

                var queryDone = "No";

                let s4 = saveInfo(step.values.userProfile.mobileNumber, "saveInfo",
                    step.values.userProfile.responseInfo, step.values.userProfile.status,
                    step.values.userProfile.followupDate);

                s4.then(function (res) {
                    queryDone = "Yes";
                }, function (err) {
                    queryDone = "Timeout";
                })

                while (queryDone == "No") {
                    await step.context.sendActivity({ type: 'typing' });
                }

                if (step.values.userProfile.cancellationReason.length > 0) {
                    await step.context.sendActivity("Information submitted!");
                }
                return await step.next();
            }
            else {
                if (String(step.result).includes("'")) {
                    var tempName = step.result.replace("'", '');
                    step.values.userProfile.responseInfo = step.values.userProfile.responseInfo 
                        ? step.values.userProfile.responseInfo + ", " + tempName
                        : tempName;
                }
                else{
                    step.values.userProfile.responseInfo = step.values.userProfile.responseInfo 
                        ? step.values.userProfile.responseInfo + ", " + step.result
                        : step.result;
                }
                
                if (step.values.userProfile.cancellationReason == "")
                    step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

                var queryDone = "No";

                let s4 = saveInfo(step.values.userProfile.mobileNumber, "saveInfo",
                    step.values.userProfile.responseInfo, step.values.userProfile.status,
                    step.values.userProfile.followupDate);

                s4.then(function (res) {
                    queryDone = "Yes";
                }, function (err) {
                    queryDone = "Timeout";
                })

                while (queryDone == "No") {
                    await step.context.sendActivity({ type: 'typing' });
                }

                if (step.values.userProfile.cancellationReason.length > 0) {
                    await step.context.sendActivity("Information submitted!");
                }
            }
        }
        else if (step.values.userProfile.cancelledResult == "DOC") {
            if (step.values.userProfile.cancellationReason == "")
                step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

            let name = "cancelledDOC" + "" + Math.floor((Math.random() * 1000) + 1);;
            let imageUrl = step.context.activity.attachments[0].contentUrl;
            let imageType = step.context.activity.attachments[0].contentType;
            var typeofImage = "";
            if (String(imageType).includes("png")) {
                typeofImage = "png";
            }
            if (String(imageType).includes("jpg")) {
                typeofImage = "jpg";
            }
            if (String(imageType).includes("jpeg")) {
                typeofImage = "jpeg";
            }
            if (String(imageType).includes("pdf")) {
                typeofImage = "pdf";
            }

            let imageName = step.values.userProfile.mobileNumber + "_" + name + "." + typeofImage;
            step.values.userProfile.fileNames = step.values.userProfile.fileNames 
                ? step.values.userProfile.fileNames + ", " + imageName
                : imageName;

            var queryDone = "No";

            let s4 = saveID(step.values.userProfile.mobileNumber, "saveID", imageUrl, imageName,
                step.values.userProfile.status, step.values.userProfile.followupDate,
                step.values.userProfile.fileNames);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing' });
            }
            if (step.values.userProfile.cancellationReason.length > 0) {
                await step.context.sendActivity("Attachment uploaded!");
                //picture or video
            }
        }
        return step.next();
    }

    async getInfo2(step) {
        console.log("CANCELLED REASON" + step.values.userProfile.cancellationReason);
        if (step.values.userProfile.cancellationReason.includes("7B")) {
            await step.context.sendActivity("We are unable to validate the principal credit card \
                issued by another bank that you submitted. Please submit a valid credit card #."
                .replace(/\s\s+/g, ' ').trim());
        }
        if (step.values.userProfile.cancellationReason.includes("4H")) {
            await step.context.sendActivity("Your company ID is unacceptable.");
        }
        if (step.values.userProfile.cancellationReason.includes("4G")) {
            await step.context.sendActivity("Kindly provide a copy of the latest Statement of \
                Account (SOA) of the principal credit card that you submitted.".replace(/\s\s+/g, ' ').trim());
        }
        if (step.values.userProfile.cancellationReason.includes("4M")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                The specimen signatures you submitted are unacceptable.".replace(/\s\s+/g, ' ').trim());
        }
        if (step.values.userProfile.cancellationReason.includes("EE")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that we were not able to verify your employment details at the \
                employment telephone number that you submitted.".replace(/\s\s+/g, ' ').trim());
        }
        if (step.values.userProfile.cancellationReason.includes("4J")) {
            await step.context.sendActivity("Hi " + step.values.userProfile.fbFirstName + ". \
                Please be advised that for us to be able to process your application, you need to \
                submit a verifiable video.".replace(/\s\s+/g, ' ').trim());
        }
        return await step.next();
    }

    async getCancelledData2(step) {
        if (step.values.userProfile.cancellationReason.includes("7B")) {
            step.values.userProfile.cancelledResult = "INFO";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("7B", "");
            const textPrompt = { prompt: 'Kindly provide your Primary Credit Card number:' };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        if (step.values.userProfile.cancellationReason.includes("4H")) {
            step.values.userProfile.cancelledResult = "DOC";
            var promptOptions = {
                prompt: 'Please take a clear picture of the FRONT of your valid unexpired \
                    Company ID now and hit send.'.replace(/\s\s+/g, ' ').trim(),
                retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        if (step.values.userProfile.cancellationReason.includes("4G")) {
            step.values.userProfile.cancelledResult = "DOC";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4G", "");
            var promptOptions = {
                prompt: 'Please take a picture of your SOA and hit send.',
                retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        if (step.values.userProfile.cancellationReason.includes("4M")) {
            step.values.userProfile.cancelledResult = "DOC";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4M", "");
            var promptOptions = {
                prompt: 'The signatures should match your signature in the ID that you submitted. \
                    Please take a picture of 3 specimen signatures on a single sheet of paper and \
                    hit send.'.replace(/\s\s+/g, ' ').trim(),
                retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        if (step.values.userProfile.cancellationReason.includes("EE")) {
            step.values.userProfile.cancelledResult = "INFO";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("EE", "");
            const textPrompt = { prompt: 'Kindly provide the correct or another office number in \
                this format (include area code) 02 8888 1700.'.replace(/\s\s+/g, ' ').trim() };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        if (step.values.userProfile.cancellationReason.includes("4J")) {
            step.values.userProfile.cancelledResult = "DOC";
            step.values.userProfile.cancellationReason
                = step.values.userProfile.cancellationReason.replace("4J", "");
            var promptOptions = {
                prompt: 'My name is [complete name] born on (date of birth) and I am applying for \
                    EastWest Bank Credit Card.'.replace(/\s\s+/g, ' ').trim(),
                retryPrompt: 'The attachment must be a video file.'
            };
            return await step.prompt(VIDEO_PROMPT, promptOptions);
        }
        if (step.values.userProfile.cancellationReason.includes("4U06")) {
            step.values.userProfile.cancelledResult = "INFO";
            const textPrompt = { prompt: 'Kindly provide your complete Home Address now.' };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        return await step.next();
    }

    async handleForm2(step) {
        if (step.values.userProfile.cancelledResult == "INFO") {
            if (step.values.userProfile.cancellationReason.includes("4U06")) {
                step.values.userProfile.responseInfo = step.values.userProfile.responseInfo 
                    ? step.values.userProfile.responseInfo + " HOME:" + step.result
                    : "HOME: " + step.result;
                
                step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

                var queryDone = "No";

                let s4 = saveInfo(step.values.userProfile.mobileNumber, "saveInfo",
                    step.values.userProfile.responseInfo, step.values.userProfile.status,
                    step.values.userProfile.followupDate);

                s4.then(function (res) {
                    queryDone = "Yes";
                }, function (err) {
                    queryDone = "Timeout";
                })

                while (queryDone == "No") {
                    await step.context.sendActivity({ type: 'typing' });
                }
            }
            else {
                if(step.result){
                    if (String(step.result).includes("'")) {
                        var tempName = step.result.replace("'", '');
                        step.values.userProfile.responseInfo = step.values.userProfile.responseInfo
                            ? step.values.userProfile.responseInfo + ", " + tempName
                            : tempName;
                    }
                    else{
                        step.values.userProfile.responseInfo = step.values.userProfile.responseInfo 
                            ? step.values.userProfile.responseInfo + ", " + step.result
                            : step.result;
                    }
                }
                else return await step.next();
                
                if (step.values.userProfile.cancellationReason == "")
                    step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

                var queryDone = "No";

                let s4 = saveInfo(step.values.userProfile.mobileNumber, "saveInfo",
                    step.values.userProfile.responseInfo, step.values.userProfile.status,
                    step.values.userProfile.followupDate);

                s4.then(function (res) {
                    queryDone = "Yes";
                }, function (err) {
                    queryDone = "Timeout";
                })

                while (queryDone == "No") {
                    await step.context.sendActivity({ type: 'typing' });
                }
            }
        }
        else if (step.values.userProfile.cancelledResult == "DOC") {
            if (step.values.userProfile.cancellationReason == "")
                step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

            let name = "cancelledDOC" + "" + Math.floor((Math.random() * 1000) + 1);;
            let imageUrl = step.context.activity.attachments[0].contentUrl;
            let imageType = step.context.activity.attachments[0].contentType;
            var typeofImage = "";
            if (String(imageType).includes("png")) {
                typeofImage = "png";
            }
            if (String(imageType).includes("jpg")) {
                typeofImage = "jpg";
            }
            if (String(imageType).includes("jpeg")) {
                typeofImage = "jpeg";
            }
            if (String(imageType).includes("pdf")) {
                typeofImage = "pdf";
            }

            let imageName = step.values.userProfile.mobileNumber + "_" + name + "." + typeofImage;
            step.values.userProfile.fileNames = step.values.userProfile.fileNames 
                ? step.values.userProfile.fileNames + ", " + imageName
                : imageName;

            var queryDone = "No";

            let s4 = saveID(step.values.userProfile.mobileNumber, "saveID", imageUrl, imageName,
                step.values.userProfile.status, step.values.userProfile.followupDate,
                step.values.userProfile.fileNames);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing' });
            }
        }
        return step.next();
    }

    async askBack(step) {
        if (step.values.userProfile.cancellationReason.includes("4H")) {
            step.values.userProfile.cancelledResult = "DOC";

            var promptOptions = {
                prompt: 'Please take a clear picture of the BACK of your valid unexpired Company ID \
                    now and hit send.'.replace(/\s\s+/g, ' ').trim(),
                retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);

        }
        else if (step.values.userProfile.cancellationReason.includes("4U06")) {
            step.values.userProfile.cancelledResult = "INFO";
            const textPrompt = { prompt: 'Kindly provide your complete Permanent Address now.' };
            return await step.prompt(TEXT_PROMPT, textPrompt);
        }
        else {
            return await step.next();
        }
    }

    async handleIDBack(step) {
        if (step.values.userProfile.cancellationReason.includes("4H")) {
            step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

            let name = "cancelledDOC" + "" + Math.floor((Math.random() * 1000) + 1);;
            let imageUrl = step.context.activity.attachments[0].contentUrl;
            let imageType = step.context.activity.attachments[0].contentType;
            var typeofImage = "";
            if (String(imageType).includes("png")) {
                typeofImage = "png";
            }
            if (String(imageType).includes("jpg")) {
                typeofImage = "jpg";
            }
            if (String(imageType).includes("jpeg")) {
                typeofImage = "jpeg";
            }

            let imageName = step.values.userProfile.mobileNumber + "_" + name + "." + typeofImage;
            step.values.userProfile.fileNames = step.values.userProfile.fileNames + ", " + imageName;

            var queryDone = "No";

            let s4 = saveID(step.values.userProfile.mobileNumber, "saveID", imageUrl, imageName,
                step.values.userProfile.status, step.values.userProfile.followupDate,
                step.values.userProfile.fileNames);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing' });
            }
        }

        else if (step.values.userProfile.cancellationReason.includes("4U06")) {
            step.values.userProfile.responseInfo = step.values.userProfile.responseInfo 
                ? step.values.userProfile.responseInfo + " PERMANENT:" + step.result
                : "PERMANENT:" + step.result;

            step.values.userProfile.status = "CANCEL_REQUIREMENTS_SUBMITTED";

            var queryDone = "No";

            let s4 = saveInfo(step.values.userProfile.mobileNumber, "saveInfo", 
                step.values.userProfile.responseInfo, step.values.userProfile.status,
                step.values.userProfile.followupDate);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing' });
            }
        }
        return step.next();
    }

    async backToMessenger(step) {
        let dateF = new Date(step.values.userProfile.followupDate);
        step.values.userProfile.followupstr = DAYS_OF_WEEK[dateF.getDay()] + ". "
            + MONTHS_ARR[dateF.getMonth()] + ". " + dateF.getDate() + ", " + dateF.getFullYear();
        await step.context.sendActivity("Thank you. We will provide feedback on or before  "
            + step.values.userProfile.followupstr + ". In the meantime, you may follow-up anytime \
            by typing the word follow-up in the chatbox. Goodbye!".replace(/\s\s+/g, ' ').trim());
        return await step.endDialog();
    }
}

function checkData(mobile, query) {
    var options =
    {
        url: 'https://prod-12.southeastasia.logic.azure.com:443/workflows/217f12eeff944a97b7ed2e37a444d030/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3vS_4KEYtIsv0DKO6J0JpzI0LpCGcBTFbEhB1lNCi4',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        ({
            "mobile": mobile,
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

function saveInfo(mobile, query, responseInfo, status, followupdate) {
    var options =
    {
        url: 'https://prod-12.southeastasia.logic.azure.com:443/workflows/217f12eeff944a97b7ed2e37a444d030/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3vS_4KEYtIsv0DKO6J0JpzI0LpCGcBTFbEhB1lNCi4',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        ({
            "mobile": mobile,
            "query": query,
            "responseInfo": responseInfo,
            "status": status,
            "followupdate": followupdate
        })
    };

    return new Promise(function (resolve, reject) {
        request.post(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(error);
            }
        })
    })
}

function saveID(mobile, query, imageUrl, imageName, status, followupdate, fileNames) {
    var options =
    {
        url: 'https://prod-12.southeastasia.logic.azure.com:443/workflows/217f12eeff944a97b7ed2e37a444d030/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3vS_4KEYtIsv0DKO6J0JpzI0LpCGcBTFbEhB1lNCi4',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        ({
            "mobile": mobile,
            "query": query,
            "imageUrl": imageUrl,
            "imageName": imageName,
            "status": status,
            "followupdate": followupdate,
            "fileNames": fileNames
        })
    };

    return new Promise(function (resolve, reject) {
        request.post(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(error);
            }
        })
    })
}

module.exports.CardsCS5 = CardsCS5;
module.exports.CARDS_CS5 = CARDS_CS5;
