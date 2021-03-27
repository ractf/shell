export const MAX_WIDTH = 7;

export const log = window.console.log.bind(window.console, "%c[Campaign]", "color: #d3d");

export const emptyChallenge = (category, x, y) => ({
    lock: false,
    solve: false,
    unlocks: [],
    files: [],
    auto_unlock: true,
    challenge_type: "default",
    challenge_metadata: {
        x: x,
        y: y
    },
    category,
});

export const clickBlock = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

export const automaticLayout = (width, height, challenges) => {
    const challenge_grid = new Array(width).fill(null).map(() => new Array(height).fill(null));
    const off_grid = [];
    challenges.forEach(challenge => {
        const { x, y } = challenge.challenge_metadata;
        if ((typeof x) !== "undefined" && (typeof y) !== "undefined")
            challenge_grid[x][y] = challenge;
        else off_grid.push(challenge);
    });

    if (off_grid.length !== 0) {
        log("Preforming automatic layout");
        // Let the editing begin!
        off_grid.sort((a, b) => a.score - b.score).forEach(challenge => {
            for (let y = 0; ; y++) {
                for (let x = 0; x < MAX_WIDTH; x++) {
                    if (x >= challenge_grid.length)
                        challenge_grid.push([]);
                    if (y >= challenge_grid[x].length)
                        challenge_grid[x].push(null);

                    if (challenge_grid[x][y])
                        continue;
                    challenge_grid[x][y] = challenge;
                    log(`Placed ${challenge.id} at ${x},${y}`);
                    challenge.editMetadata({ x, y });
                    return;
                }
            }
        });
    }
};
