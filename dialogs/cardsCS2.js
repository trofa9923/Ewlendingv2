// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const request = require('request');
const moment = require('moment-business-days');

const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { OtpBaseDialog, OTP_BASE_DIALOG } = require('./otpDialogs/otpBaseDialog');
const { CardFactory, MessageFactory } = require('botbuilder');
const { ActionTypes } = require('botbuilder');
const { CardsCS4, CARDS_CS4 } = require('./cardsCS4');
const { CardsCS3, CARDS_CS3 } = require('./cardsCS3');

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
const ITR_PROMPT = 'ITR_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const EMAIL_PROMPT2 = 'EMAIL_PROMPT2';
const LANDLINE_PROMPT = 'LANDLINE_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const BDAY_PROMPT = 'BDAY_PROMPT';
const TIN_PROMPT = 'TIN_PROMPT';
const SSSorGSIS_PROMPT = 'SSSorGSIS_PROMPT';
const CHOOSE_DOCUMENT_TYPE = 'CHOOSE_DOCUMENT_TYPE';
const CARDNAME_PROMPT = 'CARDNAME_PROMPT';
const CARDS_CS2 = 'CARDS_CS2';
const CC_PROMPT = 'CC_PROMPT';

// list of possible nature of customer's employer
const NATURE_OF_EMPLOYER = ['ARTS, ENTERTAINMENT, AND RECREATION', 'CONSTRUCTION & REAL ESTATE', 
'EDUCATION (PRIVATE)', 'FINANCIAL SERVICES - BANKS', 'FINANCIAL SERVICES - OTHERS', 'HEALTHCARE PROVIDERS', 
'HOTELS/ACCOMMODATION', 'MANPOWER & OUTSOURCING AGENCIES (BPO)', 'MANUFACTURING - ESSENTIAL', 
'MANUFACTURING - NON-ESSENTIAL', 'PROFESSIONAL SERVICES', 'PUBLIC ADMINISTRATION', 
'TRANSPORTATION AND LOGISTICS', 'TRAVEL AGENCIES', 'UTILITIES/TELCO', 
'WHOLESALE & RETAIL - NON-ESSENTIAL', 'WHOLESALE & RETAIL', 'OTHERS'];

// list of possible credit card issuer
const CREDCARD_ISSUER = ['No Card', 'ANZ', 'AUB', 'BDO', 'BPI', 'Chinabank', 'Citi', 'DBP', 'HSBC', 
'Maybank', 'Metrobank', 'PNB', 'RCBC', 'Security Bank', 'Union Bank', 'Others'];

const CLIENT_TYPE = ['Deposit/Investment', 'Credit Card', 'Personal Loan', 'Auto Loan', 
    'Home Loan','None'];

// List of months
const MONTHS_ARR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 
    'Oct', 'Nov', 'Dec'];

// List of days
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];

class CardsCS2 extends CancelAndHelpDialog {
    constructor() {
        super(CARDS_CS2 || 'cardsCS2');

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ChoicePrompt(CHOOSE_DOCUMENT_TYPE));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new TextPrompt(BDAY_PROMPT, this.bdayValidate))
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.mobileValidator));
        this.addDialog(new TextPrompt(EMAIL_PROMPT, this.emailValidator));
        this.addDialog(new TextPrompt(EMAIL_PROMPT2, this.emailValidator2));
        this.addDialog(new NumberPrompt(TIN_PROMPT, this.tinChecker));
        this.addDialog(new NumberPrompt(SSSorGSIS_PROMPT, this.SSSorGSISChecker));
        this.addDialog(new AttachmentPrompt(ITR_PROMPT, this.itrValidator));
        this.addDialog(new TextPrompt(CARDNAME_PROMPT, this.cardNameValidator));
        this.addDialog(new TextPrompt(CC_PROMPT, this.valid_credit_card));
        this.addDialog(new TextPrompt(LANDLINE_PROMPT, this.checkLandline));
        this.addDialog(new OtpBaseDialog());
        this.addDialog(new CardsCS4(CARDS_CS4));
        this.addDialog(new CardsCS3(CARDS_CS3));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.getDetails.bind(this),
            this.dataPrivacy.bind(this),
            this.dataPrivacyP2.bind(this),
            this.informApplicationSummary.bind(this),
            this.askMobileNumber.bind(this),
            this.confirmMobileNumber.bind(this),
            this.confirmMobileNumberP2.bind(this),
            this.askToSendOTP.bind(this),
            this.validateOTP.bind(this),
            this.askModeOfApplying2.bind(this),
            this.askToChooseCard.bind(this),
            this.askToChooseCard2.bind(this),
            this.askKrisFlyerMemID.bind(this),
            this.askKrisFlyerMemID2.bind(this),
            this.askFirstName.bind(this),
            this.askMiddleName.bind(this),
            this.askLastName.bind(this),
            this.askNameSuffix.bind(this),
            this.askNameSuffix2.bind(this),
            this.askCardName.bind(this),
            this.askBirthDate.bind(this),
            this.askBirthPlace.bind(this),
            this.askGender.bind(this),
            this.askMaritalStatus.bind(this),
            this.askNationality.bind(this),
            this.askNationality2.bind(this),
            this.askNationality3.bind(this),
            this.askHomeStrAddress.bind(this),
            this.askHomeCity.bind(this),
            this.askHomeProvince.bind(this),
            this.askHomeZipCode.bind(this),
            this.askConfirmAddress.bind(this),
            this.askConfirmAddressP2.bind(this),
            this.askPermStAddress.bind(this),
            this.askPermCityAddress.bind(this),
            this.askPermProvinceAddress.bind(this),
            this.askPermZipCode.bind(this),
            this.askEmailAddress.bind(this),
            this.askHomeLandline.bind(this),
            this.askTypeOfEmployment.bind(this),
            this.askTypeOfEmployment2.bind(this),
            this.askTradeReferences.bind(this),
            this.askTradeRefName1.bind(this),
            this.askTradeRefCompName1.bind(this),
            this.askTradeRefContact1.bind(this),
            this.askTradeRefContact1_2.bind(this),
            this.askTradeRefName2.bind(this),
            this.askTradeRefCompName2.bind(this),
            this.askTradeRefContact2.bind(this),
            this.askTradeRefContact2_2.bind(this),
            this.askEmployerName.bind(this),
            this.askNatureOfEmployment.bind(this),
            this.askNatureOfEmployment2.bind(this),
            this.askJobTitle.bind(this),
            this.askDepartment.bind(this),
            this.askYearsOfEmployment.bind(this),
            this.askEmployerStrAddress.bind(this),
            this.askEmployerCityAddress.bind(this),
            this.askEmployerProvinceAddress.bind(this),
            this.askEmployerZipCode.bind(this),
            this.askOfficeNumber.bind(this),
            this.askAlternativeOfficeEmailAddress.bind(this),
            this.askAnnualIncome.bind(this),
            this.askSourceOfIncome.bind(this),
            this.askSourceOfIncome2.bind(this),
            this.askForTIN.bind(this),
            this.askForTIN2.bind(this),
            this.askIfExistingClient.bind(this),
            this.askIfExistingClient2.bind(this),
            this.askCardIssuer.bind(this),
            this.askCardIssuerP2.bind(this),
            this.askCardNumber.bind(this),
            this.askIfDOSRI.bind(this),
            this.askIfDOSRI2.bind(this),
            this.askIfDOSRIRelated.bind(this),
            this.askIfDOSRIRelated2.bind(this),
            this.askIfPEP.bind(this),
            this.askIfPEP2.bind(this),
            this.askIfPEPRelated.bind(this),
            this.askIfPEPRelated2.bind(this),
            this.endStep.bind(this),
            this.endStep2.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    // validates landline
    async checkLandline(promptContext) {
        return promptContext.recognized.succeeded && promptContext.recognized.value 
            &&  ((String(promptContext.recognized.value).toUpperCase() == 'N/A')
            || (promptContext.recognized.value.replace(/\D/g, '').length >=7)) ;
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

    // validator for TIN number
    async tinChecker(promptContext) {
        var str = promptContext.recognized.value;
        return /^\d+$/.test(str) && String(str).length == 12;
    }

    // validator for SSS or GSIS number
    async SSSorGSISChecker(promptContext) {
        var str = promptContext.recognized.value;
        return /^\d+$/.test(str) && (String(str).length >= 9 && String(str).length < 12);
    }

    // validates e-mail
    async emailValidator(promptContext) {
        return promptContext.recognized.succeeded
            && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(promptContext.recognized.value);
    }
    
    // validates e-mail for business e-mail
    async emailValidator2(promptContext) {
        console.log('\n'+ promptContext.recognized.value);
        console.log('\n'+ String(promptContext.recognized.value).toUpperCase());
        if (String(promptContext.recognized.value).toUpperCase() == 'N/A') return true;
        return promptContext.recognized.succeeded
            && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(promptContext.recognized.value);
    }

    // validator for mobile
    async mobileValidator(promptContext) {
        let first3Digits = String(promptContext.recognized.value);
        return promptContext.recognized.succeeded && first3Digits.substring(0, 3) == '639'
            && /^\d+$/.test(first3Digits) && String(promptContext.recognized.value).length == 12;
    }

    // validator for birthday
    async bdayValidate(promptContext) {
        var str = promptContext.recognized.value;
       
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str))
            return false;

        // Parse the date parts to integers
        var parts = str.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    }

    // validator for credit card number
    async credCardNumberValidator(promptContext) {
        var str = promptContext.recognized.value;
        return /^\d+$/.test(str) && String(str).length == 16;
    }

    // validator for the lenght of the name in the card
    async cardNameValidator(promptContext) {
        var str = promptContext.recognized.value;
        return !/\d/.test(str) && String(str).length <= 19;
    }

    // validator for credit card number
    async valid_credit_card(promptContext) {
        var value = promptContext.recognized.value;
        // Accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) return false;

        // The Luhn Algorithm. It's so pretty.
        let nCheck = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    async getDetails(step) {
        step.values.userProfile = step.options;
        step.values.userProfile.isMobNumCorrect = step.options.isMobNumCorrect;
        return await step.next();
    }

    async dataPrivacy(step) {
        console.log('\n\n\HERE:' + JSON.stringify(step.values.userProfile));
        if (step.values.userProfile.isMobNumCorrect && step.values.userProfile.isMobNumCorrect == 'No')
            return await step.next();

        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM") {

            await step.context.sendActivity('Let\'s proceed with your application.'.replace(/\s\s+/g, ' '));
            return await step.next();
        }

        var tempStr = step.values.userProfile.fbFirstName 
            ? ', ' + step.values.userProfile.fbFirstName + '.' : '!'

        const dpCard2 = CardFactory.heroCard(
            `Hi${tempStr} I\'m ESTA, your EastWest System Tech Assistant`,
            CardFactory.images(['https://ewbdevstorage.blob.core.windows.net/public-images/ESTA_IMAGE/esta3.jpg'])
        );
        await step.context.sendActivity({ attachments: [dpCard2] });
        
        await step.context.sendActivity("Thank you for your interest in applying for an EastWest \
            Credit Card. \u{1F604}".replace(/\s\s+/g, ' '));
        await step.context.sendActivity({ type: 'typing' });
        await step.context.sendActivity("Get a free P2,000 eGC when you apply for an EW credit card\
             thru Landers.".replace(/\s\s+/g, ' '));
        await step.context.sendActivity({ type: 'typing' });
        
        await step.context.sendActivity("Promo Mechanics as approved by DTI.".replace(/\s\s+/g, ' '));
        const dpCard = CardFactory.heroCard(
            'DTI Permit                                        ',
            CardFactory.images(['https://chatbot.ewbconsumerlending.com/Logo_messenger_crop.jpg']),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Read',
                    value: 'https://chatbot.ewbconsumerlending.com/T&C_Landers_2022.pdf'
                }
            ])
        );
        await step.context.sendActivity({ attachments: [dpCard] });
        await step.context.sendActivity({ type: 'typing' });
        await step.context.sendActivity("Before we proceed, I need you to read and consent to our \
            Data Privacy Policy below.".replace(/\s\s+/g, ' '));
        const dpCard3 = CardFactory.heroCard(
            'Data Privacy                                        ',
            CardFactory.images(['https://chatbot.ewbconsumerlending.com/Logo_messenger_crop.jpg']),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Read',
                    value: 'https://chatbot.ewbconsumerlending.com/PrivacyPolicy.html'
                }
            ])
        );
        await step.context.sendActivity({ attachments: [dpCard3] });
        await step.context.sendActivity({ type: 'typing' });
        await step.context.sendActivity();
        return await step.prompt(CONFIRM_PROMPT, {
            prompt: 'Do you agree?', 
            choices: ChoiceFactory.toChoices(['Yes', 'No'])});
    }

    async dataPrivacyP2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM") 
            return await step.next();

        if (step.values.userProfile.isMobNumCorrect && step.values.userProfile.isMobNumCorrect == 'No')
            return await step.next();
        else if (step.result) return await step.next();
        else {
            await step.context.sendActivity("Thank you! If you change your mind, refresh your \
                browser to re-enter the program.".replace(/\s\s+/g, ' '));
            return await step.endDialog();
        }
    }

    async informApplicationSummary(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM"
            || step.values.userProfile.isMobNumCorrect == 'No') 
            return await step.next();
                
        await step.context.sendActivity("Great! Here are the steps to proceed with your application:");
        await step.context.sendActivity("1. Verify your mobile number.");
        await step.context.sendActivity("2. Submit your application information and requirements.");
        await step.context.sendActivity("3. If the question is not applicable, kindly indicate N/A.");
        await step.context.sendActivity("Don't worry, you can complete the application process at \
            your convenience. You can stop anytime and return to where you left off by clicking \
            \"Start\" from the menu.".replace(/\s\s+/g, ' '));
        await step.context.sendActivity("If by any chance you encounter any issues, don't panic! \
            Just type \"Feedback\". We've got you covered.".replace(/\s\s+/g, ' '));

        var tempStr = step.values.userProfile.fbFirstName 
        ? ', ' + step.values.userProfile.fbFirstName + '?!' : '?!'
        return await step.prompt(CONFIRM_PROMPT, "Ready to go" + tempStr,
            ["Yes", "No"]);
    }

    async askMobileNumber(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM") 
            return await step.next();

        if (step.values.userProfile.isMobNumCorrect && step.values.userProfile.isMobNumCorrect == 'No'){
            return await step.prompt(NUMBER_PROMPT, { prompt: 'Please enter your mobile number in \
                this format 639088879999. For example, if your mobile is 09088879999, drop the 0 \
                and replace it with 63 so that you end up with 639088879999.'
                .replace(/\s\s+/g, ' '),
            retryPrompt: 'Incorrect input. Please enter your mobile number in this format \
                639088879999. For example, if your mobile is 09088879999, drop the 0 and replace it \
                with 63 so that you end up with 639088879999.'.replace(/\s\s+/g, ' ')});
        }

        if (step.result) {
            return await step.prompt(NUMBER_PROMPT, { prompt: 'Awesome. Now, I need to verify your \
                mobile number. Please enter your mobile number in this format 639088879999. For \
                example, if your mobile number is 09088879999, drop the 0 and replace it with 63 \
                so that you end up with 639088879999.'.replace(/\s\s+/g, ' '),
            retryPrompt: 'Please key in your mobile number following this format - 639XXXXXXXXX. \
                For example, if your mobile number is 09089998888, drop the 0 and replace it with \
                63 so that it becomes 639089998888.'.replace(/\s\s+/g, ' ')});
        }
        else {
            await step.context.sendActivity("Thank you! If you change your mind, refresh your \
                browser to re-enter the program.".replace(/\s\s+/g, ' '));
            return await step.endDialog();
        }
    }

    async confirmMobileNumber(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM") 
            return await step.next();

        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1") return await step.next();

        step.values.userProfile.mobile = step.result;
        return await step.prompt(CONFIRM_PROMPT, `Is +${step.values.userProfile.mobile} correct?`,
            ['Yes', 'No']);
    }

    async confirmMobileNumberP2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM") 
            return await step.next();

        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1") return await step.next();

        if (step.result) {
            step.values.userProfile.isMobNumCorrect = 'Yes';
            return await step.next();
        }
        else {
            step.values.userProfile.isMobNumCorrect = 'No';
            return await step.replaceDialog(CARDS_CS2, step.values.userProfile);
        }
    }

    async askToSendOTP(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM") 
            return await step.next();

        let d = new Date();
        let currentDate = String(d.getDate()).padStart(2, '0') + "/" 
            + String(d.getMonth() + 1).padStart(2, '0') + "/" + String(d.getFullYear());

        step.values.userProfile.followUpDate = moment(currentDate, 'DD/MM/YYYY').businessAdd(15)._d;
        var fDate = new Date(step.values.userProfile.followUpDate);
        step.values.userProfile.followUpDate = String(fDate.getMonth() + 1).padStart(2, '0')
            + "/" + String(fDate.getDate()).padStart(2, '0') + "/" + fDate.getFullYear();

        var queryDone = "No";

        let s1 = checkData(step.values.userProfile.mobile, "checkData");

        s1.then(function (res) {
            if (typeof res.Table1 == 'undefined') {
                step.values.userProfile.access = "No";
            }
            else {
                console.log(JSON.stringify(res.Table1));
                step.values.userProfile.access = "Yes";
                step.values.userProfile = res.Table1[0];
                step.values.userProfile.mobile = res.Table1[0].mobile;
            }
            queryDone = "Yes";
        }, function (err) {
            queryDone = "Timeout";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        //save as first time entry
        if (step.values.userProfile.access == "No") {
            step.values.userProfile.status = 'VERIFIED_MOBILE_NUMBER';
            
            var queryDone = "No";

            let s = new Date();
            step.values.userProfile.refNum = "CS" + (s.getMonth() + 1) + "" + s.getDate() + ""
                + s.getHours() + "" + s.getMinutes() + "" + s.getSeconds() + "" + s.getMilliseconds();

            let s2 = saveFirst(step.values.userProfile.mobile, "saveFirst", 
                fDate.getFullYear() + "/" + (fDate.getMonth() + 1) + "/"
                + fDate.getDate(), d.getFullYear() + "/" + (d.getMonth() + 1)
                + "/" + d.getDate(), step.values.userProfile.fbPsid, step.values.userProfile.refNum);

            s2.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing' });
            }
        }

        await step.context.sendActivity(`I will now send a one-time password (OTP) from an \
            EastWest-identified number to +${ step.values.userProfile.mobile }.`.replace(/\s\s+/g, ' '));
        return await step.prompt(CONFIRM_PROMPT, 'Do you want to proceed?', ['Yes', 'No']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    async validateOTP(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.result) return await step.beginDialog(OTP_BASE_DIALOG, step.values.userProfile);
        else {
            await step.context.sendActivity("Thank you! If you change your mind, refresh your \
                browser to re-enter the program.".replace(/\s\s+/g, ' '));
            return await step.endDialog();
        }
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askModeOfApplying2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.branchCode = 'Landers';
        if (step.values.userProfile.branchCode == 'Landers'){
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Indicate the corresponding number of the Landers Branch you are applying from',
                choices: ChoiceFactory.toChoices(['Alabang, Muntinlupa', 
                'Arcovia, Pasig', 'Balintawak, Quezon City', 'BGC, Taguig', 
                'Otis, Manila'])});    
        }
        else {
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Indicate the corresponding number of the S&R Branch you are applying from:',
                choices: ChoiceFactory.toChoices(['Alabang, Muntinlupa',
                    'Aseana, Parañaque', 'BGC, Taguig', 'Circuit, Makati',
                    'Commonwealth, Quezon City', 'Congressional, Quezon City', 
                    'Dr. A Santos Ave, Sucat, Parañaque', 'E. Rodriguez, Quezon City',
                    'Libis, Quezon City', 'Ninoy Aquino Ave, Sucat, Parañaque', 
                    'Shaw, Mandaluyong', 'Sumulong Highway, Marikina']
                )});
        }
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askToChooseCard(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        step.values.userProfile.branchCode += " : " + step.result.value;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Now, kindly choose your preferred EastWest credit card type. Please note that \
                you may receive a card type other than your choice depending on the result of \
                EastWest’s evaluation of your application.'.replace(/\s\s+/g, ' '),
            choices: ChoiceFactory.toChoices(['VISA', 'Mastercard'])
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askToChooseCard2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.cardType = step.result.value;

        if (step.values.userProfile.cardType == 'VISA') {
            await step.context.sendActivity("Below, you will find our selection of EastWest VISA credit cards.");
            const message = MessageFactory.carousel([
                CardFactory.heroCard(
                    'EastWest Visa Platinum',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/PlatinumVisa.png']),
                    CardFactory.actions([
                        {
                            type: ActionTypes.PostBack,
                            title: 'Select',
                            value: '408'
                        },
                        {
                            type: 'openUrl',
                            title: 'Learn More',
                            value: 'https://www.ewbanker.com/info/ewcc_features_VISAplatinum.asp'
                        }
                    ])),
                CardFactory.heroCard(
                    'EastWest Visa Gold',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/GoldVisa.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '302'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc_featuresandbenefits.asp'
                    }])),
                CardFactory.heroCard(
                    'EastWest Visa Classic',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/ClassicVisa.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '402'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc_featuresandbenefits.asp'
                    }]))
            ], 'Kindly choose credit card option');
            return await step.prompt(CHOICE_PROMPT, {
                prompt: message,
                choices: ['408', '302', '402'],
                style: ListStyle.none
            });
        }

        else if (step.values.userProfile.cardType == 'Mastercard') {

            await step.context.sendActivity("Below, you will find our selection of EastWest Mastercard credit cards.");
            const message = MessageFactory.carousel([
                CardFactory.heroCard(
                    'EastWest Platinum Mastercard',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/PlatinumMC.png']),
                    CardFactory.actions([
                        {
                            type: ActionTypes.PostBack,
                            title: 'Select',
                            value: '108'
                        },
                        {
                            type: 'openUrl',
                            title: 'Learn More',
                            value: 'https://www.ewbanker.com/info/ewcc_features_platinum.asp'
                        }
                    ])),
                CardFactory.heroCard(
                    'EastWest EveryDay Titanium Mastercard',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/Everyday.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '112'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc_features_everymcard.asp'
                    }])),
                CardFactory.heroCard(
                    'EastWest Dolce Vita Titanium Mastercard',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/DV.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '208'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc_features_dolceVita.asp'
                    }])),
                CardFactory.heroCard(
                    'EastWest Gold Mastercard',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/GoldMC.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '102'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc_featuresandbenefits.asp'
                    }])),
                CardFactory.heroCard(
                    'EastWest Classic Mastercard',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/ClassicMC.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '212'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc_featuresandbenefits.asp'
                    }])),
                CardFactory.heroCard(
                    'EastWest Singapore Airlines KrisFlyer World Mastercard',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/SQWorld.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '114'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc-features-singapore-airlines-krisflyer-world-mastercard.asp'
                    }])),
                CardFactory.heroCard(
                    'EastWest Singapore Airlines KrisFlyer Platinum Mastercard',
                    CardFactory.images(['https://chatbot.ewbconsumerlending.com/creditCards/SQplat.png']),
                    CardFactory.actions([{
                        type: ActionTypes.PostBack,
                        title: 'Select',
                        value: '116'
                    },
                    {
                        type: 'openUrl',
                        title: 'Learn More',
                        value: 'https://www.ewbanker.com/info/ewcc_features_singapore%20airlines%20krisflyer%20platinum.asp'
                    }])),

            ], 'Kindly choose preferred credit card');
            return await step.prompt(CHOICE_PROMPT, {
                prompt: message,
                choices: ['116', '114', '212', '102', '208', '112', '108'],
                style: ListStyle.none
            });

        }
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askKrisFlyerMemID(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.prodType = step.result.value;
        if (step.result.value == '116' || step.result.value == '114') {
                return await step.prompt(CONFIRM_PROMPT, 'Are you a KrisFlyer Member?', ['Yes', 'No']);
        }
        else return step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askKrisFlyerMemID2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.isKrisFlyerMem = step.result ? 'Yes' : 'No';

        if (step.result) {
            return await step.prompt(TEXT_PROMPT, 'Please indicate your KrisFlyer Card Number.');
        }
        else return step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askFirstName(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.isKrisFlyerMem == 'Yes')
            step.values.userProfile.krisFlyerMemID = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please enter your FIRST NAME ONLY. Do not enter \
            your complete name.'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askMiddleName(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.firstName = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please enter your MIDDLE NAME.');
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askLastName(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.middleName = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please enter your LAST NAME.');
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askNameSuffix(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.lastName = step.result;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please choose your name suffix:',
            choices: ChoiceFactory.toChoices(['None', 'Jr.', 'Sr.', 'III', 'IV', 'V', 'Others'])});
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askNameSuffix2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.nameSuffix = step.result.value;
        if (step.values.userProfile.nameSuffix == 'Others') {
            return await step.prompt(TEXT_PROMPT, 'Please enter your name suffix:');
        }

        return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askCardName(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.nameSuffix == 'Others') {
            step.values.userProfile.nameSuffix += ': ' + step.result;
        }
        
        return await step.prompt(CARDNAME_PROMPT, {
            prompt: 'Please enter the name to appear on your card. Must not exceed 19 characters \
                including spaces and must not contain a number.'.replace(/\s\s+/g, ' '),
            retryPrompt: 'Invalid input name. Please enter the name to appear on your card. Must \
                not exceed 19 characters including spaces and must not contain a number.'
                .replace(/\s\s+/g, ' ')
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askBirthDate(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        step.values.userProfile.cardName = step.result;
        return await step.prompt(BDAY_PROMPT, {prompt: 'Please enter your birthdate in this format \
            MM/DD/YYYY. For example, instead of March 17, 1998, kindly enter 03/17/1998.'
            .replace(/\s\s+/g, ' '),
            retryPrompt: 'Incorrect input. Please enter your birthdate in this format \
            MM/DD/YYYY. For example, instead of March 17, 1998, kindly enter 03/17/1998.'
            .replace(/\s\s+/g, ' ')
        });
    }
    
    // status = VERIFIED_MOBILE_NUMBER
    async askBirthPlace(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.birthDay = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please enter your City and Country of Birth (e.g., \
            Manila, Philippines).'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askGender(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        step.values.userProfile.placeOfBirth = step.result;
        return await step.prompt(CHOICE_PROMPT, 'Please select your gender.', ['Male', 'Female']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askMaritalStatus(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.gender = step.result.value;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please select your marital status',
            choices: ChoiceFactory.toChoices(['Single', 'Married', 'Divorced', 'Widow', 'Separated'])
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askNationality(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.civilStatus = step.result.value;
        return await step.prompt(CONFIRM_PROMPT, 'Are you a Filipino Citizen?', ['Yes', 'No']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askNationality2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.nationality = step.result ? 'Filipino' : 'Non-Filipino';
        console.log('\n\n'+step.values.userProfile.nationality);
        if (step.values.userProfile.nationality == 'Non-Filipino') {
            await step.context.sendActivity('You need to submit your Alien Certificate of \
                Registration (ACR).'.replace(/\s\s+/g, ' '));
            var promptOptions = {
                prompt: 'Please take a clear picture of your ACR. Please note that blurred images \
                    may cause a delay in the processing of your credit card application.'
                    .replace(/\s\s+/g, ' '),
                retryPrompt: 'The attachment must be a jpg/png image file.'
            };
            return await step.prompt(ITR_PROMPT, promptOptions);
        }
        return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askNationality3(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.nationality == 'Non-Filipino') {
            let name = "acrID";
            let imageUrl = step.context.activity.attachments[0].contentUrl;
            let imageType = step.context.activity.attachments[0].contentType;

            console.log('\n\nURL: ' + imageUrl);
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
                step.values.userProfile.fileNames = step.values.userProfile.fileNames + "," + imageName;
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

            await step.context.sendActivity("Please wait. We are uploading the picture. This \
                process can take a few seconds. If the picture fails to upload, kindly re-upload \
                it. Thank you!".replace(/\s\s+/g, ' '));
            
            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing' });
            }
        }
        
        return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askHomeStrAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        await step.context.sendActivity("We will collect your Home address in 4 parts. Please enter \
            only the information specified.".replace(/\s\s+/g, ' '));
        return await step.prompt(TEXT_PROMPT, 'Please enter your Home No., Building, Street,\
            Subdivision, Brgy.'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askHomeCity(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.homeStAddress = step.result.replace(/'/g, '');
        return await step.prompt(TEXT_PROMPT, 'Please enter your Home Municipality, City.');
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askHomeProvince(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.homeCity = step.result.replace(/'/g, '');
        return await step.prompt(TEXT_PROMPT, 'Please enter your Home Province (e.g. Metro Manila).');
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askHomeZipCode(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.homeProvince = step.result.replace(/'/g, '');
        return await step.prompt(TEXT_PROMPT, 'Please enter your Home Zip Code.');
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askConfirmAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.homeZipCode = step.result.replace(/'/g, '');
        return await step.prompt(CONFIRM_PROMPT, 'Is ' + step.values.userProfile.homeStAddress
            + ', ' + step.values.userProfile.homeCity + ', ' + step.values.userProfile.homeProvince 
            + ', ' + step.values.userProfile.homeZipCode + ' your permanent address?', ['Yes', 'No']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askConfirmAddressP2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.permanentResidence = step.result ? "Yes" : "No";
        return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askPermStAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.permanentResidence == "Yes") return await step.next();
        else
            return await step.prompt(TEXT_PROMPT, 'Please enter your Permanent No., Building, \
                Street, Subdivision, Brgy.'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askPermCityAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.permanentResidence == "Yes") {
            step.values.userProfile.permSt = step.values.userProfile.homeStAddress;
            return await step.next();
        }
        else {
            step.values.userProfile.permSt = step.result.replace(/'/g, "");
            return await step.prompt(TEXT_PROMPT, 'Please enter your Permanent Municipality, City.');
        }
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askPermProvinceAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.permanentResidence == "Yes") {
            step.values.userProfile.permCity = step.values.userProfile.homeCity;
            return await step.next();
        }
        else {
            step.values.userProfile.permCity = step.result.replace(/'/g, "");
            return await step.prompt(TEXT_PROMPT, 'Please enter your Permanent Province \
                (e.g. Metro Manila).'.replace(/\s\s+/g, ' '));
        }
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askPermZipCode(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.permanentResidence == "Yes") {
            step.values.userProfile.permProv = step.values.userProfile.homeProvince;
            return await step.next();
        }
        else {
            step.values.userProfile.permProv = step.result.replace(/'/g, "");
            return await step.prompt(TEXT_PROMPT, 'Please enter your Permanent Zip Code.');
        }
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askEmailAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.permanentResidence == "Yes") {
            step.values.userProfile.permZipCode = step.values.userProfile.homeZipCode;
        }
        else {
            step.values.userProfile.permZipCode = step.result.replace(/'/g, "");
        }
        return await step.prompt(EMAIL_PROMPT, {prompt: 'Please enter your e-mail address.',
            retryPrompt: 'Incorrect e-mail address. Please enter a valid e-mail address.'});
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askHomeLandline(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.emailAdd = step.result;
        return await step.prompt(LANDLINE_PROMPT, {
            prompt: 'Please enter your Home Landline including area code. E.g., 02 8888 9999 or \
                N/A if not applicable.'.replace(/\s\s+/g, ' '),
            retryPrompt: 'Incorrect Input! Please enter your Home Landline including area code. \
                E.g., 02 8888 9999 or N/A if not applicable.'.replace(/\s\s+/g, ' ')
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTypeOfEmployment(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.homeLandline = step.result;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please enter the number that corresponds to your type of employment',
            choices: ChoiceFactory.toChoices(['Private', 'Government', 'Self-employed/Business Owner',
                'Others'])
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTypeOfEmployment2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.employmentType= step.result.value;
        if (step.result.value == 'Others') {
            return await step.prompt(TEXT_PROMPT, 'Please input exact employment.');
        }       
        return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeReferences(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        if (step.values.userProfile.employmentType == 'Others') {
            step.values.userProfile.employmentType += ' : ' + step.result;
        }
        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            await step.context.sendActivity('I need to collect 2 trade references from you. Please provide \
                the following for each trade reference (Full Name, Company Name, and Contact Number)'
                .replace(/\s\s+/g, ' '));
            
            await step.context.sendActivity('I will now collect the information for your FIRST trade \
                reference'.replace(/\s\s+/g, ' '));
        }
        return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefName1(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') 
            return await step.prompt(TEXT_PROMPT, 'Please enter the FULL NAME of your first trade \
                reference in this format - LAST NAME, FIRST NAME, MIDDLE NAME'
                .replace(/\s\s+/g, ' '));
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefCompName1(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.tradeRefName1 = step.result;
            return await step.prompt(TEXT_PROMPT, 'Please enter the COMPANY NAME of your FIRST \
                trade reference.'.replace(/\s\s+/g, ' '));
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefContact1(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.tradeRefCompName1 = step.result;
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Please select what contact detail you will provide:'.replace(/\s\s+/g, ' '),
                choices: ChoiceFactory.toChoices(['Mobile', 'Landline'])
            });
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefContact1_2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.contactMode = step.result.value;
            
            if (step.values.userProfile.contactMode == 'Mobile') {
                return await step.prompt(NUMBER_PROMPT, { prompt: 'Please enter your mobile number in \
                    this format 639088879999. For example, if your mobile is 09088879999, drop the 0 \
                    and replace it with 63 so that you end up with 639088879999.'
                    .replace(/\s\s+/g, ' '),
                retryPrompt: 'Incorrect input. Please enter your mobile number in this format \
                    639088879999. For example, if your mobile is 09088879999, drop the 0 and replace it \
                    with 63 so that you end up with 639088879999.'.replace(/\s\s+/g, ' ')});
            }
            else {
                return await step.prompt(LANDLINE_PROMPT, {
                    prompt: 'Please enter your Trade Reference\'s Landline including area code. \
                        Include area code and local number (if applicable). Ex. 02 8888 9999 loc \
                        2422.'.replace(/\s\s+/g, ' '),
                    retryPrompt: 'Incorrect input! Please enter your Trade Reference\'s Landline \
                        including area code. Include area code and local number (if applicable). \
                        Ex. 02 8888 9999 loc 2422.'.replace(/\s\s+/g, ' ')
                });
            }
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefName2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.tradeRefContactNum1 = step.result;

            await step.context.sendActivity('I will now collect the information for your SECOND trade \
                reference'.replace(/\s\s+/g, ' '));

            return await step.prompt(TEXT_PROMPT, 'Please enter the FULL NAME of your SECOND trade \
                reference in this format - LAST NAME, FIRST NAME, MIDDLE NAME.'
                .replace(/\s\s+/g, ' '));
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefCompName2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.tradeRefName2 = step.result;
            return await step.prompt(TEXT_PROMPT, 'Please enter the COMPANY NAME of your SECOND \
                trade reference.'.replace(/\s\s+/g, ' '));
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefContact2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.tradeRefCompName2 = step.result;
            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Please select what contact detail you will provide:'.replace(/\s\s+/g, ' '),
                choices: ChoiceFactory.toChoices(['Mobile', 'Landline'])
            });
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askTradeRefContact2_2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.contactMode = step.result.value;
            
            if (step.values.userProfile.contactMode == 'Mobile') {
                return await step.prompt(NUMBER_PROMPT, { prompt: 'Please enter your mobile number in \
                    this format 639088879999. For example, if your mobile is 09088879999, drop the 0 \
                    and replace it with 63 so that you end up with 639088879999.'
                    .replace(/\s\s+/g, ' '),
                retryPrompt: 'Incorrect input. Please enter your mobile number in this format \
                    639088879999. For example, if your mobile is 09088879999, drop the 0 and replace it \
                    with 63 so that you end up with 639088879999.'.replace(/\s\s+/g, ' ')});
            }
            else {
                return await step.prompt(LANDLINE_PROMPT, {
                    prompt: 'Please enter your Trade Reference\'s Landline including area code. \
                        Include area code and local number (if applicable). Ex. 02 8888 9999 loc \
                        2422.'.replace(/\s\s+/g, ' '),
                    retryPrompt: 'Incorrect input! Please enter your Trade Reference\'s Landline \
                        including area code. Include area code and local number (if applicable). \
                        Ex. 02 8888 9999 loc 2422.'.replace(/\s\s+/g, ' ')
                });
            }
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askEmployerName(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.employmentType == 'Self-employed/Business Owner') {
            step.values.userProfile.tradeRefContactNum2 = step.result;
            await step.context.sendActivity('Thank you for providing your trade references.')
        }
        return await step.prompt(TEXT_PROMPT, 'Please enter your Employer or Business Name.');
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askNatureOfEmployment(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.employerOrBusinessName = step.result;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please enter the number that corresponds to the nature of your employer \
                or business:'.replace(/\s\s+/g, ' '),
            choices: ChoiceFactory.toChoices(NATURE_OF_EMPLOYER)
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askNatureOfEmployment2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.natureOfBusiness = step.result.value;
        if (step.values.userProfile.natureOfBusiness == 'OTHERS') {
            return await step.prompt(TEXT_PROMPT, 'Please specify the nature of your employer \
                or business.'.replace(/\s\s+/g, ' '));
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askJobTitle(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        if (step.values.userProfile.natureOfBusiness == 'OTHERS')
            step.values.userProfile.natureOfBusiness += ' : ' + step.result;

        return await step.prompt(TEXT_PROMPT, 'Please enter your Job Title.')
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askDepartment(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.position = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please enter the department you belong to \
            (N/A, if not applicable).'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askYearsOfEmployment(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.department = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please enter number of years in Business or Employment.');
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askEmployerStrAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        step.values.userProfile.yrsWithEmployerOrBusiness = step.result;
        await step.context.sendActivity("We will collect your address in 4 parts. Please enter only \
            the information specified.".replace(/\s\s+/g, ' '));
        return await step.prompt(TEXT_PROMPT, 'Please enter your Employer or Business No., Building, \
            Street, Subdivision, Brgy. '.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askEmployerCityAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();
        
        step.values.userProfile.compAddress1 = step.result.replace(/'/g, '');
        return await step.prompt(TEXT_PROMPT, 'Please enter your Employer or Business Municipality, \
            City.'.replace(/\s\s+/g, ' '));
    }
    
    // status = VERIFIED_MOBILE_NUMBER
    async askEmployerProvinceAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.compAddress2 = step.result.replace(/'/g, '');
        return await step.prompt(TEXT_PROMPT, 'Please enter your Employer or Business Province \
            (e.g. Metro Manila).'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askEmployerZipCode(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.compAddress3 = step.result.replace(/'/g, '');
        return await step.prompt(TEXT_PROMPT, 'Please enter your Employer or Business Zip code.'
            .replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askOfficeNumber(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.compAddress4 = step.result.replace(/'/g, '');
        return await step.prompt(LANDLINE_PROMPT, {
            prompt: 'Please enter the Office Landline. Include area code and local number \
                (if applicable). Ex. 02 8888 9999 loc 2422 (N/A, if not applicable).'
                .replace(/\s\s+/g, ' '),
            retryPrompt: 'Incorrect input! Please enter the Office Landline. Include area code and \
                local number (if applicable). Ex. 02 8888 9999 loc 2422 (N/A, if not applicable).'
                .replace(/\s\s+/g, ' ')
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askAlternativeOfficeEmailAddress(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.officeLandline = step.result;
        return await step.prompt(EMAIL_PROMPT2, {prompt: 'Please enter the office e-mail address or \
            your alternative e-mail address.'.replace(/\s\s+/g, ' '),
            retryPrompt: 'Incorrect e-mail address. Please enter a valid e-mail address.'});
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askAnnualIncome(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.alternativeEmailAddress = step.result;
        return await step.prompt(TEXT_PROMPT, 'Please indicate your gross annual income, example \
            Php 1,000,000.'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askSourceOfIncome(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.annualIncome = step.result;
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please select your main source of income:',
            choices: ChoiceFactory.toChoices(['Salary/Benefits',
                'Allowance', 'Business Income', 'Remittance', 'Retirement/Separation',
                'Others'])
        });
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askSourceOfIncome2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1"
            || step.values.userProfile.status == "NEED_GOVNUM")
            return await step.next();

        step.values.userProfile.sourceOfFunds = step.result.value;
        if (step.result.value == 'Others') {
            return await step.prompt(TEXT_PROMPT, 'Please indicate specific source of income.');
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askForTIN(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.status == "NEED_GOVNUM") {
            return await step.prompt(CHOICE_PROMPT, 'Do you have a TIN or SSS/GSIS Number?', 
            ['Tax Identification Number (TIN)', 'SSS/GSIS Number', 'No, I don\'t have any of the two']);
        }

        if (step.values.userProfile.sourceOfFunds == 'Others') {
            step.values.userProfile.sourceOfFunds += ' : ' + step.result;
        }

        return await step.prompt(CHOICE_PROMPT, 'Do you have a TIN or SSS/GSIS Number?', 
            ['Tax Identification Number (TIN)', 'SSS/GSIS Number', 'No, I don\'t have any of the two']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    // status = NEED_GOVNUM (if no tin or SSS/GSIS)
    async askForTIN2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        step.values.userProfile.govIDNUmber = step.result.value;
        if (step.result.value == 'Tax Identification Number (TIN)') {
            return await step.prompt(TIN_PROMPT, {
                prompt: 'Please input your 12-digit TIN without dashes. If your TIN is less than 12 \
                    digits, add zeroes at the end'.replace(/\s\s+/g, ' '),
                retryPrompt: 'Incorrect input. Please input again your 12-digit TIN without dashes. \
                    If your TIN is less than 12 digits, add zeroes at the end'.replace(/\s\s+/g, ' ')});
        }
        else if (step.result.value == 'SSS/GSIS Number') {
            return await step.prompt(SSSorGSIS_PROMPT, { prompt: 'Please enter your SSS or GSIS Number.\
            (Length must be 9-11 digits)'.replace(/\s\s+/g, ' '),
            retryPrompt: 'Incorrect input. Please enter your SSS or GSIS Number.'});
        }
        else {
            await step.context.sendActivity('Sorry but you need to have either one of the two \
                to proceed with your application. Just click \'Start\' to re-enter the program. Thank you!'
                .replace(/\s\s+/g, ' '));

            step.values.userProfile.status = "NEED_GOVNUM";
    
            var queryDone = "No";
            let s4 = saveData(step.values.userProfile, "saveData");

            s4.then(function (res) {
                queryDone = "Yes";
            }, function (err) {
                queryDone = "Timeout";
            })

            while (queryDone == "No") {
                await step.context.sendActivity({ type: 'typing' });
            }

            return step.endDialog();
        }
    }

    // status = NEED_GOVNUM
    async askIfExistingClient(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.govIDNUmber == 'Tax Identification Number (TIN)')
            step.values.userProfile.tinNumber = step.result;
        else step.values.userProfile.SSSorGSISNumber = step.result;

        return step.prompt(CONFIRM_PROMPT, 'Are you an existing EastWest Bank Client?',
            ['Yes','No']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfExistingClient2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        step.values.userProfile.isExistingClient = step.result ? 'Yes' : 'No';
        if (step.result){
            await step.context.sendActivity('Kindly indicate those that apply. (Input the number/s that \
                correspond to your answer. If more than one, kindly separate each number with a \
                comma. E.g 1,2,3)'.replace(/\s\s+/g, ' '));
            
            var details = "";
            var REQT_CTR = 1;
            for (const val in CLIENT_TYPE){
                if (REQT_CTR == 1){
                details += `${REQT_CTR}. ${CLIENT_TYPE[val]}\n`;
                REQT_CTR++;
                }
                else details += `\n ${REQT_CTR++}. ${CLIENT_TYPE[val]}`;
            }
            
            return await step.prompt(TEXT_PROMPT, details);
        }

        return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askCardIssuer(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.isExistingClient == 'Yes'){
            var str = String(step.result);

            var strArr = str.split(",");
            strArr = strArr.filter(strArr => strArr != "")

            var tempStr = "";
            for(const value in strArr) {
            var index = parseInt(strArr[value]) - 1;
            tempStr += ", " + CLIENT_TYPE[index]
            }

            tempStr = tempStr.replace(tempStr.substring(0,2), '');
            step.values.userProfile.clientTypeList = tempStr;
        }

        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Please enter the number that corresponds to the name of the bank that issued \
            your principal credit card:'.replace(/\s\s+/g, ' '),
            choices: ChoiceFactory.toChoices(CREDCARD_ISSUER)});
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askCardIssuerP2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        step.values.userProfile.otherCreditCardBank = step.result.value;
        if (step.values.userProfile.otherCreditCardBank == 'Others'){
            return await step.prompt(TEXT_PROMPT, 'Please input exact credit card issuer.');
        }
        else return await step.next(); // skip this step if 'Others' is not selected
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askCardNumber(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.otherCreditCardBank == 'Others'){
            step.values.userProfile.otherCreditCardBank += ` : ${ step.result }`;
            return await step.prompt(CC_PROMPT, {
                prompt: 'Please enter your 16-digit credit card number.',
                retryPrompt: 'Please enter your 16-digit credit card number.'
            });
        }
        else if (!(step.values.userProfile.otherCreditCardBank == 'No Card')){
            return await step.prompt(CC_PROMPT, {
                prompt: 'Please enter your 16-digit credit card number.',
                retryPrompt: 'Please enter your 16-digit credit card number.'
            });
        }
        else return await step.next() // skip this step if 'No Card' is selected
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfDOSRI(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.otherCreditCardBank != 'No Card') {
            step.values.userProfile.otherCreditCardNumber = step.result;
        }
        return await step.prompt(CONFIRM_PROMPT, 'Are you a Director, Officer, or Shareholder of \
            EastWest Bank, EastWest Rural Bank, or any subsidiary and/or affiliate?'
            .replace(/\s\s+/g, ' '), ['Yes', 'No']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfDOSRI2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        step.values.userProfile.isDosri = step.result ? 'Yes' : 'No';
        if (step.result) {
            return await step.prompt(TEXT_PROMPT, 'Please enter the company name and your position.');
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfDOSRIRelated(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.isDosri == 'Yes') 
            step.values.userProfile.dosriPos = step.result;

        return await step.prompt(CONFIRM_PROMPT, 'Are you a 1st degree relative of a Director, \
            Officer, or Shareholder of EastWest Bank?'.replace(/\s\s+/g, ' '), ['Yes', 'No'])
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfDOSRIRelated2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        step.values.userProfile.isDosriRelated = step.result ? 'Yes' : 'No';
        if (step.result) {
            return await step.prompt(TEXT_PROMPT, 'Please enter the full name and position of your \
                relative at EastWest Bank.'.replace(/\s\s+/g, ' '));
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfPEP(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.isDosriRelated == 'Yes')
            step.values.userProfile.dosriRel = step.result;
        return await step.prompt(CONFIRM_PROMPT, 'Are you a politically exposed person (PEP)?', 
            ['Yes', 'No']);
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfPEP2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();
        
        step.values.userProfile.isPEP = step.result ? 'Yes' : 'No';
        if (step.result) {
            return await step.prompt(TEXT_PROMPT, 'Kindly indicate the government agency you are \
                affiliated with and your position.'.replace(/\s\s+/g, ' '));
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfPEPRelated(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        if (step.values.userProfile.isPEP == 'Yes')
            step.values.userProfile.PEPPos = step.result;
        return await step.prompt(CONFIRM_PROMPT, 'Are you an immediate family member or a close \
            relative/associate of a PEP?'.replace(/\s\s+/g, ' '));
    }

    // status = VERIFIED_MOBILE_NUMBER
    async askIfPEPRelated2(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        step.values.userProfile.isPEPRel = step.result ? 'Yes' : 'No';
        if (step.result) {
            return await step.prompt(TEXT_PROMPT, 'Kindly indicate the name, government agency your \
                immediate family member or close relative/associate is affiliated with, and \
                his/her position.'.replace(/\s\s+/g, ' '));
        }
        else return await step.next();
    }

    // status = VERIFIED_MOBILE_NUMBER
    async endStep(step) {
        if (step.values.userProfile.status == "C_FORM_SUBMITTED_1")
            return await step.next();

        step.values.userProfile.status = "C_FORM_SUBMITTED_1";
        
        if (step.values.userProfile.isPEPRel == 'Yes')
            step.values.userProfile.PEPRelInfo = step.result;
    
        let dateF = new Date(step.values.userProfile.followUpdate);
        step.values.followupstr = DAYS_OF_WEEK[dateF.getDay()] + " "
            + MONTHS_ARR[dateF.getMonth()] + " " + dateF.getDate() + ", " + dateF.getFullYear();

        var queryDone = "No";

        let q2 = saveData(step.values.userProfile, "saveData");

        q2.then(function (res) {
            queryDone = "Yes";
        }, function (err) {
            queryDone = "Yes";
        })

        while (queryDone == "No") {
            await step.context.sendActivity({ type: 'typing' });
        }

        return await step.next();
    }

     // status = C_FORM_SUBMITTED_1
     async endStep2(step) {
        console.log("\n\nFIRST BATCH OF INFO: " 
            + JSON.stringify(step.values.userProfile).replace(',', /\n/g));
        
        step.values.userProfile.status = step.values.userProfile.otherCreditCardBank == "No Card"
            ? "NEED_INCOME" : "NEED_KYC2"; 

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

        if (step.values.userProfile.nationality == 'Non-Filipino') {
            var tempStr = step.values.userProfile.status == 'NEED_INCOME' ? ', a proof of income, '
                : '';
            await step.context.sendActivity(`We are close to finishing your application. I \
            just need to collect a few more information fields ${ tempStr }and a video of yourself actively \
            confirming your application.`.replace(/\s\s+/g, ' '));
        }
        else {
            var tempStr = step.values.userProfile.status == 'NEED_INCOME' ? ', a proof of income, '
                : ', ';
            await step.context.sendActivity(`We are close to finishing your application. I \
            just need to collect a few more information fields ${ tempStr }a photo-bearing government ID \
            and a video of yourself actively confirming your application.`.replace(/\s\s+/g, ' '));
        }
        
        if (step.values.userProfile.status == 'NEED_INCOME')
            return await step.beginDialog(CARDS_CS4, step.values.userProfile);
        else
            return await step.beginDialog(CARDS_CS3, step.values.userProfile);
    }
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

function saveData(userProfile, queryType) {
    var options =
    {
        url: 'https://prod-12.southeastasia.logic.azure.com:443/workflows/217f12eeff944a97b7ed2e37a444d030/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3vS_4KEYtIsv0DKO6J0JpzI0LpCGcBTFbEhB1lNCi4',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        ({
            "query": queryType,
            "mobile": userProfile.mobile,
            "branchCode": userProfile.branchCode,
            "prodType": userProfile.prodType,
            "krisFlyerMemID": userProfile.krisFlyerMemID ? userProfile.krisFlyerMemID : '',
            "firstName": userProfile.firstName,
            "middleName": userProfile.middleName,
            "lastName": userProfile.lastName,
            "nameSuffix": userProfile.nameSuffix,
            "cardName": userProfile.cardName,
            "birthDay": userProfile.birthDay,
            "placeOfBirth": userProfile.placeOfBirth,
            "gender": userProfile.gender,
            "civilStatus": userProfile.civilStatus,
            "nationality": userProfile.nationality,
            "homeStAddress": userProfile.homeStAddress,
            "homeCity": userProfile.homeCity,
            "homeProvince": userProfile.homeProvince,
            "homeZipCode": userProfile.homeZipCode,
            "permSt": userProfile.permSt,
            "permCity": userProfile.permCity,
            "permProv": userProfile.permProv,
            "permZipCode": userProfile.permZipCode,
            "emailAdd": userProfile.emailAdd,
            "homeLandline": userProfile.homeLandline,
            "employmentType": userProfile.employmentType,
            "tradeRefName1": userProfile.tradeRefName1,
            "tradeRefCompName1": userProfile.tradeRefCompName1,
            "tradeRefContactNum1": userProfile.tradeRefContactNum1,
            "tradeRefName2": userProfile.tradeRefName2,
            "tradeRefCompName2": userProfile.tradeRefCompName2,
            "tradeRefContactNum2": userProfile.tradeRefContactNum2,
            "employerOrBusinessName": userProfile.employerOrBusinessName,
            "natureOfBusiness": userProfile.natureOfBusiness,
            "position": userProfile.position,
            "department": userProfile.department,
            "yrsWithEmployerOrBusiness": userProfile.yrsWithEmployerOrBusiness,
            "compAddress1": userProfile.compAddress1,
            "compAddress2": userProfile.compAddress2,
            "compAddress3": userProfile.compAddress3,
            "compAddress4": userProfile.compAddress4,
            "officeLandline": userProfile.officeLandline,
            "alternativeEmailAddress": userProfile.alternativeEmailAddress,
            "annualIncome": userProfile.annualIncome,
            "sourceOfFunds": userProfile.sourceOfFunds,
            "tinNumber": userProfile.tinNumber ? userProfile.tinNumber : '',
            "SSS_GSIS_Nbr": userProfile.SSSorGSISNumber ? userProfile.SSSorGSISNumber : '',
            "clientTypeList": userProfile.clientTypeList,
            "otherCreditCardBank": userProfile.otherCreditCardBank,
            "otherCreditCardNumber": userProfile.otherCreditCardNumber,
            "isDosri": userProfile.isDosri,
            "DOSRIPos": userProfile.dosriPos,
            "isDosriRelated": userProfile.isDosriRelated,
            "DOSRIRelInfo": userProfile.dosriRel,
            "isPEP": userProfile.isPEP,
            "PEPPos": userProfile.PEPPos,
            "isPEPRel": userProfile.isPEPRel,
            "PEPRelInfo": userProfile.PEPRelInfo,
            "followUpDate": userProfile.followUpDate,
            "status": userProfile.status
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

function saveFirst(mobile, query, followUpDate, today, fbPsid, refNum) {
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
            "followUpDate": followUpDate,
            "today": today,
            "fbPsid": fbPsid,
            "refNum": refNum
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

module.exports.CardsCS2 = CardsCS2;
module.exports.CARDS_CS2 = CARDS_CS2;