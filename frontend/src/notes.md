{
  "title": "Find Maximum in an Array",
  "description": "Given an array of integers, find and return the maximum value in the array.",
  "difficulty": "EASY",
  "tags": ["arrays", "loops", "comparison"],
  "examples": {
    "PYTHON": {
      "input": "[3, 7, 2, 9, 5]",
      "output": "9",
      "explanation": "The highest value in the array [3, 7, 2, 9, 5] is 9."
    },
    "JAVASCRIPT": {
      "input": "[-5, 12, 0, 3, 7]",
      "output": "12",
      "explanation": "The highest value in the array [-5, 12, 0, 3, 7] is 12."
    }
  },
  "constraints": "-10^9 ≤ arr[i] ≤ 10^9, 1 ≤ length of array ≤ 10^6",
  "testcases": [
    {
      "input": "[100, 200, 300, 50]",
      "output": "300"
    },
    {
      "input": "[-500, -600, -100]",
      "output": "-100"
    },
    {
      "input": "[0]",
      "output": "0"
    }
  ],
  "codeSnippet": {
    "JAVASCRIPT": "const fs = require('fs');\n\nfunction findMax(arr) {\n    return Math.max(...arr);\n}\n\nconst input = JSON.parse(fs.readFileSync(0, 'utf-8').trim());\nconsole.log(findMax(input));",
    "PYTHON": "def find_max(arr):\n    return max(arr)\n\nimport sys\ninput_list = list(map(int, sys.stdin.read().split()))\nprint(find_max(input_list))",
    "JAVA": "import java.util.*;\n\npublic class Main {\n    public static int findMax(int[] arr) {\n        return Arrays.stream(arr).max().getAsInt();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for(int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        System.out.println(findMax(arr));\n    }\n}"
  },
  "referenceSolutions": {
    "JAVASCRIPT": "const fs = require('fs');\nconst input = JSON.parse(fs.readFileSync(0, 'utf-8').trim());\nconsole.log(Math.max(...input));",
    "PYTHON": "import sys\ninput_list = list(map(int, sys.stdin.read().split()))\nprint(max(input_list))",
    "JAVA": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for(int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        System.out.println(Arrays.stream(arr).max().getAsInt());\n    }\n}"
  }
}