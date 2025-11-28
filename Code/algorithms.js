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

function* selectionStepper(list) {
    for (let i = 0; i < list.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < list.length; j++) {
            if (list[j] < list[min])
                min = j;
        }
        let temp = list[i];
        list[i] = list[min];
        list[min] = temp;
        yield true; // swap performed
    }
}

function* insertionStepper(list) {
    for (let i = 1; i < list.length; i++) {
        let key = list[i];
        while (i > 0 && key < list[i-1]) {
            list[i] = list[i-1];
            i--;
            list[i] = key;
            yield true; // shift performed
        }
    }
}