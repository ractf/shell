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

import { getClass } from "@ractf/plugins";

import Challenge from "./challenge";

export default class Category {
    constructor(data) {
        const thisProxy = new Proxy(getClass(this), {
            get(target, name) {
                return Reflect.get(...arguments) || target._data[name];
            }
        });

        this._data = data;
        this._challenges = data.challenges.map(i => getClass(Challenge).fromJSON(thisProxy, i));

        return thisProxy;
    }

    *[Symbol.iterator]() {
        for (const i of Object.keys(this._data)) {
            yield i;
        }
    }

    get url() {
        return `/campaign/${this.id}`;
    }

    get id() {
        return this._data.id;
    }

    get challenges() {
        return this._challenges;
    }

    toJSON() {
        const ret = {};
        for (const i of this)
            ret[i] = this[i];
        ret.challenges = this.challenges.map(i => i.toJSON());
        return ret;
    }

    static fromJSON(data) {
        return new this(data);
    }
}
