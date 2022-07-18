function orgByClass (classes, dataset) {
    var out = {};
    for (let i of dataset) {
        var c = classes.find(c=>c.verafied(i))?.name
        out[c] ? out[c]++ : out[c] = 1
    }
    return out;
}

orgByClass([
    {
        name: "0-5",
        verafied: function (i) {
            return (i > 0 && i < 5);
        }
    },
    {
        name: "5-10",
        verafied: function (i) {
            return (i > 5 && i < 10);
        }
    },
],
    new Array(300).fill(0).reduce((prev, crnt) => { prev.push(Math.floor(Math.random() * 10)); return prev }, [])
)