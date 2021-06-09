// Copyright (C) 2020 Really Awesome Technology Ltd
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

import { editChallenge } from "@ractf/api";
import { getClass } from "@ractf/plugins";


export class ASTNode {
    constructor() {
        this._id = Math.random();
    }
    get serialized() { return ""; }
}

export class ASTChallenge extends ASTNode {
    constructor(challenge_id) {
        super();
        this._challenge_id = challenge_id;
    }
    get challenge_id() {
        return this._challenge_id;
    }
    get serialized() {
        return `${this.challenge_id}`;
    }
}

export class ASTBinOp extends ASTNode {
    op = "undefined";

    constructor(right, left) {
        super();
        this._left = left; this._right = right;
    }
    get left() { return this._left; }
    get right() { return this._right; }
    get serialized() {
        return `${this.left.serialized} ${this.right.serialized} ${this.op}`;
    }
}

export class ASTAnd extends ASTBinOp { op = "AND" }
export class ASTOr extends ASTBinOp { op = "OR" }

export default class Challenge {
    constructor(category, data) {
        if ("toJSON" in data && (typeof data.toJSON) === "function")
            data = data.toJSON();
        this._data = data;
        this._category = category;

        return new Proxy(this, {
            get(target, name) {
                return Reflect.get(...arguments) || target._data[name];
            }
        });
    }

    *[Symbol.iterator]() {
        for (const i of Object.keys(this._data)) {
            yield i;
        }
    }

    edit(changes) {
        return editChallenge({ ...this._data, ...changes });
    }

    editMetadata(changes) {
        return this.edit({
            ...this._data, challenge_metadata: {
                ...this._data.challenge_metadata,
                ...changes
            }
        });
    }

    get category() {
        return this._category;
    }

    get id() {
        return this._data.id;
    }

    get url() {
        return `${this.category.url}/${this.id}`;
    }

    get tags() {
        return (this._data.tags || []).map(i => (typeof i === "object" ? i.text : i));
    }

    get votes() {
        return (this._data.votes || { positive: 0, negative: 0 });
    }

    // TODO: Remove this
    get unlocks() {
        return [];
    }

    get unlockedBy() {
        return getClass(Challenge).astChallengesList(this.getRequirementAST());
    }

    relatedTo(challenge) {
        return (
            challenge.unlockedBy.indexOf(this.id) !== -1
            || this.unlockedBy.indexOf(challenge.id) !== -1
        );
    }

    static tryParseAST(requirements, lenientParse = false) {
        const stack = [];
        requirements = (requirements || "").trim();
        if (!requirements)
            return [true, new ASTNode()];
        for (const i of requirements.split(/\s+/)) {
            if (/^\d+$/.test(i)) {
                stack.push(new ASTChallenge(parseInt(i, 10)));
            } else {
                switch (i) {
                    case "OR":
                        if (!lenientParse && stack.length < 2)
                            return [false, "Binary operation 'OR' needs two operands"];
                        stack.push(new ASTOr(stack.pop(), stack.pop()));
                        break;
                    case "AND":
                        if (!lenientParse && stack.length < 2)
                            return [false, "Binary operation 'AND' needs two operands"];
                        stack.push(new ASTAnd(stack.pop(), stack.pop()));
                        break;
                    default:
                        if (!lenientParse)
                            return [false, `Invalid opcode '${i}'`];
                        break;
                }
            }
        }
        if (!lenientParse) {
            if (stack.length === 0)
                return [false, "Stack exhausted. Nothing to do."];
            else if (stack.length > 1)
                return [false, "Stack contains trailing data"];
        }
        return [true, stack.pop()];
    }

    static astChallengesList(ast) {
        if (!ast)
            return [];
        const challenges = [];
        const queue = [ast];
        while (queue.length) {
            const next = queue.pop();
            if (next instanceof ASTBinOp) {
                queue.push(next.left);
                queue.push(next.right);
            } else if (next instanceof ASTChallenge) {
                challenges.push(next.challenge_id);
            }
        }
        return challenges;
    }

    getRequirementAST() {
        const [success, ast] = getClass(Challenge).tryParseAST(this._data.unlock_requirements, true);
        if (!success) return new ASTNode();
        return ast;
    }

    static getSimpleRequirementsStatic(ast) {
        let op = null;
        const challenges = [];
        const queue = [ast];
        while (queue.length) {
            const next = queue.pop();
            if (next instanceof ASTBinOp) {
                if (op === null)
                    op = next.op;
                else if (next.op !== op) {
                    return null;
                }
                queue.push(next.left);
                queue.push(next.right);
            } else if (next instanceof ASTChallenge) {
                challenges.push(next.challenge_id);
            }
        }
        return [op, challenges];
    }

    getSimpleRequirements() {
        return getClass(Challenge).getSimpleRequirementsStatic(this.getRequirementAST());
    }

    toJSON() {
        const ret = {};
        for (const i of this)
            if (i !== "category")
                ret[i] = this[i];

        if (!ret.tags)
            ret.tags = [];
        else
            ret.tags = ret.tags.map(i => (typeof i === "object") ? i : ({ type: "tag", text: i }));

        return ret;
    }

    static fromJSON(category, data) {
        return new this(category, data);
    }
}
