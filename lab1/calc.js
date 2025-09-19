const [, , operation, ...numbers] = process.argv;

function add(numbers) {
    if (numbers.length < 2) {
        console.log("Cannot perform any operation on less than two numbers");
        return;
    }

    return numbers.reduce((acc, num) => {
        return acc + Number(num);
    }, 0);
}

function divide(numbers) {
    if (numbers.length < 2) {
        console.log("Cannot perform any operation on less than two numbers");
        return;
    }

    if (numbers.length > 2) {
        console.log("Only two numbers can be divided");
        return;
    }

    if (Number(numbers[1]) === 0) {
        console.log("cannot divide by zero");
        return;
    }

    return Number(numbers[0]) / Number(numbers[1]);
}

function sub(numbers) {
    if (numbers.length < 2) {
        console.log("Cannot perform any operation on less than two numbers");
        return;
    }

    return numbers.reduce((acc, num) => {
        return Number(acc) - Number(num);
    });
}

function multi(numbers) {
    if (numbers.length < 2) {
        console.log("Cannot perform any operation on less than two numbers");
        return;
    }

    return numbers.reduce((acc, num) => {
        return acc * Number(num);
    }, 1);
}

let result;
switch (operation) {
    case "add":
        result = add(numbers);
        break;

    case "divide":
        result = divide(numbers);
        break;

    case "sub":
        result = sub(numbers);
        break;

    case "multi":
        result = multi(numbers);
        break;

    default:
        console.log("Invalid input");
        break;
}

if (isFinite(result)) {
    console.log("The result of " + operation + " operation = " + result);
} else {
    console.log("Error");
}

