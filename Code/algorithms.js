// Computer Graphics Final Project
// Sorting Algorithm Visualization in 3D using WebGL
// Fall 25
// Brandon Bryant and Rutledge Dixon

/*
 * SORTING ALGORITHM STEPPERS
 * 
 * Each function is a generator that sorts an array in-place and yields
 * after each significant operation (swap, shift, or merge). This allows
 * consumers to animate the sorting process step-by-step by calling .next()
 * to advance one operation at a time.
 */

// Bubble Sort - O(n²) average and worst case
// Repeatedly swaps adjacent elements if they're out of order
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

// Selection Sort - O(n²) average and worst case
// Finds the minimum element and swaps it to the front of the unsorted portion
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

// Insertion Sort - O(n²) average and worst case, O(n) best case
// Builds sorted array by inserting each element into its proper position
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

// Merge Sort - O(n log n) all cases
// Recursively divides the array in half, sorts each half, then merges them
function* mergeStepper(list) {
    yield* mergeSort(list, 0, list.length);
}

// Recursively divides array into halves and sorts them
function* mergeSort(list, start, length) {
    if (length > 1) {
        const mid = Math.floor(length / 2);

        yield* mergeSort(list, start, mid);
        yield* mergeSort(list, start + mid, length - mid);
        
        yield* merge(list, start, mid, length - mid);
    }
}

// Merges two sorted subarrays into a single sorted array
function* merge(list, start, leftLen, rightLen) {
    let leftStart = start;
    let leftEnd = start + leftLen;
    let rightStart = leftEnd;
    let rightEnd = rightStart + rightLen;
    
    // Insertion-based merge: repeatedly find the smallest remaining element
    // and swap it into position
    for (let pos = leftStart; pos < rightEnd; pos++) {
        // Find minimum in remaining unsorted portion
        let minIdx = pos;
        for (let i = pos + 1; i < rightEnd; i++) {
            if (list[i] < list[minIdx]) {
                minIdx = i;
            }
        }
        
        // Swap minimum to current position if needed
        if (minIdx !== pos) {
            let temp = list[pos];
            list[pos] = list[minIdx];
            list[minIdx] = temp;
            yield true; // swap performed
        }
    }
}

// Quick Sort - O(n log n) average case, O(n²) worst case
// Picks a pivot and partitions array into elements less/greater than pivot
function* quickStepper(list) {
    yield* quickSort(list, 0, list.length - 1);
}

// Recursively sorts partitions on either side of the pivot
function* quickSort(list, first, last) {
    if (first < last) {
        let pivotIndex = yield* partition(list, first, last);
        yield* quickSort(list, first, pivotIndex - 1);
        yield* quickSort(list, pivotIndex + 1, last);
    }
}

// Partitions array around pivot and returns pivot's final position
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

// Heap Sort - O(n log n) all cases
// Builds a max heap then repeatedly extracts the maximum to the end
function* heapStepper(list) {
    // Check if already sorted
    let alreadySorted = true;
    for (let i = 1; i < list.length; i++) {
        if (list[i] < list[i - 1]) {
            alreadySorted = false;
            break;
        }
    }
    if (alreadySorted) return;

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

// Maintains max heap property by moving larger values toward the root
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

// Shell Sort - O(n log n) to O(n²) depending on gap sequence
// Insertion sort with decreasing gaps, allowing distant element swaps
function* shellStepper(list) {
    // Start with a large gap, then reduce
    for (let gap = Math.floor(list.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        // Do a gapped insertion sort
        for (let i = gap; i < list.length; i++) {
            let j = i;
            
            while (j >= gap && list[j] < list[j - gap]) {
                // Swap elements that are gap distance apart
                const temp = list[j];
                list[j] = list[j - gap];
                list[j - gap] = temp;
                yield true; // swap performed
                j -= gap;
            }
        }
    }
}

// Bogo Sort - O((n+1)!) average case, unbounded worst case
// Randomly shuffles the array until it happens to be sorted
function* bogoStepper(list) {
    let sorted = false;    
    while (!sorted) {
        sorted = true;
        for (let i = 1; i < list.length; i++) {
            if (list[i-1] > list[i]) {
                sorted = false;
                break;
            }
        }
        if (sorted) return;
        list.sort(() => Math.random() - 0.5);
        yield true;
    }
}