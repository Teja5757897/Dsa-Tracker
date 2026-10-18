// Starter question set, grouped by topic and ordered like the Love Babbar DSA Sheet topics.
// This is a curated sample of well-known problems, not the full sheet.
// Add more rows here (title, LeetCode slug, difficulty) and run: npm run seed -- --force

const E = "Easy";
const M = "Medium";
const H = "Hard";

const sheet = {
    Array: [
        ["Two Sum", "two-sum", E],
        ["Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", E],
        ["Maximum Subarray", "maximum-subarray", M],
        ["Product of Array Except Self", "product-of-array-except-self", M],
        ["3Sum", "3sum", M],
        ["Container With Most Water", "container-with-most-water", M],
        ["Merge Intervals", "merge-intervals", M],
        ["Find the Duplicate Number", "find-the-duplicate-number", M],
        ["Sort Colors", "sort-colors", M],
    ],
    Matrix: [
        ["Rotate Image", "rotate-image", M],
        ["Spiral Matrix", "spiral-matrix", M],
        ["Set Matrix Zeroes", "set-matrix-zeroes", M],
        ["Search a 2D Matrix", "search-a-2d-matrix", M],
        ["Pascal's Triangle", "pascals-triangle", E],
    ],
    String: [
        ["Valid Anagram", "valid-anagram", E],
        ["Valid Palindrome", "valid-palindrome", E],
        ["Longest Common Prefix", "longest-common-prefix", E],
        ["Group Anagrams", "group-anagrams", M],
        ["Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", M],
        ["Longest Palindromic Substring", "longest-palindromic-substring", M],
        ["Minimum Window Substring", "minimum-window-substring", H],
    ],
    "Searching and Sorting": [
        ["Binary Search", "binary-search", E],
        ["Search in Rotated Sorted Array", "search-in-rotated-sorted-array", M],
        ["Find First and Last Position of Element in Sorted Array", "find-first-and-last-position-of-element-in-sorted-array", M],
        ["Koko Eating Bananas", "koko-eating-bananas", M],
        ["Kth Largest Element in an Array", "kth-largest-element-in-an-array", M],
        ["Median of Two Sorted Arrays", "median-of-two-sorted-arrays", H],
    ],
    "Linked List": [
        ["Reverse Linked List", "reverse-linked-list", E],
        ["Merge Two Sorted Lists", "merge-two-sorted-lists", E],
        ["Linked List Cycle", "linked-list-cycle", E],
        ["Middle of the Linked List", "middle-of-the-linked-list", E],
        ["Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", M],
        ["Reorder List", "reorder-list", M],
        ["Merge k Sorted Lists", "merge-k-sorted-lists", H],
    ],
    "Stacks and Queues": [
        ["Valid Parentheses", "valid-parentheses", E],
        ["Implement Queue using Stacks", "implement-queue-using-stacks", E],
        ["Next Greater Element I", "next-greater-element-i", E],
        ["Min Stack", "min-stack", M],
        ["Daily Temperatures", "daily-temperatures", M],
        ["Largest Rectangle in Histogram", "largest-rectangle-in-histogram", H],
    ],
    "Binary Trees": [
        ["Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", E],
        ["Invert Binary Tree", "invert-binary-tree", E],
        ["Diameter of Binary Tree", "diameter-of-binary-tree", E],
        ["Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", M],
        ["Lowest Common Ancestor of a Binary Tree", "lowest-common-ancestor-of-a-binary-tree", M],
        ["Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", H],
        ["Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", H],
    ],
    "Binary Search Trees": [
        ["Convert Sorted Array to Binary Search Tree", "convert-sorted-array-to-binary-search-tree", E],
        ["Validate Binary Search Tree", "validate-binary-search-tree", M],
        ["Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", M],
        ["Lowest Common Ancestor of a Binary Search Tree", "lowest-common-ancestor-of-a-binary-search-tree", M],
        ["Insert into a Binary Search Tree", "insert-into-a-binary-search-tree", M],
    ],
    Greedy: [
        ["Assign Cookies", "assign-cookies", E],
        ["Jump Game", "jump-game", M],
        ["Jump Game II", "jump-game-ii", M],
        ["Gas Station", "gas-station", M],
        ["Non-overlapping Intervals", "non-overlapping-intervals", M],
        ["Task Scheduler", "task-scheduler", M],
    ],
    Backtracking: [
        ["Subsets", "subsets", M],
        ["Permutations", "permutations", M],
        ["Combination Sum", "combination-sum", M],
        ["Word Search", "word-search", M],
        ["Palindrome Partitioning", "palindrome-partitioning", M],
        ["N-Queens", "n-queens", H],
    ],
    Heap: [
        ["Last Stone Weight", "last-stone-weight", E],
        ["Top K Frequent Elements", "top-k-frequent-elements", M],
        ["K Closest Points to Origin", "k-closest-points-to-origin", M],
        ["Find Median from Data Stream", "find-median-from-data-stream", H],
    ],
    Graph: [
        ["Number of Islands", "number-of-islands", M],
        ["Clone Graph", "clone-graph", M],
        ["Course Schedule", "course-schedule", M],
        ["Rotting Oranges", "rotting-oranges", M],
        ["Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", M],
        ["Network Delay Time", "network-delay-time", M],
        ["Word Ladder", "word-ladder", H],
    ],
    Trie: [
        ["Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", M],
        ["Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", M],
        ["Word Search II", "word-search-ii", H],
    ],
    "Dynamic Programming": [
        ["Climbing Stairs", "climbing-stairs", E],
        ["House Robber", "house-robber", M],
        ["Coin Change", "coin-change", M],
        ["Unique Paths", "unique-paths", M],
        ["Longest Increasing Subsequence", "longest-increasing-subsequence", M],
        ["Longest Common Subsequence", "longest-common-subsequence", M],
        ["Word Break", "word-break", M],
        ["Partition Equal Subset Sum", "partition-equal-subset-sum", M],
        ["Edit Distance", "edit-distance", M],
    ],
    "Bit Manipulation": [
        ["Single Number", "single-number", E],
        ["Number of 1 Bits", "number-of-1-bits", E],
        ["Counting Bits", "counting-bits", E],
        ["Reverse Bits", "reverse-bits", E],
        ["Missing Number", "missing-number", E],
        ["Sum of Two Integers", "sum-of-two-integers", M],
    ],
};

const questions = [];
let order = 0;

for (const [topic, rows] of Object.entries(sheet)) {
    for (const [title, slug, difficulty] of rows) {
        order += 1;
        questions.push({
            title,
            topic,
            difficulty,
            leetcode: `https://leetcode.com/problems/${slug}/`,
            order,
        });
    }
}

module.exports = questions;
