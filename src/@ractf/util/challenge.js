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

export default class Challenge {
    constructor(category, data) {
        this._data = data;
        this._category = category;

        return new Proxy(this, {
            get(target, name) {
                return Reflect.get(...arguments) || target._data[name];
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
        return `${this.category.url}/challenge/${this.id}`;
    }

    static fromJSON(category, data) {
        return new this(category, data);
    }
}
