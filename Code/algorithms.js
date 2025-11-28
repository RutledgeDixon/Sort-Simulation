// Classic bubble-pass generator. It walks the passes of bubble sort and yields
// after every actual swap. Consumers call .next() to perform a single swap step.
function* bubbleStepper(list) {
    for (let passLimit = list.length - 1; passLimit >= 1; passLimit--) {
        for (let i = 0; i < passLimit; i++) {
            if (list[i] > list[i + 1]) {
                const tmp = list[i];
                list[i] = list[i + 1];
                list[i + 1] = tmp;
                yield true; // swap performed
            }
        }
    }
}