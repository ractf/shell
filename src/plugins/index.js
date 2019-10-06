import jeopardySetup from "./jeopardy/setup";
import campaignSetup from "./campaign/setup";
import standardChallengeSetup from "./standardChallenge/setup";


export default () => {
    jeopardySetup();
    campaignSetup();
    
    standardChallengeSetup();
}
