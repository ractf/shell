// Copyright (C) 2020-2021 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import { getClass, registerSubclass, registerPlugin } from "@ractf/plugins";
import { Challenge, Category } from "@ractf/shell-util";


export default () => {
    const defaultSlug = (object) => {
        if (!object.name)
            return object.id;
        return object.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    };

    // Category slugs
    class SluggedCategory extends getClass(Category) {
        get url() {
            const id = this.metadata?.category_slug || defaultSlug(this);
            return `/campaign/${id}`;
        }
    };
    registerSubclass(Category, SluggedCategory);
    registerPlugin("categoryMetadata", "challengeSlugs", {
        fields: [
            { name: "category_slug", label: "Category Slug", type: "text" },
        ],
    });
    registerPlugin("categoryMatcher", "challengeSlugs", (categories, id) => {
        for (const i of categories)
            if (i.metadata?.category_slug === id)
                return i;
            else if (!i.metadata?.category_slug && defaultSlug(i) === id)
                return i;
        return null;
    });

    // Challenge slugs
    class SluggedChallenge extends getClass(Challenge) {
        get url() {
            const id = this.challenge_metadata?.challenge_slug || defaultSlug(this);
            return `${this.category.url}/${id}`;
        }
    };
    registerSubclass(Challenge, SluggedChallenge);
    registerPlugin("challengeMetadata", "challengeSlugs", {
        fields: [
            {
                label: "Challenge slug", type: "group", children: [
                    { name: "challenge_slug", label: "Challenge Slug", type: "text" },
                ]
            },
        ],
    });
    registerPlugin("challengeMatcher", "challengeSlugs", (category, challengeId) => {
        for (const i of category.challenges)
            if (i.challenge_metadata?.challenge_slug === challengeId)
                return i;
            else if (!i.metadata?.category_slug && defaultSlug(i) === challengeId)
                return i;
        return null;
    });
};
