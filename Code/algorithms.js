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

function* mergeStepper(list) {
    yield* mergeSort(list, 0, list.length);
}

function* mergeSort(list, start, length) {
    if (length > 1) {
        const mid = Math.floor(length / 2);

        yield* mergeSort(list, start, mid);
        yield* mergeSort(list, start + mid, length - mid);
        
        yield* merge(list, start, mid, length - mid);
    }
}

function* merge(list, start, leftLen, rightLen) {
    const left = list.slice(start, start + leftLen);
    const right = list.slice(start + leftLen, start + leftLen + rightLen);

    let i = 0, j = 0, k = start;

    while (i < leftLen && j < rightLen) {
        list[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
        yield true; // merge step performed
    }

    while (i < leftLen) {
        list[k++] = left[i++];
        yield true;
    }

    while (j < rightLen) {
        list[k++] = right[j++];
        yield true;
    }
}