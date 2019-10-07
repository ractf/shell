import jeopardySetup from "./jeopardy/setup";
import campaignSetup from "./campaign/setup";
import standardChallengeSetup from "./standardChallenge/setup";
import legalSetup from "./legal/setup";


export default () => {
    jeopardySetup();
    campaignSetup();

    standardChallengeSetup();
    legalSetup();
}
