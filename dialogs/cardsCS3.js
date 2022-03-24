// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const request = require('request');
const moment = require('moment-business-days');

const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { CardFactory } = require('botbuilder');
const { ActivityTypes, MessageFactory, InputHints } = require('botbuilder');

const {
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ConfirmPrompt,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog,
    ListStyle
} = require('botbuilder-dialogs');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const ITR_PROMPT = 'ITR_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const CHOOSE_DOCUMENT_TYPE = 'CHOOSE_DOCUMENT_TYPE';
const CARDS_CS3 = 'CARDS_CS3';
const VID_PROMPT = 'VID_PROMPT';

// List of video attachment types
const ATTACHMENT_ARR = ['video/mp4', 'video/x-msvideo', 'video/mpeg', 'video/3gpp', 'video/3gpp2'];

// List of months
const MONTHS_ARR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 
    'Oct', 'Nov', 'Dec'];

// List of days
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];

class CardsCS3 extends CancelAndHelpDialog {
    constructor() {
        super(CARDS_CS3 || 'cardsCS3');

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ChoicePrompt(CHOOSE_DOCUMENT_TYPE));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new AttachmentPrompt(ITR_PROMPT, this.itrValidator));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT, this.picturePromptValidator));
        this.addDialog(new AttachmentPrompt(VID_PROMPT, this.videoValidator));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.getDetails.bind(this),
            this.askCompanyID.bind(this),
            this.askCompanyIDp2.bind(this),
            this.askCompanyIDp3.bind(this),
            this.askGovID.bind(this),
            this.askGovID2.bind(this),
            this.getSpecimenSig.bind(this),
            this.getSpecimenSig2.bind(this),
            this.getConsent.bind(this),
            this.getConsent2.bind(this),
            this.askDelivAddress.bind(this),
            this.askDelivAddress2.bind(this),
            this.askDelivAddress3.bind(this),
            this.askVid.bind(this),
            this.askVid2.bind(this),
            this.endStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    // validator for attachmentes
    async itrValidator(promptContext) {
        if (promptContext.recognized.succeeded) {
            var attachments = promptContext.recognized.value;
            var validImages = [];

            attachments.forEach(attachment => {
                if (attachment.contentType === 'image/jpeg' ||
                    attachment.contentType === 'image/png' ||
                    attachment.contentType === 'image/jpg' ||
                    attachment.contentType === 'application/pdf') {
                    validImages.push(attachment);
                }
            });

            promptContext.recognized.value = validImages;

            // If none of the attachments are valid images, the retry prompt should be sent.
            return !!validImages.length;
        }
        else {
            await promptContext.context.sendActivity('No attachments received. \
                Please attach an image/pdf file.'.replace(/\s\s+/g, ' '));
            return false;
        }
    }

    // validates government ID
    async picturePromptValidator(promptContext) {
        if (promptContext.recognized.succeeded) {
            var attachments = promptContext.recognized.value;
            var validImages = [];
            var dummy;

            attachments.forEach(attachment => {
                if (attachment.contentType === 'image/jpeg' 
                    || attachment.contentType === 'image/png'
                    || attachment.contentType === 'image/jpeg') {
                    validImages.push(attachment);
                }
            });

            if (validImages.length == 0) {
                await promptContext.context.sendActivity('Not a valid attachment. Please attach \
                    an image.'.replace(/\s\s+/g, ' '));
                return false;
            }

            promptContext.recognized.value = validImages;

            var botVision = customVision(validImages[0].contentUrl);

            var queryDone = "No";

            var botquery = {};
            botVision.then(function (result) {
                queryDone = "Yes";
                botquery = result;
            }, function (error) {
                queryDone = "Timeout";
            })

            while (queryDone == "No") {
                await promptContext.context.sendActivity({ type: 'typing' });
            }

            if (queryDone == "Timeout") {
                dummy = true;
            }

            if (botquery.predictions[0].probability > botquery.predictions[1].probability) {

                if (botquery.predictions[0].tagName === 'id') {
                    dummy = true;
                }
                else {
                    await promptContext.context
                        .sendActivity(MessageFactory.attachment(validImages[0],
                            'This is an invalid id. Please try again'));
                    dummy = false;
                }
            }

            else if (botquery.predictions[0].probability < botquery.predictions[1].probability) {

                if (botquery.predictions[1].tagName === 'id') {
                    dummy = true;
                }
                else if (botquery.predictions[1].tagName == "id") {
                    await promptContext.context
                        .sendActivity(MessageFactory.attachment(validImages[0],
                            'This is an invalid id. Please try again'));
                    dummy = false;
                }
            }

            // If none of the attachments are valid images, the retry prompt should be sent.
            return !!validImages.length && dummy;
        }
        else {
            await promptContext.context.sendActivity('No attachments received. Please attach an image.');
            return false;
        }
    }

    // validates video
    async videoValidator(promptContext) {
        
        if (promptContext.recognized.succeeded) {
            var attachments = promptContext.recognized.value;
            var validImages = [];

            attachments.forEach(attachment => {
                if (ATTACHMENT_ARR.includes(attachment.contentType)) {
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

    async getDetails(step) {
        console.log('\n\n CS3 VALUES ARE: ' + JSON.stringify(step.options));
        step.values.userProfile = step.options;

        let d = new Date();
        let currentDate = String(d.getDate()).padStart(2, '0') + "/" 
            + String(d.getMonth() + 1).padStart(2, '0') + "/" + String(d.getFullYear());

        step.values.userProfile.followUpDate = moment(currentDate, 'DD/MM/YYYY').businessAdd(15)._d;
        var fDate = new Date(step.values.userProfile.followUpDate);
        step.values.userProfile.followUpDate = String(fDate.getMonth() + 1).padStart(2, '0')
            + "/" + String(fDate.getDate()).padStart(2, '0') + "/" + fDate.getFullYear();

        return await step.next();
    }

     // status = NEED_KYC2
    async askCompanyID(step) {
        if (step.values.userProfile.status == "GOV_ID2"
            || step.values.userProfile.status == "SIGNATURE2"
            || step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.status == "INCOME2"
            || step.values.userProfile.status == "VIDEO2") 
            return await step.next();
            
        if (step.values.userProfile.employmentType == 'Private'
            || step.values.userProfile.employmentType == 'Government') {

            var promptOptions = {
                prompt: 'Please take a clear picture of the FRONT of your company ID and hit send. \
                    Please note that blurred images may cause a delay in the processing of your \
                    credit card application.'.replace(/\s\s+/g, ' '),
                retryPrompt: 'The attachment must be a jpg/png image file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        else return await step.next(); // skip this step if not employed
    }

    // status = NEED_KYC2
    async askCompanyIDp2(step) {
        if (step.values.userProfile.status == "GOV_ID2"
            || step.values.userProfile.status == "SIGNATURE2"
            || step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.status == "INCOME2"
            || step.values.userProfile.status == "VIDEO2")
            return await step.next();

        if (step.values.userProfile.employmentType == 'Private'
            || step.values.userProfile.employmentType == 'Government') {
            
            let name = "idFront";
            let imageUrl = step.context.activity.attachments[0].contentUrl;
            let imageType = step.context.activity.attachments[0].contentType;
            var typeofImage = "";

            typeofImage = String(imageType).includes("png") ? "png" : 
                String(imageType).includes("jpg") ? "jpg" :
                String(imageType).includes("jpeg") ? "jpeg" : "";

            let imageName = step.values.userProfile.mobile + "_" + name + "." + typeofImage;

            var queryDone = "No";
            if (step.values.userProfile.fileNames) {
                step.values.userProfile.fileNames += ", " + imageName;
            }
            else {
                step.values.userProfile.fileNames = imageName;
            }

            let s4 = saveID(step.values.userProfile, "saveID", imageUrl, imageName);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            await step.context.sendActivity("Please wait. We are uploading the picture. \
                This process can take a few seconds. If the picture fails to upload, kindly \
                re-upload it. Thank you!".replace(/\s\s+/g, ' '));
            while (queryDone == "No") {

                await step.context.sendActivity({ type: 'typing' });
            }
            var promptOptions = {
                prompt: 'Please take a clear picture of the BACK of your company ID and hit send. \
                    Please note that blurred images may cause a delay in the processing of your \
                    credit card application.'.replace(/\s\s+/g, ' '),
                retryPrompt: 'The attachment must be a jpg/png image file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        else return await step.next(); // skip this step if not employed
    }

    // status = NEED_KYC2
    async askCompanyIDp3(step) {
        if (step.values.userProfile.status == "GOV_ID2"
            || step.values.userProfile.status == "SIGNATURE2"
            || step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.status == "INCOME2"
            || step.values.userProfile.status == "VIDEO2") 
            return await step.next();

        if (step.values.userProfile.employmentType == 'Private'
            || step.values.userProfile.employmentType == 'Government') {

            let name = "idBAck";
            let imageUrl = step.context.activity.attachments[0].contentUrl;
            let imageType = step.context.activity.attachments[0].contentType;
            var typeofImage = "";

            typeofImage = String(imageType).includes("png") ? "png" : 
                String(imageType).includes("jpg") ? "jpg" :
                String(imageType).includes("jpeg") ? "jpeg" : "";

            let imageName = step.values.userProfile.mobile + "_" + name + "." + typeofImage;

            var queryDone = "No";
            if (step.values.userProfile.fileNames) {
                step.values.userProfile.fileNames += ", " + imageName;
            }
            else {
                step.values.userProfile.fileNames = imageName;
            }

            let s4 = saveID(step.values.userProfile, "saveID", imageUrl, imageName);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            await step.context.sendActivity('Please wait. We are uploading the picture. This \
                process can take a few seconds. If the picture fails to upload, kindly re-upload it. \
                Thank you!'.replace(/\s\s+/g, ' '));

            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing'});
            }

            return await step.next();
        }
        else return await step.next(); //skip this step if not employed
    }

    // status = NEED_KYC2
    async askGovID(step) {
        if (step.values.userProfile.status == "GOV_ID2"
            || step.values.userProfile.status == "SIGNATURE2"
            || step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "INCOME2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.nationality == 'Non-Filipino'
            || step.values.userProfile.status == "VIDEO2") {
            return await step.next();
        }

        if (step.values.userProfile.nationality == 'Filipino') {
            await step.context.sendActivity("Please choose the valid photo-bearing government-issued ID \
                that you will submit.".replace(/\s\s+/g, ' '));
            return await step.prompt(CHOOSE_DOCUMENT_TYPE, {
                prompt: '',
                choices: ChoiceFactory.toChoices(['Driver\'s License', 'Voter\'s ID', 'PRC ID', 'UMID', 
                    'SSS ID', 'GSIS ID', 'Passport']),
                style: ListStyle.heroCard
            });
        }
        else return await step.next();
    }

    // status = NEED_KYC2
    async askGovID2(step) {
        if (step.values.userProfile.status == "GOV_ID2"
            || step.values.userProfile.status == "SIGNATURE2"
            || step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "INCOME2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.nationality == 'Non-Filipino'
            || step.values.userProfile.status == "VIDEO2") {
            return await step.next();
        }
        
        if (step.values.userProfile.nationality == 'Filipino') {
            if (step.result.value == 'Passport') {
                var promptOptions = {
                    prompt: 'Please take a clear picture of the front of your passport and hit send.',
                    retryPrompt: 'The attachment must be a jpg/png image file.'
                };
    
                return await step.prompt(ITR_PROMPT, promptOptions);
            }
            else {
                var promptOptions = {
                    prompt: 'Please take a clear picture of the front of your ID and hit send.\
                        The attachment must be a jpg/png image file.'.replace(/\s\s+/g, ' '),
                    retryPrompt: 'The attachment must be a jpg/png image file.'
                };
    
                return await step.prompt(ATTACHMENT_PROMPT, promptOptions);
            }
        }
        else return await step.next();
    }

    // status = NEED_KYC2
    async getSpecimenSig(step) {
        if (step.values.userProfile.status == "SIGNATURE2"
            || step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.status == "INCOME2"
            || step.values.userProfile.status == "VIDEO2") {
            return await step.next();
        }

        if (step.values.userProfile.status == "GOV_ID2") {
            var promptOptions = {
                prompt: 'I will now collect your specimen signatures. Please take a clear picture \
                    of your 3 specimen signatures on a single sheet of paper. The signatures should \
                    match your signature in the ID that you submitted.'.replace(/\s\s+/g, ' '),
                retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
            };

            return await step.prompt(ITR_PROMPT, promptOptions);
        }

        console.log('\n\nGOV ID1: ' + JSON.stringify(step.context.activity));

        if (step.values.userProfile.nationality == 'Filipino') {
            console.log('\n\nGOV ID2: ' + JSON.stringify(step.context.activity));
            let name = "idGov";
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

            let imageName = step.values.userProfile.mobile + "_" + name + "." + typeofImage;

            step.values.userProfile.status = "GOV_ID2";

            var queryDone = "No";

            if (step.values.userProfile.fileNames) {
                step.values.userProfile.fileNames += ", " + imageName;
            }
            else {
                step.values.userProfile.fileNames = imageName;
            }

            let s4 = saveID(step.values.userProfile, "saveID", imageUrl, imageName);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            await step.context.sendActivity("Please wait. We are uploading the picture. This process \
                can take a few seconds. If the picture fails to upload, kindly re-upload it. Thank you!"
                .replace(/\s\s+/g, ' '));
            while (queryDone == "No") {

                await step.context.sendActivity({ type: 'typing' });
            }
        }

        var promptOptions = {
            prompt: 'I will now collect your specimen signatures. Please take a clear picture of \
                your 3 specimen signatures on a single sheet of paper. The signatures should match \
                your signature in the ID that you submitted.'.replace(/\s\s+/g, ' '),
            retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
        };

        return await step.prompt(ITR_PROMPT, promptOptions);
    }

    // status = GOV_ID2
    async getSpecimenSig2(step) {
        if (step.values.userProfile.status == "SIGNATURE2"
            || step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.status == "INCOME2"
            || step.values.userProfile.status == "VIDEO2") 
            return await step.next();

            let name = "signature";
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

            let imageName = step.values.userProfile.mobile + "_" + name + "." + typeofImage;

            var queryDone = "No";
            if (step.values.userProfile.fileNames) {
                step.values.userProfile.fileNames += ", " + imageName;
            }
            else {
                step.values.userProfile.fileNames = imageName;
            }

            step.values.userProfile.status = "SIGNATURE2";

            let s4 = saveID(step.values.userProfile, "saveID", imageUrl, imageName);

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            await step.context.sendActivity("Please wait. We are uploading the picture. This \
                process can take a few seconds. If the picture fails to upload, kindly re-upload \
                it. Thank you!".replace(/\s\s+/g, ' '));
            while (queryDone == "No") {

                await step.context.sendActivity({ type: 'typing' });
            }

            return await step.next();
    }

    // status = SIGNATURE2
    async getConsent(step) {
        if (step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "TERMS2"
            || step.values.userProfile.status == "VIDEO2") 
            return await step.next();

        await step.context.sendActivity("May I now request you to read and agree to the Bank’s \
            Credit Card Terms and Conditions.".replace(/\s\s+/g, ' '));
        const dpCard = CardFactory.heroCard(
            'TERMS AND CONDITIONS GOVERNING THE ISSUANCE AND USE OF EASTWEST CREDIT CARDS',
            CardFactory.images(['https://chatbot.ewbconsumerlending.com/Logo_messenger_crop.jpg']),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Read',
                    value: 'https://chatbot.ewbconsumerlending.com/T&C2.pdf'
                }
            ])
        );
        await step.context.sendActivity({ attachments: [dpCard] })
        return await step.prompt(CONFIRM_PROMPT, 'Do you agree?', ['Yes', 'No']);
    }

    // status = SIGNATURE2
    async getConsent2(step) {
        if (step.values.userProfile.status == "PROMOTIONS2"
            || step.values.userProfile.status == "VIDEO2") 
            return await step.next();

        if (step.values.userProfile.status == "SIGNATURE2") {
            step.values.userProfile.status = "TERMS2";
            if (step.result) {
                var queryDone = "No";

                let s5 = statusUpdate(step.values.userProfile.mobile, "statusUpdate", 
                step.values.userProfile.fbPsid, step.values.userProfile.status);

                s5.then(function (res) {
                    queryDone = "Yes";
                }, function (err) {
                    queryDone = "Timeout";
                });

                while (queryDone == "No") {
                    await step.context.sendActivity({ type: 'typing' });
                }
            }
            else {
                await step.context.sendActivity("You need to agree to continue processing your \
                    application. Just click the \'Start\' button to re-enter the program. \
                    Thank you!".replace(/\s\s+/g, ' '));
                return await step.endDialog();
            }
        }
        
        return await step.next();
    }

    // status = TERMS2
    async askDelivAddress(step) {
        if (step.values.userProfile.status == "VIDEO2") return await step.next();
    
        return await step.prompt(CHOICE_PROMPT,"Which will be your preferred delivery address?", 
            ['Home', 'Office', 'Any']);
    }

    // status = TERMS2
    async askDelivAddress2(step) {
        if (step.values.userProfile.status == "VIDEO2") return await step.next();
        step.values.userProfile.prefDelivAdd = step.result.value;
        await step.context.sendActivity("If we are unable to deliver to your  preferred delivery \
            address, we will deliver the card to your alternate address.".replace(/\s\s+/g, ' '));
        return await step.next();
    }

    // status = TERMS2
    async askDelivAddress3(step) {
        if (step.values.userProfile.status == "VIDEO2") return await step.next();

        var queryDone = "No";

        let q2 = saveData2(step.values.userProfile, "saveData2");

        q2.then(function (res) {
            queryDone = "Yes";
        }, function (err) {
            queryDone = "Yes";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        step.values.userProfile.status = "PROMOTIONS2";

        var queryDone = "No";
        let s4 = statusUpdate(step.values.userProfile.mobile, "statusUpdate", 
            step.values.userProfile.fbPsid, step.values.userProfile.status);

        s4.then(function (res) {
            queryDone = "Yes";
        }, function (err) {
            queryDone = "Timeout";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        return await step.next();
    }

    // status = PROMOTIONS2
    async askVid(step) {
        await step.context.sendActivity("And finally, please take a video of yourself while holding \
            your valid photo-bearing government-issued ID under your chin while reading the \
            statement below:".replace(/\s\s+/g, ' '));

        var promptOptions = {
            prompt: 'My name is [complete name] and I was born on (month, date, and year). \
                The date today is (month, date, and year) and I am applying for an EastWest \
                credit card.'.replace(/\s\s+/g, ' '),
            retryPrompt: 'The attachment must be a video file.'
        };
        return await step.prompt(VID_PROMPT, promptOptions);
    }

    // status = PROMOTIONS2
    async askVid2(step) {
        console.log("\n\nWHOLE INFO: " + JSON.stringify(step.values.userProfile).replace(',', ','+ /\n/g));
        let name = "video";
        let imageUrl = step.context.activity.attachments[0].contentUrl;
        let imageType = step.context.activity.attachments[0].contentType;
        var typeofImage = "";

        if (String(imageType).includes("mp4")) {
            typeofImage = "mp4";
        }
        if (String(imageType).includes("x-msvideo")) {
            typeofImage = "avi";
        }
        if (String(imageType).includes("mpeg")) {
            typeofImage = "mpeg";
        }
        if (String(imageType).includes("3gpp")) {
            typeofImage = "3gpp";
        }
        if (String(imageType).includes("3gpp2")) {
            typeofImage = "3gpp2";
        }
        
        step.values.userProfile.status = "VIDEO2";

        var queryDone = "No";
        let imageName = step.values.userProfile.mobile + "_" + name + "." + typeofImage;

        if (step.values.userProfile.fileNames) {
            step.values.userProfile.fileNames += ", " + imageName;
        }
        else {
            step.values.userProfile.fileNames = imageName;
        }

        let s4 = saveID(step.values.userProfile, "saveID", imageUrl, imageName);

        s4.then(function (res) {
            queryDone = "Yes";
        }, function (err) {
            queryDone = "Timeout";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        return await step.next();
    }

    async endStep(step) {
        let dateF = new Date(step.values.userProfile.followUpDate);
        step.values.userProfile.followupstr = DAYS_OF_WEEK[dateF.getDay()] + ", "
            + MONTHS_ARR[dateF.getMonth()] + " " + dateF.getDate() + ", " + dateF.getFullYear();

        var tempStr = step.values.userProfile.fbFirstName  ? ', ' + step.values.userProfile.fbFirstName 
            : ''

        step.values.userProfile.status = "PENDING";

        var queryDone = "No";
        let s4 = statusUpdate(step.values.userProfile.mobile, "statusUpdate", 
            step.values.userProfile.fbPsid, step.values.userProfile.status);

        s4.then(function (res) {
            queryDone = "Yes";
        }, function (err) {
            queryDone = "Timeout";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        await step.context.sendActivity("We\'re done" + tempStr + ". Wasn’t that quick and easy?");
        await step.context.sendActivity("Thank you. We will provide feedback on or before " 
            + step.values.userProfile.followupstr + ". We will advise you once your card application has been \
            approved. In the meantime, we have sent an SMS with a link that you can use anytime to \
            monitor the status of your application. You can also click FOLLOW UP in the chatbox."
            .replace(/\s\s+/g, ' '));
        await step.context.sendActivity("If you have any questions, please click this link - \
            www.ewlend.com/feedback. Thank you and goodbye!".replace(/\s\s+/g, ' '));
        return step.endDialog();
    }
}

function statusUpdate(mobile, query, fbPsid, status) {
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
            "fbPsid": fbPsid,
            "status": status
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

//CUSTOM VISION
function customVision(url) {
    var options =
    {
        //LOGIC APP : demo_getFBData
        url: 'https://prod-01.southeastasia.logic.azure.com:443/workflows/2a7d931ef2ab4d4ea23616d3fba6df3a/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FbvsGtlfKngh1mR7UMuVBtXx4pALSuFwGm4yMvdCw1U',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        ({
            "imageUrl": url
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

function saveData2(userProfile, queryType) {
    var options =
    {
        url: 'https://prod-12.southeastasia.logic.azure.com:443/workflows/217f12eeff944a97b7ed2e37a444d030/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3vS_4KEYtIsv0DKO6J0JpzI0LpCGcBTFbEhB1lNCi4',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        ({
            "mobile": userProfile.mobile,
            "query": queryType,
            "prefDelivAdd": userProfile.prefDelivAdd
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

function saveID(userProfile, query, imageUrl, imageName) {
    var options =
    {
        url: 'https://prod-12.southeastasia.logic.azure.com:443/workflows/217f12eeff944a97b7ed2e37a444d030/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3vS_4KEYtIsv0DKO6J0JpzI0LpCGcBTFbEhB1lNCi4',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        ({
            "mobile": userProfile.mobile,
            "query": query,
            "imageUrl": imageUrl,
            "imageName": imageName,
            "status": userProfile.status,
            "followUpDate": userProfile.followUpDate,
            "fileNames": userProfile.fileNames
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

module.exports.CardsCS3 = CardsCS3;
module.exports.CARDS_CS3 = CARDS_CS3;