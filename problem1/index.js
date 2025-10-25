
const sum_to_n_a = function(n) {
  // Input validation
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    throw new Error('Input must be a non-negative integer');
  }
  
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};


const sum_to_n_b = function(n) {
  // Input validation
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    throw new Error('Input must be a non-negative integer');
  }
  
  return (n * (n + 1)) / 2;
};

const sum_to_n_c = function(n) {
  // Input validation
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    throw new Error('Input must be a non-negative integer');
  }
  
  // Base case
  if (n <= 1) return n;
  
  // Recursive case
  return n + sum_to_n_c(n - 1);
};

// Example usage and testing
console.log('Testing sum_to_n implementations:\n');

const testCases = [0, 1, 5, 10, 100];

testCases.forEach(testValue => {
  console.log(`n = ${testValue}:`);
  console.log(`  Iterative (A): ${sum_to_n_a(testValue)}`);
  console.log(`  Formula (B):   ${sum_to_n_b(testValue)}`);
  console.log(`  Recursive (C): ${sum_to_n_c(testValue)}`);
  console.log();
});

