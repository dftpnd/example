var data = [10, 4, 0, 3, 9, 1, 2, 2, 2, 6];

function getTerms (arr, sum) {
    return (function getAllSum (arr, sum) {
        if (arr.length === 0)
            return;

        var results = [],
            difference = 0,
            differenceResults = [];

        arr.forEach(function (currentNumber, index) {
            difference = sum - currentNumber;

            if (difference > 0) {
                differenceResults = getAllSum(arr.slice(0, index), difference);

                if (differenceResults && differenceResults.length !== 0) {
                    differenceResults.forEach(function (number, ind) {
                        differenceResults[ind].push(currentNumber);
                        results.push(differenceResults[ind]);
                    });
                }
            } else if (difference === 0) {
                results.push([currentNumber]);
            }
        });
        return results;
    })(arr, sum);
}

var res = getTerms(data, 10);

console.log(res);