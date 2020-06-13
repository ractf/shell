import { registerPlugin } from "ractf";

import { CampaignChallenges } from "./components/CampaignChallenges";

export default () => {
    registerPlugin("categoryType", "campaign", { component: CampaignChallenges });
    registerPlugin("challengeMetadata", "campaign", {
        fields: [
            { label: "Campaign settings:", type: "label" },
            { name: "x", label: "X Position", type: "number" },
            { name: "y", label: "Y Position", type: "number" },
            { type: "hr" },
        ],
        check: (challenge, category) => {
            return category.contained_type === "campaign";
        }
    });
};
