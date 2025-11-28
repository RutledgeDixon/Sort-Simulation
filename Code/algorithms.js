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

function* quickStepper(list) {
    yield* quickSort(list, 0, list.length - 1);
}

function* quickSort(list, first, last) {
    if (first < last) {
        let pivotIndex = yield* partition(list, first, last);
        yield* quickSort(list, first, pivotIndex - 1);
        yield* quickSort(list, pivotIndex + 1, last);
    }
}

function* partition(list, first, last) {
    const pivotValue = list[first];
    let up = first;
    let down = last;

    while (up < down) {
        while (up < last && list[up] <= pivotValue) up++;
        while (list[down] > pivotValue) down--;
        if (up < down) {
            const temp = list[up];
            list[up] = list[down];
            list[down] = temp;
            yield true; // swap performed
        }
    }
    
    list[first] = list[down];
    list[down] = pivotValue;
    yield true; // swap pivot into place

    return down;
}

function* heapStepper(list) {
    // Build max heap
    for (let i = Math.floor(list.length / 2) - 1; i >= 0; i--) {
        yield* heap(list, list.length, i);
    }

    // Extract elements from heap one by one
    for (let i = list.length - 1; i > 0; i--) {
        // Move current root to end
        let temp = list[0];
        list[0] = list[i];
        list[i] = temp;
        yield true; // swap performed

        // Heapify reduced heap
        yield* heap(list, i, 0);
    }
}

function* heap(list, heapSize, rootIndex) {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    if (left < heapSize && list[left] > list[largest]) {
        largest = left;
    }

    if (right < heapSize && list[right] > list[largest]) {
        largest = right;
    }

    if (largest !== rootIndex) {
        let temp = list[rootIndex];
        list[rootIndex] = list[largest];
        list[largest] = temp;
        yield true; // swap performed

        yield* heap(list, heapSize, largest);
    }
}

function* shellStepper(list) {
    // Start with a large gap, then reduce
    for (let gap = Math.floor(list.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // Do a gapped insertion sort
        for (let i = gap; i < list.length; i++) {
            const temp = list[i];
            let j = i;
            
            while (j >= gap && list[j - gap] > temp) {
                list[j] = list[j - gap];
                j -= gap;
                yield true; // shift performed
            }
            
            if (list[j] !== temp) {
                list[j] = temp;
                yield true; // final insert
            }
        }
    }
}