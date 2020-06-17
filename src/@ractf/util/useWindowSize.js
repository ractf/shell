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

import { useState, useEffect } from "react";


export default () => {
    const getWinSize = () => ({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        scrollscrollWidthHeight: window.scrollWidth,
        scrollHeight: window.scrollHeight,
    });

    const [winSize, setWinSize] = useState(getWinSize());
    const onResize = () => setWinSize(getWinSize());
    useEffect(onResize, []);
    useEffect(() => {
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });

    return winSize;
};
