// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { MessageFactory, InputHints, ActionTypes, ActivityTypes, CardFactory } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ComponentDialog, DialogSet, DialogTurnStatus, ConfirmPrompt, TextPrompt, NumberPrompt, WaterfallDialog, ChoicePrompt, ListStyle, ChoiceFactory, AttachmentPrompt } = require('botbuilder-dialogs');
const { UserProfile } = require('../userProfile');
const { Connection, Request } = require("tedious");
//const xmlParser = require('xml2json');
const WelcomeCard = require('../bots/resources/welcomeCard.json');
const virtual = require('../bots/resources/virtual2.json');
const { MapHelper } = require('./mapHelper');


var parser = require('fast-xml-parser');
var he = require('he');


var request = require('request');
var OAuth2 = require('oauth').OAuth2;
var FB = require('fb');

function retrieveData(userID) {

    FB.setAccessToken('EAAoljEZBWjaIBAO7NEoPzHEt06nCxTNbG8mCbAzjTXgBrgHsZCNA6a1bwRo8dtcFhEwAT1CHTEzLGZB6gsYdrBRnsxTPIPhX1N7tiAFPrCURykWJOmEGBMYTvz7FcC85tUCte3KtAj2WQBfSSWG5X8UDEvTZBB9pYQZCqN993eZA9yW2RmJvZBt');
    return new Promise(function (resolve, reject) {
        FB.api(`/${userID}/`, function (res) {
            if (res) {
                resolve(res);
            }
            else {
                console.log(!res ? 'error occurred' : res.error);
                reject(res.error);
            }

        })
    })
}


function retrieveData2(userID, pageID) {

    FB.setAccessToken(pageID);
    return new Promise(function (resolve, reject) {
        FB.api(`/${userID}/`, function (res) {
            if (res) {
                resolve(res);
            }
            else {
                console.log(!res ? 'error occurred' : res.error);
                reject(res.error);
            }

        })
    })
}

const ACTIVITY_PROMPT = 'ACTIVITY_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';

//Test Dialog
const { TestDialog } = require('./testDialog');
const TEST_DIALOG = 'testDialog';

//Test Dialog
const { AutoCF, AUTO_CF } = require('./autoCF');

const { WarehouseDialog, WAREHOUSE_DIALOG } = require('./warehouseDialog');

const { AutoLoans, AUTO_LOANS } = require('./autoloans');

const { AutoAuction, AUTO_AUCTION } = require('./autoAuction');

const { AutoAuction2, AUTO_AUCTION2 } = require('./autoAuction2');

const { RopaBis, ROPA_BIS } = require('./ropaBis');

const { RopaPayment, ROPA_PAYMENT } = require('./ropaPayment');

//Test Dialog
const { Mortgage } = require('./mortgage');
const MORTGAGE_DIALOG = 'mortgage';

const { CardsAcqui7 } = require('./cardsAcqui7');
const CARDS_ACQUI7 = 'cardsAcqui7';

const { CardsAcqui11 } = require('./cardsAcqui11');
const CARDS_ACQUI11 = 'cardsAcqui11';

const { CardsAcqui12 } = require('./cardsAcqui12');
const CARDS_ACQUI12 = 'cardsAcqui12';

const { CardsAcqui13 } = require('./cardsAcqui13');
const CARDS_ACQUI13 = 'cardsAcqui13';


const { DisputeChange } = require('./disputeChange');
const DISPUTE_CHANGE = 'disputeChange';

//auto underwriting
const { AutoBot } = require('./autoBot');
const AUTO_BOT = 'autoBot';

//feedcc - feedback credit card
const { Feedcc } = require('./feedcc');
const FEED_CC = 'feedcc';

//auto underwriting
const { PlBalcon } = require('./plBalcon');
const PL_BALCON = 'plBalcon';

const { AmfPoints } = require('./amfPoints');
const AMF_POINTS = 'amfPoints';

//LAZADA
const { ReferrerDialog } = require('./referrerDialog');
const REFERRER_DIALOG = 'referrerDialog';

//LAZADA
const { ReferralDialog } = require('./referralDialog');
const REFERRAL_DIALOG = 'referralDialog';

const { MgmAcqui } = require('./mgmAcqui');
const MGM_ACQUI = 'mgmAcqui';

const { ReferralDialog3 } = require('./referralDialog3');
const REFERRAL_DIALOG_3 = 'referralDialog3';

//auto underwriting
const { AppOld } = require('./appOld');
const APP_OLD = 'appOld';

//LAZADA
const { LazadaDialog1 } = require('./lazadaDialog1');
const LAZADA_DIALOG_1 = 'lazadaDialog1';

const { LazadaDialog3 } = require('./lazadaDialog3');
const LAZADA_DIALOG_3 = 'lazadaDialog3';

const { LazadaDialog2 } = require('./lazadaDialog2');
const LAZADA_DIALOG_2 = 'lazadaDialog2';

const { LazadaDialog4 } = require('./lazadaDialog4');
const LAZADA_DIALOG_4 = 'lazadaDialog4';

const { LazadaDialog5 } = require('./lazadaDialog5');
const LAZADA_DIALOG_5 = 'lazadaDialog5';

const { LazadaDialog6 } = require('./lazadaDialog6');
const LAZADA_DIALOG_6 = 'lazadaDialog6';

//BARO
const { BaroDialog } = require('./baroDialog');
const BARO_DIALOG = 'baroDialog';

//
const { CollectDialog } = require('./collectDialog');
const COLLECT_DIALOG = 'collectDialog';

const { AutoCollectDialog } = require('./autoCollectDialog');
const AUTOCOLLECT_DIALOG = 'autoCollectDialog';

const { CardsCollect } = require('./cardsCollect');
const CARDSCOLLECT = 'cardsCollect';

const { PlCollect } = require('./plCollect');
const PLCOLLECT = 'plCollect';

const { CcplDD } = require('./ccplDD');
const CCPLDD = 'ccplDD';

const { CcplPDD } = require('./ccplPDD');
const CCPLPDD = 'ccplPDD';


const { CcplADD } = require('./ccplADD');
const CCPLADD = 'ccplADD';


const { PlDD } = require('./plDD');
const PLDD = 'plDD';

const { PlPDD } = require('./plPDD');
const PLPDD = 'plPDD';


const { PlADD } = require('./plADD');
const PLADD = 'plADD';



//virtual Card
const { VirtualCard } = require('./virtualCard');
const VIRTUAL_CARD = 'virtualCard';

//rts Card
const { RtsDialog } = require('./rtsDialog');
const RTS_DIALOG = 'rtsDialog';


//Test Dialog
const { PlBookSuccess } = require('./plBookSuccess');
const PL_BOOK_SUCCESS = 'plBookSuccess';

//Test Dialog
const { PersonalLoanForms } = require('./personalLoanForms');
const PERSONAL_LOAN_FORMS = 'personalLoanForms';

//Test Dialog
const { PersonalLoanForms2 } = require('./personalLoanForms2');
const PERSONAL_LOAN_FORMS2 = 'personalLoanForms2';

const { PersonalLoan } = require('./personalLoan');
const PERSONAL_LOAN = 'personalLoan';

const { PersonalLoanCBGP1, PersonalCBGP1 } = require('./personalCBGP1');
const PERSONAL_CBGP1 = 'personalCBGP1';

const { PersonalLoanTPSAP1, PersonalTPSAP1 } = require('./personalTPSAP1');
const PERSONAL_TPSAP1 = 'personalTPSAP1';

const { PersonalLoanEcoP1, PersonalEcoP1 } = require('./personalEcoP1');
const PERSONAL_ECOP1 = 'personalEcoP1';

const { PersonalFinal } = require('./personalFinal');
const PERSONAL_FINAL = 'personalFinal';

const { PersonalBooking } = require('./personalBooking');
const PERSONAL_BOOKING = 'personalBooking';

const { PersonalBook2 } = require('./personalBook2');
const PERSONAL_BOOK2 = 'personalBook2';

//Test Dialog
const { TestSuccessDialog } = require('./testSuccessDialog');
const TEST_SUCCESS_DIALOG = 'testSuccessDialog';

//Test Dialog
const { Survey } = require('./survey');
const SURVEY = 'survey';

const { Survey2 } = require('./survey2');
const SURVEY2 = 'survey2';

const { Survey3 } = require('./survey3');
const SURVEY3 = 'survey3';

const { Anton } = require('./anton');
const ANTON = 'anton';

//Test Dialog
const { CardsOptions } = require('./cardsOptions');
const CARDS_OPTIONS = 'cardsOptions';

//Test Dialog
const { CardSuccessDialog } = require('./cardSuccessDialog');
const CARD_SUCCESS_DIALOG = 'cardSuccessDialog';

//Test Dialog
const { ApplicationCards } = require('./applicationCards');
const APPLICATION_CARDS = 'applicationCards';


//Test Dialog
const { WarehouseEdit } = require('./warehouseEdit');
const WAREHOUSE_EDIT = 'warehouseEdit';

const { WarehouseNew } = require('./warehouseNew');
const WAREHOUSE_NEW = 'warehouseNew';

//Test Dialog
const { AutoStoreForm } = require('./autoStoreForm');
const AUTO_STORE_FORM = 'autoStoreForm';


//Test Dialog
const { DlDialog } = require('./dlDialog');
const DL_DIALOG = 'dlDialog';

//Test Dialog
const { ActivationCard } = require('./activationCard');
const ACTIVATION_CARD = 'activationCard';

//Test Dialog
const { ActivationCard2 } = require('./activationCard2');
const ACTIVATION_CARD2 = 'activationCard2';

//Test Dialog
const { CrossEcoDialog } = require('./crossEcoDialog');
const CROSS_ECO_DIALOG = 'crossEcoDialog';

//Test Dialog
const { JmProject } = require('./jmProject');
const JM_PROJECT = 'jmProject';

const { JmProject2 } = require('./jmProject2');
const JM_PROJECT2 = 'jmProject2';

//Test Dialog
const { JmProjectv3 } = require('./jmProjectv3');
const JM_PROJECT_V3 = 'jmProjectv3';

const { JmProjectv4 } = require('./jmProjectv4');
const JM_PROJECT_V4 = 'jmProjectv4';

const { JmProject2v3 } = require('./jmProject2v3');
const JM_PROJECT2_V3 = 'jmProject2v3';

const { JmProject2v4 } = require('./jmProject2v4');
const JM_PROJECT2_V4 = 'jmProject2v4';

//Test Dialog
const { SnrDialog } = require('./snrDialog');
const SNR_DIALOG = 'snrDialog';

const { UpdateContact } = require('./updateContact');
const UPDATE_CONTACT = 'updateContact';

//Test Dialog
const { WaltermartDialog } = require('./waltermartDialog');
const WALTERMART_DIALOG = 'waltermartDialog';

const { IsFraudDialog } = require('./isFraudDialog');
const ISFRAUD_DIALOG = 'isFraudDialog';

// const { EddDialog } = require('./eddDialog');
const { EddDialog, EDD_DIALOG } = require('./eddDialog');
// const EDD_DIALOG = 'eddDialog';

//CardsSQ1 Dialog
const { CardsSQ1, CARDS_SQ1 } = require('./cardsSQ1');

//CardsSQ5 Dialog
const { CardsSQ5, CARDS_SQ5 } = require('./cardsSQ5');

//CardsCS1 Dialog
const { CardsCS1, CARDS_CS1 } = require('./cardsCS1');

//CardsCS5 Dialog
const { CardsCS5, CARDS_CS5 } = require('./cardsCS5');

const { AutoPreX, AUTO_PREX } = require('./autoPreX');

//PersonalLoanServices Dialog
const { PersonalLoanServices, PL_Services } = require('./personalLoanServices');

//Test Dialog
const { DemoDialog } = require('./demoDialog');

const { CardsPlat1 } = require('./cardsPlat1');
const CARDS_PLAT1 = 'cardsPlat1';

const { CardsPlat5 } = require('./cardsPlat5');
const CARDS_PLAT5 = 'cardsPlat5';

const { CardsScb1 } = require('./cardsScb1');
const CARDS_SCB1 = 'cardsScb1';

const { CardsScb5 } = require('./cardsScb5');
const CARDS_SCB5 = 'cardsScb5';

//Anton Test Dialog
// const { AntonTestDialog } = require('./antonTestDialog');
// const ANTONTEST_DIALOG = 'antonTestDialog';

const DEMO_DIALOG = 'demoDialog';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const USER_PROFILE_PROPERTY = 'userProfile';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

class MainDialog extends ComponentDialog {
    constructor(bookingDialog, userState) {
        super('MainDialog');

        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);


        // if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        // this.luisRecognizer = luisRecognizer;

        if (!bookingDialog) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');

        // Define the main dialog and its related components.
        // This is a sample "book a flight" dialog.
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT, this.itrValidator))
            .addDialog(bookingDialog)
            .addDialog(new TextPrompt(ACTIVITY_PROMPT))
            .addDialog(new CardsOptions(CARDS_OPTIONS))
            .addDialog(new NumberPrompt(NUMBER_PROMPT, this.mobileValidator))
            .addDialog(new TestDialog(TEST_DIALOG, userState))
            .addDialog(new ApplicationCards(APPLICATION_CARDS, userState))
            .addDialog(new TestSuccessDialog(TEST_SUCCESS_DIALOG, userState))
            .addDialog(new CardSuccessDialog(CARD_SUCCESS_DIALOG, userState))
            .addDialog(new DlDialog(DL_DIALOG, userState))
            .addDialog(new DemoDialog(DEMO_DIALOG, userState))
            .addDialog(new PersonalBook2(PERSONAL_BOOK2, userState))
            .addDialog(new SnrDialog(SNR_DIALOG, userState))
            .addDialog(new ActivationCard(ACTIVATION_CARD))
            .addDialog(new PersonalBooking(PERSONAL_BOOKING))
            .addDialog(new ActivationCard2(ACTIVATION_CARD2))
            .addDialog(new AutoStoreForm(AUTO_STORE_FORM))
            .addDialog(new PersonalLoanForms(PERSONAL_LOAN_FORMS))
            .addDialog(new PersonalLoanForms2(PERSONAL_LOAN_FORMS2))
            .addDialog(new PersonalFinal(PERSONAL_FINAL))
            .addDialog(new PersonalLoan(PERSONAL_LOAN))
            .addDialog(new Survey(SURVEY))
            .addDialog(new ReferrerDialog(REFERRER_DIALOG))
            .addDialog(new ReferralDialog(REFERRAL_DIALOG))
            .addDialog(new ReferralDialog3(REFERRAL_DIALOG_3))
            .addDialog(new LazadaDialog1(LAZADA_DIALOG_1))
            .addDialog(new LazadaDialog2(LAZADA_DIALOG_2))
            .addDialog(new LazadaDialog3(LAZADA_DIALOG_3))
            .addDialog(new LazadaDialog4(LAZADA_DIALOG_4))
            .addDialog(new VirtualCard(VIRTUAL_CARD))
            .addDialog(new Survey2(SURVEY2))
            .addDialog(new AppOld(APP_OLD))
            .addDialog(new BaroDialog(BARO_DIALOG))
            .addDialog(new Survey3(SURVEY3))
            .addDialog(new PlBalcon(PL_BALCON))
            .addDialog(new AutoBot(AUTO_BOT))
            .addDialog(new PlBookSuccess(PL_BOOK_SUCCESS))
            .addDialog(new LazadaDialog5(LAZADA_DIALOG_5))
            .addDialog(new LazadaDialog6(LAZADA_DIALOG_6))
            .addDialog(new RtsDialog(RTS_DIALOG))
            .addDialog(new JmProject(JM_PROJECT))
            .addDialog(new CrossEcoDialog(CROSS_ECO_DIALOG))
            .addDialog(new JmProject2(JM_PROJECT2))
            .addDialog(new CardsAcqui7(CARDS_ACQUI7))
            .addDialog(new CardsAcqui11(CARDS_ACQUI11))
            .addDialog(new Feedcc(FEED_CC))
            .addDialog(new Anton(ANTON))
            .addDialog(new UpdateContact(UPDATE_CONTACT))
            .addDialog(new CardsAcqui12(CARDS_ACQUI12))
            .addDialog(new CardsAcqui13(CARDS_ACQUI13))
            .addDialog(new Mortgage(MORTGAGE_DIALOG))
            .addDialog(new AutoCF())
            .addDialog(new WarehouseEdit(WAREHOUSE_EDIT))
            .addDialog(new WarehouseNew(WAREHOUSE_NEW))
            .addDialog(new WarehouseDialog())
            .addDialog(new MgmAcqui(MGM_ACQUI))
            .addDialog(new WaltermartDialog(WALTERMART_DIALOG, userState))
            .addDialog(new JmProjectv3(JM_PROJECT_V3))
            .addDialog(new JmProjectv4(JM_PROJECT_V4))
            .addDialog(new JmProject2v3(JM_PROJECT2_V3))
            .addDialog(new JmProject2v4(JM_PROJECT2_V4))
            .addDialog(new AmfPoints(AMF_POINTS))
            .addDialog(new AutoAuction())
            .addDialog(new RopaBis())
            .addDialog(new PersonalCBGP1(PERSONAL_CBGP1))
            .addDialog(new PersonalTPSAP1(PERSONAL_TPSAP1))
            .addDialog(new PersonalEcoP1(PERSONAL_ECOP1))
            .addDialog(new DisputeChange(DISPUTE_CHANGE))
            .addDialog(new IsFraudDialog(ISFRAUD_DIALOG))
            .addDialog(new EddDialog(EDD_DIALOG))
            .addDialog(new AutoLoans())
            .addDialog(new AutoAuction2())
            .addDialog(new CollectDialog(COLLECT_DIALOG))
            .addDialog(new AutoCollectDialog(AUTOCOLLECT_DIALOG))
            .addDialog(new CardsCollect(CARDSCOLLECT))
            .addDialog(new PlCollect(PLCOLLECT))
            .addDialog(new CcplDD(CCPLDD))
            .addDialog(new CcplPDD(CCPLPDD))
            .addDialog(new CcplADD(CCPLADD))
            .addDialog(new PlDD(PLDD))
            .addDialog(new PlPDD(PLPDD))
            .addDialog(new PlADD(PLADD))
            .addDialog(new RopaPayment(ROPA_PAYMENT))
            .addDialog(new CardsPlat5(CARDS_PLAT5))
            .addDialog(new CardsPlat1(CARDS_PLAT1))
            .addDialog(new CardsScb1(CARDS_SCB1))
            .addDialog(new CardsScb5(CARDS_SCB5))
            .addDialog(new CardsSQ1(CARDS_SQ1))
            .addDialog(new CardsSQ5(CARDS_SQ5))
            .addDialog(new CardsCS1(CARDS_CS1))
            .addDialog(new CardsCS5(CARDS_CS5))
            .addDialog(new AutoPreX(AUTO_PREX))
            .addDialog(new PersonalLoanServices(PL_Services))
            // .addDialog(new AntonTestDialog(ANTONTEST_DIALOG))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.preStep.bind(this),
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }

    }

    async preStep(stepContext) {
        if (stepContext.context.activity.channelId == 'directline') {
            // const { context, context: { activity } } = stepContext;
            // const { latitude, longitude } = activity.channelData;
            // await stepContext.context.sendActivity("Here's the map.");
            // const mapHelper = new MapHelper();
            // await mapHelper.getMap(context, latitude, longitude);
            // return await stepContext.endDialog();
            const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
            await stepContext.context.sendActivity({ attachments: [welcomeCard] });
            return await stepContext.prompt(ACTIVITY_PROMPT, '');
        }
        else {
            return await stepContext.next();
        }
    }

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
     * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
     */
    async introStep(stepContext) {
        stepContext.values.userMain = stepContext.options ? stepContext.options : {};
        //const userProfile = await this.userProfileAccessor.get(stepContext.context, new UserProfile());
        stepContext.values.userMain.refDL = stepContext.context.activity.from.id;
        const channelData = stepContext.context.activity && stepContext.context.activity.channelData;

        console.log("channelData: " + JSON.stringify(channelData));

        // if (!this.luisRecognizer.isConfigured) {
        //     const messageText = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
        //     await stepContext.context.sendActivity(messageText, null, InputHints.IgnoringInput);
        //     return await stepContext.next();
        // }

        if (stepContext.context.activity.channelId === 'directline') {

            stepContext.values.userMain.refCode = getPromoCode(stepContext.values.userMain.refDL);
            console.log("\n\rwhole ref = " + stepContext.values.userMain.refDL);
            console.log("\n\getMobile  = " + getMobileNumber(stepContext.values.userMain.refDL));
            console.log("\n\getPromo  = " + getPromoCode(stepContext.values.userMain.refDL));


            if (stepContext.values.userMain.refCode == "virtual") {
                stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);

                return await stepContext.beginDialog(VIRTUAL_CARD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "warehouseEdit") {
                // stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);

                return await stepContext.beginDialog(WAREHOUSE_EDIT, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "warehouseNew") {
                // stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);

                return await stepContext.beginDialog(WAREHOUSE_NEW, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "test") {
                await stepContext.context.sendActivity("<br/>apvillabrille@eastwestbanker.com")
                return await stepContext.endDialog();
            }


            if (stepContext.values.userMain.refCode == "dispute") {
                stepContext.values.userMain.referral_link = stepContext.values.userMain.refDL;

                return await stepContext.beginDialog(JM_PROJECT, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "disputev3") {
                stepContext.values.userMain.referral_link = stepContext.values.userMain.refDL;

                return await stepContext.beginDialog(JM_PROJECT_V3, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "disputev4") {
                stepContext.values.userMain.referral_link = stepContext.values.userMain.refDL;

                return await stepContext.beginDialog(JM_PROJECT_V4, stepContext.values.userMain);
            }
            
            if (stepContext.values.userMain.refCode == "disputeCancelledv4") {
                stepContext.values.userMain.mobileNumber = getMobileNumber(stepContext.values.userMain.refDL);

                return await stepContext.beginDialog(JM_PROJECT2_V4, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "disputeCancelledv3") {
                stepContext.values.userMain.mobileNumber = getMobileNumber(stepContext.values.userMain.refDL);

                return await stepContext.beginDialog(JM_PROJECT2_V3, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "disputeCancelled") {
                stepContext.values.userMain.mobileNumber = getMobileNumber(stepContext.values.userMain.refDL);

                return await stepContext.beginDialog(JM_PROJECT2, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "getEmail") {
                return await stepContext.prompt(ACTIVITY_PROMPT, { prompt: 'Please enter your email address to continue with your EastWest Personal Loan Application:' });
            }

            // if (stepContext.values.userMain.refCode == "antonTest")
            // {
            //     await stepContext.context.sendActivity(`${JSON.stringify(stepContext.values.userMain)}`);
            //     return await stepContext.beginDialog(ANTONTEST_DIALOG, stepContext.values.userMain);
            // }

            if (stepContext.values.userMain.refCode == "validation") {
                console.log('\n\nwent to maindialog.js\n\n')
                stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(ANTON, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "updateContact") {
                stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(UPDATE_CONTACT, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.refCode == "rts") {
                stepContext.values.userMain.appID = getMobileNumber(stepContext.values.userMain.refDL);

                return await stepContext.beginDialog(RTS_DIALOG, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.refCode == "underwrite") {
                stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(AUTO_BOT, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "isFraud") {
                stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(ISFRAUD_DIALOG, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "edd") {
                console.log('\n\nHERE. ITS UR PROBLEM');
                stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(EDD_DIALOG, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "PLBOOK") {
                return await stepContext.next();
            }
            else if (stepContext.values.userMain.refCode == "mortgage") {
                await stepContext.context.sendActivity("If you have previously attempted to apply and did not complete the process, you will be brought back to where you stopped after we verify your mobile number.");
                await stepContext.context.sendActivity("Step 1. Verification of your mobile number.");
                const inputMobile = { prompt: 'Please key in your mobile number following this format - 639XXXXXXXXX.', retryPrompt: 'Please resubmit, mobile number must comply with a format of 639XXXXXXXXX.' };
                return await stepContext.prompt(NUMBER_PROMPT, inputMobile);
            }
            else if (stepContext.values.userMain.refCode == "feedcc") {
                await stepContext.context.sendActivity("Before I accept your feedback or display our response, I will need to authenticate your identity.");
                const inputMobile = { prompt: 'Please key in your mobile number following this format - 639XXXXXXXXX. For example, if your # is 09089998888 then drop the first 0 and add 63 so that it becomes 639089998888.', retryPrompt: 'Please resubmit, mobile number must comply with a format of 639XXXXXXXXX' };
                return await stepContext.prompt(NUMBER_PROMPT, inputMobile);
            }
            else if (stepContext.values.userMain.refCode == "creditcard") {


                await stepContext.context.sendActivity("To display your application status, I will first need to authenticate your identity. ");
                const inputMobile = { prompt: 'Please key in your mobile number following this format - 639XXXXXXXXX. For example, if your # is 09089998888 then drop the first 0 and add 63 so that it becomes 639089998888.', retryPrompt: 'Please resubmit, mobile number must comply with a format of 639XXXXXXXXX' };
                return await stepContext.prompt(NUMBER_PROMPT, inputMobile);
            }
            else if (stepContext.values.userMain.refCode == "appcc") {
                return await stepContext.next();
            }
            else if (stepContext.values.userMain.refCode == "backUp") {
                return await stepContext.next();
            }
            else if (stepContext.values.userMain.refCode == "CBG" || stepContext.values.userMain.refCode == "ECO") {
                await stepContext.context.sendActivity("If you have previously attempted to apply and did not complete the process, you will be brought back to where you stopped after we verify your mobile number.");
                await stepContext.context.sendActivity("Step 1. Verification of your mobile number.");
                const inputMobile = { prompt: 'Please key in your mobile number following this format - 639XXXXXXXXX.', retryPrompt: 'Please resubmit, mobile number must comply with a format of 639XXXXXXXXX.' };
                return await stepContext.prompt(NUMBER_PROMPT, inputMobile);
            }

            else if (stepContext.values.userMain.refCode == "PL2") {
                await stepContext.context.sendActivity("You are now outside of messenger and in a secure EastWest owned chat environment.");
                await stepContext.context.sendActivity("If you have previously attempted to apply and did not complete the process, you will be brought back to where you stopped after we verify your mobile number.");
                await stepContext.context.sendActivity("Step 1. Verification of your mobile number.");
                const inputMobile = { prompt: 'Please key in your mobile number following this format - 639XXXXXXXXX.', retryPrompt: 'Please resubmit, mobile number must comply with a format of 639XXXXXXXXX.' };
                return await stepContext.prompt(NUMBER_PROMPT, inputMobile);
            }
            else {
                await stepContext.context.sendActivity("If you have previously attempted to apply and did not complete the process, you will be brought back to where you stopped after we verify your mobile number.");
                //await stepContext.context.sendActivity("Please note that we only accept applications from Filipino citizens.");
                await stepContext.context.sendActivity("Step 1. Verification of your mobile number.");
                const inputMobile = { prompt: 'Please key in your mobile number following this format - 639XXXXXXXXX.', retryPrompt: 'Please resubmit, mobile number must comply with a format of 639XXXXXXXXX.' };
                return await stepContext.prompt(NUMBER_PROMPT, inputMobile);
            }


        }

        return await stepContext.next();
    }

    //validate mobile
    async mobileValidator(promptContext) {
        let first3Digits = String(promptContext.recognized.value);
        return promptContext.recognized.succeeded && first3Digits.substring(0, 3) == '639' && String(promptContext.recognized.value).length == 12;

    }

    /**
     * Second step in the waterfall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
     * Then, it hands off to the bookingDialog child dialog to collect any remaining details.
     */
    async actStep(stepContext) {
        const channelData = stepContext.context.activity && stepContext.context.activity.channelData;

        //directline
        if (stepContext.context.activity.channelId === 'directline') {

            stepContext.values.userMain.mobileNumber = stepContext.result;
            if (stepContext.values.userMain.refCode == "demo") {
                return await stepContext.beginDialog(DEMO_DIALOG, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.refCode == "dispute" || stepContext.values.userMain.refCode == "disputeCancelled") {
                return await stepContext.endDialog();
            }
            if (stepContext.values.userMain.refCode == "disputev3" || stepContext.values.userMain.refCode == "disputeCancelledv3") {
                return await stepContext.endDialog();
            }
            else if (stepContext.values.userMain.refCode == "auto") {
                return await stepContext.beginDialog(AUTO_STORE_FORM, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.refCode == "PL2") {
                return await stepContext.beginDialog(PERSONAL_LOAN_FORMS, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "mortgage") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                return await stepContext.beginDialog(MORTGAGE_DIALOG, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.refCode == "PL3") {
                return await stepContext.beginDialog(PERSONAL_LOAN_FORMS2, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.refCode == "PLBOOK") {
                // await stepContext.context.sendActivity("BOOKING");
                // return await stepContext.endDialog();
                stepContext.values.userMain.appID = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(PERSONAL_BOOK2, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.refCode == "underwrite") {
                //auto underwriting
                //return await stepContext.beginDialog(AUTO_BOT, stepContext.values.userMain);
                return await stepContext.endDialog();
            }
            else if (stepContext.values.userMain.refCode == "creditcard") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                return await stepContext.beginDialog(CARDS_ACQUI11, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "feedcc") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                return await stepContext.beginDialog(FEED_CC, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "validation") {
                return await stepContext.endDialog();
            }

            else if (stepContext.values.userMain.refCode == "updateContact") {
                return await stepContext.endDialog();
            }

            else if (stepContext.values.userMain.refCode == "warehouseEdit") {
                return await stepContext.endDialog();
            }

            else if (stepContext.values.userMain.refCode == "warehouseNew") {
                return await stepContext.endDialog();
            }

            else if (stepContext.values.userMain.refCode == "getEmail") {
                await stepContext.context.sendActivity("Thank you. We will provide you feedback by via SMS and Email. Goodbye!");


                var queryDone = "No";

                let s = emailResponse(stepContext.result, getMobileNumber(stepContext.values.userMain.refDL));

                s.then(function (res) {
                    queryDone = "Yes";
                }, function (err) {
                    queryDone = "Yes";
                })

                while (queryDone == "No") {
                    return await stepContext.context.sendActivity({ type: 'typing' });
                }


                return await stepContext.endDialog();
            }


            else if (stepContext.values.userMain.refCode == "virtual") {
                return await stepContext.endDialog();
            }
            else if (stepContext.values.userMain.refCode == "rts") {
                return await stepContext.endDialog();
            }

            else if (stepContext.values.userMain.refCode == "cc") {
                return await stepContext.beginDialog(LAZADA_DIALOG_2, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "appcc") {
                return await stepContext.beginDialog(LAZADA_DIALOG_4, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "cancelled") {
                return await stepContext.beginDialog(LAZADA_DIALOG_5, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "appOld") {
                return await stepContext.beginDialog(APP_OLD, stepContext.values.userMain)
            }

            else if (stepContext.values.userMain.refCode == "isFraud") {
                return await stepContext.endDialog();
            }

            else if (stepContext.values.userMain.refCode == "edd") {
                return await stepContext.endDialog();
            }


            else if (stepContext.values.userMain.refCode == "CBG") {
                return await stepContext.beginDialog(CROSS_ECO_DIALOG, stepContext.values.userMain)
            }
            else if (stepContext.values.userMain.refCode == "ECO") {
                return await stepContext.beginDialog(CROSS_ECO_DIALOG, stepContext.values.userMain)
            }
            else if (stepContext.values.userMain.refCode == "SNR") {
                return await stepContext.beginDialog(APPLICATION_CARDS, stepContext.values.userMain)
            }
            else if (stepContext.values.userMain.refCode == "backUp") {
                return await stepContext.beginDialog(CARDS_ACQUI7, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.refCode == "personalLoan") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                return await stepContext.beginDialog(PERSONAL_LOAN, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.refCode == "plxsell") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(PERSONAL_CBGP1, stepContext.values.userMain);
            }

            // else if (stepContext.values.userMain.refCode == "pltpsa") {
            //     stepContext.values.userMain.mobileNumber = stepContext.result;
            //     stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
            //     return await stepContext.beginDialog(PERSONAL_TPSAP1, stepContext.values.userMain);
            // }

            else if (stepContext.values.userMain.refCode == "pleco") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(PERSONAL_ECOP1, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.refCode == "plcbg") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(PERSONAL_ECOP1, stepContext.values.userMain);
            }
            else {
                return await stepContext.beginDialog(DL_DIALOG, stepContext.values.userMain);
            }

        }

        //first interaction - postback.payload.referral
        if (stepContext.context && stepContext.context._activity
            && stepContext.context._activity.channelData
            && stepContext.context._activity.channelData.postback
            && stepContext.context._activity.channelData.postback.payload == 'action?Start'
            && stepContext.context._activity.channelData.postback.referral
            && stepContext.context.activity.channelId === 'facebook') {

            console.log('\n\nCHANNEL DATA INFO:' + JSON.stringify(stepContext.context));

            stepContext.values.userMain.referral_link
                = stepContext.context._activity.channelData.postback.referral.ref; //m.me link
            stepContext.values.userMain.userMobile
                = getMobileNumber(stepContext.values.userMain.referral_link);
            stepContext.values.userMain.promo
                = getPromoCode(stepContext.values.userMain.referral_link);
            stepContext.values.userMain.psid
                = stepContext.context._activity.channelData.sender.id;
            stepContext.values.userMain.name
                = stepContext.context._activity.from.name;
                
            var queryDone = "No";
            let ret = retrieveData(stepContext.context._activity.channelData.sender.id);

            ret.then(function (result) {
                //console.log(JSON.stringify(result));
                stepContext.values.userMain.fbFirstName = result.first_name;
                queryDone = "Yes";
            }, function (error) {
                console.log(error);
            })

            while (queryDone == "No") {
                await stepContext.context.sendActivity({ type: 'typing' });
            }
            if (stepContext.values.userMain.promo == "test") {
                return await stepContext.beginDialog(TEST_DIALOG, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.promo == "topup") {
                return await stepContext.beginDialog(TEST_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "sqCards") {
                return await stepContext.beginDialog(CARDS_SQ1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "pltpsa") {
                // stepContext.values.userMain.mobileNumber = stepContext.result;
                stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(PERSONAL_TPSAP1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsCS") {
                return await stepContext.beginDialog(CARDS_CS1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "autoPreX") {
                return await stepContext.beginDialog(AUTO_PREX, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "plChecker") {
                return await stepContext.beginDialog(PL_Services, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsPlat") {
                return await stepContext.beginDialog(CARDS_PLAT1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsScb") {
                return await stepContext.beginDialog(CARDS_SCB1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "mortCollect") {
                return await stepContext.beginDialog(COLLECT_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "autoCollect") {
                return await stepContext.beginDialog(AUTOCOLLECT_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsCollect") {
                return await stepContext.beginDialog(CARDSCOLLECT, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "plCollect") {
                return await stepContext.beginDialog(PLCOLLECT, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "CCPLDD") {
                return await stepContext.beginDialog(CCPLDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "CCPLPDD") {
                return await stepContext.beginDialog(CCPLPDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "CCPLADD") {
                return await stepContext.beginDialog(CCPLADD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "PLDD") {
                return await stepContext.beginDialog(PLDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "PLPDD") {
                return await stepContext.beginDialog(PLPDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "PLADD") {
                return await stepContext.beginDialog(PLADD, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == "snr") {
                return await stepContext.beginDialog(SNR_DIALOG, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == "waltermart") {
                return await stepContext.beginDialog(WALTERMART_DIALOG, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == "PL") {
                console.log("PL DIALOGUE");
                return await stepContext.beginDialog(PERSONAL_LOAN, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == "activate") {
                return await stepContext.beginDialog(ACTIVATION_CARD, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == 'activation') {
                return await stepContext.beginDialog(ACTIVATION_CARD2, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == 'warehouse') {
                return await stepContext.beginDialog(WAREHOUSE_DIALOG, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'autoloans') {
                return await stepContext.beginDialog(AUTO_LOANS, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'autoAuction') {
                return await stepContext.beginDialog(AUTO_AUCTION, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'auction') {
                return await stepContext.beginDialog(AUTO_AUCTION2, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'ropaBis') {
                return await stepContext.beginDialog(ROPA_BIS, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'ropaPayment') {
                return await stepContext.beginDialog(ROPA_PAYMENT, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == "isFraud") {
                // stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(ISFRAUD_DIALOG, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'autoCF') {
                stepContext.values.userMain.appID = getMobileNumber(stepContext.values.userMain.referral_link);
                console.log("APPID1" + stepContext.values.userMain.appID);
                return await stepContext.beginDialog(AUTO_CF, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == 'al') {
                // Create connection to database
                const config = {
                    authentication: {
                        options: {
                            userName: "julius", // update me
                            password: "spacemaN1" // update me
                        },
                        type: "default"
                    },
                    server: "dbbankbot.database.windows.nett", // update me
                    options: {
                        database: "chatbot_demo", //update me
                        encrypt: true
                    }
                };

                const connection = new Connection(config);

                // Attempt to connect and execute queries if connection goes through
                connection.on("connect", err => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        queryDatabase();
                    }
                });
                await stepContext.context.sendActivity("DONE QUERY");
                return await stepContext.next();
            }
            else if (stepContext.values.userMain.promo == 'sksk') {
                await stepContext.context.sendActivity("Great! Mystery solved");
                return await stepContext.next();
            }
            else if (stepContext.values.userMain.promo == 'survey') {
                return await stepContext.beginDialog(SURVEY, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == 'survey2') {
                return await stepContext.beginDialog(SURVEY2, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'survey3') {
                return await stepContext.beginDialog(SURVEY3, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'baro') {
                return await stepContext.beginDialog(BARO_DIALOG, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == 'ref') {
                return await stepContext.beginDialog(REFERRER_DIALOG, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == 'ref2') {
                return await stepContext.beginDialog(MGM_ACQUI, stepContext.values.userMain);
            }
            else if (stepContext.values.userMain.promo == 'ref3') {
                return await stepContext.beginDialog(REFERRAL_DIALOG_3, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'plBalcon') {
                return await stepContext.beginDialog(PL_BALCON, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'cardUpgrade') {
                return await stepContext.beginDialog(AMF_POINTS, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'cards12') {
                return await stepContext.beginDialog(CARDS_ACQUI12, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'cards13') {
                return await stepContext.beginDialog(CARDS_ACQUI13, stepContext.values.userMain);
            }
            else {

                await stepContext.context.sendActivity("You're weird 4");
                return await stepContext.next();
            }

        }

        if (channelData && channelData.postback && channelData.postback.payload == 'action?Start') {
            console.log('\n\nWith REF: ' + JSON.stringify(channelData));
            // stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
            // return await stepContext.beginDialog(PL_Services, stepContext.values.userMain);
            var queryDone = "No";
            let ret = retrieveData(stepContext.context.activity.channelData.sender.id);

            ret.then(function (result) {
                //console.log(JSON.stringify(result));
                stepContext.values.userMain.fbFirstName = result.first_name;
                queryDone = "Yes";
            }, function (error) {
                console.log(error);
            })

            while (queryDone == "No") {
                await stepContext.context.sendActivity({ type: 'typing' });
            }

            const dpCard2 = CardFactory.heroCard(
                'Hi ' + stepContext.values.userMain.fbFirstName + '. I\'m ESTA, your EastWest Tech Assistant',
                CardFactory.images(['https://ewbdevstorage.blob.core.windows.net/public-images/ESTA_IMAGE/esta3.jpg'])
            );
            await stepContext.context.sendActivity({ attachments: [dpCard2] });
            //await stepContext.context.sendActivity("I can help you with application for Credit Card, Auto Loan, and Personal Loan");
            //await stepContext.context.sendActivity("How may I help you today?");
            //return await stepContext.endDialog();
            return await stepContext.prompt(CHOICE_PROMPT, {
                prompt: 'At this time, I can only accept applications for Auto Loans, Personal Loan and Credit Cards . If you receive an SMS or Email with KEYWORD, kindly choose Keyword',
                choices: ChoiceFactory.toChoices(['Auto', 'Personal', 'Cards', 'Keyword']),
                style: ListStyle.auto
            });
        }

        if (channelData && channelData.postback && channelData.postback.payload) {
            stepContext.values.userMain.psid = stepContext.context.activity.channelData.sender.id;

            var queryDone = "No";
            let ret = retrieveData(stepContext.context.activity.channelData.sender.id);

            ret.then(function (result) {
                //console.log(JSON.stringify(result));
                stepContext.values.userMain.fbFirstName = result.first_name;
                queryDone = "Yes";
            }, function (error) {
                console.log(error);
            })

            while (queryDone == "No") {
                await stepContext.context.sendActivity({ type: 'typing' });
            }
            if (channelData.postback.payload.includes("surveyProceed-")) {
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(SURVEY, stepContext.values.userMain);
            }
            if (channelData.postback.payload.includes("surveyProceed2-")) {
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(SURVEY2, stepContext.values.userMain);
            }
            if (channelData.postback.payload.includes("surveyProceed3-")) {
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(SURVEY3, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("plProceed-")) {
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(PERSONAL_LOAN, stepContext.values.userMain);
            }
            if (channelData.postback.payload.includes("baroProceed-")) {
                stepContext.values.userMain.userMobile = getMobileNumber(channelData.postback.payload);
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(BARO_DIALOG, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("ccProceed")) {
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(LAZADA_DIALOG_1, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("balConProceed-")) {
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(PL_BALCON, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("amfProceed-")) {
                stepContext.values.userMain.dataPrivacy = "Yes";
                return await stepContext.beginDialog(AMF_POINTS, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("resolveProceed-")) {
                stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
                return await stepContext.beginDialog(LAZADA_DIALOG_5, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("resolveProceedSQ-")) {
                stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
                return await stepContext.beginDialog(CARDS_SQ5, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("resolveProceedCS-")) {
                stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
                return await stepContext.beginDialog(CARDS_CS5, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("plCheckerRestart")) {
                stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
                return await stepContext.beginDialog(PL_Services, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("disputeProceed-")) {
                stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
                return await stepContext.beginDialog(JM_PROJECT2, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("ref=lazada")) {
                stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
                return await stepContext.beginDialog(LAZADA_DIALOG_1, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("dispute1-")) {
                stepContext.values.userMain.referral_link = channelData.postback.payload;
                return await stepContext.beginDialog(JM_PROJECT, stepContext.values.userMain);
            }

            if (channelData.postback.payload.includes("Feedback")) {
                //stepContext.values.userMain.referral_link = channelData.postback.payload;
            }
        }

        if (stepContext.context._activity && stepContext.context._activity.type && stepContext.context._activity.type == 'event') {
            await stepContext.context.sendActivity({ type: 'typing' });
            return await stepContext.endDialog();
        }

        if (stepContext.context._activity && stepContext.context._activity.type && stepContext.context._activity.type == 'conversationUpdate') {
            await stepContext.context.sendActivity({ type: 'typing' });
            return await stepContext.endDialog();
        }

        //referral
        if (stepContext.context.activity && stepContext.context.activity.value
                && stepContext.context.activity.value.referral
                && stepContext.context.activity.value.referral.ref
                && stepContext.context.activity.channelId === 'facebook') {
            
            console.log('\n\nWith REF: ' + JSON.stringify(channelData));
            
            stepContext.values.userMain.referral_link = stepContext.context.activity.value.referral.ref; //m.me link
            //console.log("PSID" + stepContext.context.activity.value.sender.id);
            stepContext.values.userMain.psid = stepContext.context.activity.value.sender.id;
            //parse referrence and promoo == <CODE>-<REFRENCE_NUMBER>
            console.log("REFERRAL" + stepContext.values.userMain.referral_link);
            var queryDone = "No";
            let ret = retrieveData(stepContext.context.activity.value.sender.id);

            ret.then(function (result) {
                //console.log(JSON.stringify(result));
                stepContext.values.userMain.fbFirstName = result.first_name;
                queryDone = "Yes";
            }, function (error) {
                console.log(error);
            })

            while (queryDone == "No") {
                await stepContext.context.sendActivity({ type: 'typing' });
            }

            stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.referral_link);
            stepContext.values.userMain.promo = getPromoCode(stepContext.values.userMain.referral_link);
            if (stepContext.values.userMain.promo == "test") {
                return await stepContext.beginDialog(TEST_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "topup") {
                return await stepContext.beginDialog(TEST_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "mortCollect") {
                return await stepContext.beginDialog(COLLECT_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "plCollect") {
                return await stepContext.beginDialog(PLCOLLECT, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsCollect") {
                return await stepContext.beginDialog(CARDSCOLLECT, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "CCPLDD") {
                return await stepContext.beginDialog(CCPLDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "CCPLPDD") {
                return await stepContext.beginDialog(CCPLPDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "CCPLADD") {
                return await stepContext.beginDialog(CCPLADD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "PLDD") {
                return await stepContext.beginDialog(PLDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "PLPDD") {
                return await stepContext.beginDialog(PLPDD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "PLADD") {
                return await stepContext.beginDialog(PLADD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cards12") {
                return await stepContext.beginDialog(CARDS_ACQUI12, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.promo == "warehouse") {
                return await stepContext.beginDialog(WAREHOUSE_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "autoloans") {
                return await stepContext.beginDialog(AUTO_LOANS, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "autoAuction") {
                return await stepContext.beginDialog(AUTO_AUCTION, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "auction") {
                return await stepContext.beginDialog(AUTO_AUCTION2, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "ropaBis") {
                return await stepContext.beginDialog(ROPA_BIS, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "ropaPayment") {
                return await stepContext.beginDialog(ROPA_PAYMENT, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == "isFraud") {
                // stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(ISFRAUD_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cards13") {
                return await stepContext.beginDialog(CARDS_ACQUI13, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsPlat") {
                return await stepContext.beginDialog(CARDS_PLAT1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsSQ") {
                return await stepContext.beginDialog(CARDS_SQ1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "pltpsa") {
                stepContext.values.userMain.mobileNumber = stepContext.result;
                stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
                return await stepContext.beginDialog(PERSONAL_TPSAP1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsCS") {
                return await stepContext.beginDialog(CARDS_SQ1, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsScb") {
                return await stepContext.beginDialog(CARDS_SCB1, stepContext.values.userMain);
            }

            else if (stepContext.values.userMain.promo == 'autoCF') {
                stepContext.values.userMain.appID = getMobileNumber(stepContext.values.userMain.referral_link);
                console.log("APPID1" + stepContext.values.userMain.appID);
                return await stepContext.beginDialog(AUTO_CF, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "plSuccess") {
                return await stepContext.beginDialog(TEST_SUCCESS_DIALOG, stepContext.values.userMain);

            }

            if (stepContext.values.userMain.promo == "snr") {
                return await stepContext.beginDialog(SNR_DIALOG, stepContext.values.userMain);
            }



            if (stepContext.values.userMain.promo == "waltermart") {
                return await stepContext.beginDialog(WALTERMART_DIALOG, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "cardsSuccess") {
                return await stepContext.beginDialog(CARD_SUCCESS_DIALOG, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.promo == "PL") {
                return await stepContext.beginDialog(PERSONAL_LOAN, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == 'insight') {
                return await stepContext.beginDialog(ANTON, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "activate") {
                return await stepContext.beginDialog(ACTIVATION_CARD, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == "plnext") {
                return await stepContext.beginDialog(PERSONAL_FINAL, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == 'plBook') {
                return await stepContext.beginDialog(PERSONAL_BOOKING, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.promo == 'ref') {
                return await stepContext.beginDialog(REFERRER_DIALOG, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.promo == 'ref2') {
                return await stepContext.beginDialog(MGM_ACQUI, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.promo == 'ref3') {
                return await stepContext.beginDialog(MGM_ACQUI, stepContext.values.userMain);
            }

            if (stepContext.values.userMain.promo == 'activation') {
                return await stepContext.beginDialog(ACTIVATION_CARD2, stepContext.values.userMain);
            }
            if (stepContext.values.userMain.promo == 'al') {
                // Create connection to database
                const config = {
                    authentication: {
                        options: {
                            userName: "julius", // update me
                            password: "spacemaN1" // update me
                        },
                        type: "default"
                    },
                    server: "dbbankbot.database.windows.net", // update me
                    options: {
                        database: "chatbot_demo", //update me
                        encrypt: true
                    }
                };

                const connection = new Connection(config);

                var queryDone = "No";
                // Attempt to connect and execute queries if connection goes through
                connection.on("connect", err => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        let fq = queryDatabase(connection);
                        fq.then(function (result) {
                            console.log(JSON.stringify(result));
                            stepContext.values.userMain.mobile = result.mobile;
                            stepContext.values.userMain.email = result.email;
                            queryDone = "Yes";
                        }, function (error) {
                            console.log(error);
                            queryDone = "Timeout";
                        })
                    }
                });

                while (queryDone == "No") {
                    await stepContext.context.sendActivity({ type: 'typing' });
                }



                await stepContext.context.sendActivity("MOBILE = " + stepContext.values.userMain.mobile + "\nEMAIL = " + stepContext.values.userMain.email);
                await stepContext.context.sendActivity("DONE QUERY");
                return await stepContext.next();
            }

            if (stepContext.values.userMain.promo == 'sksk') {
                await stepContext.context.sendActivity("Test here 1");
                return await stepContext.next();
            }

            else {
                await stepContext.context.sendActivity("You're weird 1");
            }
            return await stepContext.endDialog();
        }
        //await stepContext.context.sendActivity("Hi " + stepContext.context.activity.from.name);


        else {
            stepContext.values.userMain.psid = stepContext.context._activity.channelData.sender.id;
            var queryDone = "No";
            let ret = retrieveData(stepContext.context._activity.channelData.sender.id);

            ret.then(function (result) {
                //console.log(JSON.stringify(result));
                stepContext.values.userMain.fbFirstName = result.first_name;
                queryDone = "Yes";
            }, function (error) {
                console.log(error);
            })

            while (queryDone == "No") {
                await stepContext.context.sendActivity({ type: 'typing' });
            }
            if (stepContext.context._activity && stepContext.context._activity.channelData
                    && stepContext.context._activity.channelData
                    && stepContext.context._activity.channelData.referral
                    && stepContext.context._activity.channelData.referral.ref
                    && stepContext.context.activity.channelId === 'facebook') {

                console.log('\n\nIN ELSE: ' + JSON.stringify(stepContext.context._activity.channelData));
               
                stepContext.values.userMain.referral_link = stepContext.context._activity.channelData.referral.ref; //m.me link
                //console.log("PSID" + stepContext.context.activity.value.sender.id);
                stepContext.values.userMain.psid = stepContext.context._activity.channelData.sender.id;
                //parse referrence and promoo == <CODE>-<REFRENCE_NUMBER>
                console.log("REFERRAL" + stepContext.values.userMain.referral_link);
                var queryDone = "No";
                let ret = retrieveData(stepContext.context._activity.channelData.sender.id);

                ret.then(function (result) {
                    //console.log(JSON.stringify(result));
                    stepContext.values.userMain.fbFirstName = result.first_name;
                    queryDone = "Yes";
                }, function (error) {
                    console.log(error);
                })

                while (queryDone == "No") {
                    await stepContext.context.sendActivity({ type: 'typing' });
                }

                stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.referral_link);
                stepContext.values.userMain.promo = getPromoCode(stepContext.values.userMain.referral_link);
                if (stepContext.values.userMain.promo == "test") {
                    return await stepContext.beginDialog(TEST_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "warehouse") {
                    return await stepContext.beginDialog(WAREHOUSE_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "mortCollect") {
                    return await stepContext.beginDialog(COLLECT_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "autoCollect") {
                    return await stepContext.beginDialog(AUTOCOLLECT_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "cardsCollect") {
                    return await stepContext.beginDialog(CARDSCOLLECT, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "plCollect") {
                    return await stepContext.beginDialog(PLCOLLECT, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "CCPLDD") {
                    return await stepContext.beginDialog(CCPLDD, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "CCPLPDD") {
                    return await stepContext.beginDialog(CCPLPDD, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "CCPLADD") {
                    return await stepContext.beginDialog(CCPLADD, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "PLDD") {
                    return await stepContext.beginDialog(PLDD, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "PLPDD") {
                    return await stepContext.beginDialog(PLPDD, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "PLADD") {
                    return await stepContext.beginDialog(PLADD, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "autoloans") {
                    return await stepContext.beginDialog(AUTO_LOANS, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "autoAuction") {
                    return await stepContext.beginDialog(AUTO_AUCTION, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "auction") {
                    return await stepContext.beginDialog(AUTO_AUCTION2, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "ropaBis") {
                    return await stepContext.beginDialog(ROPA_BIS, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "ropaPayment") {
                    return await stepContext.beginDialog(ROPA_PAYMENT, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "cards12") {
                    return await stepContext.beginDialog(CARDS_ACQUI12, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "cards13") {
                    return await stepContext.beginDialog(CARDS_ACQUI13, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "cardsPlat") {
                    return await stepContext.beginDialog(CARDS_PLAT1, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "sqCards") {
                    return await stepContext.beginDialog(CARDS_SQ1, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "pltpsa") {
                    stepContext.values.userMain.mobileNumber = stepContext.result;
                    stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
                    return await stepContext.beginDialog(PERSONAL_TPSAP1, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "cardsCS") {
                    return await stepContext.beginDialog(CARDS_CS1, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "autoPreX") {
                    return await stepContext.beginDialog(AUTO_PREX, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "plChecker") {
                    return await stepContext.beginDialog(PL_Services, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "cardsScb") {
                    return await stepContext.beginDialog(CARDS_SCB1, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "topup") {
                    return await stepContext.beginDialog(TEST_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "plSuccess") {
                    return await stepContext.beginDialog(TEST_SUCCESS_DIALOG, stepContext.values.userMain);

                }

                if (stepContext.values.userMain.promo == "snr") {
                    return await stepContext.beginDialog(SNR_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "waltermart") {
                    return await stepContext.beginDialog(WALTERMART_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "cardsSuccess") {
                    return await stepContext.beginDialog(CARD_SUCCESS_DIALOG, stepContext.values.userMain);
                }
                if (stepContext.values.userMain.promo == "PL") {
                    return await stepContext.beginDialog(PERSONAL_LOAN, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "activate") {
                    return await stepContext.beginDialog(ACTIVATION_CARD, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "plnext") {
                    return await stepContext.beginDialog(PERSONAL_FINAL, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == "disputeChange") {
                    return await stepContext.beginDialog(DISPUTE_CHANGE, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'plBook') {
                    return await stepContext.beginDialog(PERSONAL_BOOKING, stepContext.values.userMain);
                }

                else if (stepContext.values.userMain.promo == "isFraud") {
                    // stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                    return await stepContext.beginDialog(ISFRAUD_DIALOG, stepContext.values.userMain);
                }

                else if (stepContext.values.userMain.promo == 'autoCF') {
                    stepContext.values.userMain.appID = getMobileNumber(stepContext.values.userMain.referral_link);
                    console.log("APPID3" + stepContext.values.userMain.appID);
                    return await stepContext.beginDialog(AUTO_CF, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'activation') {
                    return await stepContext.beginDialog(ACTIVATION_CARD2, stepContext.values.userMain);
                }
                if (stepContext.values.userMain.promo == 'al') {
                    // Create connection to database
                    const config = {
                        authentication: {
                            options: {
                                userName: "julius", // update me
                                password: "spacemaN1" // update me
                            },
                            type: "default"
                        },
                        server: "dbbankbot.database.windows.net", // update me
                        options: {
                            database: "chatbot_demo", //update me
                            encrypt: true
                        }
                    };

                    const connection = new Connection(config);

                    var queryDone = "No";
                    // Attempt to connect and execute queries if connection goes through
                    connection.on("connect", err => {
                        if (err) {
                            console.error(err.message);
                        } else {
                            let fq = queryDatabase(connection);
                            fq.then(function (result) {
                                console.log(JSON.stringify(result));
                                stepContext.values.userMain.mobile = result.mobile;
                                stepContext.values.userMain.email = result.email;
                                queryDone = "Yes";
                            }, function (error) {
                                console.log(error);
                                queryDone = "Timeout";
                            })
                        }
                    });

                    while (queryDone == "No") {
                        await stepContext.context.sendActivity({ type: 'typing' });
                    }



                    await stepContext.context.sendActivity("MOBILE = " + stepContext.values.userMain.mobile + "\nEMAIL = " + stepContext.values.userMain.email);
                    await stepContext.context.sendActivity("DONE QUERY");
                    return await stepContext.next();
                }

                if (stepContext.values.userMain.promo == 'survey') {
                    return await stepContext.beginDialog(SURVEY, stepContext.values.userMain);
                }


                if (stepContext.values.userMain.promo == 'survey2') {
                    return await stepContext.beginDialog(SURVEY2, stepContext.values.userMain);
                }
                if (stepContext.values.userMain.promo == 'survey3') {
                    return await stepContext.beginDialog(SURVEY3, stepContext.values.userMain);
                }
                if (stepContext.values.userMain.promo == 'sksk') {
                    await stepContext.context.sendActivity("Test here 1");
                    return await stepContext.next();
                }
                if (stepContext.values.userMain.promo == 'pLBookSuccess') {
                    return await stepContext.beginDialog(PL_BOOK_SUCCESS, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'lazada') {
                    return await stepContext.beginDialog(LAZADA_DIALOG_1, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'lazada3') {
                    return await stepContext.beginDialog(LAZADA_DIALOG_3, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'lazada6') {
                    return await stepContext.beginDialog(LAZADA_DIALOG_6, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'baro') {
                    return await stepContext.beginDialog(BARO_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'ref') {
                    return await stepContext.beginDialog(REFERRER_DIALOG, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'ref2') {
                    return await stepContext.beginDialog(MGM_ACQUI, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'ref3') {
                    return await stepContext.beginDialog(MGM_ACQUI, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'plBalcon') {
                    return await stepContext.beginDialog(PL_BALCON, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'cardUpgrade') {
                    return await stepContext.beginDialog(AMF_POINTS, stepContext.values.userMain);
                }

                if (stepContext.values.userMain.promo == 'pid') {
                    return await stepContext.beginDialog(JM_PROJECT, stepContext.values.userMain);
                }

                else if (stepContext.values.userMain.promo == "isFraud") {
                    // stepContext.values.userMain.userMobile = getMobileNumber(stepContext.values.userMain.refDL);
                    return await stepContext.beginDialog(ISFRAUD_DIALOG, stepContext.values.userMain);
                }



                else {
                    await stepContext.context.sendActivity("Invalid Link " + stepContext.values.userMain.referral_link);
                }
                return await stepContext.endDialog();
            }
            else if (stepContext.context._activity && stepContext.context._activity.channelData
                && stepContext.context._activity.channelData
                && stepContext.context._activity.channelData.postback
                && stepContext.context._activity.channelData.postback.payload == 'Start') {

                return await stepContext.beginDialog(PL_Services, stepContext.values.userMain);
            }
            else {

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "DCBSD STATS") {
                    var queryDone = "No";

                    let apps = dcbsdStats("test");

                    apps.then(function (res) {
                        // if (typeof res.Table1 == 'undefined') {
                        //     stepContext.values.userMain.access = "No";
                        // }
                        // else {
                        console.log("res.AA_Completed " + res.AA_Completed);
                        stepContext.values.userMain.access = "Yes";
                        //stepContext.values.userMain.totalApps = res.Table1[0].status;
                        stepContext.values.userMain.AA_Completed = res.AA_Completed;
                        stepContext.values.userMain.AA_Pending = res.AA_Pending;
                        stepContext.values.userMain.EL_Completed = res.EL_Completed;
                        stepContext.values.userMain.EL_Pending = res.EL_Pending;
                        stepContext.values.userMain.EL_Pending_BeyondTAT = res.EL_Pending_BeyondTAT;
                        stepContext.values.userMain.INQ_Completed = res.INQ_Completed;
                        stepContext.values.userMain.INQ_Pending = res.INQ_Pending;
                        stepContext.values.userMain.INQ_Pending_BeyondTAT = res.INQ_Pending_BeyondTAT;
                        stepContext.values.userMain.MT_Completed = res.MT_Completed;
                        stepContext.values.userMain.MT_Pending = res.MT_Pending;
                        stepContext.values.userMain.MT_Pending_BeyondTAT = res.MT_Pending_BeyondTAT;
                        stepContext.values.userMain.RFS_Completed = res.RFS_Completed;
                        stepContext.values.userMain.RFS_Pending = res.RFS_Pending;
                        stepContext.values.userMain.RT_Completed = res.RT_Completed;
                        stepContext.values.userMain.RT_Pending = res.RT_Pending;
                        stepContext.values.userMain.RT_Pending_BeyondTAT = res.RT_Pending_BeyondTAT;
                        stepContext.values.userMain.SATF_Completed = res.SATF_Completed;
                        stepContext.values.userMain.SATF_Pending = res.SATF_Pending;
                        stepContext.values.userMain.SCR_Completed = res.SCR_Completed;
                        stepContext.values.userMain.SCR_Pending = res.SCR_Pending;
                        stepContext.values.userMain.UAM_Completed = res.UAM_Completed;
                        stepContext.values.userMain.UAM_Pending = res.UAM_Pending;
                        stepContext.values.userMain.UI_Completed = res.UI_Completed;
                        stepContext.values.userMain.WL_Prod_Completed = res.WL_Prod_Completed;
                        stepContext.values.userMain.WL_Prod_Pending = res.WL_Prod_Pending;
                        stepContext.values.userMain.WL_Prod_Pending_BeyondTAT = res.WL_Prod_Pending_BeyondTAT;
                        // }
                        queryDone = "Yes";
                    }, function (err) {
                        queryDone = "Yes"
                    })

                    while (queryDone == "No") {
                        await stepContext.context.sendActivity({ type: 'typing' });
                    }
                    //stepContext.values.userMain.totalApps = parseInt(stepContext.values.userMain.totalDQ) + parseInt(stepContext.values.userMain.totalUpload);
                    //await stepContext.context.sendActivity("CARDS ACQUISTION STATS: \n\rTotal Applications: " + stepContext.values.userMain.totalApps + "\n\rTotal Disqualified: " + stepContext.values.userMain.totalDQ + "\n\rTotal Upload: " + stepContext.values.userMain.totalUpload + "\n\rTotal Declined: " + stepContext.values.userMain.totalDeclined + "\n\rTotal Cancelled: " + stepContext.values.userMain.totalCancelled + "\n\rTotal Need KYC2: " + stepContext.values.userMain.totalNeedKYC2 + "\n\rTotal Approved: " + stepContext.values.userMain.totalApproved);
                    await stepContext.context.sendActivity("Authorize Approver (AA): \n\rCompleted: " + stepContext.values.userMain.AA_Completed + "\n\rPending: " + stepContext.values.userMain.AA_Pending);
                    await stepContext.context.sendActivity("Emergency List (EL): \n\rCompleted: " + stepContext.values.userMain.EL_Completed + "\n\rPending: " + stepContext.values.userMain.EL_Pending + "\n\rBeyond Tat:" + stepContext.values.userMain.EL_Pending_BeyondTAT);
                    await stepContext.context.sendActivity("Inquiries (INQ): \n\rCompleted: " + stepContext.values.userMain.INQ_Completed + "\n\rPending: " + stepContext.values.userMain.INQ_Pending + "\n\rBeyond Tat:" + stepContext.values.userMain.INQ_Pending_BeyondTAT);
                    await stepContext.context.sendActivity("Merchant Request Tracker (MT): \n\rCompleted: " + stepContext.values.userMain.MT_Completed + "\n\rPending: " + stepContext.values.userMain.MT_Pending + "\n\rBeyond Tat:" + stepContext.values.userMain.MT_Pending_BeyondTAT);
                    await stepContext.context.sendActivity("Request for Service (RFS): \n\rCompleted: " + stepContext.values.userMain.RFS_Completed + "\n\rPending: " + stepContext.values.userMain.RFS_Pending);
                    await stepContext.context.sendActivity("Systems Application Turnover Form (SATF): \n\rCompleted: " + stepContext.values.userMain.SATF_Completed + "\n\rPending: " + stepContext.values.userMain.SATF_Pending);
                    await stepContext.context.sendActivity("Service Change Request (SCR): \n\rCompleted: " + stepContext.values.userMain.SCR_Completed + "\n\rPending: " + stepContext.values.userMain.SCR_Pending);
                    await stepContext.context.sendActivity("(UAM): \n\rCompleted: " + stepContext.values.userMain.UAM_Completed + "\n\rPending: " + stepContext.values.userMain.UAM_Pending);
                    await stepContext.context.sendActivity("(UI Upload): \n\rCompleted: " + stepContext.values.userMain.UI_Completed);
                    await stepContext.context.sendActivity("(WL): \n\rCompleted: " + stepContext.values.userMain.WL_Prod_Completed + "\n\rPending: " + stepContext.values.userMain.WL_Prod_Pending + "\n\rBeyond Tat:" + stepContext.values.userMain.WL_Prod_Pending_BeyondTAT);
                    return await stepContext.endDialog();
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text == "mgmCheck") {
                    var queryDone2 = "No";

                    let getRef = getReferral("639478428822");

                    getRef.then(function (res) {
                        if (res.Table1) {
                            stepContext.values.userMain.referralsStats = [];
                            var i;
                            for (i = 0; i < res.Table1.length; i++) {
                                stepContext.values.userMain.referralsStats.push(res.Table1[i].firstName + " " + res.Table1[i].lastName + " - " + res.Table1[i].status);
                            }
                        }
                        else {

                        }
                        queryDone2 = "Yes";
                    }, function (err) {
                        queryDone2 = "Timeout";
                    })

                    while (queryDone2 == "No") {
                        await stepContext.context.sendActivity({ type: 'typing' });
                    }

                    if (stepContext.values.userMain.referralsStats) {
                        let d = new Date();
                        let str = "Hi, " + stepContext.values.userMain.fbFirstName + "! Thank you for participating in the EastWest Member-Get-Member Promo. We are pleased to inform you of the status of your referral/s as of " + String(d.getDate()).padStart(2, '0') + "/" + String(d.getMonth() + 1).padStart(2, '0') + "/" + String(d.getFullYear()) + ":";
                        const msgArray = stepContext.values.userMain.referralsStats;
                        const message = MessageFactory.text('');
                        msgArray.forEach((val, index) => {
                            if (!message.text) {
                                message.text = `${index + 1}. ${val}\r`;
                            } else if (message.text) {
                                console.log(message.text);
                                message.text = message.text.concat(`${index + 1}. ${val}\r`);
                            }
                        });
                        str = str + " \n\r " + message.text + "\n\r To date, you have " + stepContext.values.userMain.referralsStats.length + " approved referral/s. Your cash credit/s will be posted to your registered EastWest credit card and will be reflected on your next Statement of Account (SOA).";
                        await stepContext.context.sendActivity(str);
                        await stepContext.context.sendActivity(JSON.stringify(message));

                    }
                    else {
                        await stepContext.context.sendActivity("We’re all set!");
                    }
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "PL COLLECT") {
                    stepContext.values.userMain.accNum = "8888880101640006";
                    return await stepContext.beginDialog(PLCOLLECT, stepContext.values.userMain);
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "SQ CARDS") {
                    // stepContext.values.userMain.accNum = "8888880101640006";
                    return await stepContext.beginDialog(CARDS_SQ1, stepContext.values.userMain);
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "PL TPSA") {
                    stepContext.values.userMain.mobileNumber = stepContext.result;
                    stepContext.values.userMain.sourceCode = getMobileNumber(stepContext.values.userMain.refDL);
                    return await stepContext.beginDialog(PERSONAL_TPSAP1, stepContext.values.userMain);
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "CARDS CS") {
                    // stepContext.values.userMain.accNum = "8888880101640006";
                    return await stepContext.beginDialog(CARDS_CS1, stepContext.values.userMain);
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "CHECK PL") {
                    // stepContext.values.userMain.accNum = "8888880101640006";
                    return await stepContext.beginDialog(PL_Services, stepContext.values.userMain);
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "CARDS COLLECT") {
                    // stepContext.values.userMain.accNum = "8888880101640006";
                    return await stepContext.beginDialog(CARDSCOLLECT, stepContext.values.userMain);
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text == "sp") {
                    return await stepContext.prompt(ACTIVITY_PROMPT, { prompt: 'ENTER SQL ID:' });
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.includes("change-")) {

                    let data = stepContext.context._activity.channelData.message.text.split("-");

                    var queryDone = "No";

                    let apps = changeSQL(data[1], data[2]);

                    apps.then(function (res) {
                        queryDone = "Yes";
                    }, function (err) {
                        queryDone = "Yes"
                    })

                    while (queryDone == "No") {
                        await stepContext.context.sendActivity({ type: 'typing' });
                    }

                    await stepContext.context.sendActivity("Done! Please verify changes.");
                    return await stepContext.endDialog();
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.includes('FB_DATA')) {

                    let data = stepContext.context._activity.channelData.message.text.split("-");
                    let psid = data[1];
                    let pageId = data[2];

                    var queryDone = "No";
                    let ret = retrieveData2(psid,pageId);

                    ret.then(function (result) {
                        //console.log(JSON.stringify(result));
                        stepContext.values.userMain.fbFirstName = result.first_name;
                        queryDone = "Yes";
                    }, function (error) {
                        console.log(error);
                    })

                    while (queryDone == "No") {
                        await stepContext.context.sendActivity({ type: 'typing' });
                    }

                    await stepContext.context.sendActivity("FB NAME" + stepContext.values.userMain.fbFirstName);
                    return await stepContext.endDialog();
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == "TABULATE") {

                    var queryDone = "No";

                    let apps = reportBid("report");

                    apps.then(function (res) {
                        queryDone = "Yes";
                    }, function (err) {
                        queryDone = "Yes"
                    })

                    while (queryDone == "No") {
                        await stepContext.context.sendActivity({ type: 'typing' });
                    }

                    await stepContext.context.sendActivity("Done! Please check email for tabulation.");
                    return await stepContext.endDialog();
                }

                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text == "map") {
                    const { context, context: { activity } } = stepContext;
                    const { latitude, longitude } = activity.channelData;
                    await stepContext.context.sendActivity("Here's the map.");
                    const mapHelper = new MapHelper();
                    await mapHelper.getMap(context, latitude, longitude);
                    return await stepContext.endDialog();
                }


                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text == "attach") {
                    var promptOptions = {
                        prompt: 'Please take a picture and hit send',
                        retryPrompt: 'The attachment must be a jpg/png image file or pdf document file.'
                    };

                    return await stepContext.prompt(ATTACHMENT_PROMPT, promptOptions);
                }



                if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text == 'time') {
                    let d = new Date();
                    let dplus = new Date();
                    let dminus = new Date();
                    await stepContext.context.sendActivity("CHECK TIME ACTIVITY!");
                    await stepContext.context.sendActivity("DAY : " + d.getDate());
                    await stepContext.context.sendActivity("TIME : " + d.getHours());
                    await stepContext.context.sendActivity("ACTUAL TIME :" + d.getTime());
                    await stepContext.context.sendActivity("TIME+8 : " + dplus.setHours(dplus.getHours() + 8));
                    await stepContext.context.sendActivity("ACTUAL TIME+8: " + dplus.getTime());
                    await stepContext.context.sendActivity("TIME-8 : " + dminus.setHours(dminus.getHours() - 8));
                    await stepContext.context.sendActivity("ACTUAL TIME-8: " + dminus.getTime());

                    return await stepContext.endDialog();
                }
                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text == 'AUTO CF') {
                    return await stepContext.beginDialog(AUTO_CF, stepContext.values.userMain);
                }

                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == 'WAREHOUSE') {
                    return await stepContext.beginDialog(WAREHOUSE_DIALOG, stepContext.values.userMain);
                }

                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == 'AUTO') {
                    return await stepContext.beginDialog(AUTO_LOANS, stepContext.values.userMain);
                }

                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == 'AUCTION') {
                    return await stepContext.beginDialog(AUTO_AUCTION, stepContext.values.userMain);
                }

                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == 'AUTO AUCTION') {
                    return await stepContext.beginDialog(AUTO_AUCTION2, stepContext.values.userMain);
                }

                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text && stepContext.context._activity.channelData.message.text.toUpperCase() == 'BIS') {
                    return await stepContext.beginDialog(ROPA_BIS, stepContext.values.userMain);
                }

                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.text) {

                    console.log('\n\nInfo: ' + JSON.stringify(stepContext.context._activity));
                    await stepContext.context.sendActivity("TESTING: I received a text.");

                    var queryDone = "No";

                    let a = witQuery(stepContext.context._activity.channelData.message.text);

                    a.then(function (res) {
                        console.log(JSON.stringify(res));
                        if (res.intents && res.intents[0]) {
                            stepContext.values.intent = res.intents[0].name;
                        }
                        queryDone = "Yes";
                    }, function (err) {
                        console.log(err);
                    })


                    while (queryDone == "No") {
                        await stepContext.context.sendActivity({ type: 'typing' });
                    }

                    await stepContext.context.sendActivity(stepContext.values.intent);
                    await stepContext.context.sendActivity("Done?");

                    return await stepContext.endDialog();
                }

                else if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.attachments) {
                    await stepContext.context.sendActivity("TESTING: I received an attachment.");
                    return await stepContext.endDialog();
                }

                await stepContext.context.sendActivity("I restarted the bot for coding, please click again the link again to restart. Thank you!");
                stepContext.values.userMain.psid = stepContext.context._activity.channelData.sender.id;
                var queryDone = "No";
                let ret = retrieveData(stepContext.context._activity.channelData.sender.id);

                ret.then(function (result) {
                    //console.log(JSON.stringify(result));
                    stepContext.values.userMain.fbFirstName = result.first_name;
                    queryDone = "Yes";
                }, function (error) {
                    console.log(error);
                })

                while (queryDone == "No") {
                    await stepContext.context.sendActivity({ type: 'typing' });
                }

                // const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
                // switch (LuisRecognizer.topIntent(luisResult)) {
                //     case 'Personal_Loan': {
                //         await stepContext.context.sendActivity("PERSONAL LOAN INTENTION DETECTED");
                //         break;
                //     }

                //     default: {
                //         break;
                //     }

                // }

                if (stepContext.context._activity && stepContext.context._activity.text && stepContext.context._activity.text == 'ACTIVATE') {
                    return await stepContext.beginDialog(ACTIVATION_CARD2, stepContext.values.userMain);
                }

            }
        }

        return await stepContext.next();

    }


    /**
     * Shows a warning if the requested From or To cities are recognized as entities but they are not in the Airport entity list.
     * In some cases LUIS will recognize the From and To composite entities as a valid cities but the From and To Airport values
     * will be empty if those entity values can't be mapped to a canonical item in the Airport.
     */
    async showWarningForUnsupportedCities(context, fromEntities, toEntities) {
        const unsupportedCities = [];
        if (fromEntities.from && !fromEntities.airport) {
            unsupportedCities.push(fromEntities.from);
        }

        if (toEntities.to && !toEntities.airport) {
            unsupportedCities.push(toEntities.to);
        }

        if (unsupportedCities.length) {
            const messageText = `Sorry but the following airports are not supported: ${unsupportedCities.join(', ')}`;
            await context.sendActivity(messageText, messageText, InputHints.IgnoringInput);
        }
    }

    async itrValidator(promptContext) {
        if (promptContext.recognized.succeeded) {
            // var attachments = promptContext.recognized.value;
            // var validImages = [];

            // attachments.forEach(attachment => {
            //     if (attachment.contentType === 'image/jpeg' || attachment.contentType === 'image/png' || attachment.contentType === 'image/jpg' || attachment.contentType === 'application/pdf') {
            //         validImages.push(attachment);
            //     }
            // });

            // promptContext.recognized.value = validImages;


            // // If none of the attachments are valid images, the retry prompt should be sent.
            // return !!validImages.length;
            return true;
        }
        else {
            await promptContext.context.sendActivity('No attachments received. Please attach image/pdf file.');
            return false;
        }
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "book a flight" interaction with a simple confirmation.
     */
    async finalStep(stepContext) {
        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.

        // if (channelData && channelData.postback && channelData.postback.payload == 'Start') {
        //     // stepContext.values.userMain.mobileNumber = getMobileNumber(channelData.postback.payload);
        //     console.log('\n\nUSER: ' + JSON.stringify(stepContext.values.userMain));
        //     return await stepContext.beginDialog(PL_Services, stepContext.values.userMain);
        // }

        console.log('\n\nHere: ' + JSON.stringify(stepContext.result));
        if (stepContext.result && stepContext.result.value) {
            
            if (stepContext.result.value == 'Auto') {
                return await stepContext.beginDialog(AUTO_STORE_FORM, stepContext.values.userMain);
            }
            else if (stepContext.result.value == 'Personal') {
                return await stepContext.beginDialog(PERSONAL_LOAN, stepContext.values.userMain);
            }
            else if (stepContext.result.value == 'Cards') {
                return await stepContext.beginDialog(CARDS_OPTIONS, stepContext.values.userMain);

            }
            else if (stepContext.result.value == 'Keyword') {
                await stepContext.context.sendActivity("Kindly enter the keyword from SMS/Email that we sent you");
                return await stepContext.endDialog();
            }

            return await stepContext.endDialog();
        }
        else if (stepContext.result) {
            if (stepContext.result.isFromPLServices) {            
                console.log('\n\nHere2: ' + JSON.stringify(stepContext.values.userMain));
                return await stepContext.replaceDialog(this.initialDialogId, stepContext.values.userMain);
            }
            const result = stepContext.result;
            // Now we have all the booking details.

            // This is where calls to the booking AOU service or database would go.

            // If the call to the booking service was successful tell the user.
            // const timeProperty = new TimexProperty(result.travelDate);
            // const travelDateMsg = timeProperty.toNaturalLanguage(new Date(Date.now()));
            // const msg = `I have you booked to ${result.destination} from ${result.origin} on ${travelDateMsg}.`;
            // await stepContext.context.sendActivity(msg, msg, InputHints.IgnoringInput);

            var queryDone2 = "No";

            let getRef = checkSP(result);

            getRef.then(function (res) {
                if (res.value) {
                    stepContext.values.userMain.response = res.value;
                }
                else {
                    stepContext.values.userMain.response = "NONE";
                }
                queryDone2 = "Yes";
            }, function (err) {
                queryDone2 = "Timeout";
            })

            while (queryDone2 == "No") {
                await stepContext.context.sendActivity({ type: 'typing' });
            }

            await stepContext.context.sendActivity(stepContext.values.userMain.response);


        }
        if (stepContext.context._activity.channelData.message && stepContext.context._activity.channelData.message.attachments) {
            // await stepContext.context.sendActivity("HERE ARE ATTACHMENT DETAILS");
            // // await stepContext.context.sendActivity(stepContext.context.activity.attachments);
            // //await stepContext.context.sendActivity(Object.keys(stepContext.context.activity.attachments[0]));
            // for(let i=0; i<stepContext.context.activity.attachments.length;i++) {
            //     await stepContext.context.sendActivity("CONTENTTYPE " + stepContext.context.activity.attachments[i].contentType);
            //     await stepContext.context.sendActivity("CONTENTURL " + stepContext.context.activity.attachments[i].contentUrl);

            // }

        }

        // Restart the main dialog with a different message the second time around

        //return await stepContext.endDialog();
        // return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: '' });
        return await stepContext.endDialog();
    }
}

function queryDatabase(connection) {
    console.log("Reading rows from the Table...");



    return new Promise(function (resolve, reject) {
        var dummy = {};
        // Read all rows from table
        const request = new Request(
            `SELECT * FROM [dbo].[CARDS_ACTIVATION] WHERE MOBILE_NO='639984860798'`,
            (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log(`${rowCount} row(s) returned`);
                }
            }
        );
        request.on("row", columns => {
            columns.forEach(column => {
                //console.log("%s\n%s", column.metadata.colName);
                //ID%sCREATED%s
                //timestamp_version%sMODIFIED_BY%sMODIFIED_DATE%sUCRN%sMOBILE_NO%sEMAIL%sLAST_6_DIGITS%s
                //STATUS%sSMS_SENT%sREMARKS%sPRIVACY%sID_PIC%sDOCUMENTS%sID_URL%s
                if (column.metadata.colName == 'MOBILE_NO') {
                    dummy.mobile = column.value;
                    console.log("MOBILE " + dummy.mobile);
                    //console.log(stepContext.values.userMain.mobile);
                }
                if (column.metadata.colName == 'EMAIL') {
                    dummy.email = column.value;
                    console.log("EMAIL " + dummy.email);
                    //console.log(stepContext.values.userMain.email);
                }
                //
                //
            });
            console.log(typeof columns);
            //console.log(JSON.stringify(columns));
            //stepContext.values.userMain.mobile = columns.MOBILE_NO;
            //stepContext.values.userMain.email = columns.EMAIL;
        });
        console.log("DUMMY " + JSON.stringify(dummy));
        resolve(dummy);

        connection.execSql(request);

    })

}

// function you can use:
function getMobileNumber(str) {
    return str.split('-')[1];
}

function getPromoCode(str) {
    return str.split('-')[0];
}


function soapQuery() {
    var options =
    {
        //soap query
        url: ' http://192.168.6.61:18080/ewb-ws-asp/EwbAspService',
        headers: {
            'Content-Type': 'text/xml'
        },
        body: "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:ewb:ws:asp:interface\"><soapenv:Header/><soapenv:Body>\<urn:getUcrnCreditCardAcctInfoRequest><header><service>0116</service><clientId>EWIS1BFS01</clientId><apiKey>64ae9529-240b-460a-b207-866ed024b7de</apiKey><requestDateTime>2016-05-05</requestDateTime><clientTraceNumber> INQUIREINFO01</clientTraceNumber><serverTraceNumber></serverTraceNumber><returnCode></returnCode><filler></filler></header><input><custNumber></custNumber><acctNumber></acctNumber><ucrn>4084058002008867</ucrn><accountCardList><fromRecordNumber>-1</fromRecordNumber><toRecordNumber>-1</toRecordNumber></accountCardList></input></urn:getUcrnCreditCardAcctInfoRequest></soapenv:Body></soapenv:Envelope>"


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

function witQuery(text) {
    let param = text.split(' ').join('%20');
    var options =
    {
        //wit query
        /**
         * curl \
 -H 'Authorization: Bearer 5EJMZ33FFYQ2L6LSLM5LQJ77DMOTOG3W' \
 'https://api.wit.ai/message?v=20210105&q='
         * 
         */
        url: 'https://api.wit.ai/message?v=20210105&q=' + param,
        headers: {
            'Authorization': 'Bearer 5EJMZ33FFYQ2L6LSLM5LQJ77DMOTOG3W'
        }

    };

    return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }
            else {
                reject(error);
            }
        })
    })

}

function dcbsdStats(test) {
    var options =
    {
        //LOGIC APP : CHATBOT_DCBSD_SUMMARY
        url: 'https://prod-18.southeastasia.logic.azure.com:443/workflows/cf7ff38f2af049cf8101cc6161fcd926/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=StScGGoe83ceeO5BA4XEpPC8EQ7SLeQJcJ8K4G6kkAQ',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
            ({
                "test": test
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

function changeSQL(appm_nbr, sql) {
    var options =
    {
        //LOGIC APP : demo_manualCorrection_CreditSP
        url: 'https://prod-18.southeastasia.logic.azure.com:443/workflows/119d0b0099144690bcfbe4feb256ac6d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cSvI8rFZ4MxG5FwVFMI2oskrX73xXmd3T7cCVSJp1Vc',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
            ({
                "appm_nbr": appm_nbr,
                "sql": sql
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

function getReferral(referrer_mobile) {
    var options =
    {
        //LOGIC APP : demo_getReferral
        url: 'https://prod-13.southeastasia.logic.azure.com:443/workflows/4ef08c3420f4443380ebf2ef03e76cab/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pFPbuzEsFX5xutpgRVX_QC1Itg3jTp2m683ggoePs6o',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
            ({

                "mobilenumber": referrer_mobile

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

function checkSP(referrer_mobile) {
    var options =
    {
        //LOGIC APP : checkSQLID
        url: 'https://prod-19.southeastasia.logic.azure.com:443/workflows/c6ee4ddf957f4b43ad51c8685f7ebf49/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Z19cLZwAGnQJq31patjv7FqNxvaXSYlfufHAnoh8Z4U',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
            ({

                "sql": referrer_mobile

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

function reportBid(queryType) {
    var options =
    {
        //LOGIC APP : demo_survey_1
        url: 'https://prod-24.southeastasia.logic.azure.com:443/workflows/91404ce65a1c42218814d51c9878c9aa/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=vXOu-sBn2laSQnKnOvcSVpdZh98trYBzgrzo7nhc3cQ',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
            ({
                "queryType": queryType

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

function emailResponse(email, mobile) {
    var options =
    {
        //LOGIC APP : GET_EMAILADD_PL _ flow
        url: 'https://prod-07.southeastasia.logic.azure.com:443/workflows/3173df14d95c4572b242037b9b2c2e7d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZL65JOYD-la8z_dAnqyCjHFXyJoiLVprbQYwaXyQMMM',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
            ({
                "email": email,
                "mobile": mobile

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

module.exports.MainDialog = MainDialog;