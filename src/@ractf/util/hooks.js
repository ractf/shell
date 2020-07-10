import { useSelector } from "react-redux";

import Challenge from "./challenge";
import Category from "./category";

import { plugins } from "ractf";
import { getClass } from "@ractf/plugins";

export const useCategories = () => {
    const categories = useSelector(state => state.challenges?.categories) || [];
    return categories.map(i => getClass(Category).fromJSON(i));
};

export const useCategory = (id) => {
    const categories = useSelector(state => state.challenges?.categories) || [];

    const matchers = Object.values(plugins.categoryMatcher);
    for (const matcher of matchers) {
        const cat = matcher(categories, id);
        if (cat)
            return getClass(Category).fromJSON(cat);
    }

    for (const i of categories) {
        if (i.id.toString() === id) {
            return getClass(Category).fromJSON(i);
        }
    }
    return null;
};

export const useChallenge = (category, challengeId) => {
    if (!category) {
        return null;
    }

    const matchers = Object.values(plugins.challengeMatcher);
    for (const matcher of matchers) {
        const challenge = matcher(category, challengeId);
        if (challenge)
            return getClass(Challenge).fromJSON(category, challenge);
    }

    const challenges = category.challenges || [];
    for (const i of challenges) {
        if (i.id.toString() === challengeId.toString()) {
            return getClass(Challenge).fromJSON(category, i);
        }
    }

    return null;
};
